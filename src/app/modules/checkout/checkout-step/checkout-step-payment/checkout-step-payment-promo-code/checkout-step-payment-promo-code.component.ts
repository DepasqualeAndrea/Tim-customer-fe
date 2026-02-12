import { AuthService } from 'app/core/services/auth.service';
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CheckoutStepPaymentPromoCode} from '../checkout-step-payment.model';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { CheckoutStepInsuranceInfoProduct } from '../../checkout-step-insurance-info/checkout-step-insurance-info.model';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { DataService } from 'app/core/services/data.service';

@Component({
  selector: 'app-checkout-step-payment-promo-code',
  templateUrl: './checkout-step-payment-promo-code.component.html',
  styleUrls: ['./checkout-step-payment-promo-code.component.scss']
})
export class CheckoutStepPaymentPromoCodeComponent implements OnInit, OnChanges {

  form: FormGroup;
  @Input() promoCode: CheckoutStepPaymentPromoCode;
  @Input() product: CheckoutStepInsuranceInfoProduct;
  @Output() promoCodeApply: EventEmitter<CheckoutStepPaymentPromoCode> = new EventEmitter<CheckoutStepPaymentPromoCode>();
  @Output() promoCodeRemove: EventEmitter<void> = new EventEmitter<void>();
  linearStepper: boolean;
  promoCodeKentico: any;
  code: string;

  constructor(
    private formBuilder: FormBuilder,
    private componentFeaturesService: ComponentFeaturesService,
    public dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
    private authService: AuthService) {
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
        this.linearStepper = constraints.some((product) => this.product.code.startsWith(product));
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

    this.code = this.product.code;

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

  fromViewToModel(form: FormGroup): CheckoutStepPaymentPromoCode {
    return {value: form.controls.promoCode.value, applied: form.controls.applied.value, promotion_name: ''};
  }

  removePromoCode($event) {
    $event.preventDefault();
    this.promoCodeRemove.emit();
  }

  applyPromoCode() {
    this.promoCodeApply.emit(this.fromViewToModel(this.form));
  }

}
