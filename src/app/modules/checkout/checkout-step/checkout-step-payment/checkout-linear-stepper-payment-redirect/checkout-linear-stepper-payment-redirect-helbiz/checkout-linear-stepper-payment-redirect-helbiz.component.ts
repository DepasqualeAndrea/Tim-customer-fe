import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { AuthService, CheckoutService, DataService, UserService } from '@services';
import { Braintree3DSecurePaymentService } from 'app/modules/payment-management/payment-services/braintree-3d-secure-payment.service';
import { BlockUIService } from 'ng-block-ui';
import { VehicleTypeValues } from 'app/modules/preventivatore/preventivatore-dynamic/components/quotator-rc-fca/rc-auto.enum';
import { YoloDataLayerEventObjGeneratorService } from 'app/modules/tenants/y/yolo-data-layer-event-obj-generator.service';
import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';
import { ActivatedRoute } from '@angular/router';
import { CheckoutStepService } from 'app/modules/checkout/services/checkout-step.service';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { LoaderService } from 'app/core/services/loader.service';
import { CheckoutStepPaymentComponentAbstract } from '../../checkout-step-payment-abstract.component';
import { CheckoutLinearStepperPaymentComponent } from '../../checkout-linear-stepper-payment/checkout-linear-stepper-payment.component';
import { PayLoad } from '../../checkout-step-payment.model';
import { map } from 'rxjs/operators';
import { NypCheckoutService, NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
    selector: 'app-checkout-linear-stepper-payment-redirect-helbiz',
    templateUrl: './checkout-linear-stepper-payment-redirect-helbiz.component.html',
    styleUrls: ['./checkout-linear-stepper-payment-redirect-helbiz.component.scss'],
    standalone: false
})
export class CheckoutLinearStepperPaymentRedirectHelbizComponent extends CheckoutStepPaymentComponentAbstract implements OnInit {

  hidePromoCode: boolean;
  paymentChoice;
  paymentRedirect: boolean;
  collapsePaymentMethodsList = true;
  postePay = true;
  payPal = true;
  kenticoTitleContentId = 'checkout.payment';
  secondaryInformativeSet: string = null;
  secondarySetDocumentName: string = null;
  public useAltDocumentAcceptanceComponent: boolean;
  public useDocumentsAcceptanceUtmSource: boolean;
  payment_methods;

  constructor(checkoutStepService: CheckoutStepService,
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
    protected nypUserService: NypUserService,
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
    this.getCheckoutRedirect();
    super.ngOnInit();
  }

  public handleNextStep(): void {
    this.nypUserService.getLegacyPaymentMethods()
      .subscribe((paymentMethodResponse) => {
        console.log(paymentMethodResponse.payment_methods);
        const paymentID = paymentMethodResponse.payment_methods.find(pm =>
          pm.name.includes('Helbiz')).id;
        console.log(paymentID);
        const payload: PayLoad = {
          payment_method_id: paymentID,
          order_number: this.product.orderId
        };
        this.userService.helbizPayment(payload).subscribe(res => {
          window.location.href = res.redirect_url;
        });
      });
  }


  closeCollapseAfterAddingPm() {
    this.collapsePaymentMethodsList = true;
  }


  getCheckoutRedirect() {
    this.paymentRedirect = JSON.parse(localStorage.getItem('redirect-checkout'));
    localStorage.removeItem('redirect-checkout');
  }

}
