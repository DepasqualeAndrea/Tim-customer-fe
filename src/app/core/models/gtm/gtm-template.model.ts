export const ECOMMERCE_EVENTS = {
  ADD_TO_CART: 'add_to_cart',
  BEGIN_CHECKOUT: 'begin_checkout',
  ADD_SHIPPING_INFO: 'add_shipping_info',
  ADD_PAYMENT_INFO: 'add_payment_info',
  PURCHASE: 'purchase'
};

export const FUNNEL_STATES = [
  'insurance-info',
  'address',
  'survey',
  'payment',
  'confirm',
  'complete'
];

export const PAYMENT_TYPES = {
  CreditCard: 'carta',
  PayPalAccount: 'paypal'
};
export const GENERIC_PAGE = 'generico';
export const NORMAL_ACCESS = 'general';
export const PRODUCT_NO_NAME = 'N.A.';
export interface GTMDataLayerObject {
}

class TransactionProducts implements GTMDataLayerObject {
  sku = '';
  name = '';
  category = '';
  price = '';
  quantity = '';
}

export class GTMModelTemplate implements GTMDataLayerObject {

}

/**
 * It's the initial object template for Google Tag Manager.
 */

export class GTMModelDefaultTemplate extends GTMModelTemplate {
  categoryPage = '';
  productName = '';
  productId = '';
  pageName = '';
  userId = '';
  isLoggedIn = '';
  deviceType = '';
  daysCount = '';
  productType = '';
  phoneBrand = '';
  phoneModel = '';
  startDate = '';
  endDate = '';
  destinationCountry = '';
  peopleCount = '';
  price = '';
  event = '';
  transactionId = '';
  transactionTotal = '';
  transactionProducts = '';
  page_title_name = '';
  page_detail = '';
  product_name = '';
  ecommerce = '';
  login_type = '';
  registration_type = '';
}

export class GA4ModelTemplate {
  page_title_name = '';
  page_detail = '';
  product_name = '';
  ecommerce = '';
  userId = '';
  isLoggedIn = '';
  event = '';
  login_type = '';
  registration_type = '';
}

export interface DataLayerGA4Template {
}


export class BaseEvent extends GTMModelTemplate implements DataLayerGA4Template {
}
export class PageViewEvent extends GTMModelTemplate implements DataLayerGA4Template {
  private event: string;
  page_title_name: string;
  page_detail: string;
  product_name: string;
  userId: string;
  isLoggedIn: string;

  constructor() {
    super();
    this.event = 'page_view';
  }
}

export class ViewItemEvent extends GTMModelTemplate implements DataLayerGA4Template {
  private event: string;
  ecommerce: EcommerceObject;

  constructor() {
    super();
    this.event = 'view_item';
    this.ecommerce = new EcommerceObject();
  }
}

export class EcommerceEvent extends GTMModelTemplate implements DataLayerGA4Template {
  private event: string;
  ecommerce: EcommerceObjectInCart;

  constructor(event: string) {
    super();
    this.event = event;
    switch (event) {
      case ECOMMERCE_EVENTS.ADD_SHIPPING_INFO:
        this.ecommerce = new EcommerceObjectSurvey();
        break;
      case ECOMMERCE_EVENTS.ADD_PAYMENT_INFO:
        this.ecommerce = new EcommerceObjectPayment();
        break;
      case ECOMMERCE_EVENTS.PURCHASE:
        this.ecommerce = new EcommerceObjectPurchaseComplete();
        break;
      default:
        this.ecommerce = new EcommerceObjectInCart();
    }
  }
}

export class EcommerceObject {
  items: EcommerceItem[];

  constructor() {
    this.items = new Array<EcommerceItem>();
  }
}

export class EcommerceObjectInCart {
  items: EcommerceItemInCart[];

  constructor() {
    this.items = new Array<EcommerceItemInCart>();
  }
}

export class EcommerceItem {
  item_name: string;
  item_id: string;
  item_category: string;
}

export class EcommerceItemInCart extends EcommerceItem {
  price: number;
  quantity: number;

  constructor() {
    super();
    this.quantity = 1;
  }
}

export class EcommerceObjectSurvey extends EcommerceObjectInCart {
  private shipping_tier: string;

  constructor() {
    super();
    this.shipping_tier = 'questionario';
  }
}

export class EcommerceObjectPayment extends EcommerceObjectInCart {
  payment_type: string;
}

export class EcommerceObjectPurchaseComplete extends EcommerceObjectInCart {
  currency: string;
  value: number;
  transaction_id: string;
  coupon?: string;
}

export class LoginEvent extends GTMModelTemplate implements DataLayerGA4Template {
  private event: string;
  login_type: string;

  constructor() {
    super();
    this.event = 'login';
    this.login_type = NORMAL_ACCESS;
  }
}

export class RegistrationEvent extends GTMModelTemplate implements DataLayerGA4Template {
  private event: string;
  registration_type: string;

  constructor() {
    super();
    this.event = 'registration';
    this.registration_type = NORMAL_ACCESS;
  }
}
