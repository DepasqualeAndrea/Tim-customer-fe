import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { CheckoutStepService } from '../../../services/checkout-step.service';
import { ComponentFeaturesService } from '../../../../../core/services/componentFeatures.service';
import { AuthService, CheckoutService, DataService, UserService } from '@services';
import { CheckoutStepPaymentComponentAbstract } from '../checkout-step-payment-abstract.component';
import { Braintree3DSecurePaymentService } from 'app/modules/payment-management/payment-services/braintree-3d-secure-payment.service';
import { BlockUIService } from 'ng-block-ui';
import { CheckoutLinearStepperPaymentComponent } from '../checkout-linear-stepper-payment/checkout-linear-stepper-payment.component';
import { CheckoutStepPaymentProduct } from '../checkout-step-payment.model';
import { PAYMENT_METHOD_NAME } from 'app/app.constants';
import { PaymentMethod } from 'app/modules/payment-management/payment-management.model';
import { YoloDataLayerEventObjGeneratorService } from 'app/modules/tenants/y/yolo-data-layer-event-obj-generator.service';
import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';
import { LoaderService } from '../../../../../core/services/loader.service';
import { ActivatedRoute } from '@angular/router';
import { NypCheckoutService, NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-checkout-linear-stepper-no-payment',
  templateUrl: './checkout-linear-stepper-no-payment.component.html',
  styleUrls: ['./checkout-linear-stepper-no-payment.component.scss']
})
export class CheckoutLinearStepperNoPaymentComponent extends CheckoutStepPaymentComponentAbstract implements OnInit {

  kenticoTitleContentId = 'checkout.payment';

  constructor(
    checkoutStepService: CheckoutStepService,
    checkoutService: CheckoutService,
    nypCheckoutService: NypCheckoutService,
    userService: UserService,
    nypUserService: NypUserService,
    dataService: DataService,
    authService: AuthService,
    componentFeaturesService: ComponentFeaturesService,
    toastrService: ToastrService,
    braintree3DSecurePaymentService: Braintree3DSecurePaymentService,
    blockUIService: BlockUIService,
    loaderService: LoaderService,
    gtmEventGeneratorService: YoloDataLayerEventObjGeneratorService,
    gtmHandlerService: GtmHandlerService,
    public route: ActivatedRoute) {
    super(checkoutStepService,
      checkoutService,
      nypCheckoutService,
      userService,
      nypUserService,
      dataService,
      authService,
      componentFeaturesService,
      toastrService,
      braintree3DSecurePaymentService,
      blockUIService,
      loaderService,
      gtmEventGeneratorService,
      gtmHandlerService,
      route);
  }

  ngOnInit() {
    this.getTitle();
    this.nypUserService.getWallets().subscribe(wallets => {
      this.paymentMethods = this.createPaymentMethods(
        wallets,
        this.braintreePaymentMethod.id,
        this.product,
      );
    });
    super.ngOnInit();
  }

  createPaymentMethods(wallets: any, braintreePaymentMethodId: number, product: CheckoutStepPaymentProduct): PaymentMethod[] {
    const pms = this.getPaymentMethodsFromBrainTreeUserWallet(wallets, braintreePaymentMethodId);
    const createNoPaymentWallet = this.canCreatePaymentWallet(PAYMENT_METHOD_NAME.NO_PAYMENT);
    if (createNoPaymentWallet) {
      const noPaymentMethodCC = this.createNoPaymentMethodCC();
      return pms.some(pm => pm.wallet.payment_method_id === noPaymentMethodCC.wallet.payment_method_id)
        ? pms
        : this.addPaymentMethodToUserPaymentMethods(pms, noPaymentMethodCC);
    }
    return pms;
  }

  createNoPaymentMethodCC(): PaymentMethod {
    const paymentMethod = this.product.paymentMethods.find(method =>
      method.name === PAYMENT_METHOD_NAME.NO_PAYMENT
    );
    this.paymentMethod = {
      id: null,
      type: paymentMethod.type,
      holder: null,
      lastDigits: null,
      expiration: null,
      wallet: {
        id: null,
        name: null,
        month: null,
        year: null,
        last_digits: null,
        payment_method_id: paymentMethod.id,
        cc_type: null,
        data: null,
        default: true,
        recurring: null,
        customer_id: null,
        insurances: []
      }
    };
    return this.paymentMethod;
  }

  getPaymentAttributesFromPaymentMethod(paymentMethod: PaymentMethod): any {
    if (!!this.braintreePaymentMethod && this.braintreePaymentMethod.type === 'Spree::PaymentMethod::NoPaymentCreditCard') {
      return {
        payment_method_id: paymentMethod.wallet.payment_method_id,
        source_attributes: {
          verification_value: '12345',
          number: '12345',
          month: '01',
          year: '2023',
          name: 'Matteo Cellucci'
        }
      };
    }
  }

  getTitle(): void {
    this.componentFeaturesService.useComponent('checkout-step-payment');
    this.componentFeaturesService.useRule('title');
    const itemId: string = this.componentFeaturesService.getConstraints().get(this.currentStep.product.code);
    if (!!itemId) {
      this.kenticoTitleContentId = itemId;
    }
  }

  getFunction(functionName: string): Function {
    const func: Function[] = Object.entries(CheckoutLinearStepperPaymentComponent.prototype)
      .filter(f => {
        return f[0] === functionName;
      })
      .map<Function>(f => {
        return <Function>f[1];
      });

    if (func.length === 1) {
      return func[0];
    }
    return null;
  }

  canConfirm() {
    const shouldConsentBeValid = this.showConsentForm ? (this.consent !== undefined && this.consent.consentForm.valid) : true;
    const paymentValidation = !!this.paymentMethod;
    return (paymentValidation && this.documentAcceptanceCard.form.valid && shouldConsentBeValid);
  }

  closeCollapseAfterAddingPm() {
    throw new Error('Method not implemented.');
  }
}
