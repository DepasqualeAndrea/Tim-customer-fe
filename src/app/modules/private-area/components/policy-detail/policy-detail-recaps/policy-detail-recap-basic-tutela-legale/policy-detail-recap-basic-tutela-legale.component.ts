import { Component, OnInit } from '@angular/core';
import { CONSTANTS } from 'app/app.constants';
import { LocaleService } from 'app/core/services/locale.service';
import * as moment from 'moment';
import { PolicyDetailRecapDynamicComponent } from '../policy-detail-recap-dynamic.component';

@Component({
  selector: 'app-policy-detail-recap-basic-tutela-legale',
  templateUrl: './policy-detail-recap-basic-tutela-legale.component.html',
  styleUrls: ['./policy-detail-recap-basic-tutela-legale.component.scss']
})
export class PolicyDetailRecapBasicTutelaLegaleComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  insuredPresentation;
  paymentPeriod;

  constructor(private locale: LocaleService) {
    super();
   }

  ngOnInit() {
    this.getPolicyDetails();
  }

  isCertificateMissing(policy) {
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING;
  }

  getPolicyDetails() {
    this.paymentPeriod = this.policy.variant.sku.includes('TUTLEG12') ?
                               'Annuale' : this.policy.variant.sku.includes('TUTLEG1_') ?
                               'Mensile' : null;
    this.insuredPresentation = this.policy.variant.option_values['0'].presentation;
  }

  getDuration(policy) {
    const x = moment(policy.expirationDate, 'YYYY-MM-DD').diff(moment(policy.startDate), 'days');
    return moment.duration(x, 'days').locale(this.locale.locale).humanize();
  }

  isPolicyPriceANumber(): boolean {
    return !!this.policy && !!this.policy.price && !isNaN(<number>this.policy.price);
  }

}
