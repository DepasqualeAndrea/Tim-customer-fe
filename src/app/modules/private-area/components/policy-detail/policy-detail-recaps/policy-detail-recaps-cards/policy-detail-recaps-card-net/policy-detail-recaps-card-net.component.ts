import {Component, Input, OnInit} from '@angular/core';
import {Policy} from '../../../../../private-area.model';
import {CONSTANTS} from '../../../../../../../app.constants';

@Component({
    selector: 'app-policy-detail-recaps-card-net',
    templateUrl: './policy-detail-recaps-card-net.component.html',
    styleUrls: ['./policy-detail-recaps-card-net.component.scss'],
    standalone: false
})
export class PolicyDetailRecapsCardNetComponent implements OnInit {

  @Input() policy: Policy;

  constructor() {
  }

  ngOnInit() {
    this.changeDateExpirationForTravelpackNet();
  }

  changeDateExpirationForTravelpackNet() {
    const dateToBE = this.policy.expirationDate;
    this.policy.expirationDate = this.addDecreseDays(dateToBE, -1);
  }

  isCertificateMissing(policy) {
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING;
  }

  addDecreseDays(date: Date, days: number) {
    const copy = new Date(Number(date));
    copy.setDate(date.getDate() + days);
    return copy;
  }

  isPolicyPriceANumber(): boolean {
    return !!this.policy && !!this.policy.price && !isNaN(<number>this.policy.price);
  }

}
