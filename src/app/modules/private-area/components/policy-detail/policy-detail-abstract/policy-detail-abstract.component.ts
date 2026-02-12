import { NypExternalClaimService, NypIadOrderService, NypInsurancesService, NypUserService, POLICY_STATUS } from '@NYP/ngx-multitenant-core';
import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PolicyNotificationType, PolicyPayments, User } from '@model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, DataService, InsurancesService, Tenants, UserService } from '@services';
import { ModalService } from 'app/core/services/modal.service';
import { NYP_ENABLED_PRODUCTS, TIM_BILL_PROTECTION_2_PRODUCT_NAME, TIM_BILL_PROTECTION_PRODUCT_NAME, TIM_BILL_PROTECTOR_PRODUCT_NAME, TIM_PROTEZIONE_CASA_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypApiService } from 'app/modules/nyp-checkout/services/api.service';
import { Braintree3DSecurePaymentService } from 'app/modules/payment-management/payment-services/braintree-3d-secure-payment.service';
import { PolicyDetailModalWithdrawalNetComponent } from 'app/modules/private-area/components/policy-detail/policy-detail-modal-withdrawal-net/policy-detail-modal-withdrawal-net.component';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { BlockUIService } from 'ng-block-ui';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ExternalClaimUser } from '../../../../../core/models/claims/external-claim-user.model';
import { ExternalClaimService } from '../../../../../core/services/claims/external-claim.service';
import { ComponentFeaturesService } from '../../../../../core/services/componentFeatures.service';
import { LoaderService } from '../../../../../core/services/loader.service';
import { KenticoTranslateService } from '../../../../kentico/data-layer/kentico-translate.service';
import { PaymentMethod, Wallet } from '../../../../payment-management/payment-management.model';
import { ContainerComponent } from '../../../../tenants/component-loader/containers/container.component';
import { Policy, PolicyAction, PolicyPaymentMethodType } from '../../../private-area.model';
import { PolicyDetailModalCancelationCivibankComponent } from '../policy-detail-modal-cancelation-civibank/policy-detail-modal-cancelation-civibank.component';
import { PolicyDetailModalCancelationSuccessCivibankComponent } from '../policy-detail-modal-cancelation-success-civibank/policy-detail-modal-cancelation-success-civibank.component';
import { PolicyDetailModalCancelationSuccessComponent } from '../policy-detail-modal-cancelation-success/policy-detail-modal-cancelation-success.component';
import { PolicyDetailModalCancelationComponent } from '../policy-detail-modal-cancelation/policy-detail-modal-cancelation.component';
import { PolicyDetailModalCancellationMultiriskComponent } from '../policy-detail-modal-cancellation-multirisk/policy-detail-modal-cancellation-multirisk.component';
import { PolicyDetailModalWithdrawalNewComponent } from '../policy-detail-modal-withdrawal-new/policy-detail-modal-withdrawal-new.component';
import { PolicyDetailModalWithdrawalSuccessComponent } from '../policy-detail-modal-withdrawal-success/policy-detail-modal-withdrawal-success.component';
import { PolicyDetailModalWithdrawalComponent } from '../policy-detail-modal-withdrawal/policy-detail-modal-withdrawal.component';
import { PolicyUpdateEvent, PolicyUpdateItem } from '../policy-detail.model';
import { PolicyLinkPositions } from './policy-links-positions.enum';
import { ExternalClaim } from 'app/core/models/claims/external-claim.model';

@Directive()
export abstract class PolicyDetailAbstractComponent implements OnInit, OnDestroy {

  policy: Policy;
  policyAction: PolicyAction;
  braintreePaymentMethod = { id: null, name: null, type: null };
  paymentMethods: PaymentMethod[];
  paymentMethod: PaymentMethod;
  paypal = true;
  creditCard = true;
  editCollapsed = true;
  collapseWhenPaymentAdded = false;
  paymentMethodTypes = PolicyPaymentMethodType;
  notificationTypes = PolicyNotificationType;
  hiddenClaimButtonProducts = ['pmi-rbm-pandemic', 'das-legalprotection', 'satec-tua-sunny', //
    'rc-scooter-bike', 'virtualhospital-annual', 'virtualhospital-monthly'];
  showLegalProtectionNoteProducts = ['net-pet-gold'];
  externalClaimProducts: string[] = [];
  externalLinkClaimProducts: string[] = [];
  paperyDocProducts: string[] = [];
  withdrawableLinkNotVisible: string[] = [];
  paymentData: {};
  cardNumbers: string;
  unknownPaymentMethod = {
    email: 'Dati non disponibili',
    expiration: 'Dati non disponibili',
    holder: 'Dati non disponibili',
    id: 9999,
    lastDigits: 'Dati non disponibili',
    type: 'Dati non disponibili',
    wallet: {
      data: {
        email: 'Dati non disponibili'
      }
    }
  };
  providerImage: string;
  providerImageAlt: string;
  policies: any;
  nopolicies = false;
  showListPayments: boolean;
  sendPaperyDoc = true;
  isSkiPolicyNotActive = false;

  @Input() product: any;
  @Output() loadingRequested: EventEmitter<boolean> = new EventEmitter<boolean>();
  disclaimer3DSecure: string;
  paymentmethodProducts: any;
  doubleClaimButtonProducts: any;
  policyActionsPosition: string;
  linkExternal: any;
  infoLinkExternal: any;
  paymentWalletSteps: string;
  payments: PolicyPayments[];
  private subscriptions: { [key: string]: Subscription } = {};
  extraInfoProvider: object;




  protected constructor(
    private route: ActivatedRoute,
    protected modalService: NgbModal,
    public insurancesService: InsurancesService,
    protected nypInsurancesService: NypInsurancesService,
    public dataService: DataService,
    private userService: UserService,
    protected nypUserService: NypUserService,
    private toastrService: ToastrService,
    private router: Router,
    public kenticoTranslateService: KenticoTranslateService,
    public componentFeaturesService: ComponentFeaturesService,
    private authService: AuthService,
    private externalClaimService: ExternalClaimService,
    protected nypExternalClaimService: NypExternalClaimService,
    private braintree3DSecurePaymentService: Braintree3DSecurePaymentService,
    private blockUIService: BlockUIService,
    private loaderService: LoaderService,
    public modService: ModalService,
    public nypIadOrderService: NypIadOrderService,
    private apiService: NypApiService,
  ) { }
  ngOnInit() {
    this.route.data.pipe(untilDestroyed(this)).subscribe(data => {
      this.initPolicy(data.policy);
      if (!!this.policy.subscription) {
        this.getThreeDSecureDisclaimerContent(this.policy.subscription).subscribe();
      }
    });
    this.getExternalClaimProducts();
    this.getPaperyDocsProducts();
    this.hidePaymentMethods();
    this.getPaymentMethodsSection();
    this.getDoubleClaimButton();
    this.getWithdrawableLinkNotVisibleProducts();
    this.getShowListPayments();
    this.getPolicyActionsLinkPosition();
    this.getExtraInfoGenertel();
    this.getPaymentWalletSteps();
    this.subscribePayments();
    this.getExtraInfoProvider();
  }

  claimRequestButtons() {
    if (this.getDoubleClaimButton()) {
      if (this.doubleClaimButtonProducts.includes(this.policy.product.product_code)) {
        return true;
      }
    }
  }

  /**
   * Subscribe to payments from insurances.services
   * @returns Observable di PolicyPayments
   */
  protected subscribePayments() {
    if (this.policy['payments']) {
      this.payments = [this.policy['payments']];
      //this.subscriptions['payments'] = this.nypInsurancesService.getPaymentsInsuranceById(this.policy.id).subscribe(pay => this.payments = pay);
    }
  }

  showPaymentMethod() {
    if (this.getPaymentMethodsSection()) {
      if (this.hasPaymentMethod()) {
        if (this.paymentmethodProducts.includes(this.policy.product.product_code) && this.isPaymentRecurrent(this.policy)) {
          return true;
        } else {
          return false;
        }
      }
    } else {
      return true;
    }
  }

  getExtraInfoGenertel() {
    if (this.isExternalLinkClaim()
      || this.policy.product.product_code.includes('tim-for-ski')) {
      this.kenticoTranslateService.getItem<any>('links_external_open_claim').pipe(untilDestroyed(this)).subscribe(item => {
        const nameProduct = this.policy.product.product_code.split('-').join('');
        this.linkExternal = item.linked_items[nameProduct].text.value;
        this.infoLinkExternal = item.linked_items['info_' + nameProduct] ? item.linked_items['info_' + nameProduct].text.value : null;
      });
    }
  }

  getExtraInfoProvider() {
    if (this.dataService.tenantInfo === 'imagin-es-es_db') {
      this.kenticoTranslateService.getItem<any>('extra_info_provider').pipe(untilDestroyed(this)).subscribe(item => {
        this.componentFeaturesService.useComponent('policy-detail');
        this.componentFeaturesService.useRule('claim');
        const constraints = this.componentFeaturesService.getConstraints().get('external-number') || [];
        let allowed: boolean;
        if (constraints.includes(this.policy.product.product_code)) {
          allowed = true;
        }
        this.extraInfoProvider = {
          allowed: allowed,
          value: item.linked_items.chubb_deporte_phone.text.value
        };
      });
    }
  }

  getPaymentWalletSteps() {
    this.kenticoTranslateService.getItem<any>('private_area.modify_payment_steps').pipe(untilDestroyed(this)).subscribe(item => {
      this.paymentWalletSteps = item.value;
    });
  }

  getThreeDSecureDisclaimerContent(subscription): Observable<any> {
    const paymentMethods$ = of(this.policy.product.payment_methods);
    const disclaimerContent$ = this.kenticoTranslateService.getItem<any>('disclaimer_3dsecure.threedsecure_disclaimer').pipe(
      map<any, string>(item => item.value)
    );
    return forkJoin([paymentMethods$, disclaimerContent$]).pipe(
      tap(([methods, disclaimer]) => {
        const isPaymentRecurrent = this.isPaymentRecurrent(this.policy);
        const actualPaymentMethod = subscription.source_attributes ? methods.find(method =>
          subscription.source_attributes.payment_method_id === method.id
        ) : null;
        const isUserPaymentMethodOutdated = !!actualPaymentMethod && !actualPaymentMethod.name.includes('PaypalBraintree') &&
          actualPaymentMethod.name !== 'Transfer';
        if (isPaymentRecurrent && isUserPaymentMethodOutdated) {
          this.disclaimer3DSecure = disclaimer;
        }
      })
    );
  }

  noPaymentMethod(policy: Policy) {
    this.policy = Object.assign({}, policy);
    if (this.policy.paymentMethod === undefined || !this.paymentMethod) {
      this.cardNumbers = '';
      this.paymentData = Object.assign(this.unknownPaymentMethod);
    } else {
      this.cardNumbers = '************';
      this.paymentData = this.paymentMethod || this.policy.paymentMethod;
    }
  }

  computeBraintreePaymentMethod(paymentMethods: any[], productCode: string): any {
    this.componentFeaturesService.useComponent('policy-detail');
    this.componentFeaturesService.useRule('get-different-braintree-payment-method');
    let isProductCodeValid = false;
    let allProductCodesEnabled = false;
    if (this.componentFeaturesService.isRuleEnabled()) {
      const defaultBraintreePaymentMethod = this.componentFeaturesService.getConstraints().get('payment-method-name');
      const enabledProductCodes = this.componentFeaturesService.getConstraints().get('product-codes');
      if (enabledProductCodes) {
        isProductCodeValid = enabledProductCodes.some(code =>
          code === productCode
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

  initPolicy(policy: Policy) {
    this.policy = Object.assign({}, policy);
    const product = this.policy.product;
    const nameProduct = product.properties.find(prop => prop.name === 'name_product');
    this.policy.nameProduct = nameProduct ? nameProduct.value : '';
    let paymentMethods = product.payment_methods;
    if (paymentMethods[0] === undefined) {
      paymentMethods = Object.assign(this.unknownPaymentMethod);
    } else {
      this.braintreePaymentMethod = this.computeBraintreePaymentMethod(paymentMethods, product.product_code);
    }
    this.nypUserService.getGupPaymentMethodList(DataService.POLICY_PAYMENT_ID).subscribe(wallets => {
      this.paymentMethods = (wallets.payment_source || [])
        .filter(wallet => wallet.payment_method_id === this.braintreePaymentMethod.id)
        .map(wallet => this.convertWallet(wallet));
      this.nypInsurancesService.getInsuranceById(+this.policy.id).subscribe(insurance => {
        const ins = insurance as any;
        if (!!ins.subscription) {
          if (ins.subscription.source_attributes && ins.subscription.source_attributes.type
            && (ins.subscription.source_attributes.type.includes('PaypalBraintree')
              || ins.subscription.source_attributes.type.toLowerCase().includes('sia'))) {
            this.getPaymentDataFromPreviousSubscription(policy.subscription.source_attributes);
            return;
          }
          const method = ins.subscription.source_attributes ? this.paymentMethods.find(pm => pm.id === ins.subscription.source_attributes.id) : null;
          if (method) {
            this.cardNumbers = '************';
            this.paymentData = method;
            return;
          }
          this.cardNumbers = '';
          this.paymentData = Object.assign(this.unknownPaymentMethod);
          return;
        } else {
          if (!!this.policy.paymentMethod &&
            !!this.policy.paymentMethod.sourceType && this.policy.paymentMethod.sourceType.includes('PaypalBraintree')) {
            this.paymentMethod = this.policy.paymentMethod;
            this.cardNumbers = '************';
            this.paymentData = Object.assign(this.paymentMethod);
            return;
          }
          const method = this.paymentMethods.find(pm => pm.id === this.policy.paymentMethod.id);
          this.paymentMethod = method;
          this.noPaymentMethod(policy);
          return;
        }
      });
    });
  }

  getPaymentDataFromPreviousSubscription(sourceAttributes) {
    this.cardNumbers = '************';
    this.paymentData = {
      email: sourceAttributes.email,
      expiration: `${sourceAttributes.month}/${sourceAttributes.year}`,
      holder: sourceAttributes.name,
      id: sourceAttributes.id,
      lastDigits: sourceAttributes.last_digits,
      type: sourceAttributes.cc_type,
    };
  }

  isExternalClaim() {
    return this.externalClaimProducts.findIndex(code => code === this.policy.product.product_code) >= 0;
  }

  isExternalLinkClaim() {
    return this.externalLinkClaimProducts.findIndex(code => code === this.policy.product.product_code) >= 0;
  }

  isWithdrawableLinkNotVisibleProducts() {
    return this.withdrawableLinkNotVisible.findIndex(code => code === this.policy.product.product_code) >= 0;
  }

  hasPaperyDoc() {
    return this.paperyDocProducts.findIndex(code => code === this.policy.product.product_code) >= 0;
  }

  hasPaymentMethod() {
    return this.paymentmethodProducts.findIndex(code => code === this.policy.product.product_code) >= 0;
  }

  requestPapery() {
    this.insurancesService.requestPaperyDoc(this.policy.id.toString()).subscribe(response => this.policy.papery_docs = response.papery_docs);
  }

  openClaim() {
    if (this.isExternalClaim()) {
      this.openExternalClaim();
    } else {
      this.openModalClaim();
    }
  }

  openExternalClaim() {
    const userClaim: ExternalClaimUser = this.convertUserToExternalClaimUser(this.authService.loggedUser);
    const claim: ExternalClaim = new ExternalClaim();
    claim.claim.insured = userClaim;
    this.loadingRequested.emit(true);
    if (this.dataService.isTenant(Tenants.INTESA)) {
      this.externalClaimService.createExternalClaim(this.policy.id, claim).subscribe(response => {
        if (!!response && !!response.url) {
          window.location.href = response.url;
        }
        this.loadingRequested.emit(false);
      });
    } else {
      this.externalClaimService.getMotionCloudClaimUrl(this.policy.id, claim, this.policy.product.product_code).subscribe(response => {
        if (!!response && !!response.url) {
          window.location.href = response.url;
        }
        this.loadingRequested.emit(false);
      });
    }
  }

  replacementModal() {
    let kenticoContent = {};
    this.kenticoTranslateService.getItem<any>('home_modal_replacement').pipe().subscribe(item => {
      kenticoContent = item;
      const modalRef = this.modalService.open(ContainerComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
      (<ContainerComponent>modalRef.componentInstance).type = 'PolicyDetailReplacementModal';
      (<ContainerComponent>modalRef.componentInstance).componentInputData = { 'kenticoContent': kenticoContent, 'policyData': this.policy };
      modalRef.result.then(result => {
        if (result === 'Cane') {
          const modalRefSuccess = this.modalService.open(ContainerComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
          (<ContainerComponent>modalRefSuccess.componentInstance).type = 'PolicyDetailReplacementSuccessHomeAnimalsModal';
          (<ContainerComponent>modalRefSuccess.componentInstance).componentInputData = { 'kenticoContent': kenticoContent, 'policyData': this.policy };
          modalRefSuccess.result.then(() => this.rerunGuradsAndResolvers(), () => this.rerunGuradsAndResolvers());
        } else {
          const modalRefSuccess = this.modalService.open(ContainerComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
          (<ContainerComponent>modalRefSuccess.componentInstance).type = 'PolicyDetailReplacementSuccessNotInterestedModal';
          (<ContainerComponent>modalRefSuccess.componentInstance).componentInputData = { 'kenticoContent': kenticoContent, 'policyData': this.policy };
          modalRefSuccess.result.then(() => this.rerunGuradsAndResolvers(), () => this.rerunGuradsAndResolvers());
        }
      });

    });
  }

  openModalClaim() {
    this.componentFeaturesService.useComponent('policy-detail');
    this.componentFeaturesService.useRule('claim');
    const value: string = this.componentFeaturesService.getConstraints().get(this.policy.product.product_code);
    const product = this.policy.product.product_code;
    if (!!value) {
      window.open(value, '_blank');
    }
    if ((product === 'chubb-deporte' || product === 'chubb-deporte-rec')
      && (this.dataService.tenantInfo.tenant !== 'santa-lucia_db')) {
      return null;
    }
    if (product === 'sa-pet-gold' || product === 'sa-pet-silver') {
      const modalRef = this.modalService.open(ContainerComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
      (<ContainerComponent>modalRef.componentInstance).type = 'PolicyDetailModalClaimPetForm';
      (<ContainerComponent>modalRef.componentInstance).componentInputData = { 'policyData': this.policy };
    }
    if (product === 'satec-tua-sunny') {
      const modalRef = this.modalService.open(ContainerComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
      (<ContainerComponent>modalRef.componentInstance).type = 'sunnyPolicyModalClaim';
      (<ContainerComponent>modalRef.componentInstance).componentInputData = { 'policyData': this.policy };
    } else if (product === 'tim-my-home') {
      let kenticoContent = {};
      this.kenticoTranslateService.getItem<any>('modal_tim_home_protection_open_claim').pipe().subscribe(item => {
        kenticoContent = item;
        const modalRef = this.modalService.open(ContainerComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
        (<ContainerComponent>modalRef.componentInstance).type = 'PolicyDetailModalDoubleClaimHomeProtection';
        (<ContainerComponent>modalRef.componentInstance).componentInputData = { 'kenticoContent': kenticoContent, 'policyData': this.policy };
      });
    } else if (product === 'tim-my-sci') {
      let kenticoContent = {};
      this.kenticoTranslateService.getItem<any>('modal_tim_my_sci_open_claim').pipe().subscribe(item => {
        kenticoContent = item;
        const modalRef = this.modalService.open(ContainerComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
        (<ContainerComponent>modalRef.componentInstance).type = 'PolicyDetailModalDoubleClaimTimMySciComponent';
        (<ContainerComponent>modalRef.componentInstance).componentInputData = { 'kenticoContent': kenticoContent, 'policyData': this.policy };
      });
    } else if (product === 'esqui-gold' || product === 'esqui-silver') {
      let kenticoContent = {};
      this.kenticoTranslateService.getItem<any>('modal_open_claim_es').pipe().subscribe(item => {
        kenticoContent = item;
        const modalRef = this.modalService.open(ContainerComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
        (<ContainerComponent>modalRef.componentInstance).type = 'PolicyDetailModalClaimEsComponent';
        (<ContainerComponent>modalRef.componentInstance).componentInputData = { 'kenticoContent': kenticoContent, 'policyData': this.policy };
      });
    } else if ((product === 'erv-mountain-gold' || product === 'erv-mountain-silver') && (this.dataService.isTenant('yolodb')
      || this.dataService.isTenant('civibank_db') || this.dataService.isTenant('bancapc-it-it_db')
      || this.dataService.isTenant('banco-desio_db')
    )) {
      this.modService.openModal('sci_modal_open_claim', 'policyModalClaimSci');
    } else if (product === 'ergo-mountain-gold' || product === 'ergo-mountain-silver') {
      this.modService.openModal('sci_modal_open_claim', 'policyModalClaimSci');
    } else if (product === 'axa-assistance-gold' || product === 'axa-assistance-silver' || product === 'axa-annullament') {
      this.modService.openModal('travel_modal_open_claim', 'policyModalClaimTravel');
    } else {
      const modalRef = this.modalService.open(ContainerComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
      (<ContainerComponent>modalRef.componentInstance).type = 'policyModalClaim';
      (<ContainerComponent>modalRef.componentInstance).componentInputData = { 'policyData': this.policy };
    }
  }

  openModalCancelation(): void {
    const product = NypInsurancesService?.products?.products?.find(product => product?.product_code == this.policy.product.product_code);
    const modalRef = this.modalService.open(PolicyDetailModalCancelationComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
    modalRef.componentInstance.policyData = this.policy;
    modalRef.result.then(result => {
      modalRef.dismiss();

      const rest: Observable<any> = NYP_ENABLED_PRODUCTS.includes(this.policy.product.product_code)
        ? this.apiService.deactivatePolicy(this.policy.policyNumber)
        : this.nypInsurancesService.deactivate(this.policy.id, product?.deactivation?.deactivationType);

      rest.subscribe(res => {
        const modalRefSuccess = this.modalService.open(PolicyDetailModalCancelationSuccessComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
        modalRefSuccess.componentInstance.policyData = this.policy;
        modalRefSuccess.result.then(() => this.rerunGuradsAndResolvers(), () => this.rerunGuradsAndResolvers());
      });
    });
  }
  openModalCancellationMultirisk() {
    const modalRef = this.modalService.open(PolicyDetailModalCancellationMultiriskComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
    modalRef.componentInstance.policyData = this.policy;

  }

  openModalCancelationCivibank(): void {
    const product = this.dataService.products.find(product => product.product_code == this.policy.product.product_code);
    const modalRef = this.modalService.open(PolicyDetailModalCancelationCivibankComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
    modalRef.componentInstance.policyData = this.policy;
    modalRef.result.then(result => {
      modalRef.dismiss();
      this.nypInsurancesService.deactivate(this.policy.id, product?.deactivation?.deactivationType).subscribe(res => {
        const modalRefSuccess = this.modalService.open(PolicyDetailModalCancelationSuccessCivibankComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
        modalRefSuccess.componentInstance.policyData = this.policy;
        modalRefSuccess.result.then(() => this.rerunGuradsAndResolvers(), () => this.rerunGuradsAndResolvers());
      });
    });
  }

  openModalWithdrawal(): void {
    const tenant = this.dataService.tenantInfo.tenant;
    let modalRef: any;
    if (this.policy.product.product_code.includes('tim-for-ski')) {
      const modalRef = this.modalService.open(PolicyDetailModalWithdrawalNetComponent,
        { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window', backdrop: 'static', keyboard: false, centered: true });
      modalRef.componentInstance.policyData = this.policy;
      modalRef.result.then(result => {
        modalRef.dismiss();
      });
    } else {
      modalRef = this.modalService.open(this.haveNewPolicyDetailModal() ? PolicyDetailModalWithdrawalNewComponent : PolicyDetailModalWithdrawalComponent,
        { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
      modalRef.componentInstance.policyData = this.policy;
      modalRef.result.then(result => {
        modalRef.dismiss();
        if (tenant === 'chebanca_db') {
          this.nypInsurancesService.withdrawWithIBAN(this.policy.id, result).subscribe(res => {
            const modalRefSuccess = this.modalService.open(PolicyDetailModalWithdrawalSuccessComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
            modalRefSuccess.result.then(() => this.rerunGuradsAndResolvers(), () => this.rerunGuradsAndResolvers());
          });
        } else if (TIM_PROTEZIONE_CASA_PRODUCT_NAME.includes(this.policy?.product?.product_code) || TIM_BILL_PROTECTION_PRODUCT_NAME.includes(this.policy?.product?.product_code) || TIM_BILL_PROTECTION_2_PRODUCT_NAME.includes(this.policy?.product?.product_code), TIM_BILL_PROTECTOR_PRODUCT_NAME.includes(this.policy?.product?.product_code)) {
          this.apiService.withdraw(this.policy.id, result).subscribe(res => {
            const modalRefSuccess = this.modalService.open(PolicyDetailModalWithdrawalSuccessComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
            modalRefSuccess.result.then(() => this.rerunGuradsAndResolvers(), () => this.rerunGuradsAndResolvers());
          });
        } else {
          this.nypInsurancesService.withdraw(this.policy.id, result).subscribe(res => {
            const modalRefSuccess = this.modalService.open(PolicyDetailModalWithdrawalSuccessComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
            modalRefSuccess.result.then(() => this.rerunGuradsAndResolvers(), () => this.rerunGuradsAndResolvers());
          });
        }
      });
    }
  }
  openModalWithdrawalMultirisk() {
    let kenticoContent = {};
    this.kenticoTranslateService.getItem<any>('modal_withdrawal_multirisk').pipe().subscribe(item => {
      kenticoContent = item;
      let modalRef: any;
      modalRef = this.modalService.open(ContainerComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
      (<ContainerComponent>modalRef.componentInstance).type = 'PolicyModalWithdrawalMultirisk';
      (<ContainerComponent>modalRef.componentInstance).componentInputData = { 'kenticoContent': kenticoContent, 'policyData': this.policy };
    });
  }


  openModalClaimReport() {
    let kenticoContent = {};
    this.kenticoTranslateService.getItem<any>('modal_reporting').pipe().subscribe(item => {
      kenticoContent = item;
      console.log(item)
      const modalRef = this.modalService.open(ContainerComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
      (<ContainerComponent>modalRef.componentInstance).type = 'PolicyModalClaimReport';
      (<ContainerComponent>modalRef.componentInstance).componentInputData = { 'kenticoContent': kenticoContent, 'policyData': this.policy };
    });

  }
  rerunGuradsAndResolvers() {
    const defaltOnSameUrlNavigation = this.router.onSameUrlNavigation;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigateByUrl(this.router.url, { replaceUrl: true });
    this.router.onSameUrlNavigation = defaltOnSameUrlNavigation;
  }

  download($event, url): void {
    $event.preventDefault();
    $event.stopPropagation();
    if (this.isMobile()) {
      this.downloadMobile(url);
    } else {
      this.downloadDesktop(url);
    }
  }

  isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  convertWallet(wallet: Wallet): PaymentMethod {
    return {
      id: wallet.id,
      type: wallet.cc_type,
      holder: wallet.name,
      lastDigits: wallet.last_digits,
      expiration: `${wallet.month}/${wallet.year}`,
      wallet: wallet
    };
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
    const previousFavourite = this.paymentMethods.find(pm => pm.wallet.default) || null;
    this.nypUserService.setWallet(newWallet).pipe(
      switchMap((response) => {
        if (item.setAsFavourite) {
          return this.nypUserService.setDefaultPayment(response.id).pipe(map(() => response));
        } else if (!item.setAsFavourite && !!previousFavourite) {
          return this.nypUserService.setDefaultPayment(previousFavourite.id).pipe(map(() => response));
        }
        return of(response);
      })
    ).subscribe((response) => {
      const wallet = this.convertWallet(<Wallet>response);
      this.paymentMethods = this.paymentMethods.concat(wallet);
      if (item.setAsFavourite) {
        this.paymentMethod = wallet;
      }
      if (!this.collapseWhenPaymentAdded) {
        this.collapseWhenPaymentAdded = true;
      }
    });
  }

  savePolicyPaymentMethod() {
    if (!this.paymentMethod || !this.paymentMethod.wallet) {
      return;
    }
    this.loaderService.start('block-ui-main');
    const paymentMethodId = this.paymentMethod.wallet.payment_method_id;
    const walletId = this.paymentMethod.wallet.wallet_payment_source_id;
    this.nypUserService.getLegacyPaymentMethods().pipe(
      map(methods => methods.payment_methods)
    ).subscribe(paymentMethods => {
      const paymentMethod = paymentMethods.find(method =>
        paymentMethodId === method.id
      );
      const isPaypalBraintree = paymentMethod.name.includes('PaypalBraintree');
      if (isPaypalBraintree) {
        const isPaymentPaypal = this.paymentMethod.type === 'paypal';
        if (isPaymentPaypal) {
          this.nypInsurancesService.changeWalletPaymentSubscription(this.policy.id, null, walletId).subscribe(response => {
            this.loaderService.stop('block-ui-main');
            this.rerunGuradsAndResolvers();
          }, error => {
            this.loaderService.stop('block-ui-main');
            this.toastrService.error(error.message);
            console.log(error);
          });
        } else {
          this.braintree3DSecurePaymentService.updateSubscription(paymentMethodId, walletId, this.policy.id).pipe(
            catchError((error) => {
              this.loaderService.stop('block-ui-main');
              this.toastrService.error(error.message);
              return Observable.throw(error);
            }))
            .subscribe(
              result => {
                const nonce = result.payments_attributes[0].source_attributes.nonce;
                this.nypInsurancesService.changeWalletPaymentSubscription(this.policy.id, nonce, walletId).subscribe(response => {
                  this.loaderService.stop('block-ui-main');
                  this.rerunGuradsAndResolvers();
                });
              });
        }
      } else {
        let updatePayment: string;
        this.kenticoTranslateService.getItem<any>('toasts.update_payment_method').pipe(
          tap(toastMessage => updatePayment = toastMessage.value),
          switchMap(() => this.nypInsurancesService.changeWalletSource(this.policy.orderCode, this.paymentMethod.wallet.payment_token, `${this.policy.id}`))
        )
          .subscribe(response => {
            this.loaderService.stop('block-ui-main');
            this.toastrService.success(updatePayment);
            this.rerunGuradsAndResolvers();
          });
      }
    }, error => {
      console.log(error);
    });
  }

  ngOnDestroy(): void {
    Object.values(this.subscriptions).forEach(sub => { sub.unsubscribe(); });
    this.subscriptions = {};
  }

  handlePolicyUpdated(event: PolicyUpdateEvent) {
    if (event.item === PolicyUpdateItem.APPLIANCES) {
      const changes = { cover_care_appliance_insurance: { appliances_attributes: event.value } };
      let updatePolicy: string;
      this.kenticoTranslateService.getItem<any>('toasts.update_policy').pipe(
        tap(toastMessage => updatePolicy = toastMessage.value),
        switchMap(() => this.nypInsurancesService.updateAppliances(this.policy.id, changes))
      )
        .subscribe(res => {
          this.toastrService.success(updatePolicy);
          this.rerunGuradsAndResolvers();
        });
    }
  }

  redirectPolicyRenew(): void {
    const addonIdsString =
      this.policy.product.addons.map(addon => {
        return addon.id;
      }).join(',');
    const renewingPolicy = {
      code: this.policy.product.product_code,
      policyId: this.policy.renewCandidate.id,
      variantId: this.policy.variant.id,
      addonIds: addonIdsString,
    };
    this.router.navigate(['/preventivatore', renewingPolicy]);
  }

  hideClaimButton(code) {
    return !this.hiddenClaimButtonProducts.some(productToHide => productToHide === code);
  }

  getProviderImage(id) {
    this.providerImageAlt = "product.provider.name"
    const url = this.policy.product.images.find(image => image.image_type == "company_image").original_url;

    this.providerImage = url
  }
  /**
   *
   * @returns true if product is ski and status is verified,canceled or unverified.
   * this methods allows the disabling of ski claims btn
   */
  checkIfIsSkiPolicyActive() {
    if (this.policy.product.product_code.includes("tim-for-ski") && ([POLICY_STATUS.VERIFIED, POLICY_STATUS.CANCELED, POLICY_STATUS.UNVERIFIED].some(status => status == this.policy.status))) {
      console.log("TRUE")
      return this.isSkiPolicyNotActive = true;
    }
    console.log("FALSE ")
    return false
  }

  isPaymentRecurrent(policy) {
    return !!policy.subscription;
  }

  showLegalProtectionNote(code) {
    return this.showLegalProtectionNoteProducts.some(productCode => productCode === code);
  }

  getShowListPayments() {
    this.componentFeaturesService.useComponent('policy-detail');
    this.componentFeaturesService.useRule('show-list-payments');
    this.showListPayments = this.componentFeaturesService.isRuleEnabled();
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      if (!!constraints) {
        this.showListPayments = constraints.some((product) => this.policy.product.product_code.startsWith(product));
      }
    }
  }

  getPolicyActionsLinkPosition(): void {
    this.componentFeaturesService.useComponent('policy-detail');
    this.componentFeaturesService.useRule('policy-actions-link-position');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const position = this.componentFeaturesService.getConstraints().get(this.policy.product.product_code);
      this.policyActionsPosition = !!position ? position : PolicyLinkPositions.TOP;
      return;
    }
    this.policyActionsPosition = PolicyLinkPositions.TOP;
  }

  getPosition(position: string) {
    return PolicyLinkPositions[position];
  }

  private getDoubleClaimButton() {
    this.componentFeaturesService.useComponent('policy-detail');
    this.componentFeaturesService.useRule('double-claim-button');
    this.doubleClaimButtonProducts = this.componentFeaturesService.getConstraints().get('products') || [];
    return this.componentFeaturesService.isRuleEnabled();
  }

  private getPerAddonClaimButton() {
    this.componentFeaturesService.useComponent('per-addon-claim-button');
    this.componentFeaturesService.useRule('per-addon-button');
    this.doubleClaimButtonProducts = this.componentFeaturesService.getConstraints().get('products') || [];
    if (this.policy.product.product_code.includes(this.doubleClaimButtonProducts)) {
      return this.componentFeaturesService.isRuleEnabled();
    }
  }

  private getPaymentMethodsSection() {
    this.componentFeaturesService.useComponent('policy-detail');
    this.componentFeaturesService.useRule('payment-method');
    this.paymentmethodProducts = this.componentFeaturesService.getConstraints().get('products') || [];
    return this.componentFeaturesService.isRuleEnabled();
  }

  private getPaperyDocsProducts() {
    this.componentFeaturesService.useComponent('policy-detail');
    this.componentFeaturesService.useRule('papery-doc');
    this.paperyDocProducts = this.componentFeaturesService.getConstraints().get('products') || [];
    // Controllo se tra le constraints del tenant esiste send-papery-doc
    if (this.componentFeaturesService.getConstraints().has('send-papery-doc')) {
      // Recupero il value della constraint send-papery-doc
      const value = this.componentFeaturesService.getConstraints().get('send-papery-doc');
      // Se è di tipo booleano imposto la proprietà sendPaperyDoc
      if (typeof value === 'boolean') {
        this.sendPaperyDoc = value;
        // Altrimenti controllo se è di tipo oggetto e se la chiave corrisponde a "value"
      } else if (typeof value === 'object' && 'value' in value) {
        this.sendPaperyDoc = value.value;
        // Controllo che nel value ci sia un array chiamato "exceptions" con all'interno il codice dei prodotti
        if ('exceptions' in value && Array.isArray(value.exceptions) && value.exceptions.includes(this.policy.product.product_code)) {
          this.sendPaperyDoc = !this.sendPaperyDoc;
        }
      }
    } else {
      this.sendPaperyDoc = true;
    }
  }

  private getExternalClaimProducts() {
    this.componentFeaturesService.useComponent('policy-detail');
    this.componentFeaturesService.useRule('claim');
    this.externalClaimProducts = this.componentFeaturesService.getConstraints().get('externals') || [];
    this.externalLinkClaimProducts = this.componentFeaturesService.getConstraints().get('external-link') || [];
  }

  private haveNewPolicyDetailModal() {
    this.componentFeaturesService.useComponent('policy-detail');
    this.componentFeaturesService.useRule('new-modal-withdraw');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      if (!!constraints) {
        return constraints.some((product) => this.policy.product.product_code === product);
      }
    }
    return null;
  }

  private getWithdrawableLinkNotVisibleProducts() {
    this.componentFeaturesService.useComponent('policy-detail');
    this.componentFeaturesService.useRule('withdrawable-link-not-visible');
    this.withdrawableLinkNotVisible = this.componentFeaturesService.getConstraints().get('products') || [];
  }

  private hidePaymentMethods() {
    this.componentFeaturesService.useComponent('checkout-step-payment');
    this.componentFeaturesService.useRule('paypal-payment-not-visible');
    const paypalInvisible = this.componentFeaturesService.isRuleEnabled();
    this.paypal = paypalInvisible ? false : true;
  }

  private getNumeroCivicoFromAddress(address: string): string {
    const execResult: RegExpExecArray = /^([a-zA-Z\s]*)[\W\s]*(.*?[\d\s]+[\W+]*)$/.exec(address);
    if (!execResult) {
      return address;
    }

    return execResult[2];
  }

  private getStreetFromAddress(address: string): string {
    const execResult: RegExpExecArray = /^([a-zA-Z\s]*)[\W\s]*(.*?[\d\s]+[\W+]*)$/.exec(address);
    if (!execResult) {
      return address;
    }

    return execResult[1];


  }

  private convertUserToExternalClaimUser(u: User): ExternalClaimUser {
    const external: ExternalClaimUser = new ExternalClaimUser();
    external.name = u.address.firstname + ' ' + u.address.lastname;
    external.fiscal_code = u.address.taxcode;
    external.email = u.email;
    external.phone = u.address.phone;
    external.birth_place = !!u.address.birth_city && u.address.birth_city.name || '';
    external.birth_day = moment(u.address.birth_date).format('DD/MM/YYYY');
    external.resident.city = u.address.city;
    external.resident.street = this.getNumeroCivicoFromAddress(u.address.address1);
    external.resident.square = this.getStreetFromAddress(u.address.address1);
    external.resident.province = !!u.address.state && u.address.state.name || '';
    external.resident.postcode = u.address.zipcode;


    // add italian prefix if not present into phone field
    if (!!external.phone && external.phone.startsWith('0039')) {
      external.phone = '+39' + external.phone.substring('0039'.length);
    }
    if (!!external.phone && !external.phone.startsWith('+39')) {
      external.phone = '+39' + external.phone;
    }

    return external;
  }

  private downloadMobile(url: string) {
    const anchor = document.createElement('a');
    document.body.appendChild(anchor);
    anchor.href = url;
    anchor.target = '_blank';
    anchor.download = 'test';
    anchor.click();
    document.body.removeChild(anchor);
  }

  private downloadDesktop(url: string) {
    this.nypInsurancesService.getCertificate(url).subscribe((response) => {
      saveAs(new Blob([response], { type: 'application/zip' }), 'information.zip');
    });
  }

}
