import { Component, OnInit } from '@angular/core';
import { PolicyDetailRecapDynamicComponent } from '../policy-detail-recap-dynamic.component';
import { CONSTANTS } from '../../../../../../app.constants';
import { KenticoTranslateService } from '../../../../../kentico/data-layer/kentico-translate.service';
import { DataService } from '@services';
import { ComponentFeaturesService } from '../../../../../../core/services/componentFeatures.service';
import * as moment from 'moment';
import { NypIadPolicyService } from '@NYP/ngx-multitenant-core';

@Component({
    selector: 'app-policy-detail-recap-basic-tim-my-pet',
    templateUrl: './policy-detail-recap-basic-tim-my-pet.component.html',
    styleUrls: ['./policy-detail-recap-basic-tim-my-pet.component.scss'],
    standalone: false
})
export class PolicyDetailRecapBasicTimMyPetComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  duration: string;
  formattedExpirationDate: string;
  formattedStartDate: string;
  petKind: string;
  petName: string;
  petKindLabel: string;

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    public dataService: DataService,
    private componentFeaturesService: ComponentFeaturesService,
    private nypIadPolicyService: NypIadPolicyService,
  ) {
    super();
  }

  ngOnInit() {
    this.formatDates(this.policy);
    this.setDuration(this.policy);
    this.setPetInfos(this.policy);
  }

  public isCertificateMissing(policy): boolean {
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING;
  }

  public infoPackageDownload() {
    this.componentFeaturesService.getComponent('policy-detail');
    this.componentFeaturesService.useRule('info-package-download');
    return this.componentFeaturesService.isRuleEnabled();
  }

  private setDuration(policy): void {
    if (policy.product.payment_methods[0].type === 'Spree::Gateway::BraintreeRecurrent' || policy.product.payment_methods[0].type === 'Spree::PaymentMethod::NoPaymentCreditCard') {
      this.kenticoTranslateService.getItem<any>('private_area.yearly_duration_type').pipe().subscribe(item => {
        this.duration = item.value;
      });
    }
  }

  private formatDates(policy): void {
    this.formattedExpirationDate = moment(policy.expirationDate).format('DD/MM/YYYY');
    this.formattedStartDate = moment(policy.startDate).format('DD/MM/YYYY');
  }

  private setPetInfos(policy): void {
    const kindLabel = { "dog": "Cane", "cat": "Gatto" }
    const insuredPet = policy.insuredEntities.pets[0];
    this.petKind = insuredPet.kind;
    this.petName = insuredPet.name;
    this.petKindLabel = kindLabel[insuredPet.kind]

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

}
