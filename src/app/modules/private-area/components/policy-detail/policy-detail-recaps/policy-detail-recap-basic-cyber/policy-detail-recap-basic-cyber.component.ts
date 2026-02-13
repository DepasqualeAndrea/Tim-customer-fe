import { Component, OnInit } from '@angular/core';
import { CONSTANTS } from 'app/app.constants';
import { LocaleService } from 'app/core/services/locale.service';
import * as moment from 'moment';
import { PolicyDetailRecapDynamicComponent } from '../policy-detail-recap-dynamic.component';

@Component({
    selector: 'app-policy-detail-recap-basic-cyber',
    templateUrl: './policy-detail-recap-basic-cyber.component.html',
    styleUrls: ['./policy-detail-recap-basic-cyber.component.scss'],
    standalone: false
})
export class PolicyDetailRecapBasicCyberComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

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

  isSurveyMissing(policy) {
    return policy.surveyUrl !== CONSTANTS.SURVEY_URL_MISSING;
  }

  getPolicyDetails() {
    this.paymentPeriod = this.policy.payment_frequency === 'M' ? 'Mensile' : 'Annuale';
                               
    this.insuredPresentation = this.policy.variant.option_values.find(pres => pres.option_type_name === 'maximal').presentation === '1000000' ? 'Fino a 1.000.000 €' : 
                               this.policy.variant.option_values.find(pres => pres.option_type_name === 'maximal').presentation === '5000000' ? 'Da 1.000.001 € a 5.000.000 €' : 'Da 5.000.001 € a 20.000.000 €';
  }

  getDuration(policy) {
    const x = moment(policy.expirationDate, 'YYYY-MM-DD').diff(moment(policy.startDate), 'days');
    return moment.duration(x, 'days').locale(this.locale.locale).humanize();
  }

  isPolicyPriceANumber(): boolean {
    return !!this.policy && !!this.policy.price && !isNaN(<number>this.policy.price);
  }

}
