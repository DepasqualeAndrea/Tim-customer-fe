import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService, CheckoutService, DataService, UserService } from '@services';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';
import { LoaderService } from 'app/core/services/loader.service';
import { CheckoutStepService } from 'app/modules/checkout/services/checkout-step.service';
import { Braintree3DSecurePaymentService } from 'app/modules/payment-management/payment-services/braintree-3d-secure-payment.service';
import { YoloDataLayerEventObjGeneratorService } from 'app/modules/tenants/y/yolo-data-layer-event-obj-generator.service';
import { BlockUIService } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { CheckoutSciGenertelContent } from '../../checkout-step-insurance-info/checkout-step-insurance-info-genertel-sci/checkout-step-insurance-info-genertel-sci-content';
import { CheckoutStepPaymentComponentAbstract } from '../checkout-step-payment-abstract.component';
import { FormPaymentOptions } from './form-payment-options.enum';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { GtmInitDataLayerService } from 'app/core/services/gtm/gtm-init-datalayer.service';
import { NypCheckoutService, NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-checkout-step-payment-genertel-sci',
  templateUrl: './checkout-step-payment-genertel-sci.component.html',
  styleUrls: ['./checkout-step-payment-genertel-sci.component.scss']
})
export class CheckoutStepPaymentGenertelSciComponent extends CheckoutStepPaymentComponentAbstract implements OnInit {

  constructor(checkoutStepService: CheckoutStepService,
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
    private formBuilder: FormBuilder,
    public route: ActivatedRoute,
    private kenticoTranslateService: KenticoTranslateService,
    private gtmInitDataLayerService: GtmInitDataLayerService) {
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

  form: FormGroup;
  addPaymentEvent = false;
  content: CheckoutSciGenertelContent;

  ngOnInit() {
    super.ngOnInit();
    this.createForm();
    this.getContent();
    this.pushGtmNavigationEvent()
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      paymentType: [FormPaymentOptions.CC, Validators.nullValidator]
    });
  }

  public continuecheckout(): void {
    this.addPaymentEvent = !this.addPaymentEvent;
  }

  public previousStep(): void {
    this.handlePrevStep();
  }

  closeCollapseAfterAddingPm(): void { }
  getContent() {
    this.kenticoTranslateService.getItem<any>('checkout_sci_genertel').subscribe((json) => {
      this.content = {
        step_6: {
          payment_method: json.payment_method.value,
          credit_card: json.credit_card.value,
          paypal: json.paypal.value,
          confirm_pay_btn: json.confirm_pay_btn.value
        },
        checkout_common_labels: {
          back: json.back.value,
          continue: json.continue.value,
          genertel_icon: json.genertel_icon.value,
          date_icon: json.date_icon.value,
          select_icon: json.select_icon.value,
          info_icon: json.info_icon.value,
          date_placeholder: json.date_placeholder.value,
          birth_country: json.birth_country_130a4b3.value,
          error_birth_country: json.error_birth_country_2d28258.value,
          birth_state: json.birth_state.value,
          error_birth_state: json.error_birth_state.value,
          birth_city: json.birth_city.value,
          error_birth_city: json.error_birth_city.value,
          tax_code: json.tax_code.value,
          error_tax_code: json.error_tax_code.value,
          error_check_cin: json.error_check_cin.value,
          continue_for: json.continue_for.value
        }
      };
    });
  }

  private pushGtmNavigationEvent() {
    this.gtmInitDataLayerService.preventivatoreCustomTags({
      vpv: '/preventivatore/diretto/sci/scelta-metodo-pagamento',
      vpvt: 'Preventivatore Sci - Scelta Metodo Pagamento'
    })
  }

}
