import { Product } from '@model';
import {
  EcommerceEvent,
  LoginEvent,
  RegistrationEvent,
  GENERIC_PAGE,
  PAYMENT_TYPES,
  PRODUCT_NO_NAME,
  NORMAL_ACCESS,
  ECOMMERCE_EVENTS,
  BaseEvent,
  PageViewEvent,
  ViewItemEvent,
  FUNNEL_STATES,
  EcommerceItem,
  EcommerceItemInCart,
} from './../../../core/models/gtm/gtm-template.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services';
import { gtm_settings } from 'app/core/models/gtm/gtm-settings.model';
import { ProductData } from 'app/modules/checkout/checkout.model';

@Injectable({
  providedIn: 'root'
})
export class YoloDataLayerEventObjGeneratorService {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  private loggedIn(logged: boolean): string {
    return logged ? 'Logged In' : 'Not Logged in';
  }

  private isBusiness(): string {
    return gtm_settings.businessTenant ? 'business' : 'prodotto';
  }

  private getPageTitleName(): string {
    const pathUrlWithoutParameters = this.getPathUrlWithoutParameters();
    if (!!pathUrlWithoutParameters) {
      return `${pathUrlWithoutParameters}_${this.isBusiness()}`;
    }
    return '';
  }

  private getPageDetail(product: any): string {
    const funnelState = product.state ? this.getFunnelState(product.state) : this.getPathUrlWithoutParameters();
    return this.isFunnelEcommerce() ? `funnel_${funnelState}` : GENERIC_PAGE;
  }

  private transformFunnelState(funnelState: string): string {
    return funnelState.toLowerCase().replace(/\W/gm, '_');
  }

  private transformPaymentType(paymentType: string): string {
    return PAYMENT_TYPES[paymentType];
  }

  private transformValue(value: any): string {
    return !!value ? value.toString() : '';
  }
  private isFunnelEcommerce(): boolean {
    const pathname = this.getPathUrlWithoutParameters();
    return ['preventivatore', 'apertura', 'checkout', 'continue-checkout'].some(routePath => pathname.includes(routePath));
  }

  private getFunnelState(orderState: string): string {
    const funnelState = FUNNEL_STATES.find(s => s === orderState);
    return !!funnelState ? this.transformFunnelState(funnelState) : orderState;
  }

  private getPathUrlWithoutParameters(): string {
    const pathUrlWithoutParameters = this.removeParametersFromUrl(this.router.url);
    const slashIndex = pathUrlWithoutParameters.indexOf('/');
    return pathUrlWithoutParameters.substring(slashIndex + 1);
  }

  private removeParametersFromUrl(routeUrl: string): string {
    const pathname = routeUrl;
    // const yourUrl = new URL(routeUrl);
    // const pathname = url.parse(routeUrl).pathname;
    // const pathname = new URL(routeUrl).pathname;
    return pathname ? pathname.split(';')[0]  : '';
  }

  private getProductName(product: Product): string {
    const properties = product.properties;
    const uniq = properties && properties.find(p => p.name === 'uniq_name');
    const productName = !!uniq ? uniq.value : product.name;
    return productName || PRODUCT_NO_NAME;
  }

  private getAccessType(product: Product): string {
    const productName = this.getProductName(product);
    return productName !== PRODUCT_NO_NAME ? `prodotto_${productName}` : NORMAL_ACCESS;
  }

  /**
   * DataLayer Base
   * @returns baseEvent that should be pushed to dataLayer object on every page change (unless exceptions)
   */
  fillDataLayerBaseEvent(): BaseEvent {
    const baseEvent = this.fillPageViewEvent();
    return baseEvent;
  }

  /**
   * DataLayer Base
   * @param product has the values to overwrite basic tag with no particular info about product
   * @returns baseEvent that should be pushed to dataLayer object
   */
  updateDataLayerBaseEvent(product: Product): BaseEvent {
    const baseEvent = this.fillPageViewEvent(product);
    return baseEvent;
  }

  /**
   *
   * @returns pageViewEvent occurring on page navigation
   */
  fillPageViewEvent(product?: any): PageViewEvent {
    const pageViewEvent = new PageViewEvent();
    pageViewEvent.page_title_name = this.getPageTitleName();
    pageViewEvent.page_detail = !!product ? this.getPageDetail(product) : GENERIC_PAGE;
    pageViewEvent.product_name = !!product ? this.getProductName(product) : PRODUCT_NO_NAME;
    pageViewEvent.isLoggedIn = this.loggedIn(this.authService.loggedIn);
    if (this.authService.loggedIn) {
      pageViewEvent.userId = this.authService.loggedUser ? this.transformValue(this.authService.loggedUser.id) : '';
    }
    return pageViewEvent;
  }

  /**
   * DataLayer Ecommerce
   * @param items are the products/product_variants initialized for the specific preventivatore page
   * @returns viewItemEvent occurring when user navigates to preventivatore
   */
  fillProductDetailViewEvent(items: Product[]): ViewItemEvent {
    const viewItemEvent = new ViewItemEvent();
    items.forEach(item => {
      const ecommerceItem: EcommerceItem = {
        item_name: this.transformValue(item.name),
        item_id: this.transformValue(item.id),
        item_category: this.transformValue(item.category)
      };
      viewItemEvent.ecommerce.items.push(ecommerceItem);
    });
    return viewItemEvent;
  }

  /**
   * DataLayer Ecommerce
   * @param productData is an object of composed interface `CheckoutProduct & ResponseOrder` with order
   * and product data
   * @returns an array of EcommerceItemInCart
   */
  private fillEcommerceItems(productData: ProductData): EcommerceItemInCart[] {
    const product = productData.originalProduct;
    const ecommerceItems: EcommerceItemInCart[] = [{
      item_name: this.transformValue(product.name),
      item_id: this.transformValue(product.id),
      item_category: this.transformValue(product.category),
      price: productData.total,
      quantity: !!productData.total_quantity ? productData.total_quantity : 1
    }];
    return ecommerceItems;
  }

  /**
   * DataLayer Ecommerce
   * @param event has one of the values listed in `ECOMMERCE_EVENTS` constant
   * @param productData is an object of composed interface `CheckoutProduct & ResponseOrder` with order
   * and product data
   * @returns an ecommerceEvent with filled `items`
   */
  private fillEcommerceEvent(event: string, productData: ProductData): EcommerceEvent {
    const ecommerceEvent = new EcommerceEvent(event);
    ecommerceEvent.ecommerce.items = this.fillEcommerceItems(productData);
    return ecommerceEvent;
  }

  /**
   * DataLayer Ecommerce
   * - Called after order is created, when landing on checkout step `insurance-info`
   * @param productData is an object of composed interface `CheckoutProduct & ResponseOrder` with order
   * and product data
   * @returns addToCartEvent
   */
  fillAddToCartEvent(productData: ProductData): EcommerceEvent {
    const addToCartEvent = this.fillEcommerceEvent(ECOMMERCE_EVENTS.ADD_TO_CART, productData);
    return addToCartEvent;
  }

  /**
   * DataLayer Ecommerce
   * - Called after checkout begun, when landing on checkout step `address`
   * @param productData is an object of composed interface `CheckoutProduct & ResponseOrder` with order
   * and product data
   * @returns beginCheckoutEvent
   */
  fillBeginCheckoutEvent(productData: ProductData): EcommerceEvent {
    const beginCheckoutEvent = this.fillEcommerceEvent(ECOMMERCE_EVENTS.BEGIN_CHECKOUT, productData);
    return beginCheckoutEvent;
  }

  /**
   * DataLayer Ecommerce
   * - Called after contractor is set, when landing on checkout step `survey`
   * @param productData - Is an object of composed interface `CheckoutProduct & ResponseOrder` with order
   * and product data
   * @returns addShippingInfoEvent
   */
  fillAddShippingInfoEvent(productData: ProductData): EcommerceEvent {
    const addShippingInfoEvent = this.fillEcommerceEvent(ECOMMERCE_EVENTS.ADD_SHIPPING_INFO, productData);
    return addShippingInfoEvent;
  }

  /**
   * DataLayer Ecommerce
   * - Called right after user has added a new payment method
   * @param product - Is an object of composed interface `CheckoutProduct & ResponseOrder` with order
   * and product data
   * @param payload - Is the type of payment used: CreditCard or PayPalAccount
   * @returns addPaymentInfoEvent with `payment_type` used
   */
  fillAddPaymentInfoEvent(product: ProductData, payload: any): EcommerceEvent {
    const addPaymentInfoEvent = this.fillEcommerceEvent(ECOMMERCE_EVENTS.ADD_PAYMENT_INFO, product);
    const paymentType = this.transformPaymentType(payload);
    addPaymentInfoEvent.ecommerce = Object.assign(addPaymentInfoEvent.ecommerce, { payment_type: paymentType });
    return addPaymentInfoEvent;
  }

  /**
   * DataLayer Ecommerce
   * - Called after payment method is charged successfully, when landing on step `complete`
   * @param productData - Is an object of composed interface `CheckoutProduct & ResponseOrder` with order
   * and product data
   * @returns purchaseEvent with transaction data and coupon (if applied)
   */
  fillPurchaseEvent(productData: ProductData, payload: any): EcommerceEvent {
    const purchaseEvent = this.fillEcommerceEvent(ECOMMERCE_EVENTS.PURCHASE, productData);
    purchaseEvent.ecommerce = Object.assign(purchaseEvent.ecommerce, {
      currency: productData.currency,
      value: productData.total,
      transaction_id: productData.orderId,
    });
    if (!!payload && payload.applied) {
      purchaseEvent.ecommerce = Object.assign(purchaseEvent.ecommerce, { coupon: payload.value});
    }
    return purchaseEvent;
  }

  /**
   * DataLayer Custom Event
   * - Event fired on click on "Accedi" from login-form
   * @param product - If undefined, login happened from login page, during checkout otherwise
   * @returns loginEvent after login successful
   */
  fillLoginEvent(product?: Product): LoginEvent {
    const loginEvent = new LoginEvent();
    loginEvent.login_type = !!product ? this.getAccessType(product) : NORMAL_ACCESS;
    return loginEvent;
  }

  /**
   * DataLayer Custom Event
   * - Event fired on click on "Registrati" from register-form
   * @param product - If undefined, registration happened from registration page, during checkout otherwise
   * @returns registrationEvent after registration successful
   */
  fillRegistrationEvent(product?: Product): RegistrationEvent {
    const registrationEvent = new RegistrationEvent();
    registrationEvent.registration_type = !!product ? this.getAccessType(product) : NORMAL_ACCESS;
    return registrationEvent;
  }

  /**
   * Resets ecommerce object before any ecommerce object push
   * @returns null ecommerce object
   */
  resetEcommerce() {
    return { 'ecommerce': 'null' };
  }
}
