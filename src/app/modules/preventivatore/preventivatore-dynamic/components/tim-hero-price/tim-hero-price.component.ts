import { animate, group, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, CheckoutService, DataService, InsurancesService } from '@services';
import { ProductConsistencyService } from 'app/core/services/product-consistency.service';
import { TimMyBrokerCustomersService } from 'app/core/services/tim-my-broker-customers.service';
import { CheckoutStepService } from 'app/modules/checkout/services/checkout-step.service';
import { CheckOutBehavior } from 'app/modules/preventivatore/partials/checkout-behavior';
import { PreventivatoreConstants } from 'app/modules/preventivatore/PreventivatoreConstants';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { fromEvent, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';
import { LoaderService } from '../../../../../core/services/loader.service';
import { EhealthStdRequest, Product, RequestOrder, TimMyHomeRequestQuote } from '@model';
import { CheckoutBehaviourRequest } from './tim-prev-checkout.model';
import { RouterService } from 'app/core/services/router.service';
import { FTTH_QUERY_PARAM, UPSELLING_QUERY_PARAM } from 'app/shared/shared-queryparam-keys';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ContentItem } from 'kentico-cloud-delivery';
import { PreventivatoreDynamicSharedFunctions } from "../../services/content/preventivatore-dynamic-shared-functions";
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { AdobeAnalyticsDatalayerService } from 'app/core/services/adobe_analytics/adobe-init-datalayer.service';

@Component({
  selector: 'app-tim-hero-price',
  templateUrl: './tim-hero-price.component.html',
  styleUrls: ['./tim-hero-price.component.scss'],
  animations: [
    trigger('changeNavState', [
      state('floating', style({})),
      state('sticking', style({ margin: '0', position: 'fixed', zIndex: '3', top: '0', right: '0', width: '100vw', borderBottom: '1px solid #001136', maxHeight: '120px' })),
      transition('*=>floating', [group([animate('0ms 0ms')])]),
      transition('*=>sticking', [group([animate('0ms 0ms')])]),
    ]),
  ]
})
export class TimHeroPriceComponent extends PreventivatoreAbstractComponent implements OnInit, OnDestroy {

  constructor(
    ref: ChangeDetectorRef,
    private insuranceService: InsurancesService,
    protected nypInsurancesService: NypInsurancesService,
    private router: Router,
    private checkoutService: CheckoutService,
    private dataService: DataService,
    private auth: AuthService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private timMyBrokerCustomersService: TimMyBrokerCustomersService,
    private consistencyService: ProductConsistencyService,
    private checkoutStepService: CheckoutStepService,
    public routerService: RouterService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService
  ) { super(ref); }

  public isRedirecting: boolean = false;
  private quotationPrice: string;
  public currentState: string = 'floating';
  public productPriceUnits: string;
  public productPriceCents: string;

  get productCode(): string {
    return this.data.product.product_code
  }

  ngOnInit() {
    this.insertIconInText();
    if (this.dataService.isTenant('tim-broker-customers_db')) {
      this.redirectNewCustomersSso();
    }

    if (this.isProductCode('ehealth-quixa-homage')) {
      this.loaderService.start(
        PreventivatoreConstants.blockUiMainName,
        PreventivatoreConstants.RedirectLoadingMessagesMap.get(this.productCode));
      this.isRedirecting = true;
      this.customersLandingRedirect();
    } else {
      this.consistencyService.getProductsConsistencyMapping();
      this.checkProductConsistency(this.productCode);
    }
    if (this.isProductCode('ehealth-quixa-standard')) {
      this.getQuotation().subscribe(quotation => {
        this.quotationPrice = quotation.additional_data.data.InsuranceFees.pop().Price;
        this.splitProductPriceFromQuote(this.quotationPrice);
      });
    } else {
      this.splitProductPrice();
    }
    if (this.isProductCode('tim-my-home')) {
      const consistencyPricePayload = this.consistencyService.getPricingConsistency(this.productCode);
      if (!!consistencyPricePayload) {
        this.consistencyService.priceConsistency(consistencyPricePayload).subscribe(res => {
          if (!!res.ftth) {
            this.splitProductPrice('0,00 €');
            this.checkoutStepService.setReducerProperty({
              property: 'cost_item.informative_set',
              value: ''
            });
            this.checkoutStepService.setReducerProperty({
              property: 'cost_item.informative_set_double',
              value: ''
            });
            this.checkoutStepService.setReducerProperty({
              property: 'cost_item.informative_set_multirischio',
              value: ''
            });
          }
        });
      }

      const queryParamMap = this.route.snapshot.queryParamMap;
      if (queryParamMap.has(FTTH_QUERY_PARAM) && !queryParamMap.has(UPSELLING_QUERY_PARAM)) {
        this.splitProductPrice('0,00 €');
      }
    }
  }

  ngOnDestroy() { }

  ngAfterViewInit() {
    this.createScrollEventListener()
      .subscribe(scrollOffset => {
        this.currentState = scrollOffset >= 574 ? 'sticking' : 'floating';
      });
  }

  private createScrollEventListener(): Observable<number> {
    return fromEvent(window, 'scroll').pipe(untilDestroyed(this), map(() => window.pageYOffset));
  }

  private splitProductPrice(price: string = this.data.product.display_price): void {
    const productPrice = price;
    const separatedPrice = productPrice.replace(/\s/g, '').split(',');
    this.productPriceUnits = separatedPrice[0];
    this.productPriceCents = ',' + separatedPrice[1];
  }

  private splitProductPriceFromQuote(price: string): void {
    const separatedPrice = price.toString().replace(/\s/g, '').split('.');
    this.productPriceUnits = separatedPrice[0];
    this.productPriceCents = ',' + separatedPrice[1].padEnd(2, '0') + '€';
  }

  private getQuotation(): Observable<any> {
    const quotationRequest = this.createQuotationPayload();
    return this.nypInsurancesService.submitEhealthStandardQuotation(quotationRequest);
  }

  private createQuotationPayload(): EhealthStdRequest {
    return {
      tenant: 'tim',
      product_code: this.data.product.product_code,
      product_data: {}
    };
  }

  private createUnipolRequest(): TimMyHomeRequestQuote {
    const user = this.auth.loggedUser;
    return {
      product_code: this.data.product.product_code,
      user_id: user.id,  // solo se utente loggato
      addons: []
    };
  }

  private createOrderObj(): RequestOrder {
    return {
      order: {
        line_items_attributes: {
          0: {
            variant_id: this.data.product.master_variant,
            quantity: 1,
          },
        },
      }
    };
  }

  public checkout(): void {
    if (this.isProductCode('tim-my-home')) {
      this.checkoutStepService.priceChangeAfterSelectedAddonsTimMyHome(this.createUnipolRequest());
    }
    const order = this.createOrderObj();

    const form: any = {
      paymentmethod: '',
      mypet_pet_type: '',
      codice_sconto: 'no',
      sci_numassicurati: 0,
      sci_min14: 0,
      sci_polizza: '',
    }
    let digitalData: digitalData = this.adobeAnalyticsDataLayerService.setDigitalData(this.data.product, 1, "", {}, form, 'tim broker', '');
    this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    
    this.sendCheckoutAction(order);
  }

  private sendCheckoutAction(order: RequestOrder): void {
    const action = {
      action: 'checkout_product'
      , payload: {
        product: this.data.product
        , order: order
        , router: 'checkout'
      }
    };
    this.sendActionEvent(action);
  }

  private customersLandingRedirect(): void {
    if ((this.auth.userTokenVerified || this.auth.loggedIn) &&
      !this.consistencyService.isUserTimBrokerCustomer()) {
      this.nypInsurancesService.getInsurances().pipe(take(1)).subscribe(res => {
        if (res.insurances.length !== 0) {
          this.loaderService.stop(PreventivatoreConstants.blockUiMainName);
          this.router.navigate(['/private-area/my-policies']);
        } else {
          this.getProductAndGoToCheckout();
        }
      });
    } else {
      this.timMyBrokerCustomersService.redirectToOldSssoAuth();
    }
  }

  private getProductAndGoToCheckout(): void {
    this.nypInsurancesService.getProducts().pipe(take(1)).subscribe(data => {
      const product = data.products.find(product =>
        product.product_code === this.data.product.product_code
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
    this.loaderService.stop(PreventivatoreConstants.blockUiMainName);
    const checkoutBehavior = new CheckOutBehavior(this.checkoutService, this.dataService, this.router);
    checkoutBehavior.checkout(payload.order, payload.product, payload.router, true, true);
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
      router: 'checkout'
    };
    return payload;
  }

  private redirectNewCustomersSso(): void {
    const queryParams = this.route.snapshot.queryParams;
    const hasCheckoutQueryParams = queryParams['source'] === 'tim' && queryParams['checkout'] === 'true';
    const alias = this.data.product.properties.find(a => a.name === 'alias').value;
    if (hasCheckoutQueryParams && !this.consistencyService.isUserLoggenInLegacy) {
      this.timMyBrokerCustomersService.redirectToNewSsoAuth('assicurazione-' + alias + '?source=tim&checkout=true');
    }
    if (hasCheckoutQueryParams && this.consistencyService.isUserLoggenInLegacy) {
      this.goToRedirectCheckout(this.data.product);
    }
  }

  private checkProductConsistency(productCode: string): void {
    if (this.consistencyService.isConsistencyRuleEnabled) {
      const product = this.data.product;
      const isProductNoConsistency = this.consistencyService.getProductNoConsistency(product);
      if (this.consistencyService.isUserLoggedInWithSso) {
        this.consistencyService.consistency().subscribe(res => {
          this.consistencyService.saveConsistenciesResponse(res);
          const isEligible = this.consistencyService.isUserEligibleForProduct(productCode) || isProductNoConsistency;
          this.redirectIfNotEligible(isEligible);
        });
      }
      if (this.consistencyService.isUserLoggenInLegacy &&
        this.consistencyService.isUserTimBrokerCustomer()) {
        const isEligible = this.consistencyService.isUserEligibleForProductByTarget(productCode) || isProductNoConsistency;
        this.redirectIfNotEligible(isEligible);
      }
    }
  }

  private redirectIfNotEligible(isEligible: boolean): void {
    isEligible ? null : this.router.navigate(['products']);
  }

  private isProductCode(productCode: string): boolean {
    return this.productCode === productCode;
  }

  goToLink(link) {
    this.isLinkInternal(link) ? this.routerService.navigate(link) : window.open(link, "_blank");
  }

  isLinkInternal(link: string): boolean {
    return link.startsWith('/')
  }

  public isEmpty(content: string): boolean {
    return PreventivatoreDynamicSharedFunctions.isEmptyText(content);
  }

  insertIconInText(): void {
    if (this.data.description) {
      this.data.description = this.data.description.replace('Fibra', 'Fibra <sup><img class="sup-icon" src="/assets/images/tim/icon-fibra.svg" /></sup>');
    }
    if (this.data.warranty_description) {
      this.data.warranty_description = this.data?.warranty_description.replaceAll('FIBRA', 'FIBRA <sup><img class="sup-icon" src="/assets/images/tim/icon-fibra.svg" /></sup>');
    }
  }

}
