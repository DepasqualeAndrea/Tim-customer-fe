import { NypCheckoutService } from '@NYP/ngx-multitenant-core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LineItemPaymentFrequency, PaymentMethod, RequestOrder } from '@model';
import { CheckoutService, DataService } from '@services';
import { PAYMENT_METHOD_NAME } from 'app/app.constants';
import { GET_TOKEN, REDIRECT_TOKEN_LOCAL_STORAGE_KEY } from 'app/core/models/token-interceptor.model';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { AdobeAnalyticsDatalayerService } from 'app/core/services/adobe_analytics/adobe-init-datalayer.service';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { GupService } from 'app/core/services/gup.service';
import { CheckoutStepService } from 'app/modules/checkout/services/checkout-step.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { FormHumanError } from 'app/shared/errors/form-human-error.model';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { CheckoutStepComponent } from '../../../checkout-step.component';
import { CheckoutStepPaymentDocumentsAcceptance, CheckoutStepPaymentProduct, CheckoutStepPaymentPromoCode } from '../../checkout-step-payment.model';
import { GUP_PAYMENT_METHOD_NAME, GUP_RECURRENT_PAYMENT_METHOD_NAME, GupAddEvent, GupPaymentMethod, GupRequest, NoPaymentRequest, Pitype, StepGupContent } from './gup-payment-methods.interface';

export type DoubleInfoSet = { setOne: string, setTwo: string };

@Component({
  selector: 'app-checkout-linear-stepper-payment-redirect-gup',
  templateUrl: './checkout-linear-stepper-payment-redirect-gup.component.html',
  styleUrls: ['./checkout-linear-stepper-payment-redirect-gup.component.scss']
})
export class CheckoutLinearStepperPaymentRedirectGupComponent extends CheckoutStepComponent implements OnInit {

  private readonly COMPONENT_FEATURE_NAME = 'checkout-step-payment';
  private readonly DOUBLE_INFO_SET_RULE = 'double-info-set';
  private readonly HIDE_PROMO_CODE_RULE = 'hide-promo-code';

  public doubleInformativeSet: DoubleInfoSet;
  public doubleSetInfo: string;
  private gupPaymentType: string;
  public product: CheckoutStepPaymentProduct;
  public documentsAcceptance: CheckoutStepPaymentDocumentsAcceptance;
  private documentAcceptanceFormValues: CheckoutStepPaymentDocumentsAcceptance;
  public promoCode: CheckoutStepPaymentPromoCode;

  constructor(
    public checkoutStepService: CheckoutStepService,
    private gupService: GupService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private kenticoTranslateService: KenticoTranslateService,
    public componentFeaturesService: ComponentFeaturesService,
    public dataService: DataService,
    private checkoutService: CheckoutService,
    protected nypCheckoutService: NypCheckoutService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService
  ) {
    super(checkoutStepService, componentFeaturesService);
  }

  public gupPaymentMethods: GupPaymentMethod[];
  public defaultGupPaymentMethod: GupPaymentMethod;
  private selectedPitype: Pitype;
  private gupLegacyPaymentMethod: PaymentMethod;
  private consentChecks: boolean;
  public selectedPaymentMethod: GupPaymentMethod;
  public content: StepGupContent;
  public disableDocuments: boolean = false;
  public hidePromoCode: boolean = false;

  public get isNoPaymentSelected(): boolean {
    return this.selectedPitype === Pitype.NoPayment;
  }

  public get canConfirm(): boolean {
    return this.consentChecks && this.hasSelectedPaymentMethod();
  }

  ngOnInit() {
    this.product = (<CheckoutStepPaymentProduct>this.currentStep.product);
    this.documentsAcceptance = (<CheckoutStepPaymentProduct>this.currentStep.product).documentsAcceptance;
    this.promoCode = (<CheckoutStepPaymentProduct>this.currentStep.product).promoCode; 0
    this.loadContent();
    this.getComponentFeaturesRules();
    this.checkPaymentFail();
  }

  private hasSelectedPaymentMethod(): boolean {
    return !!this.selectedPitype || !!this.selectedPaymentMethod;
  }

  private loadContent(): void {
    this.kenticoTranslateService.getItem<any>('checkout_step_gup').pipe(take(1)).subscribe(item => {
      this.content = {
        paymentData: item.payment_data.value,
        paymentDataChoice: item.payment_data_choice.value,
        paymentEligibility: item.product_eligibility.value,
        paymentWalletListGupContent: {
          addCreditCard: item.add_card.value,
          addPaypalAccount: item.add_paypal.value,
          choosePaymentMethod: item.choose_payment.value,
          paymentMethodsLabel: item.payment_methods.value,
          confirmButton: item.confirm_button.value,
          cancelButton: item.cancel_button.value,
          paycheckCharge: item.paycheck_charge && item.paycheck_charge.value
        }
      };
    });
  }

  private getComponentFeaturesRules(): void {
    this.componentFeaturesService.useComponent(this.COMPONENT_FEATURE_NAME);
    this.setDoubleInformativeSet();
    this.assignGupPaymentType();
    this.getHidePromoCode();
  }

  private setDoubleInformativeSet(): void {
    this.componentFeaturesService.useRule(this.DOUBLE_INFO_SET_RULE);
    const secondaryInfoSetFunction: string = this.componentFeaturesService.getConstraints().get(this.currentStep.product.code);
    if (!!secondaryInfoSetFunction) {
      this.doubleInformativeSet = {
        setOne: this.currentStep.product.originalProduct.product_structure.template_properties.informative_set,
        setTwo: this.currentStep.product.originalProduct.product_structure.template_properties.informative_set_double
      };
    }
  }

  private assignGupPaymentType(): void {
    const gupPaymentType = this.gupService.getGupPaymentType(this.product.code);
    if (typeof gupPaymentType === 'string') {
      this.gupPaymentType = gupPaymentType;
      this.getGupPaymentMethodsList();
    }
    if (Array.isArray(gupPaymentType) && gupPaymentType.length > 0) {
      const orderNumber = this.dataService.getResponseOrder().number;
      this.nypCheckoutService.getOrder(orderNumber).subscribe(order => {
        const paymentFrequency = order.line_items[0].payment_frequency;
        this.gupPaymentType = (paymentFrequency !== LineItemPaymentFrequency.MONTHLY && paymentFrequency !== LineItemPaymentFrequency.YEARLY)
          ? gupPaymentType.find(paymentType => paymentType === GUP_PAYMENT_METHOD_NAME)
          : gupPaymentType.find(paymentType => paymentType === GUP_RECURRENT_PAYMENT_METHOD_NAME);
        this.getGupPaymentMethodsList();
      })
    }
  }

  private checkPaymentFail(): void {
    const orderNumber = this.dataService.getResponseOrder().number;
    const queryParamOrder = this.route.snapshot.queryParams.order;
    this.kenticoTranslateService.getItem<any>('checkout').pipe(take(1)).subscribe(item => {
      if (!!queryParamOrder && orderNumber === queryParamOrder) {
        this.toastr.error(item.payment_fail.value);
      }
    });
  }

  /**
  * Calls gupService method to assign payment methods list from
  * user's wallet and sets the first one as selected if it exists
  */
  private getGupPaymentMethodsList(): void {
    this.gupService.getUserGupWalletList(this.gupPaymentType, this.product).subscribe(wallet => {
      this.gupLegacyPaymentMethod = this.gupService.getGupLegacyPaymentMethod();
      this.gupPaymentMethods = wallet.payment_sources;
      this.defaultGupPaymentMethod = this.getDefaultPaymentMethod();
      this.selectedPaymentMethod = this.defaultGupPaymentMethod;
    });
  }

  public handleNextStep(): void {
    if (this.isProductCode('tim-my-home') || this.isProductCode('customers-tim-pet') || this.isProductCode('ehealth-quixa-homage') || this.isProductCode('ehealth-quixa-standard')
      || this.isProductCode('tim-my-sci')) {
      const form: any = {
        paymentmethod: this.selectedPitype,
        mypet_pet_type: this.dataService.getParams().kindSelected !== undefined ? this.dataService.getParams().kindSelected : '',
        codice_sconto: 'yes',
        sci_numassicurati: this.dataService.getParams().insuredNumber !== undefined ? this.dataService.getParams().insuredNumber : 0,
        sci_min14: this.dataService.getParams().insuredMinors !== undefined ? this.dataService.getParams().insuredMinors : false,
        sci_polizza: this.dataService.getParams().proposalName !== undefined ? this.dataService.getParams().proposalName : '',
      }
      const number = this.product.order.id + '';
      let digitalData: digitalData = this.adobeAnalyticsDataLayerService.setDigitalData(this.product, 1, number, {}, form, 'tim broker', '');
      this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    }

    this.selectedPitype === Pitype.NoPayment
      ? super.handleNextStep()
      : this.gupPaymentAction(this.selectedPaymentMethod, this.selectedPitype);
  }

  /**
  * implemented method from superclass CheckoutStepComponent
  * @returns no payment request order to complete checkout
  * @see RequestOrder
  * @see CheckoutStepComponent
  */
  public createRequestOrder(): RequestOrder {
    const requestOrder: RequestOrder = { order: {} };
    const noPayment = this.getNoPayment();
    if (!!noPayment) {
      requestOrder.order.payments_attributes = [
        this.getPaycheckChargeMethod(noPayment)
      ];
    }
    return requestOrder;
  }

  private getNoPayment(): PaymentMethod {
    return this.product.paymentMethods.find(method =>
      method.name === PAYMENT_METHOD_NAME.NO_PAYMENT
    );
  }

  private getPaycheckChargeMethod(paymentMethod: PaymentMethod): NoPaymentRequest {
    return new NoPaymentRequest(paymentMethod.id)
  }

  /**
  * Sends a request with an existing payment method
  * or the type of new payment method to add to the user's wallet
  * @param selectedPaymentMethod is the selected existing payment method to be used for the payment
  * @param selectedPitype is the selected payment type of the new payment method to be added
  * @see GupPaymentMethod
  * @see Pitype
  */
  private gupPaymentAction(selectedPaymentMethod: GupPaymentMethod, selectedPitype: Pitype): void {

    const orderNumber = this.dataService.getResponseOrder().number;
    const payload: GupRequest = {
      payment_method_id: this.gupLegacyPaymentMethod.id,
      order_number: orderNumber
    };
    if (selectedPaymentMethod && selectedPaymentMethod.billing_id) {
      Object.assign(payload, { billing_id: selectedPaymentMethod.billing_id, pitype: selectedPaymentMethod.cc_type });
    } else {
      Object.assign(payload, { pitype: selectedPitype });
    }
    this.gupService.pay(payload).subscribe(res => {
      // TODO: SUPER PEZZOTTO PER PAY-BY-LINK DI YIN YSD-2876
      localStorage.removeItem('yin');

      localStorage.setItem(REDIRECT_TOKEN_LOCAL_STORAGE_KEY, GET_TOKEN());
      window.location.href = res.redirectUrl;
    });
  }

  /**
  * Updates the properties of the component that
  * will be sent as the payment POST payload
  * One of the two properties of addPaymentMethodEvent will always be null
  * @param addPaymentMethodEvent the event that specifies which payment method to use or which type of payment method to add
  * @see   GupAddEvent
  */
  public triggerPaymentMethodChanged(addPaymentMethodEvent: GupAddEvent): void {
    this.selectedPaymentMethod = addPaymentMethodEvent.paymentMethod;
    this.selectedPitype = addPaymentMethodEvent.pitype;
    this.handleDocumentAcceptanceChange(this.documentAcceptanceFormValues)
  }

  public handleDocumentAcceptanceChange(event: CheckoutStepPaymentDocumentsAcceptance): void {

    if (!!event) {
      this.documentAcceptanceFormValues = event;
      let consentKeys = Object.keys(event)
      if (this.selectedPitype !== Pitype.NoPayment) {
        consentKeys = consentKeys.filter(consentKey => consentKey !== 'charge_paycheck')
      }
      this.consentChecks = consentKeys.every(consentKey => !!this.documentAcceptanceFormValues[consentKey]);
    } else {
      this.consentChecks = true;
    }
  }

  private getDefaultPaymentMethod(): GupPaymentMethod {
    return this.gupPaymentMethods && this.gupPaymentMethods[0];
  }

  public isProductCode(code: string): boolean {
    return this.product.code === code;
  }

  public handleApplyPromoCode(promoCode: CheckoutStepPaymentPromoCode) {
    this.nypCheckoutService.applyCouponCode(this.dataService.getResponseOrder().id, promoCode.value, this.dataService.getResponseOrder().number, this.dataService.getResponseOrder().line_items[0].id).subscribe(
      response => {
        const promo = Object.assign({}, promoCode, { applied: true, promotion_name: response.promotion_name });
        this.checkoutStepService.couponApplied(promo);
        this.promoCode = promo;
        Object.assign(this.product, { promoCode: this.promoCode });
      },
      error => {
        this.toastr.error(error.error.error);
        throw new FormHumanError('Invalid promo code');
      }
    );
  }

  public getHidePromoCode() {
    this.componentFeaturesService.useComponent(this.COMPONENT_FEATURE_NAME);
    this.componentFeaturesService.useRule(this.HIDE_PROMO_CODE_RULE);
    if (this.componentFeaturesService.isRuleEnabled()) {
      this.hidePromoCode = this.componentFeaturesService.isRuleEnabled();
    }
  }

  public handleRemovePromoCode() {
    this.promoCode = Object.assign({}, this.promoCode, { applied: false });
  }
}
