import { Component, OnInit } from '@angular/core';
import { PolicyDetailRecapDynamicComponent } from '../policy-detail-recap-dynamic.component';
import { CONSTANTS } from 'app/app.constants';

@Component({
  selector: 'app-policy-detail-recap-basic-free-tires',
  templateUrl: './policy-detail-recap-basic-free-tires.component.html',
  styleUrls: ['./policy-detail-recap-basic-free-tires.component.scss']
})
export class PolicyDetailRecapBasicFreeTiresComponent extends PolicyDetailRecapDynamicComponent  implements OnInit {


  constructor() {
    super();
  }

  ngOnInit() {
  }

  isCertificateMissing(policy) {
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING;
  }

}
