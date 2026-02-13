import { Component, OnInit } from '@angular/core';
import { CONSTANTS } from 'app/app.constants';
import moment from 'moment';
import { PolicyDetailRecapDynamicComponent } from '../policy-detail-recap-dynamic.component';

@Component({
    selector: 'app-policy-detail-recap-basic-baggage-loss',
    templateUrl: './policy-detail-recap-basic-baggage-loss.component.html',
    styleUrls: ['./policy-detail-recap-basic-baggage-loss.component.scss'],
    standalone: false
})
export class PolicyDetailRecapBasicBaggageLossComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  ngOnInit() {
  }

  convertDateAssuranceFormat(date: Date) {
    const dateMoment = moment(date).subtract(1, 'd').toDate();
    return dateMoment;
  }

  isCertificateMissing(policy) {
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING;
  }

}
