import { Component, OnInit } from '@angular/core';
import { DataService } from '@services';
import { CONSTANTS } from 'app/app.constants';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { PolicyDetailRecapDynamicComponent } from '../policy-detail-recap-dynamic.component';
import {ComponentFeaturesService} from '../../../../../../core/services/componentFeatures.service';
import moment from 'moment';

@Component({
    selector: 'app-policy-detail-recap-basic-travel',
    templateUrl: './policy-detail-recap-basic-travel.component.html',
    styleUrls: ['./policy-detail-recap-basic-travel.component.scss'],
    standalone: false
})
export class PolicyDetailRecapBasicTravelComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  duration: string;

  constructor(
    private componentFeaturesService: ComponentFeaturesService,
    public dataService: DataService
  ) {
    super();
  }

  ngOnInit() {
    if (this.isDateExpirationViewOneDayBefore()) {
      this.policy.expirationDate = moment(this.policy.expirationDate).subtract(1, 'day').toDate();
    }
  }

  isCertificateMissing(policy) {
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING;
  }

  hasSameInfosetOfPurchaseDay() {
    this.componentFeaturesService.useComponent('policy-detail');
    this.componentFeaturesService.useRule('same-infoset-purchase');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      if (!!constraints) {
        return constraints.some((product) => this.policy.product.product_code.startsWith(product));
      }
    }
  }

  isDateExpirationViewOneDayBefore() {
    this.componentFeaturesService.useComponent('policy-detail');
    this.componentFeaturesService.useRule('view-one-day-before');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      if (!!constraints) {
        return constraints.some((product) => this.policy.product.product_code.startsWith(product));
      }
    }
  }

  joinDestinationsString(destinations: any) {
    let destinationsString = '';
    destinations.forEach((dest, i) => {
      destinationsString = destinationsString + (i === 0 ? '' : ', ') + dest.country;
    });
    return destinationsString;
  }

}

