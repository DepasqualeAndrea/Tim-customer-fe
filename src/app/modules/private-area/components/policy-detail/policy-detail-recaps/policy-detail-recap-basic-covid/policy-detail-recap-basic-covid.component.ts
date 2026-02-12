import { Component, OnInit } from '@angular/core';
import { CONSTANTS } from 'app/app.constants';
import { PolicyDetailRecapDynamicComponent } from '../policy-detail-recap-dynamic.component';

@Component({
  selector: 'app-policy-detail-recap-basic-covid',
  templateUrl: './policy-detail-recap-basic-covid.component.html',
  styleUrls: ['./policy-detail-recap-basic-covid.component.scss']
})
export class PolicyDetailRecapBasicCovidComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  constructor() { 
    super();
  }

  ngOnInit() {
  }

  isCertificateMissing(policy) {
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING;
  }


}
