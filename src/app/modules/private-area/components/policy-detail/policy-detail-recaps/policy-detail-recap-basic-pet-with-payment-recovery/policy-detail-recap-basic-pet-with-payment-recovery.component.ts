import { find } from 'rxjs/operators';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Policy } from '../../../../private-area.model';
import { ComponentFeaturesService } from '../../../../../../core/services/componentFeatures.service';
import { KenticoTranslateService } from '../../../../../kentico/data-layer/kentico-translate.service';
import * as moment from 'moment';
import { CONSTANTS } from '../../../../../../app.constants';
import * as _ from 'lodash';
import { PolicyDetailRecapDynamicComponent } from '../policy-detail-recap-dynamic.component';
import { DataService, InsurancesService } from '@services';

@Component({
    selector: 'app-policy-detail-recap-basic-pet-with-payment-recovery',
    templateUrl: './policy-detail-recap-basic-pet-with-payment-recovery.component.html',
    styleUrls: ['./policy-detail-recap-basic-pet-with-payment-recovery.component.scss'],
    standalone: false
})
export class PolicyDetailRecapBasicPetWithPaymentRecoveryComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  @Input() policy: Policy;
  priceIsNumber = true;
  kenticoPrivateArea: any;
  typeAnimals: string;
  paid: boolean;
  lastPayment: any;
  lastPolicy: any;

  constructor(private componentFeaturesService: ComponentFeaturesService,
    private kenticoTranslateService: KenticoTranslateService,
    private dataService: DataService,
    private insuranceService: InsurancesService,
    private elementRef: ElementRef) {
    super();
  }

  ngOnInit() {
    if (this.isDateExpirationViewOneDayBefore()) {
      this.policy.expirationDate = moment(this.policy.expirationDate).subtract(1, 'day').toDate();
    }
    if (this.isStartDateViewOneDayBefore()) {
      this.policy.startDate = moment(this.policy.startDate).subtract(1, 'day').toDate();
    }
    this.priceIsNumber = (!!this.policy && !!this.policy.price && !isNaN(<number>this.policy.price));
    this.kenticoTranslateService.getItem('private_area').subscribe(resp => {
      this.kenticoPrivateArea = resp;
      this.getAnimalType();
    });
    if (this.policy.installments !== null && this.policy.installments.length > 0) {
      this.getLastPayment();
    }
  }

  isCertificateMissing(policy) {
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING;
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

  isStartDateViewOneDayBefore() {
    this.componentFeaturesService.useComponent('policy-detail');
    this.componentFeaturesService.useRule('view-one-day-before-start-date');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      if (!!constraints) {
        return constraints.some((product) => this.policy.product.product_code.startsWith(product));
      }
    }
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

  getAnimalType() {
    const groupsKind = _.groupBy(this.policy.insuredEntities.pets[0], 'kind');
    const groupsKindKeys = Object.keys(groupsKind);
    for (const groupsKindKey of groupsKindKeys) {
      this.typeAnimals = (this.typeAnimals || '') + (this.typeAnimals ? ', ' : '') + this.getKenticoName(groupsKindKey, groupsKind);
    }
  }

  getKenticoName(kind, groupsKind) {
    switch (kind) {
      case 'dog':
        const dog = [];
        groupsKind.dog.forEach(element => {
          dog.push(element.breed);
        });
        return this.kenticoPrivateArea.type_animal_dog.value + ' ' + dog.join('-');
      case 'cat':
        const cat = [];
        groupsKind.cat.forEach(element => {
          cat.push(element.breed);
        });
        return this.kenticoPrivateArea.type_animal_cat.value + ' ' + cat.join('-');
      default:
        break;
    }
  }

  retryPayment() {
    const paymentMethod = this.policy.product.payment_methods.find(method => method.name.toLowerCase().includes('sia'));
    const request = { line_item_id: this.policy.id };
    this.insuranceService.getSiaPaymentRedirectManageCard(request, paymentMethod.id.toString()).subscribe(resp => {
      const containerHtmlSia = this.elementRef.nativeElement.querySelector('.container-html-sia-retry-payment');
      containerHtmlSia.insertAdjacentHTML('beforeend', resp.body);
      document.forms['frm'].submit();
    });
  }
  getLastPayment() {
    if (this.policy.installments && this.policy.installments.length > 1) {
      let i = 1;
      for (const installment of this.policy.installments) {
        if (i <= this.policy.installments.length - 1) {
          if (moment(installment.start_date).toDate() > moment(this.policy.installments[i].start_date).toDate()) {
            this.lastPayment = installment.start_date;
            this.lastPolicy = installment;
            i++;
          } else {
            this.lastPayment = this.policy.installments[i].start_date;
            this.lastPolicy = installment;
            i++;
          }
        }
      }
      if (this.lastPolicy.state !== 'paid') {
        this.paid = true;
      }
    } else {
      this.lastPayment = this.policy.installments[0].payment_date;
      this.paid = this.policy.installments[0].state !== 'paid';
    }
  }
}
