import { Component, OnInit } from '@angular/core';
import { PolicyDetailRecapDynamicComponent } from '../policy-detail-recap-dynamic.component';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { CONSTANTS } from 'app/app.constants';

@Component({
  selector: 'app-policy-detail-recap-basic-pai',
  templateUrl: './policy-detail-recap-basic-pai.component.html',
  styleUrls: ['./policy-detail-recap-basic-pai.component.scss']
})
export class PolicyDetailRecapBasicPaiComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  duration: string;

  constructor(private kenticoTranslateService: KenticoTranslateService) {
    super();
   }

  ngOnInit() {
  }

  isCertificateMissing(policy) {
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING;
  }

}
