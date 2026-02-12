import {Injectable} from '@angular/core';
import {CheckoutModule} from '../../checkout.module';
import {Target} from './target';
import * as moment from 'moment';
import {Moment} from 'moment';


@Injectable({
  providedIn: 'root'
})
export class TargetTriggerService {
  private targets: Map<string, Target> = new Map<string, Target>();
  private lastUpdate: Moment;

  public registerTarget(id: string, target: Target): void {
    if(!id || !target) {
      return;
    }
    this.targets.set(id, target);
    this.lastUpdate = moment();
  }

  public removeTarget(id: string): boolean {
    this.lastUpdate = moment();
    return this.targets.delete(id);
  }

  public isToUpdate(mom: Moment): boolean {
    return this.lastUpdate.isAfter(mom);
  }

  public getTarget(id: string): Target {
    return this.targets.get(id);
  }

  public getAllTargets(): Target[] {
    const result: Target[] = [];
    Array.from(this.targets.keys()).forEach(key => {
      const target: Target = this.getTarget(key);
      if(!!target) {
        result.push(target);
      }
    });

    return result;
  }

}
