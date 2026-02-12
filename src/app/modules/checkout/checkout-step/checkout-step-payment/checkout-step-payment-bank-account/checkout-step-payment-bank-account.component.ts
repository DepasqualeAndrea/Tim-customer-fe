import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { CheckoutStepService } from '../../../services/checkout-step.service';
import { ComponentFeaturesService } from '../../../../../core/services/componentFeatures.service';
import { AuthService, CheckoutService, DataService, InsurancesService, UserService } from '@services';
import { CheckoutStepPaymentComponentAbstract } from '../checkout-step-payment-abstract.component';
import { Braintree3DSecurePaymentService } from 'app/modules/payment-management/payment-services/braintree-3d-secure-payment.service';
import { BlockUIService } from 'ng-block-ui';
import { YoloDataLayerEventObjGeneratorService } from 'app/modules/tenants/y/yolo-data-layer-event-obj-generator.service';
import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';
import { LoaderService } from '../../../../../core/services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckoutLinearStepperPaymentComponent } from '../checkout-linear-stepper-payment/checkout-linear-stepper-payment.component';
import { VehicleTypeValues } from '../../../../preventivatore/preventivatore-dynamic/components/quotator-rc-fca/rc-auto.enum';
import { take } from 'rxjs/operators';
import moment from 'moment';
import { ModalService } from '../../../../../core/services/modal.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ChangeStatusService } from 'app/core/services/change-status.service';
import { PaymentConstants, PaymentResponseCode, ModalConstants } from './payment-bank-account-constants';
import { ScaManagerService } from './sca-manager.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NypCheckoutService, NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-checkout-step-payment-bank-account',
  templateUrl: './checkout-step-payment-bank-account.component.html',
  styleUrls: ['./checkout-step-payment-bank-account.component.scss']
})
export class CheckoutStepPaymentBankAccountComponent extends CheckoutStepPaymentComponentAbstract implements OnInit {

  kenticoTitleContentId = 'checkout.payment';
  selectedBill: any;
  payment: any;
  hidePromoCode: boolean;
  useAltDocumentAcceptanceComponent: boolean;
  secondaryInformativeSet: string = null;
  secondarySetDocumentName: string = null;
  isButtonActive: Boolean = false;
  paymentRedirect: boolean;
  kenticoContent: any;
  responseOrder: any;
  products: string;

  constructor(
    checkoutStepService: CheckoutStepService,
    checkoutService: CheckoutService,
    nypCheckoutService: NypCheckoutService,
    userService: UserService,
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
    public insuranceService: InsurancesService,
    public modalService: ModalService,
    protected nypUserService: NypUserService,
    private kenticoTranslateService: KenticoTranslateService,
    public router: Router,
    private changeStatusService: ChangeStatusService,
    public scaManagerService: ScaManagerService,
    public modal: NgbModal
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
      route
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.getComponentFeaturesRules();
    this.getCheckoutRedirect();
    this.kenticoTranslateService.getItem<any>('papery_copy_request').pipe(take(1)).subscribe(item => {
      this.kenticoContent = item;
    });
    this.responseOrder = this.dataService.getResponseOrder();
    super.handlePaymentMethodChanged(this.responseOrder.payment_methods[0]);
    this.products = this.dataService.product.product_code;
  }

  closeCollapseAfterAddingPm(): void {
  }

  /**
   * Get all component features rules
   */
  getComponentFeaturesRules(): void {
    this.componentFeaturesService.useComponent('checkout-step-payment');
    this.getTitle();
    this.getHidePromoCode();
    this.useDocumentsAcceptanceAlt();
    this.getSecondaryInformativeSet();
  }

  getTitle(): void {
    this.componentFeaturesService.useRule('title');
    const itemId: string = this.componentFeaturesService.getConstraints().get(this.currentStep.product.code);
    if (!!itemId) {
      this.kenticoTitleContentId = itemId;
    }
  }

  getHidePromoCode(): void {
    this.componentFeaturesService.useComponent('checkout-step-payment');
    this.componentFeaturesService.useRule('hide-promo-code');
    this.hidePromoCode = this.componentFeaturesService.isRuleEnabled();
    const constraints = this.componentFeaturesService.getConstraints().get('products');
    if (!!constraints) {
      this.hidePromoCode = constraints.some((product) => this.currentStep.product.code.startsWith(product));
    }
  }

  useDocumentsAcceptanceAlt(): void {
    this.componentFeaturesService.useRule('alt-documents-acceptance');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const productCodes = this.componentFeaturesService.getConstraints().get('product-codes');
      this.useAltDocumentAcceptanceComponent = productCodes.some(productCode => productCode === this.currentStep.product.code);
    }
  }

  getSecondaryInformativeSet(): void {
    this.componentFeaturesService.useRule('secondary-info-set');
    const secondaryInfoSetFunction: string = this.componentFeaturesService.getConstraints().get(this.currentStep.product.code);
    if (!!secondaryInfoSetFunction) {
      this.secondaryInformativeSet = this.getFunction(secondaryInfoSetFunction).apply(this) || null;
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

  getRCSecondaryInfoSet(): void {
    this.secondarySetDocumentName = 'Furgoni___Van_Digital_Classic.pdf';
    return this.dataService.responseOrder.line_items[0].insurance_info.car_type === VehicleTypeValues.truck ? this.currentStep.product.originalProduct.product_structure.template_properties.informative_set_double : null;
  }

  getCheckoutRedirect(): void {
    this.paymentRedirect = JSON.parse(localStorage.getItem('redirect-checkout'));
    localStorage.removeItem('redirect-checkout');
  }

  billSelected($event): void {
    this.changeStatusService.setConto($event);
    this.scaManagerService.setBankAccount($event);
    this.selectedBill = $event;
    this.isButtonActive = true;
  }

  completePayment() {
    return this.isButtonActive === true && this.canConfirmAcceptance() === true;
  }

  handleNextStep(): void {
    this.scaManagerService.initFlow();
    this.dataService.getSellaPayment().subscribe((data) => {
      if (data) {
        this.storagePayment();
        return;
      } else {
        this.router.navigate(['error']).then();
      }
    });
  }

  storagePayment(): void {
    const payload = Object.assign({
      conto_selected: this.selectedBill.aliasConto,
      masked_account_number: this.selectedBill.contoMasked,
      order_number: String(this.responseOrder.number),
      response_code: PaymentResponseCode.STORAGE
    });
    this.insuranceService.storePayment(payload).subscribe((data) => {
      if (data) {
        this.dataService.setStorePayment(data);
        super.handleNextStep();
        return;
      }
    });
  }

}
