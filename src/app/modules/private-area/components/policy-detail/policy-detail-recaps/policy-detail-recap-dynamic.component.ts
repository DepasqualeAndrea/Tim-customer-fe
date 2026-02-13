import {Policy} from '../../../private-area.model';
import moment from 'moment';
import { EventEmitter, Input, OnInit, Directive } from '@angular/core';
import {PolicyUpdateEvent} from '../policy-detail.model';

@Directive()
export abstract class PolicyDetailRecapDynamicComponent {
  @Input() policy: Policy;

  policyUpdated: EventEmitter<PolicyUpdateEvent> = new EventEmitter<PolicyUpdateEvent>();

  isPolicyPriceANumber(): boolean {
    return !!this.policy && !!this.policy.price && !isNaN(<number>this.policy.price);
  }

  getDuration(policy: Policy) {
    const x = moment(policy.expirationDate, 'YYYY-MM-DD').diff(moment(policy.startDate), 'days');
    return moment.duration(x, 'days').locale('it').humanize();
  }
}

