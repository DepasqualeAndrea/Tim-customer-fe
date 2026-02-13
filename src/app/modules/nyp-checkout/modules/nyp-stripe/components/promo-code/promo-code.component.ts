import { AuthService } from 'app/core/services/auth.service';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { DataService } from 'app/core/services/data.service';
import { CheckoutStepInsuranceInfoProduct } from 'app/modules/checkout/checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.model';
import { CheckoutStepPaymentPromoCode } from 'app/modules/checkout/checkout-step/checkout-step-payment/checkout-step-payment.model';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import {AdobeAnalyticsDatalayerService} from '../../../../../../core/services/adobe_analytics/adobe-init-datalayer.service';

@Component({
    selector: 'app-promo-code',
    templateUrl: './promo-code.component.html',
    styleUrls: ['./promo-code.component.scss', '../../../../styles/checkout-forms.scss'],
    standalone: false
})
export class PromoCodeComponent implements OnInit, OnChanges {


  form: UntypedFormGroup;
  @Input() promoCode: CheckoutStepPaymentPromoCode;
  @Input() product: CheckoutStepInsuranceInfoProduct;
  @Output() promoCodeApply: EventEmitter<CheckoutStepPaymentPromoCode> = new EventEmitter<CheckoutStepPaymentPromoCode>();
  @Output() promoCodeRemove: EventEmitter<void> = new EventEmitter<void>();
  linearStepper: boolean;
  promoCodeKentico: any;
  code: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private componentFeaturesService: ComponentFeaturesService,
    public dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
    private authService: AuthService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group(this.fromModelToView(this.promoCode));
    if ((this.dataService.isTenant('imagin-es-es_db') || this.dataService.isTenant('santa-lucia_db')) && this.product.code === 'chubb-deporte') {
      this.kenticoTranslateService.getItem<any>('checkout_sport').subscribe(res => this.promoCodeKentico = res.question_promo_code.value);
    }
    this.componentFeaturesService.useComponent('checkout');
    this.componentFeaturesService.useRule('linear-stepper');
    if (this.componentFeaturesService.isRuleEnabled()) {
      this.linearStepper = true;
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      if (!!constraints) {
        console.log("COSTRAINTS = " + constraints)
        this.linearStepper = constraints.some((product) => product.includes("tim-my-home"));
      }
    }
    this.componentFeaturesService.useRule('bank-account');
    if (this.componentFeaturesService.isRuleEnabled()) {
      this.linearStepper = true;
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      if (!!constraints) {
        this.linearStepper = constraints.some((product) => this.product.code.startsWith(product));
      }
    }
    this.autoFillDiscountCode();

    this.code = "tim-my-home";

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.promoCode && !changes.promoCode.firstChange) {
      this.form.patchValue(this.fromModelToView(this.promoCode));
    }
  }


  private autoFillDiscountCode(): void {
    this.componentFeaturesService.useComponent('checkout-step-payment');
    this.componentFeaturesService.useRule('autofill-discount-code');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const user = this.authService.loggedUser;
      if (!!user.data.automatic_discount_code) {
        this.form.controls.promoCode.patchValue(user.data.automatic_discount_code);
      }

    }
  }

  fromModelToView(promoCode: CheckoutStepPaymentPromoCode): { [key: string]: any } {
    return {
      promoCode: promoCode && promoCode.value,
      applied: promoCode && promoCode.applied
    };
  }

  fromViewToModel(form: UntypedFormGroup): CheckoutStepPaymentPromoCode {
    return { value: form.controls.promoCode.value, applied: form.controls.applied.value, promotion_name: '' };
  }

  removePromoCode($event) {
    $event.preventDefault();
    this.promoCodeRemove.emit();
  }

  applyPromoCode() {
    this.promoCodeApply.emit(this.fromViewToModel(this.form));
    let digitalData: digitalData = window['digitalData'];
    digitalData.cart.form.codice_sconto = 'si';
    this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
  }

}

