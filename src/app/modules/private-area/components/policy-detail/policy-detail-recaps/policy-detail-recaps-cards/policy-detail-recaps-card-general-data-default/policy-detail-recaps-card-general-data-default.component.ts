import { DataService } from './../../../../../../../core/services/data.service';
import { Component, Input, OnInit } from '@angular/core';
import { Policy } from '../../../../../private-area.model';
import { CONSTANTS } from '../../../../../../../../app/app.constants';
import { ComponentFeaturesService } from '../../../../../../../core/services/componentFeatures.service';
import * as moment from 'moment';
import { NypIadPolicyService } from '@NYP/ngx-multitenant-core';

@Component({
    selector: 'app-policy-detail-recaps-card-general-data-default',
    templateUrl: './policy-detail-recaps-card-general-data-default.component.html',
    styleUrls: ['./policy-detail-recaps-card-general-data-default.component.scss'],
    standalone: false
})
export class PolicyDetailRecapsCardGeneralDataDefaultComponent implements OnInit {

  @Input() policy: Policy;
  priceIsNumber = true;
  formattedExpirationDate: string;
  formattedStartDate: string;
  paymentSource: any

  get isSeasonal(): boolean {
    return this.policy.variant.name === 'Seasonal';
  }

  constructor(
    private componentFeaturesService: ComponentFeaturesService,
    public dataService: DataService,
    private nypIadPolicyService: NypIadPolicyService
  ) { }

  ngOnInit() {
    if (this.isDateExpirationViewOneDayBefore()) {
      this.policy.expirationDate = moment(this.policy.expirationDate).subtract(1, 'day').toDate();
    }
    this.priceIsNumber = !!this.policy.price && !isNaN(Number(this.policy.price)) && !!this.policy.payments?.price;

    this.formatDates(this.policy);

  }

  downloadFile(policy) {
    this.nypIadPolicyService.getDocument(policy.policyNumber).subscribe(res => {
      const source = `data:application/pdf;base64,${res.file}`;
      const link = document.createElement('a');

      link.href = source;
      link.download = res.fileName;

      link.click();
    });
  }

  isCertificateMissing(policy) {
    if (
      policy.product.product_code === 'virtualhospital-monthly' ||
      policy.product.product_code === 'virtualhospital-annual'
    ) {
      policy.certificateUrl = CONSTANTS.CERTIFICATE_URL_MISSING;
    }
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING;
  }

  isDateExpirationViewOneDayBefore() {
    this.componentFeaturesService.useComponent('policy-detail');
    this.componentFeaturesService.useRule('view-one-day-before');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      if (constraints) {
        return constraints.some(product => this.policy.product.product_code.startsWith(product));
      }
    }
  }

  hasSameInfosetOfPurchaseDay() {
    this.componentFeaturesService.useComponent('policy-detail');
    this.componentFeaturesService.useRule('same-infoset-purchase');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      if (constraints) {
        return constraints.some(product => this.policy.product.product_code.startsWith(product));
      }
    }
  }

  private formatDates(policy: Policy): void {
    this.formattedExpirationDate = moment(policy.expirationDate).format('DD/MM/YYYY');
    this.formattedStartDate = moment(policy.startDate).format('DD/MM/YYYY');
  }
}
