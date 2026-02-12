import {Injectable} from '@angular/core';
import {GTMModelDefaultTemplate, GTMModelTemplate} from '../../models/gtm/gtm-template.model';
import {GtmInitDataLayerService} from './gtm-init-datalayer.service';
import {Router} from '@angular/router';
import { GtmModelHandler } from './gtm-model-handler.interface';
import {gtm_settings} from '../../models/gtm/gtm-settings.model';


/**
 * Allows the datalayer object to be transformed
 */
interface DLTransformer {
  transform(dlObj: object): object;
}

/**
 * This class actually does not transform anything, it simply returns datalayer object as is
 */
class NullTransformer implements DLTransformer {
  transform(item: object): object {
    return item;
  }
}

/**
 * This transformers pipes one or more transformers so a transformation can be a sequence of transformations.
 */
class PipelineTransformer implements DLTransformer {
  private transformers: DLTransformer[] = [new NoNameTransformer()];

  transform(item: object): object {
    let result: object = Object.assign({}, item);
    this.transformers.forEach(t => result = t.transform(result));

    return result;
  }
}

/**
 * Transforms dataLayer object. If the target object is an array, transforms recursively each entry and return
 * the transformed array. If an entry is an object, then call transform method on it, otherwise stringify it.
 * if the target is an object, transforms recursively each object entry and return the transformed object.
 * if an entry, in the form "propertyName: propertyValue" contains a propertyValue that is an object, then call
 * transform method on it, otherwise stringify it.
 * In case of an object entry ("propertyName: propertyValue") the entry will be mapped.
 * A mapper transforms that entry in an another entry, for example if we have "name: 'value'" we can get
 * "'name': 'value'" (quoted name), or again we can check a specific name or a specific value and
 * do stuff regarding this.
 */
abstract class MainDLTransformer implements DLTransformer {
  transform(item: object): object {
    let result: object;
    if (Array.isArray(item)) {
      result = [];
      item.forEach(entry => {
        this.elaborateArrayEntry((<Array<any>>result), entry);
      });
    } else {
      result = {};
      Object.entries(item).forEach(entry => {
        this.elaborateObjectEntry(result, entry);
      });
    }

    return result;
  }

  protected abstract map(item: [string, any]): { [key: string]: any };

  private elaborateObjectEntry(result: object, entry: [string, any]) {
    const name: string = entry[0];
    const value: any = entry[1];

    // totally yack but works
    if (name === 'ecommerce' && value === 'null') {
      Object.assign(result, { [name]: null });
    } else {
      if (typeof value === 'object') {
        const toBeAssigned: object = this.map([name, this.transform(value)]);
        Object.assign(result, toBeAssigned);
      } else if (typeof value === 'number') {
        Object.assign(result, this.map([name, value]));
      } else {
        if (value) { Object.assign(result, this.map([name, value.toString()])); }
      }
    }
  }

  private elaborateArrayEntry(result: any[], entry: any) {
    if (typeof entry === 'object') {
      result.push(this.transform(entry));
    } else if (typeof entry === 'number') {
      result.push(entry);
    } else {
      result.push(entry.toString());
    }
  }

}

/**
 * This transformer is a MainDLTransformer and maps entries quoting the property name.
 * @see MainDLTransformer
 */
class NameStringifyTransformer extends MainDLTransformer {
  protected map(item: [string, any]): { [key: string]: any; } {
    return {['\'' + item[0] + '\'']: item[1]};
  }
}

/**
 * This transformer is a MainDLTransformer and maps entries just returning them
 * @see MainDLTransformer
 */
class NoNameTransformer extends MainDLTransformer {
  protected map(item: [string, any]): { [key: string]: any } {
    return {[item[0]]: item[1]};
  }
}


@Injectable({
  providedIn: 'root'
})
export class GtmService implements GtmModelHandler {
  private currentStateModel: { [key: string]: any };
  private transformer: DLTransformer = new PipelineTransformer();



  constructor(
    private gtmService: GtmInitDataLayerService
  ) {
  }

  /**
   * Overwrites properties set into current model (object pushed into window.dataLayer) getting them from obj parameter
   * if onlyNative is true then overwrite only those property that are also defined into initial object, otherwise set
   * all properties of obj that are defined into current object (included added ones)
   * @param obj is the source data we want to overwrite
   * @param onlyNative specifies if we want to overwrite only those properties contained into GTMTemplateModel
   */
  overwrite(obj: { [key: string]: any; }, onlyNative: boolean = false): void {
    if(!gtm_settings.checkTenant()){
      return;
    }
    if(!this.currentStateModel) {
      this.reset();
    }
    if (onlyNative) {
      this._overwrite(this.getInitialModel(), obj);
    } else {
      this._overwrite(this.currentStateModel, obj);
    }
  }

  /**
   * Add all properties defined into obj parameter object into current object (to push into dataLayer).
   * If a property is already defined it will be overwritten, added otherwise.
   * To avoid adding properties please refer to overwrite method.
   * @see overwrite
   * @param obj is the source data we want to add to current model
   */
  add(obj: { [key: string]: any; }): void {
    if(!gtm_settings.checkTenant()) {
      return;
    }
    if(!this.currentStateModel) {
      this.reset();
    }
    Object.assign(this.currentStateModel, obj);
  }

  /**
   * Bring the current model to the initial state template.
   */
  reset(): void {
    this.currentStateModel = this.getInitialModel();
  }

  /**
   * Push the current model into dataLayer.
   * If reset is set to true (default behavior) after pushing the current model will be resetted
   * @see reset
   * @param reset to reset the model after pushing the tag
   */
  push(reset: boolean = true) {
    this.gtmService.pushTag(
      this.transformer.transform(this.currentStateModel)
    );
    if (reset) {
      this.reset();
    }
  }

  private getInitialModel(): GTMModelTemplate {
    if (!!this.gtmService.initialTemplate) {
      return Object.assign({}, this.gtmService.initialTemplate);
    } else {
      return new GTMModelDefaultTemplate();
    }
  }

  private _overwrite(template: { [key: string]: any }, source: { [key: string]: any }) {
    Object.entries(template).forEach(value => {
      const propertyName: string = value[0];
      const propertyValue: any = source[propertyName];
      const isValid: boolean = propertyValue != null && typeof propertyValue !== 'undefined';

      if (isValid) {
        this.currentStateModel[propertyName] = propertyValue;
      }
    });
  }
}
