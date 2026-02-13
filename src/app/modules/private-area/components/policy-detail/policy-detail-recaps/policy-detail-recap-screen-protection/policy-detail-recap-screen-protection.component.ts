import { Component, Input, OnInit } from '@angular/core';
import { CONSTANTS } from 'app/app.constants';
import { Policy } from 'app/modules/private-area/private-area.model';
import moment from 'moment';
import { PolicyDetailRecapDynamicComponent } from '../policy-detail-recap-dynamic.component';

@Component({
    selector: 'app-policy-detail-recap-screen-protection',
    templateUrl: './policy-detail-recap-screen-protection.component.html',
    styleUrls: ['./policy-detail-recap-screen-protection.component.scss'],
    standalone: false
})
export class PolicyDetailRecapScreenProtectionComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  priceIsNumber= true;

  constructor() {
    super();
  }

  ngOnInit() {

    this.priceIsNumber = (!!this.policy && !!this.policy.price && !isNaN(<number>this.policy.price));
    if(isNaN(this.policy.startDate.getTime())){
      this.policy.startDate = null;
    }
    if(isNaN(this.policy.expirationDate.getTime())){
      this.policy.expirationDate = null;
    }
  }


  public isCertificateMissing(policy) {
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING;
  }



}
