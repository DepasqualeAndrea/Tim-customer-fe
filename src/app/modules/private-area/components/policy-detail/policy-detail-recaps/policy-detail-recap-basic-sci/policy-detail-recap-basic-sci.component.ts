import { Component, OnInit } from '@angular/core';
import { DataService } from '@services';
import { CONSTANTS } from 'app/app.constants';
import { PolicyDetailRecapDynamicComponent } from '../policy-detail-recap-dynamic.component';

@Component({
    selector: 'app-policy-detail-recap-basic-sci',
    templateUrl: './policy-detail-recap-basic-sci.component.html',
    styleUrls: ['./policy-detail-recap-basic-sci.component.scss'],
    standalone: false
})
export class PolicyDetailRecapBasicSciComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  constructor(public dataService: DataService) {
    super();
  }

  ngOnInit() {
  }

  isCertificateMissing(policy) {
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING;
  }

}
