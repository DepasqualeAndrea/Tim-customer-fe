import { NypCheckoutService, NypIadDocumentaryService } from '@NYP/ngx-multitenant-core';
import { Component, HostListener, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LineItemPaymentFrequency, PaymentMethod } from '@model';
import { DataService } from '@services';
import { GET_TOKEN, REDIRECT_TOKEN_LOCAL_STORAGE_KEY } from 'app/core/models/token-interceptor.model';
import { AdobeAnalyticsDatalayerService } from 'app/core/services/adobe_analytics/adobe-init-datalayer.service';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { DoubleInfoSet } from 'app/modules/checkout/checkout-step/checkout-step-payment/checkout-linear-stepper-payment-redirect/checkout-linear-stepper-payment-redirect-gup/checkout-linear-stepper-payment-redirect-gup.component';
import { GUP_PAYMENT_METHOD_NAME, GUP_RECURRENT_PAYMENT_METHOD_NAME, GupAddEvent, GupPaymentMethod, GupRequest, Pitype, StepGupContent } from 'app/modules/checkout/checkout-step/checkout-step-payment/checkout-linear-stepper-payment-redirect/checkout-linear-stepper-payment-redirect-gup/gup-payment-methods.interface';
import { CheckoutStepPaymentDocumentsAcceptance, CheckoutStepPaymentProduct, CheckoutStepPaymentPromoCode } from 'app/modules/checkout/checkout-step/checkout-step-payment/checkout-step-payment.model';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { CheckoutStates } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { NypGupService } from 'app/modules/nyp-checkout/modules/nyp-gup/services/nyp-gup.service';
import { KenticoPipe } from 'app/shared/pipe/kentico.pipe';
import { concat } from 'rxjs';
import { filter, map, mergeMap, take, tap, toArray } from 'rxjs/operators';
import { TimBillProtectionApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { FormHumanError } from 'app/shared/errors/form-human-error.model';

@Component({
  selector: 'app-checkout-step-payment',
  templateUrl: './checkout-step-payment-gup.component.html',
  styleUrls: ['./checkout-step-payment-gup.component.scss', '../../../../styles/size.scss', '../../../../styles/colors.scss', '../../../../styles/text.scss', '../../../../styles/common.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CheckoutStepPaymentComponent implements OnInit {
  public readonly pageStates: CheckoutStates[] = ['payment'];
  public isMobile: boolean = window.innerWidth < 768;
  @HostListener('window:resize', ['$event'])
  onWindowResize(event): void {
    this.isMobile = event.target.innerWidth < 768;
  }
  @Input('state') public state: CheckoutStates;
  @ViewChild('innerhide') public HIDE;

  titleStates: CheckoutStates[] = ['insurance-info', 'login-register', 'address', 'survey'];
  summaryStates: CheckoutStates[] = [];

  private readonly COMPONENT_FEATURE_NAME = 'checkout-step-payment';
  private readonly DOUBLE_INFO_SET_RULE = 'double-info-set';
  private readonly HIDE_PROMO_CODE_RULE = 'hide-promo-code';
  public doubleInformativeSet: DoubleInfoSet;
  public doubleSetInfo: string;
  private gupPaymentType: string;
  public product: CheckoutStepPaymentProduct;
  public documentsAcceptance: CheckoutStepPaymentDocumentsAcceptance;
  public promoCode: CheckoutStepPaymentPromoCode;
  public documentsAcceptancesForm: FormGroup;
  private latestForm: { uno: boolean, due: boolean, tre: boolean } = { uno: false, due: false, tre: false };

  public gupPaymentMethods: GupPaymentMethod[];
  public defaultGupPaymentMethod: GupPaymentMethod;
  private selectedPitype: Pitype;
  public selectedPaymentMethod: GupPaymentMethod;
  public content: StepGupContent;
  public disableDocuments: boolean = false;
  public hidePromoCode: boolean = false;
  private gupLegacyPaymentMethod: PaymentMethod;

  public get isNoPaymentSelected(): boolean {
    return this.selectedPitype === Pitype.NoPayment;
  }

  public get FormEnabled(): boolean {
    //!!this.selectedPaymentMethod &&
    return this.documentsAcceptancesForm.controls['uno'].value
      && this.documentsAcceptancesForm.controls['tre'].value;


  }

  constructor(
    private gupService: NypGupService,
    private kenticoTranslateService: KenticoTranslateService,
    public componentFeaturesService: ComponentFeaturesService,
    public dataService: DataService,
    private toastr: ToastrService,
    protected nypCheckoutService: NypCheckoutService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private apiService: TimBillProtectionApiService,
    private formBuilder: FormBuilder,
    private kentico: KenticoPipe,
    public nypDataService: NypDataService,
    private nypIadDocumentaryService: NypIadDocumentaryService,
  ) { }

  ngOnInit(): void {
    this.documentsAcceptancesForm = this.formBuilder.group({
      uno: [false, Validators.required],
      tre: [false, Validators.required],
    });

    this.documentsAcceptancesForm.valueChanges.subscribe((value: { uno: boolean, due: boolean, tre: boolean }) => {
      const regex = /href=\"(.*?)\"/gm;

      Object.entries(value)
        .forEach(([k, v]) => {
          if (this.latestForm[k] != v && !!v) {
            let source: string;
            let currentRgx;
            const links = [];

            switch (k) {
              case 'uno': {
                source = this.kentico.transform('tim_sport.checkbox_documents_acceptance_1_ts');
              }; break;
              case 'tre': {
                source = this.kentico.transform('tim_sport.checkbox_documents_acceptance_3_ts');
              }; break;
            }

            while ((currentRgx = regex.exec(source)) !== null) {
              // This is necessary to avoid infinite loops with zero-width matches
              if (currentRgx.index === regex.lastIndex) regex.lastIndex++;

              if (currentRgx?.length == 2) links.push(currentRgx[1]?.split('?')?.[0]);
            }

            concat(
              ...links.map(doc =>
                this.nypIadDocumentaryService.downloadFileFromUrl({ filename: doc?.split('/')?.pop(), remoteUrl: doc }).pipe(
                  map(r => ({ content: r, filename: doc?.split('/')?.pop(), }))
                ))
            ).subscribe(b => saveAs(b.content, b.filename));
          }
        });

      this.latestForm = value;
    });

    this.nypDataService.CurrentState$.pipe(
      filter(state => this.pageStates.includes(state))
    ).subscribe(() => {
      this.loadContent();
      this.getComponentFeaturesRules();
      // this.checkPaymentFail();
    });
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
    //const secondaryInfoSetFunction: string = this.componentFeaturesService.getConstraints().get(this.currentStep.product.code);
    // if (!!secondaryInfoSetFunction) {
    //   this.doubleInformativeSet = {
    //     setOne: this.currentStep.product.originalProduct.product_structure.template_properties.informative_set,
    //     setTwo: this.currentStep.product.originalProduct.product_structure.template_properties.informative_set_double
    //   };
    // }
  }

  private assignGupPaymentType(): void {
    const gupPaymentType = this.gupService.getGupPaymentType("tim-my-home");
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

  // private checkPaymentFail(): void {
  //   const orderNumber = this.dataService.getResponseOrder().number;
  //   const queryParamOrder = this.route.snapshot.queryParams.order;
  //   this.kenticoTranslateService.getItem<any>('checkout').pipe(take(1)).subscribe(item => {
  //     if (!!queryParamOrder && orderNumber === queryParamOrder) {
  //       this.toastr.error(item.payment_fail.value);
  //     }
  //   });
  // }
  private getDefaultPaymentMethod(): GupPaymentMethod {
    return this.gupPaymentMethods && this.gupPaymentMethods[0];
  }

  public getHidePromoCode() {
    this.componentFeaturesService.useComponent(this.COMPONENT_FEATURE_NAME);
    this.componentFeaturesService.useRule(this.HIDE_PROMO_CODE_RULE);
    if (this.componentFeaturesService.isRuleEnabled()) {
      this.hidePromoCode = this.componentFeaturesService.isRuleEnabled();
    }
  }
  private getGupPaymentMethodsList(): void {
    this.gupService.getUserGupWalletList(this.gupPaymentType, this.product).subscribe(wallet => {
      this.gupLegacyPaymentMethod = this.gupService.getGupLegacyPaymentMethod();
      this.gupPaymentMethods = wallet.payment_sources;
      this.defaultGupPaymentMethod = this.getDefaultPaymentMethod();
      this.selectedPaymentMethod = this.defaultGupPaymentMethod;
    });
  }

  public handleApplyPromoCode(promoCode: CheckoutStepPaymentPromoCode) {
    this.nypCheckoutService.applyCouponCode(this.nypDataService.Order$.value.id, promoCode.value, this.nypDataService.Order$.value.orderCode, this.nypDataService.Order$.value.orderItem?.[0]?.id)
      .pipe(
        tap(response => this.promoCode = Object.assign({}, promoCode, { applied: true, promotion_name: response.promotion_name })),
        mergeMap(() => this.apiService.getOrder(this.nypDataService.Order$.value.orderCode))
      )
      .subscribe(
        response => {
          // const promo = Object.assign({}, promoCode, { applied: true, promotion_name: response.promotion_name });
          // this.checkoutStepService.couponApplied(promo);
          // this.promoCode = promo;
          // Object.assign(this.product, { promoCode: this.promoCode });
        },
        error => {
          this.toastr.error(error.error.error);
          throw new FormHumanError('Invalid promo code');
        }
      );
  }

  public triggerPaymentMethodChanged(addPaymentMethodEvent: GupAddEvent): void {
    this.selectedPaymentMethod = addPaymentMethodEvent.paymentMethod;
    this.selectedPitype = addPaymentMethodEvent.pitype;
  }

  private gupPaymentAction(selectedPaymentMethod: GupPaymentMethod, selectedPitype: Pitype): void {

    const orderNumber = this.nypDataService.OrderCode;
    const payload: GupRequest = {
      payment_method_id: this.gupLegacyPaymentMethod.id,
      order_number: orderNumber
    };
    console.log(payload, "first")
    if (selectedPaymentMethod && selectedPaymentMethod.billing_id) {
      Object.assign(payload, { billing_id: selectedPaymentMethod.billing_id, pitype: selectedPaymentMethod.cc_type });
    } else {
      Object.assign(payload, { pitype: selectedPitype });
    }
    console.log(payload, "after")

    concat(
      this.gupService.pay(payload),
      this.apiService.putOrder({ anagState: 'Elaboration' }),
    ).pipe(toArray(), take(1)).subscribe(([res, _]) => {
      localStorage.setItem(REDIRECT_TOKEN_LOCAL_STORAGE_KEY, GET_TOKEN());
      window.location.href = res.redirectUrl;
    });
  }
  public handlePrevStep() {
    this.nypDataService.CurrentState$.next('survey')
  }
  //TODO: adding gup pay
  public handleNextStep() {
    //this.checkoutService.CurrentState$.next('confirm')
    this.gupPaymentAction(this.selectedPaymentMethod, this.selectedPitype);
  }
}
