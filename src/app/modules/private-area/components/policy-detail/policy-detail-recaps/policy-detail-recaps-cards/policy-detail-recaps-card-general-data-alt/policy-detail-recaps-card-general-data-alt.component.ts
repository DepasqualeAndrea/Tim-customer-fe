import {Component, Input, OnInit, Inject, LOCALE_ID} from '@angular/core';
import {Policy} from '../../../../../private-area.model';
import {CONSTANTS} from '../../../../../../../../app/app.constants';
import * as moment from 'moment';
import {LocaleService} from '../../../../../../../core/services/locale.service';

@Component({
    selector: 'app-policy-detail-recaps-card-general-data-alt',
    templateUrl: './policy-detail-recaps-card-general-data-alt.component.html',
    styleUrls: ['./policy-detail-recaps-card-general-data-alt.component.scss'],
    standalone: false
})
export class PolicyDetailRecapsCardGeneralDataAltComponent implements OnInit {

  @Input() policy: Policy;

  constructor(private locale: LocaleService) {
  }

  ngOnInit() {
  }

  isCertificateMissing(policy) {
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING;
  }

  getDuration(policy: Policy) {
    const x = moment(policy.expirationDate, 'YYYY-MM-DD').diff(moment(policy.startDate), 'days');
    return moment.duration(x, 'days').locale(this.locale.locale).humanize();
  }
  isPolicyPriceANumber(): boolean {
    return !!this.policy && !!this.policy.price && !isNaN(<number>this.policy.price);
  }

}
