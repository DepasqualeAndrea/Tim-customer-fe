import { Component, OnInit } from '@angular/core';
import { CONSTANTS } from 'app/app.constants';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { PolicyDetailRecapDynamicComponent } from '../policy-detail-recap-dynamic.component';

@Component({
    selector: 'app-policy-detail-recap-basic-bike',
    templateUrl: './policy-detail-recap-basic-bike.component.html',
    styleUrls: ['./policy-detail-recap-basic-bike.component.scss'],
    standalone: false
})
export class PolicyDetailRecapBasicBikeComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  duration: string;

  constructor(
    private kenticoTranslateService: KenticoTranslateService
  ) {
    super();
  }

  ngOnInit() {
    this.setDuration(this.policy);
  }

  isCertificateMissing(policy) {
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING;
  }

  setDuration(policy) {
    if (policy.product.payment_methods[0].type === 'Spree::Gateway::BraintreeRecurrent') {
      this.kenticoTranslateService.getItem<any>('private_area.monthly_duration_type').pipe().subscribe(item => {
        this.duration = item.value;
      });
    }
  }
}
