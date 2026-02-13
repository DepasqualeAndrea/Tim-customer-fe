import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { Component, OnInit } from '@angular/core';
import { CONSTANTS } from 'app/app.constants';
import { PolicyDetailRecapDynamicComponent } from '../policy-detail-recap-dynamic.component';
import { DataService } from '@services';

@Component({
    selector: 'app-policy-detail-recap-basic-care',
    templateUrl: './policy-detail-recap-basic-care.component.html',
    styleUrls: ['./policy-detail-recap-basic-care.component.scss'],
    standalone: false
})
export class PolicyDetailRecapBasicCareComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  duration: string;

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    public dataService: DataService
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
      this.kenticoTranslateService.getItem<any>('private_area.yearly_duration_type').pipe().subscribe(item => {
        this.duration = item.value;
      });
    }
  }

}
