import { Component, OnInit } from '@angular/core';
import { PolicyDetailRecapDynamicComponent } from '../policy-detail-recap-dynamic.component';
import { CONSTANTS } from 'app/app.constants';
import { DataService } from '@services';

@Component({
    selector: 'app-policy-detail-recap-basic-gosafe',
    templateUrl: './policy-detail-recap-basic-gosafe.component.html',
    styleUrls: ['./policy-detail-recap-basic-gosafe.component.scss'],
    standalone: false
})
export class PolicyDetailRecapBasicGosafeComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  constructor(public dataService: DataService) {
    super();
  }

  ngOnInit() {
  }

  isCertificateMissing(policy) {
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING;
  }

}
