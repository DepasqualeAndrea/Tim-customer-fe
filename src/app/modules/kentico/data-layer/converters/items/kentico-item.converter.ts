import {KenticoItemConverterInterface} from './kentico-item-converter.interface';
import {Injectable} from '@angular/core';
import {KenticoModule} from '../../../kentico.module';
import {KenticoElementConverterInterface} from '../elements/kentico-element-converter.interface';
import {ContentItem, Elements} from 'kentico-cloud-delivery';
import {SimplestConverter} from '../elements/simplest.converter';

@Injectable({
  providedIn: 'root'
})
export class KenticoItemConverter implements KenticoItemConverterInterface {
  private elementConverters: Map<string, KenticoElementConverterInterface<any>> = new Map<string, KenticoElementConverterInterface<any>>();
  private kenticoSystemItemPropertyNames: string[] = ['_config', '_raw', 'system'];
  private simplestConverter: SimplestConverter = new SimplestConverter();

  public setConverter(type: string, converter: KenticoElementConverterInterface<Elements.BaseElement<any>>): void {
    this.elementConverters.set(type, converter);
  }

  private getConverter(type: string): KenticoElementConverterInterface<any> {
    const targetConverter: KenticoElementConverterInterface<any> = this.elementConverters.get(type);
    if(!targetConverter) {
      return this.simplestConverter;
    }

    return targetConverter;
  }

  convertItem(item: ContentItem): ContentItem {
    if(!item) {
      return item;
    }

    const converted: ContentItem = Object.assign({}, item);
    Object.entries(converted)
      .filter(entry => this.kenticoSystemItemPropertyNames.findIndex(value => value === entry[0]) < 0)       // filter kentico system properties
      .filter(entry => !!entry[1]['type'] && typeof entry[1]['type'] === 'string')                                          // get only those item with type property set
      .map<{ name: string, value: any }>(entry => {
        return {name: entry[0], value: entry[1]};
      })
      .forEach(entry => {
        converted[entry.name] = this.getConverter(entry.value['type']).convertElement(entry.value);
        }
      );

    return converted;
  }


}
