import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { Component, OnInit } from '@angular/core';
import { PolicyDetailRecapDynamicComponent } from '../policy-detail-recap-dynamic.component';
import { CONSTANTS } from 'app/app.constants';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { DataService, InsurancesService, UserService } from '@services';
import { NypIadPolicyService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-policy-detail-recap-basic-pet',
  templateUrl: './policy-detail-recap-basic-pet.component.html',
  styleUrls: ['./policy-detail-recap-basic-pet.component.scss']
})
export class PolicyDetailRecapBasicPetComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  duration: string;

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    public dataService: DataService,
    private componentFeaturesService: ComponentFeaturesService,
    private nypIadPolicyService: NypIadPolicyService,
  ) {
    super();
  }

  ngOnInit() {
    this.setDuration(this.policy);
  }

  isCertificateMissing(policy) {
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING;
  }

  downloadFile(policy) {
    this.nypIadPolicyService.getDocument(policy.policyNumber).subscribe(res => {
      const source = `data:application/pdf;base64,${res.file}`;
      const link = document.createElement("a");

      link.href = source;
      link.download = res.fileName;

      link.click();
    });
  }

  infoPackageDownload() {
    this.componentFeaturesService.getComponent('policy-detail');
    this.componentFeaturesService.useRule('info-package-download');
    return this.componentFeaturesService.isRuleEnabled();
  }

  setDuration(policy) {
    if (policy.product.payment_methods[0].type === 'Spree::Gateway::BraintreeRecurrent' || policy.product.payment_methods[0].type === 'Spree::PaymentMethod::NoPaymentCreditCard') {
      this.kenticoTranslateService.getItem<any>('private_area.monthly_duration_type').pipe().subscribe(item => {
        this.duration = item.value;
      });
    }
  }

}
