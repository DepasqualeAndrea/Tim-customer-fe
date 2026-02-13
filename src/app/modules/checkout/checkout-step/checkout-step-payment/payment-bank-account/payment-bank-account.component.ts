import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CheckoutService, UserService, DataService, AuthService, InsurancesService } from '@services';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';
import { LoaderService } from 'app/core/services/loader.service';
import { CheckoutStepService } from 'app/modules/checkout/services/checkout-step.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { Braintree3DSecurePaymentService } from 'app/modules/payment-management/payment-services/braintree-3d-secure-payment.service';
import { YoloDataLayerEventObjGeneratorService } from 'app/modules/tenants/y/yolo-data-layer-event-obj-generator.service';
import moment from 'moment';
import { BlockUIService } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { CheckoutStepPaymentComponentAbstract } from '../checkout-step-payment-abstract.component';
import { NypCheckoutService, NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
    selector: 'app-payment-bank-account',
    templateUrl: './payment-bank-account.component.html',
    styleUrls: ['./payment-bank-account.component.scss'],
    standalone: false
})
export class PaymentBankAccountComponent extends CheckoutStepPaymentComponentAbstract implements OnInit {

  @Output() billSelected = new EventEmitter<any>();
  bills: any = [];
  kenticoContent: any;
  date: any;

  constructor(
    checkoutStepService: CheckoutStepService,
    checkoutService: CheckoutService,
    nypCheckoutService: NypCheckoutService,
    userService: UserService,
    nypUserService: NypUserService,
    private insuranceService: InsurancesService,
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
    private kenticoTranslateService: KenticoTranslateService
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
    this.kenticoTranslateService.getItem<any>('pagamento_conti_correnti').pipe(take(1)).subscribe((item) => {
      this.kenticoContent = item;
    });
    this.getBills();
  }

  getBills(): void {
    this.date = moment().format('DD/MM/YYYY');
    this.insuranceService.getBsBillList().subscribe((data) => {
      const bills = data.conti;
      if (bills.length === 1) {
        this.bills = data.conti;
        this.billSelected.emit(bills[0]);
      } else {
        this.bills = data.conti;
      }
    }, (error) => {
      this.toastrService.error(error.message);
      throw error;
    });
  }

  chooseIban(bill): void {
    this.billSelected.emit(bill);
  }

  closeCollapseAfterAddingPm(): void {
  }

}
