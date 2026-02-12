import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';
import { YoloDataLayerEventObjGeneratorService } from 'app/modules/tenants/y/yolo-data-layer-event-obj-generator.service';
import { ToastrService } from 'ngx-toastr';
import { OnInit, ViewChild, Directive } from '@angular/core';
import { CheckoutStepService } from '../../services/checkout-step.service';
import { CheckoutStepComponent } from '../checkout-step.component';
import { RequestOrder, ResponseOrder, User } from '@model';
import { CheckoutProduct } from '../../checkout.model';
import { CheckoutStepPaymentDocumentsAcceptance, CheckoutStepPaymentProduct, CheckoutStepPaymentPromoCode } from './checkout-step-payment.model';
import { PaymentWalletComponent } from '../../../payment-management/payment-wallet/payment-wallet.component';
import { CheckoutStepPaymentDocumentsAcceptanceComponent } from './checkout-step-payment-documents-acceptance/checkout-step-payment-documents-acceptance.component';
import { CheckoutStepPaymentCarrefourConsentComponent } from './checkout-step-payment-carrefour-consent/checkout-step-payment-carrefour-consent.component';
import { PaymentWalletListComponent } from '../../../payment-management/payment-wallet-list/payment-wallet-list.component';
import { CheckoutStepPaymentPromoCodeComponent } from './checkout-step-payment-promo-code/checkout-step-payment-promo-code.component';
import { AuthService, CheckoutService, DataService, UserService } from '@services';
import { PaymentMethod, Wallet } from '../../../payment-management/payment-management.model';
import { ConsentFormComponent } from 'app/shared/consent-form/consent-form.component';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { PaymentBankTransferComponent } from 'app/modules/payment-management/payment-bank-transfer/payment-bank-transfer/payment-bank-transfer.component';
import { FormHumanError } from '../../../../shared/errors/form-human-error.model';
import { PaymentWalletStepperListComponent } from 'app/modules/payment-management/payment-wallet-stepper-list/payment-wallet-stepper-list.component';
import { Observable, of } from 'rxjs';
import { Braintree3DSecurePaymentService } from 'app/modules/payment-management/payment-services/braintree-3d-secure-payment.service';
import { BlockUIService } from 'ng-block-ui';
import { LoaderService } from '../../../../core/services/loader.service';
import { ActivatedRoute } from '@angular/router';
import { NypCheckoutService, NypUserService } from '@NYP/ngx-multitenant-core';

@Directive()
export abstract class CheckoutStepPaymentComponentAbstract extends CheckoutStepComponent implements OnInit {

  constructor(
    checkoutStepService: CheckoutStepService,
    protected checkoutService: CheckoutService,
    protected nypCheckoutService: NypCheckoutService,
    protected userService: UserService,
    protected nypUserService: NypUserService,
    public dataService: DataService,
    private authService: AuthService,
    componentFeaturesService: ComponentFeaturesService,
    public toastrService: ToastrService,
    private braintree3DSecurePaymentService: Braintree3DSecurePaymentService,
    public blockUIService: BlockUIService,
    public loaderService: LoaderService,
    private gtmEventGeneratorService: YoloDataLayerEventObjGeneratorService,
    private gtmHandlerService: GtmHandlerService,
    public route: ActivatedRoute) {
    super(checkoutStepService, componentFeaturesService);
  }

  paymentMethods: PaymentMethod[];
  paymentMethod: PaymentMethod;
  documentsAcceptance: CheckoutStepPaymentDocumentsAcceptance;
  promoCode: CheckoutStepPaymentPromoCode;
  product: CheckoutStepPaymentProduct;
  showConsentForm: boolean;
  showCarrefourConsentForm: boolean;
  user: User;
  success = false;
  flagName: string;
  braintreePaymentMethod: any;
  payload: any;
  public hideWallets = false;

  @ViewChild('paymentWalletListCard', /* TODO: add static flag */ {}) paymentWalletListCard: PaymentWalletListComponent;
  @ViewChild('paymentWalletStepperList') paymentWalletStepperList: PaymentWalletStepperListComponent;
  @ViewChild('paymentWalletFormCard', /* TODO: add static flag */ {}) paymentWalletFormCard: PaymentWalletComponent;
  @ViewChild('paymentPromoCodeCard') paymentPromoCodeCard: CheckoutStepPaymentPromoCodeComponent;
  @ViewChild('documentAcceptanceCard', { static: false }) documentAcceptanceCard: CheckoutStepPaymentDocumentsAcceptanceComponent;
  @ViewChild('carrefourConsentCard') carrefourConsentCard: CheckoutStepPaymentCarrefourConsentComponent;
  @ViewChild('consent') consent: ConsentFormComponent;
  @ViewChild('paymentBankTransfer') paymentBankTransfer: PaymentBankTransferComponent;
  bankTransferType: string;
  bankTransferName = 'Transfer';

  private paymentMethodList = null;
  isHelbiz = false;

  ngOnInit() {
    this.promoCode = (<CheckoutStepPaymentProduct>this.currentStep.product).promoCode;
    this.product = (<CheckoutStepPaymentProduct>this.currentStep.product);
    this.paymentMethod = (<CheckoutStepPaymentProduct>this.currentStep.product).paymentMethod;
    this.documentsAcceptance = (<CheckoutStepPaymentProduct>this.currentStep.product).documentsAcceptance;
    this.braintreePaymentMethod = this.computeBraintreePaymentMethod(this.currentStep.product);
    this.bankTransferType = this.getBankTransferType(this.product, this.bankTransferName);
    this.nypUserService.getWallets().subscribe(wallets => {
      this.paymentMethods = this.createPaymentMethods(
        wallets,
        this.braintreePaymentMethod.id,
        this.product,
        this.bankTransferName
      );
    });
    this.user = this.authService.loggedUser;
    this.componentFeaturesService.useComponent('checkout-step-payment-component');
    this.componentFeaturesService.useRule('showConsents');
    this.showConsentForm = this.componentFeaturesService.isRuleEnabled();
    this.verificationShowUtmSource();
    this.checkoutStepService.afterCheckoutCouponApplied$.subscribe(() => {
      this.updateCheckoutState();
    });
    if (this.dataService.isTenant('helbiz_db')) {
      this.isHelbiz = true;
    }
  }

  verificationShowUtmSource() {
    this.componentFeaturesService.useComponent('checkout-step-payment');
    this.componentFeaturesService.useRule('documents-acceptance-utm-source');
    const c = this.componentFeaturesService.getConstraints();
    const key = this.route.snapshot.queryParams['utm_source'];
    const productCodes = this.componentFeaturesService.getConstraints().get(key);
    if (c.has(key) && productCodes.includes(this.product.code)) {
      this.showCarrefourConsentForm = this.componentFeaturesService.isRuleEnabled();
    } else {
      this.showCarrefourConsentForm = false;
    }

  }

  createPaymentMethods(wallets: any, braintreePaymentMethodId: number, product: CheckoutStepPaymentProduct, bankTransferName: string): PaymentMethod[] {
    const pms = this.getPaymentMethodsFromBrainTreeUserWallet(wallets, braintreePaymentMethodId);
    const createTransferBankWallet = this.canCreateTransferBankWallet(product, bankTransferName);
    if (createTransferBankWallet) {
      const transferBankMethod = this.createTransferBankPaymentMethod(product, bankTransferName);
      return this.addPaymentMethodToUserPaymentMethods(pms, transferBankMethod);
    }
    return pms;
  }

  createRequestOrder(): RequestOrder {
    if (this.checkoutStepService.step.name === 'confirm') {
      return;
    }
    const ro: RequestOrder = { order: {} };
    const responseOrder = this.dataService.getResponseOrder();
    if (this.paymentMethod) {
      ro.order.payments_attributes = [
        this.getPaymentAttributesFromPaymentMethod(this.paymentMethod)
      ];
    }
    return ro;
  }

  handlePaymentMethodChanged(pm: PaymentMethod) {
    this.paymentMethod = pm;
  }

  handlePaymentMethodAdded(item: any) {
    const newWallet: any = { 'payment_method_id': this.braintreePaymentMethod.id };
    if (item.type === 'PayPalAccount') {
      Object.assign(newWallet, { 'payment_method_nonce': item.nonce, 'source_attributes': { 'name': item.details.email } });
    } else {
      Object.assign(newWallet, { 'payment_method_nonce': item.payload.nonce, 'source_attributes': { 'name': item.nameCreditCard } });
    }
    const previusFavourite = this.paymentMethods.find(pm => pm.wallet.default) || null;

    this.nypUserService.setWallet(newWallet).pipe(
      switchMap((response) => {
        if (item.setAsFavourite) {
          return this.nypUserService.setDefaultPayment(response.id).pipe(map(() => {
            return response;
          }));
        } else if (!item.setAsFavourite && !!previusFavourite) {
          return this.nypUserService.setDefaultPayment(previusFavourite.id).pipe(map(() => {
            return response;
          }));
        }
        return of(response);
      })
    ).subscribe((response) => {
      this.updateWallets(response);
      this.closeCollapseAfterAddingPm();
    });
    this.handleGtm(item.type);
  }

  abstract closeCollapseAfterAddingPm();

  updateWallets(addedCard) {
    this.nypUserService.getWallets().subscribe(wallets => {
      this.paymentMethods = this.createPaymentMethods(wallets,
        this.braintreePaymentMethod.id,
        this.product,
        this.bankTransferName);
      this.paymentMethod = this.paymentMethods.find(pm => pm.id === addedCard.id);
      this.continueCheckoutIfRuleIsActive();
    });
  }

  private continueCheckoutIfRuleIsActive(): void {
    this.componentFeaturesService.useComponent('checkout-step-payment');
    this.componentFeaturesService.useRule('next-step-on-payment-added');
    if (this.componentFeaturesService.isRuleEnabled()) {
      this.handleNextStep();
    }
  }

  handleDocumentAcceptanceChange(docAcceptance: CheckoutStepPaymentDocumentsAcceptance) {
    this.documentsAcceptance = docAcceptance;
  }

  handlePrevStep() {
    this.saveProduct();
    super.handlePrevStep();
  }

  handleNextStep() {
    this.updateUser();
    this.saveProduct();
    super.handleNextStep();
  }

  private handleGtm(paymentType: string) {
    const productData = this.product as any;
    this.gtmHandlerService.multiPush(
      this.gtmEventGeneratorService.resetEcommerce(),
      this.gtmEventGeneratorService.fillAddPaymentInfoEvent(productData, paymentType)
    );
  }

  updateUser() {
    if (this.showConsentForm && this.consent.consentForm.valid) {
      const updatedUser = Object.assign({}, this.user) as User;
      const userAcceptancesAttributes = {};
      this.user.user_acceptances.forEach((ua: any, index) => {
        if (this.consent.consentForm.contains(ua.tag)) {
          userAcceptancesAttributes[`${index}`] = {
            id: ua.id,
            value: this.consent.consentForm.controls[ua.tag].value
          };
        } else {
          userAcceptancesAttributes[`${index}`] = {
            id: ua.id,
            value: ua.value
          };
        }
      });
      updatedUser.user_acceptances_attributes = userAcceptancesAttributes;
      this.nypUserService.editUser(updatedUser).pipe(take(1)).subscribe(
        () => {
          this.success = true;
          this.authService.setCurrentUserFromLocalStorage();
        },
      );
    }
  }

  handleApplyPromoCode(promoCode: CheckoutStepPaymentPromoCode) {
    this.nypCheckoutService.applyCouponCode(this.dataService.getResponseOrder().id, promoCode.value, this.dataService.getResponseOrder().number, this.dataService.getResponseOrder().line_items[0].id).subscribe(
      response => {
        const promo = Object.assign({}, promoCode, { applied: true, promotion_name: response.promotion_name });
        this.checkoutStepService.couponApplied(promo);
        this.promoCode = promo;
        Object.assign(this.product, { promoCode: this.promoCode });
      },
      error => {
        this.toastrService.error(error.error.error);
        throw new FormHumanError('Invalid promo code');
      }
    );
  }

  handleRemovePromoCode() {
    this.promoCode = Object.assign({}, this.promoCode, { applied: false });
  }

  saveProduct() {
    const paymentProduct: CheckoutStepPaymentProduct = Object.assign({}, this.currentStep.product,
      { promoCode: this.promoCode, documentsAcceptance: this.documentsAcceptance, paymentMethod: this.paymentMethod });
    this.currentStep.product = paymentProduct;
  }

  canConfirmExternalPayment(): boolean {
    if (this.documentAcceptanceCard && this.documentAcceptanceCard.form) {
      if (this.documentAcceptanceCard.form.valid) {
        return true
      } else {
        return false
      }
    } else {
      return false;
    }
  }

  canConfirm(): boolean {
    if (this.isHelbiz) {
      return this.canConfirmExternalPayment();
    } else {
      const shouldConsentBeValid = this.showConsentForm ? (this.consent !== undefined && this.consent.consentForm.valid) : true;
      const paymentListValidation = this.isThisProductUsingCheckoutStepper()
        ? (this.paymentWalletStepperList !== undefined && this.paymentWalletStepperList.form.valid)
        : (this.paymentWalletListCard !== undefined && this.paymentWalletListCard.form.valid);
      if (this.hideWallets) {
        return this.canConfirmAcceptance() && shouldConsentBeValid;
      }
      if (this.showCarrefourConsentForm) {
        return paymentListValidation
          && this.documentAcceptanceCard.form.valid
          && this.carrefourConsentCard.form.valid
          && shouldConsentBeValid;
      } else if (this.dataService.isTenant('fca-bank_db')) {
        return paymentListValidation
          && this.documentAcceptanceCard.form.valid
          && shouldConsentBeValid;
      } else {
        return paymentListValidation
          && this.documentAcceptanceCard.form.valid
          && shouldConsentBeValid;
      }
    }
  }

  canConfirmAcceptance() {
    if (this.documentAcceptanceCard && this.documentAcceptanceCard.form) {
      return this.documentAcceptanceCard.form.valid;
    } else {
      return false;
    }
  }

  computeBraintreePaymentMethod(product: CheckoutProduct): any {
    const paymentMethods = (product.paymentMethods || []);
    this.componentFeaturesService.useComponent('checkout-step-payment');
    this.componentFeaturesService.useRule('get-different-braintree-payment-method');
    let isProductCodeValid = false;
    let allProductCodesEnabled = false;
    if (this.componentFeaturesService.isRuleEnabled()) {
      const defaultBraintreePaymentMethod = this.componentFeaturesService.getConstraints().get('payment-method-name');
      const enabledProductCodes = this.componentFeaturesService.getConstraints().get('product-codes');
      if (enabledProductCodes) {
        isProductCodeValid = enabledProductCodes.some(code =>
          code === product.code
        );
      } else {
        allProductCodesEnabled = true;
      }
      if (!!defaultBraintreePaymentMethod && isProductCodeValid ||
        !!defaultBraintreePaymentMethod && allProductCodesEnabled) {
        const paymentMethod = paymentMethods.find(pm =>
          pm.name.includes(defaultBraintreePaymentMethod)
        );
        return !!paymentMethod && paymentMethod || undefined;
      }
    }
    const braintreePaymentMethod = paymentMethods.find(pm =>
      pm.name.includes('Braintree') &&
      !pm.name.includes('Paypal')
    );
    return !!braintreePaymentMethod && braintreePaymentMethod || undefined;
  }

  convertWallet(wallet: Wallet, item?: any): PaymentMethod {
    if (item && item.setAsFavourite) {
      Object.assign(wallet, { default: true });
    }
    const pm = {
      id: wallet.id,
      type: wallet.cc_type,
      holder: wallet.name,
      lastDigits: wallet.last_digits,
      expiration: `${wallet.month}/${wallet.year}`,
      wallet: wallet
    };
    if (wallet.wallet_payment_source_id) {
      pm['wallet_payment_source_id'] = wallet.wallet_payment_source_id;
    }
    return pm;
  }

  canCreateTransferBankWallet(product: any, bankTransferName: string): boolean {
    return product.paymentMethods.some(paymentMethod =>
      paymentMethod.name === bankTransferName
    );
  }

  canCreatePaymentWallet(paymentMethodName: string): boolean {
    return this.product.paymentMethods.some(pm => pm.name === paymentMethodName);
  }

  getBankTransferType(product: any, bankTransferName: string): string {
    if (this.canCreateTransferBankWallet(product, bankTransferName)) {
      const transferMethod = product.paymentMethods.find(method =>
        method.name === bankTransferName
      );
      return transferMethod.type;
    }
    return null;
  }

  createTransferBankPaymentMethod(product: any, bankTransferName: string): PaymentMethod {
    const transferMethod = product.paymentMethods.find(method =>
      method.name === bankTransferName
    );
    return {
      id: null,
      type: transferMethod.type,
      holder: null,
      lastDigits: null,
      expiration: null,
      wallet: {
        id: null,
        name: null,
        month: null,
        year: null,
        last_digits: null,
        payment_method_id: transferMethod.id,
        cc_type: null,
        data: {
          prepaid: 'Unknown',
          payroll: 'Unknown',
          debit: 'Unknown'
        },
        default: null,
        recurring: null,
        customer_id: null,
        insurances: []
      }
    };
  }

  addPaymentMethodToUserPaymentMethods(paymentMethods: PaymentMethod[], paymentMethod: PaymentMethod): PaymentMethod[] {
    paymentMethods.push(paymentMethod);
    return paymentMethods;
  }

  getPaymentMethodsFromBrainTreeUserWallet(userWallet: any, braintreePaymentMethodId: number): PaymentMethod[] {
    return !!userWallet.payment_source
      ? userWallet.payment_source.filter(source =>
        source.payment_method_id === braintreePaymentMethodId
      ).map(wallet => this.convertWallet(wallet))
      : [];
  }

  getPaymentAttributesFromPaymentMethod(paymentMethod: PaymentMethod): any {
    if (!!this.braintreePaymentMethod && this.braintreePaymentMethod.type.includes('PaypalBraintree')) {
      if (paymentMethod.type === 'Spree::PaymentMethod::Transfer') {
        return { 'payment_method_id': paymentMethod.wallet.payment_method_id };
      } else {
        return this.payload;
      }
    }
    if (paymentMethod.type.includes('SellaPayment')) {
      const wallet_id = this.dataService.getStorePayment() ? this.dataService.getStorePayment().wallet_id : null;
      return { 'payment_method_id': paymentMethod.id, 'source_attributes': { 'wallet_payment_source_id': wallet_id } };
    }
    return paymentMethod.type !== 'Spree::PaymentMethod::Transfer'
      ? {
        'payment_method_id': paymentMethod.wallet.payment_method_id,
        'source_attributes': { 'existing_card_id': paymentMethod.wallet.id }
      }
      : { 'payment_method_id': paymentMethod.wallet.payment_method_id };
  }

  isThisProductUsingCheckoutStepper() {
    let isStepperLinear = false;
    this.componentFeaturesService.useComponent('checkout');
    this.componentFeaturesService.useRule('linear-stepper');
    if (this.componentFeaturesService.isRuleEnabled()) {
      isStepperLinear = true;
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      if (!!constraints) {
        isStepperLinear = constraints.some((product) => this.currentStep.product.code.startsWith(product));
      }
    }
    return isStepperLinear;
  }

  beforeHandleNextStep(): Observable<any> {
    if (!this.paymentMethod) {
      return of({});
    }
    return this.getPaymentMethods().pipe(switchMap((paymentMethods) => {
      const threeDSecurePayments = paymentMethods.filter(x => x.type.includes('PaypalBraintree'));
      const selectedPaymentIsThreeDSecure: boolean = threeDSecurePayments.some(x => x.id === this.paymentMethod.wallet.payment_method_id);
      if (!!this.paymentMethod.type && this.paymentMethod.type === 'paypal') {
        this.payload = {
          payment_method_id: this.paymentMethod.wallet.payment_method_id,
          source_attributes: {
            wallet_payment_source_id: this.paymentMethod.wallet_payment_source_id,
          },
        };
        return of({});
      }
      if (selectedPaymentIsThreeDSecure) {
        this.loaderService.start('block-ui-main');
        const orderNumber = this.dataService.getResponseOrder().number;
        const paymentSourceInfo = { payment_method_id: this.braintreePaymentMethod.id, wallet_payment_source_id: this.paymentMethod.wallet_payment_source_id, order_number: orderNumber };
        return this.braintree3DSecurePaymentService.pay(paymentSourceInfo).pipe(
          map((payload) => {
            if (payload.success) {
              return payload.payments_attributes[0];
            }
            // _---TODO: add message error
            throw new Error();
          }),
          tap((payload) => {
            this.payload = payload;
            this.loaderService.stop('block-ui-main');
            this.loaderService.reset('block-ui-main');
          }),
          catchError((error) => {
            this.loaderService.stop('block-ui-main');
            this.loaderService.reset('block-ui-main');
            this.toastrService.error(error.message);
            throw new Error(error.message);
          })
        );
      }
      return of({});
    }));

  }

  getPaymentMethods(): Observable<any> {
    if (this.paymentMethodList) {
      return of(this.paymentMethodList);
    }
    return this.nypUserService.getLegacyPaymentMethods()
      .pipe(map((paymentMethodResponse) => {
        this.paymentMethodList = paymentMethodResponse.payment_methods;
        return this.paymentMethodList;
      }));

  }

  isProductCode(code) {
    return this.currentStep.product.code === code;
  }

  private updateCheckoutState(): void {
    this.componentFeaturesService.useComponent('checkout-step-payment');
    this.componentFeaturesService.useRule('complete-checkout-after-coupon');
    const responseOrder: ResponseOrder = this.dataService.getResponseOrder();
    if (this.componentFeaturesService.isRuleEnabled() && responseOrder.total === 0) {
      const validProducts: string[] = this.componentFeaturesService.getConstraints().get('products');
      if (validProducts.includes(this.product.code)) {
        this.hideWallets = true;
        this.checkoutStepService.setCurrentStep('confirm');
      }
    }
  }

  protected isConfirm(): boolean {
    if (this.checkoutStepService.step.name === 'confirm') {
      return true;
    }
    return false;
  }

}
