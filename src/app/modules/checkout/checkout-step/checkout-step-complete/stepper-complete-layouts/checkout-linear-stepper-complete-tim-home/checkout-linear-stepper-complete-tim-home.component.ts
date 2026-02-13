import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, RequestOrder, ResponseOrder } from '@model';
import { AuthService, CheckoutService, DataService, InsurancesService, ONGOING_CHECKOUT_DATA_LOCAL_STORAGE_KEY } from '@services';
import { CheckoutProduct } from 'app/modules/checkout/checkout.model';
import { CheckoutStepService } from 'app/modules/checkout/services/checkout-step.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { CheckOutMultipleOrderBehavior } from 'app/modules/preventivatore/partials/checkout-behavior';
import { CheckoutBehaviourRequest } from 'app/modules/preventivatore/preventivatore-dynamic/components/tim-hero-price/tim-prev-checkout.model';
import { take } from 'rxjs/operators';
import { AddonCodes } from '../../../checkout-step-insurance-info/checkout-step-insurance-info-tim-my-home/my-home-addon-content.interface';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';
import { AdobeAnalyticsDatalayerService } from 'app/core/services/adobe_analytics/adobe-init-datalayer.service';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';

@Component({
    selector: 'app-checkout-linear-stepper-complete-tim-home',
    templateUrl: './checkout-linear-stepper-complete-tim-home.component.html',
    styleUrls: ['./checkout-linear-stepper-complete-tim-home.component.scss'],
    standalone: false
})
export class CheckoutLinearStepperCompleteTimHomeComponent implements OnInit {

  @Input() order: ResponseOrder;
  @Input() product: CheckoutProduct;
  user: any;
  showConfirmPageDefault = true;

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private nypInsuranceService: NypInsurancesService,
    private router: Router,
    private checkoutService: CheckoutService,
    private checkoutStepService: CheckoutStepService,
    private dataService: DataService,
    protected authService: AuthService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService
  ) { }

  content: any;

  ngOnInit() {
    this.user = this?.order?.bill_address?.firstname ?? this.authService.loggedUser.address.firstname;
    this.getKenticoContent();

    let total = this.order.total;
    let addons = this.order.line_items[0].addons;
    let addonAssistance = false;
    if (addons.length == 1) {
      if (addons[0].code === AddonCodes.ADDON_ASSISTANCE) {
        addonAssistance = true;
      } else {
        addonAssistance = false;
      }
    } else {
      addonAssistance = false;
    }
    if (total === 0 && addonAssistance) {
      this.showConfirmPageDefault = false;
    }

    if (this.order.payments !== undefined) {
      let lastPayment = this.order.payments[this.order.payments.length - 1];
      if (lastPayment !== undefined && lastPayment.source_id !== undefined) {
        let paymentId: string = '';
        this.order.payments_sources.forEach(paymentSource => {
          if (paymentSource.id === lastPayment.source_id) {
            paymentId = paymentSource.payment_id;
          }
        });
        const form: any = {
          paymentmethod: '',
          mypet_pet_type: this.dataService.getParams().kindSelected !== undefined ? this.dataService.getParams().kindSelected : '',
          codice_sconto: '',
          sci_numassicurati: this.dataService.getParams().insuredNumber !== undefined ? this.dataService.getParams().insuredNumber : 0,
          sci_min14: this.dataService.getParams().insuredMinors !== undefined ? this.dataService.getParams().insuredMinors : false,
          sci_polizza: this.dataService.getParams().proposalName !== undefined ? this.dataService.getParams().proposalName : '',
        }
        const number = this.order.id + '';
        let digitalData: digitalData = this.adobeAnalyticsDataLayerService.setDigitalData(this.product, 1, number, {}, form, 'tim broker', paymentId);
        this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
      }
    }
  }

  getKenticoContent() {
    this.kenticoTranslateService.getItem<any>('thank_you_page_tim_ftth').pipe(take(1)).subscribe(item => {
      this.createContentItem(item);
    });
  }

  createContentItem(kenticoItem) {
    this.content = {
      image: kenticoItem.image.value[0].url,
      title: kenticoItem.title.value,
      description_1: kenticoItem.description_1.value,
      subtitle: kenticoItem.subtitle.value,
      description_2: kenticoItem.description_2.value,
      button: kenticoItem.button.value,
      image_tim_my_home: kenticoItem.image_1.value[0].url,
      my_policies_button: kenticoItem.my_policies_button.value

    };
  }

  public checkout(): void {
    this.nypInsuranceService.getProducts().pipe(take(1)).subscribe(data => {
      const product = data.products.find(product =>
        product.product_code === this.product.code
      );
      this.goToRedirectCheckout(product);
    });
  }

  private goToRedirectCheckout(product: Product): void {
    const order = this.createRedirectOrderObj(product.master_variant);
    const payload = this.createPayload(order, product);
    this.redirectCheckout(payload);
  }

  private redirectCheckout(payload: CheckoutBehaviourRequest) {
    const checkoutBehavior = new CheckOutMultipleOrderBehavior(
      this.checkoutService,
      this.dataService,
      this.router,
      this.checkoutStepService);
    checkoutBehavior.checkout(payload.order, payload.product, payload.router, true);
  }

  private createRedirectOrderObj(variant: number): RequestOrder {
    return {
      order: {
        line_items_attributes: {
          0: {
            variant_id: variant,
            quantity: 1
          },
        },
      }
    };
  }

  private createPayload(order: RequestOrder, product: Product): CheckoutBehaviourRequest {
    const payload = {
      product: product,
      order: order,
      router: 'checkout/insurance-info'
    };
    return payload;
  }

}
