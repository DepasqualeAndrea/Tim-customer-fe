import {Component, OnInit} from '@angular/core';
import {CONSTANTS} from '../../../../../../app.constants';
import {DataService} from '@services';
import {PolicyDetailRecapDynamicComponent} from '../policy-detail-recap-dynamic.component';

@Component({
  selector: 'app-policy-detail-recap-basic-ergo-sci',
  templateUrl: './policy-detail-recap-basic-ergo-sci.component.html',
  styleUrls: ['./policy-detail-recap-basic-ergo-sci.component.scss']
})
export class PolicyDetailRecapBasicErgoSciComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  constructor(
    public dataService: DataService
  ) {
    super();
  }

  ngOnInit() {
  }

  isCertificateMissing(policy) {
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING;
  }

}
