import { ToastrService } from 'ngx-toastr';
import { Component, Input, OnInit } from '@angular/core';
import { CheckoutStepService } from '../../../services/checkout-step.service';
import { ComponentFeaturesService } from '../../../../../core/services/componentFeatures.service';
import { AuthService, CheckoutService, DataService, UserService } from '@services';
import { CheckoutStepPaymentComponentAbstract } from '../checkout-step-payment-abstract.component';
import { Braintree3DSecurePaymentService } from 'app/modules/payment-management/payment-services/braintree-3d-secure-payment.service';
import { BlockUIService } from 'ng-block-ui';
import { VehicleTypeValues } from 'app/modules/preventivatore/preventivatore-dynamic/components/quotator-rc-fca/rc-auto.enum';
import { YoloDataLayerEventObjGeneratorService } from 'app/modules/tenants/y/yolo-data-layer-event-obj-generator.service';
import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';
import { LoaderService } from '../../../../../core/services/loader.service';
import { ActivatedRoute } from '@angular/router';
import { untilDestroyed } from "ngx-take-until-destroy";
import { take } from "rxjs/operators";
import { CheckoutLinearStepperService } from "../../../checkout-linear-stepper/services/checkout-linear-stepper.service";
import { NypCheckoutService, NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-checkout-linear-stepper-payment',
  templateUrl: './checkout-linear-stepper-payment.component.html',
  styleUrls: ['./checkout-linear-stepper-payment.component.scss']
})
export class CheckoutLinearStepperPaymentComponent extends CheckoutStepPaymentComponentAbstract implements OnInit {

  hidePromoCode: boolean;
  paymentChoice;
  paymentRedirect: boolean;
  collapsePaymentMethodsList = true;
  postePay = true;
  payPal = true;
  kenticoTitleContentId = 'checkout.payment';
  secondaryInformativeSet: string = null;
  secondarySetDocumentName: string = null;
  secondaryInfoSetFunction: string;
  public useAltDocumentAcceptanceComponent: boolean;
  public useDocumentsAcceptanceUtmSource: boolean;

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
    public route: ActivatedRoute,
    private checkoutLinearStepperService: CheckoutLinearStepperService
  ) {
    super(
      checkoutStepService,
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
      route,
    );
  }

  ngOnInit() {
    this.getComponentFeaturesRules();
    this.getCheckoutRedirect();
    super.ngOnInit();
  }

  ngAfterViewInit() {
    this.checkoutLinearStepperService.componentFactories$
      .pipe(untilDestroyed(this), take(1)).subscribe(componentFactories => {
        this.createComponentsFromComponentFactories(
          componentFactories,
          this.dataService.getResponseProduct().product_code
        );
      });

    this.checkoutLinearStepperService.state$.pipe(untilDestroyed(this)).subscribe(state => {
      this.updateComponentProperties(state);
    });
    this.checkoutLinearStepperService.loadTemplateComponents();
    this.checkoutLinearStepperService.sendState();
  }

  getComponentFeaturesRules(): void {
    this.componentFeaturesService.useComponent('checkout-step-payment');
    this.areAltPaymentsEnabled();
    this.getTitle();
    this.getSecondaryInformativeSet();
    this.getHidePromoCode();
    this.useDocumentsAcceptanceAlt();
    this.useCarrefourConsentComponent();
  }

  areAltPaymentsEnabled(): void {
    this.componentFeaturesService.useRule('poste-pay-payment-not-visible');
    this.postePay = this.componentFeaturesService.isRuleEnabled();
    this.componentFeaturesService.useRule('paypal-payment-not-visible');
    this.payPal = this.componentFeaturesService.isRuleEnabled();
  }

  getTitle(): void {
    this.componentFeaturesService.useRule('title');
    const itemId: string = this.componentFeaturesService.getConstraints().get(this.currentStep.product.code);
    if (!!itemId) {
      this.kenticoTitleContentId = itemId;
    }
  }

  getSecondaryInformativeSet(): void {
    this.componentFeaturesService.useRule('secondary-info-set');
    const secondaryInfoSetFunction: string = this.componentFeaturesService.getConstraints().get(this.currentStep.product.code);
    if (!!secondaryInfoSetFunction) {
      this.secondaryInformativeSet = this.secondaryInfoSetFunction ? this.getFunction(secondaryInfoSetFunction).apply(this) || null : this.secondaryInformativeSet;
    }
  }

  getFunction(functionName: string): Function {
    const func: Function[] = Object.entries(CheckoutLinearStepperPaymentComponent.prototype).filter(f => {
      return f[0] === functionName;
    }).map<Function>(f => {
      return <Function>f[1];
    });
    if (func.length === 1) {
      return func[0];
    }
    return null;
  }

  getRCSecondaryInfoSet() {
    this.secondarySetDocumentName = 'Furgoni___Van_Digital_Classic.pdf';
    return this.dataService.responseOrder.line_items[0].insurance_info.car_type === VehicleTypeValues.truck ? this.currentStep.product.originalProduct.product_structure.template_properties.informative_set_double : null;
  }

  closeCollapseAfterAddingPm() {
    this.collapsePaymentMethodsList = true;
  }

  onPaymentChoice(event) {
    this.paymentChoice = event.target.value;
  }

  onAddNewPm() {
    this.collapsePaymentMethodsList = !this.collapsePaymentMethodsList;
    this.paymentChoice = null;
  }

  getHidePromoCode() {
    this.componentFeaturesService.useComponent('checkout-step-payment');
    this.componentFeaturesService.useRule('hide-promo-code');
    this.hidePromoCode = this.componentFeaturesService.isRuleEnabled();
    const constraints = this.componentFeaturesService.getConstraints().get('products');
    if (!!constraints) {
      this.hidePromoCode = constraints.some((product) => this.currentStep.product.code.startsWith(product));
    }
  }

  getCheckoutRedirect() {
    this.paymentRedirect = JSON.parse(localStorage.getItem('redirect-checkout'));
    localStorage.removeItem('redirect-checkout');
  }

  public useDocumentsAcceptanceAlt(): void {
    this.componentFeaturesService.useRule('alt-documents-acceptance');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const productCodes = this.componentFeaturesService.getConstraints().get('product-codes');
      this.useAltDocumentAcceptanceComponent = productCodes.some(productCode => productCode === this.currentStep.product.code);
    }
  }

  public useCarrefourConsentComponent(): void {
    this.componentFeaturesService.useRule('documents-acceptance-utm-source');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const c = this.componentFeaturesService.getConstraints();
      const key = this.route.snapshot.queryParams['utm_source'];
      if (c.has(key)) {
        const productCodes = this.componentFeaturesService.getConstraints().get(key);
        this.useDocumentsAcceptanceUtmSource = productCodes.some(productCode => productCode === this.currentStep.product.code);
      }
    }
  }


}
