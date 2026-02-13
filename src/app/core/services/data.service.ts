import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Country, OrderAttributes, Product, RequestOrder, ResponseOrder } from '@model';
import { AuthService } from '@services';
import * as moment from 'moment';
import { environment } from 'environments/environment.prod';
import { Observable, Subject, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { TenantUserProperties } from '../models/tenant-user-properties';
import { KenticoTranslateService } from '../../modules/kentico/data-layer/kentico-translate.service';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { UntypedFormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { CheckoutStep } from 'app/modules/checkout/checkout-step/checkout-step.model';
import { FieldsToRecover, NypCheckoutService } from '@NYP/ngx-multitenant-core';

@Injectable()
export class DataService {
  public fieldsToRecoverKeys = {
    nonStatic: ["petSelectedVariantPrice", "skiPolicyDates", "daysOfCoverage", "price", "paymentType", /* "responseOrder", */ "requestOrder", "timHomeQuotePayload", "selectedPacketName", "orderAttributes", /* "product", */ "policy", "boxPrice", "isCheckout", "isPolizze", "kind", "dogsNum", "catsNum", "petsKind", "quotationId", "nameCard", "paymentData", "countries", "apiUrl", "timHomePrice", "countriesEndpoint", /* "products", */ "productName", "CheckoutLinearStepperService__ORDER"],
    static: ['TIM_MY_HOME_ADDONS', 'POLICY_PAYMENT_ID'],
  };

  public get fieldsToRecover(): FieldsToRecover { return JSON.parse(localStorage.getItem('fieldToRecover')); }
  public set fieldsToRecover(fields: FieldsToRecover) { localStorage.setItem('fieldToRecover', JSON.stringify(fields)); }

  public persistFieldToRecover(): FieldsToRecover {
    const fieldsToRecover = {
      nonStatic: this.fieldsToRecoverKeys.nonStatic.map(attribute => [attribute, this[attribute]]),
      static: this.fieldsToRecoverKeys.static.map(attribute => [attribute, DataService[attribute]]),
    };

    this.fieldsToRecover = fieldsToRecover;
    NypCheckoutService.FIELD_TO_RECOVER = fieldsToRecover;
    return fieldsToRecover;
  }
  public loadFieldToRecover(destroy: boolean = true): FieldsToRecover {
    if (!this.hasFieldToRecover()) return;

    const fieldsToRecover = this.fieldsToRecover;
    NypCheckoutService.FIELD_TO_RECOVER = fieldsToRecover;

    (fieldsToRecover.nonStatic || [])?.forEach(([k, v]) => this[k] = v);
    (fieldsToRecover.static || [])?.forEach(([k, v]) => DataService[k] = v);

    if (destroy) localStorage.removeItem('fieldToRecover');

    return fieldsToRecover;
  }

  public hasFieldToRecover() {
    return !!localStorage.getItem('fieldToRecover');
  }

  public readonly yinStepLogin: CheckoutStep = { "name": "survey", "stepnum": 3, "completed": false, "previous": { "name": "address", "stepnum": 2, "completed": true, "previous": { "name": "insurance-info", "stepnum": 1, "completed": true, } } } as any;

  public get Yin(): { orderNumber: string, product: string, tenant: string } | undefined {
    if (localStorage.getItem('yin')) return JSON.parse(localStorage.getItem('yin'));

    const path = this.location.path();
    if (!path.includes('yin')) return undefined;

    return path
      .substr(this.location.path().indexOf('?') + 1) // taking only the arguments
      .split("%3D").join("=") // replacing with '='
      .split("%3F").join("&") // replacing with '&'
      .split('&') // taking list of key=value
      .reduce((prev, curr) => {
        const [k, v] = curr.split('=');
        prev[k] = v;
        return prev;
      }, {}) as any;
  }

  static TIM_MY_HOME_ADDONS = [];
  static POLICY_PAYMENT_ID: number;
  petSelectedVariantPrice: number;
  skiPolicyDates: { start: string, end: string };
  CheckoutLinearStepperService__ORDER: RequestOrder;
  daysOfCoverage: number;
  daysNumber: number;
  quantity: number;
  isSeasonal: boolean;
  insuredItem: any;
  totalPriceSeasonal: number;
  firstDay: Date;
  lastDay: Date;
  price: number;
  paymentType: any;
  responseOrder: ResponseOrder;
  requestOrder: RequestOrder;
  timHomeQuotePayload: any;
  selectedPacketName: string;
  orderAttributes: OrderAttributes;
  product: Product;
  policy: any;
  boxPrice: any;
  isCheckout: boolean;
  isPolizze: boolean;
  kind: any;
  dogsNum: any;
  catsNum: any;
  petsKind: any;
  quotationId: any;
  nameCard: any;
  paymentData: any;
  countries: Array<Country>;
  apiUrl: string;
  timHomePrice: any;
  preventivatoreUrl: Subject<void> = new Subject<void>();
  preventivatoreUrlObs$ = this.preventivatoreUrl.asObservable();
  countriesEndpoint = '/countries?per_page=999';
  products: any;
  productName: string;
  public pq_variantId: number;
  public pq_quantity: number;
  public auth: AuthService;
  featureToggle: any;
  contentsArray: any = [];
  tenantProductInfo: any;
  tenantInfo: any;
  /* YOLO */
  isSplash: boolean;
  productCategory = '';
  startDateFlight: any;
  endDateFlight: any;
  idProdotto: number;
  /* from RENDIMAX */
  profileBraintree = false;

  token: string;
  private tenantMapper: TenantEnumMapper = new TenantEnumMapper();
  /* */
  private tenantUserProperties: TenantUserProperties;
  private _productsFromInsuranceServices: any;
  private dataScooterBikeSubject = new BehaviorSubject<any>({});
  dataScooterBikeObservable = this.dataScooterBikeSubject.asObservable();
  private quotatorSubject = new BehaviorSubject<any>(false);
  quotatorObservable = this.quotatorSubject.asObservable();
  sellaPayment = new Subject<boolean>();
  storedPayment: any;
  private errorCodeSubject = new BehaviorSubject<any>({});
  errorCodeObservable = this.errorCodeSubject.asObservable();

  private preventivatoreProductSubject = new BehaviorSubject<any>('');
  preventivatoreProductObservable = this.preventivatoreProductSubject.asObservable();
  private _getValueInputRadioChoise = new BehaviorSubject<any>(0);
  getValueInputRadiochoise = this._getValueInputRadioChoise.asObservable();
  params: any = {};

  private incendioSubject = new BehaviorSubject<any>('');
  incendioObservable = this.incendioSubject.asObservable();

  private tutelaSubject = new BehaviorSubject<any>('');
  tutelaObservable = this.tutelaSubject.asObservable();

  private modalMaximalSubject = new BehaviorSubject<any>('');
  modalMaximalObservable = this.modalMaximalSubject.asObservable();

  private redirectShoppingCartMultiriskSubject = new BehaviorSubject<any>('');
  redirectShoppingCartMultiriskObservable = this.redirectShoppingCartMultiriskSubject.asObservable();

  private jti = new BehaviorSubject<any>('');
  jtiObservable = this.jti.asObservable();


  constructor(
    private componentFeaturesService: ComponentFeaturesService,
    private kenticoTranslateService: KenticoTranslateService,
    private location: Location,
    protected http: HttpClient) { }

  getTenantUserProperties() {
    if (this.tenantUserProperties) {
      return this.tenantUserProperties;
    }
    const userProperties = this.getTenantInfo().user;
    if (!!userProperties) {
      this.tenantUserProperties = {
        userType: userProperties.user_type,
        facebookLoginDisabled: userProperties.facebook_login_disabled,
        loginDisabled: userProperties.login_disabled,
        redirectToCheckoutAfterAccountActivation: userProperties.redirect_to_checkout_after_account_activation,
        availableConsentFlagTags: userProperties.available_consent_flag_tags
      };
    }
    return this.tenantUserProperties;
  }

  getResponseOrder(): ResponseOrder {
    return this.responseOrder;
  }

  setResponseOrder(ord: ResponseOrder) {
    this.responseOrder = ord;
  }

  getRequestOrder(): RequestOrder {
    return this.requestOrder || new RequestOrder();
  }

  setRequestOrder(ord: RequestOrder) {
    this.requestOrder = ord;
  }

  setOrderAttributes(orderAttributes: OrderAttributes): void {
    this.orderAttributes = orderAttributes;
  }

  getOrderAttributes(): OrderAttributes {
    return this.orderAttributes;
  }

  /* set product */
  setProduct(responseProduct: Product) {
    this.product = responseProduct;
  }

  getResponseProduct(): Product {
    return this.product;
  }

  /* set Total and duration */
  setTotalDuration(params: any) {
    this.boxPrice = params;
  }

  getTotalDuration() {
    return this.boxPrice;
  }

  /* isCheckout */
  setIsCheckout(params: boolean) {
    this.isCheckout = params;
  }

  setIsCheckoutFalse(params: boolean) {
    this.isCheckout = params;
  }

  getIsCheckout() {
    return this.isCheckout;
  }


  fromPolizze(params?: boolean) {
    this.isPolizze = params;
  }

  setPolicy(policy: any) {
    this.policy = policy;
  }

  getPolicy(): any {
    return this.policy;
  }

  setPetsKind(quotation: any) {
    this.dogsNum = quotation.cani;
    this.catsNum = quotation.gatti;
  }

  getPetsKind() {
    this.petsKind = {
      cani: this.dogsNum,
      gatti: this.catsNum,
    };
    return this.petsKind;
  }

  getPaymentMethod() {
    let selectedSourceId;
    let selectedPaymentMethod;
    this.responseOrder.payments.forEach(payment => {
      if (payment.amount > 0) {
        selectedSourceId = payment.source_id;
      }
    });
    this.responseOrder.payments_sources.forEach(paymentSource => {
      if (paymentSource.id === selectedSourceId) {
        selectedPaymentMethod = paymentSource.cc_type;
      }
    });
    return selectedPaymentMethod;
  }

  setNameCard(_nameCard) {
    this.nameCard = _nameCard;
  }

  setTempPaymentData(paymentData?) {
    this.paymentData = paymentData ? paymentData : undefined;
  }

  setFeatureToggle(_feature) {
    this.featureToggle = _feature;
  }

  getFeatureToggle() {
    return this.featureToggle;
  }

  setTenantProductInfo(info) {
    this.tenantProductInfo = info;
  }

  setTenantInfo(info) {
    this.tenantInfo = info;
    this.apiUrl = this.tenantInfo.sso.required
      ? environment.LEGACY_API_URL + '/sso'
      : environment.LEGACY_API_URL;
  }

  getTenantInfo() {
    return this.tenantInfo;
  }

  setDefaultFooterLogo() {
    this.tenantInfo.footer.logo = './assets/images/logos/logo_brand_white.svg';
  }

  getFooterLogo(): string {
    return this.tenantInfo.footer.logo;
  }

  setDefaultSocialLinks() {
    this.tenantInfo.footer.socialLinks = [
      {
        name: 'LinkedIn',
        logo: 'fab fa-linkedin',
        link: 'https://www.linkedin.com/company/11046847'
      },
      {
        name: 'Facebook',
        logo: 'fab fa-facebook-square',
        link: 'https://www.facebook.com/Yolo-Insurance-316284668813764/'
      }
    ];
  }

  getSocialLinks(): { name: string, logo: string, link: string }[] {
    return this.tenantInfo.footer.socialLinks;
  }

  getMenuItems(): { name: string, route: string }[] {
    return this.tenantInfo.navbar.menuItems;
  }

  getIsLoginDisabled() {
    return !!this.tenantInfo.user && !!this.tenantInfo.user.login_disabled;
  }

  /*
    WAYS TO DETECT TENANT:
      1)  Using enum
          a)  by isTenant(tenant : Tenants): boolean
              isTenant accepts a parameter of type Tenants that is an enum defined in this file (data.service.ts)
              Tenants includes all known tenants plus one called OTHER which indicates an unknown tenant (yet).

          b)  by getTenant() : Tenants
              getTenant returns a value of type Tenants. If a tenant is unknown it will return OTHER.

      2)  using string by isTenant(tenantName : string): boolean
          isTenant accepts also a string parameter that indicates a part of the tenant saved in the DB.
          While it can even check 'unknown' tenants, it will be more error prone (by mistyping for example)

      EXAMPLES
      ========
      this.dataService.isTenant(Tenants.INTESA)             is equals to
      this.dataService.isTenant('intesa')                   that is equal to
      this.dataService.getTenant() === Tenants.INTESA

      ADDING A TENANT
      ===============
      In order to add a tenant, you need to add it into enum Tenants in this file with a name that is a part of
      tanentInfo.tenant.
      For example it's ok adding NETINS as enum if tenantInfo.tenant checks the regex .*netins.* (netins_db is ok, db_netins is also ok, net-ins_db is not)

  */
  isTenant(tenantName: Tenants | string): boolean {
    let tString: string;
    if (typeof tenantName !== 'string') {
      tString = this.tenantMapper.getValue(tenantName);
    } else {
      tString = tenantName;
    }

    return this.getTenantInfo().tenant.toString().toLowerCase().includes(tString.toLowerCase());
  }

  getTenant(): Tenants {
    for (const t in Tenants) {
      if (this.isTenant(t)) {
        return Tenants[t.toString()];
      }
    }

    if (this.getTenantInfo() === undefined || this.getTenantInfo().tenant === undefined) {
      console.warn('Impossibile determinare il tenant ion questo stadio. Probabilmente la chiamata a getTenant() viene effettuata prima della setTenantInfo()');
    } else {
      console.warn(this.getTenantInfo().tenant + ' is not a known tenant. MAYBE ADDING TO Tenants ENUM in DataService?');
    }

    return Tenants.OTHER;
  }

  setContents(_element) {
    this.contentsArray = _element;
  }

  getContent(contentKey) {
    return this.contentsArray[contentKey];
  }

  getProductColorClass(product) {
    if (product) {
      const codeArray = product.product_code.split('-');
      if (codeArray[codeArray.length - 1] === 'silver') {
        return 'silver';
      } else if (codeArray[codeArray.length - 1] === 'gold') {
        return 'gold';
      }
      return 'normal';
    } else {
      return 'normal';
    }
  }

  calculateFlightPrice(price) {
    const cost = price * 4.8 / 100;
    return cost === 0 ? 0 : (cost > 20) ? cost : 20;
  }

  setCountries(countries) {
    this.countries = countries;
  }

  setVariantsCB() {
    const variants = [{
      id: 1,
      name: '1 giorno',
      active: true,
      duration: 1,
    },
    {
      id: 2,
      name: '3 giorni',
      active: false,
      duration: 3,
    },
    {
      id: 3,
      name: '7 giorni',
      active: false,
      duration: 7,
    },
    {
      id: 4,
      name: '14 giorni',
      active: false,
      duration: 14,
    },
    {
      id: 5,
      name: '30 giorni',
      active: false,
      duration: 30,
    }];
    return variants;
  }

  genEndDateYoloWay(endDate) {
    const date = moment(endDate).format('MM/DD/YYYY');
    return moment(date, 'MM/DD/YYYY').subtract(1, 'days').format('DD/MM/YYYY');
  }

  getLoggedMenu(): Observable<any[]> {
    const sidebarMenuItemsTranslations = [
      this.kenticoTranslateService.getItem('private_area.home_menu').pipe(map<any, string>(item => item.value)),
      this.kenticoTranslateService.getItem('private_area.my_policies_menu').pipe(map<any, string>(item => item.value)),
      this.kenticoTranslateService.getItem('private_area.my_inactive_policies_menu').pipe(map<any, string>(item => item.value)),
      this.kenticoTranslateService.getItem('private_area.my_claims_menu').pipe(map<any, string>(item => item.value)),
      this.kenticoTranslateService.getItem('private_area.user_details_menu').pipe(map<any, string>(item => item.value)),
      this.kenticoTranslateService.getItem('private_area.payment_methods_menu').pipe(map<any, string>(item => item.value)),
      this.kenticoTranslateService.getItem('private_area.logout_menu').pipe(map<any, string>(item => item.value)),
      this.kenticoTranslateService.getItem('private_area.my_documents_menu').pipe(map<any, string>(item => item.value)),
      this.kenticoTranslateService.getItem('private_area.my_quotes_menu').pipe(map<any, string>(item => item.value)),
    ];
    return zip(...sidebarMenuItemsTranslations)
      .pipe(
        map(translations => {
          const menuItems = [
            {
              id: 0,
              name: translations[0],
              route: '/private-area/home',
              isActive: false,
              isExternalLink: false
            },
            {
              id: 1,
              name: translations[1],
              route: '/private-area/my-policies',
              isActive: false,
              isExternalLink: false
            },
            {
              id: 2,
              name: 'Polizze non ancora attive',
              route: '/private-area/my-pending-policies',
              isActive: false,
              isExternalLink: false
            },
            {
              id: 3,
              name: translations[3],
              route: '/private-area/my-claims',
              isActive: false,
              isExternalLink: false
            },
            {
              id: 4,
              name: translations[4],
              route: '/private-area/user-details',
              isActive: false,
              isExternalLink: false
            },
            {
              id: 5,
              name: translations[5],
              route: '/private-area/payment-methods',
              isActive: false,
              isExternalLink: false
            },
            {
              id: 6,
              name: translations[6],
              route: '/logout',
              isActive: false,
              isExternalLink: this.tenantInfo.tenant == 'imagin-es-es_db' || this.tenantInfo.tenant == 'tim-broker-customers_db' ? true : false
            }
          ];

          if (this.hasPageQuotes()) {
            menuItems.push(
              {
                id: 2,
                name: translations[7],
                route: '/private-area/my-quotes',
                isActive: false,
                isExternalLink: false
              }
            );
          }
          if (this.myDocuments()) {
            menuItems.push(
              {
                id: 6,
                name: translations[5],
                route: '/private-area/my-documents',
                isActive: false,
                isExternalLink: false
              }
            );
          }
          if (this.isPaymentMethodHide()) {
            menuItems.splice(4, 1);
          }
          if (this.tenantInfo.main.layout === 'bs') {
            return menuItems.slice(3, 4);
          }
          return menuItems.sort((a, b) => a.id < b.id ? -1 : 1);
        })
      );
  }


  getImaginLoggedMenu(): Observable<any[]> {
    const sidebarMenuItemsTranslations = [
      this.kenticoTranslateService.getItem('private_area.home_menu').pipe(map<any, string>(item => item.value)),
      this.kenticoTranslateService.getItem('private_area.my_policies_menu').pipe(map<any, string>(item => item.value)),
    ];
    return zip(...sidebarMenuItemsTranslations)
      .pipe(
        map(translations => {
          const menuItems = [
            {
              id: 0,
              name: translations[0],
              route: '/prodotti',
              isActive: false,
              isExternalLink: false
            },
            {
              id: 1,
              name: translations[1],
              route: '/private-area/my-policies',
              isActive: false,
              isExternalLink: false
            }
          ];
          return menuItems.sort((a, b) => a.id < b.id ? -1 : 1);
        })
      );
  }
  getIsFacebookDisabled() {
    return !!this.tenantInfo.user && !!this.tenantInfo.user.facebook_login_disabled;
  }

  public setProductsFromInsuranceServices(products: any) {
    this._productsFromInsuranceServices = products;
  }

  public getProductsFromInsuranceServices(filterFn: (products: Product) => boolean) {
    const selectedProducts = this._productsFromInsuranceServices.filter(filterFn);
    return _.cloneDeep(selectedProducts);
  }

  private isPaymentMethodHide() {
    this.componentFeaturesService.useComponent('private-area');
    this.componentFeaturesService.useRule('sidebar-menu');
    if (this.componentFeaturesService.isRuleEnabled()) {
      return this.componentFeaturesService.getConstraints().has('payment-methods-visible');
    }
  }

  private hasPageQuotes() {
    this.componentFeaturesService.useComponent('private-area-home-page');
    this.componentFeaturesService.useRule('link-my-quote');
    return this.componentFeaturesService.isRuleEnabled();
  }

  private myDocuments(): boolean {
    this.componentFeaturesService.useComponent('private-area');
    this.componentFeaturesService.useRule('my-documents');
    return this.componentFeaturesService.isRuleEnabled();
  }

  setDataScooterBike(data: []) {
    this.dataScooterBikeSubject.next(data);
  }

  getDataScooterBike(): Observable<[]> {
    return this.dataScooterBikeObservable;
  }

  setQuotator(data: boolean) {
    this.quotatorSubject.next(data);
  }

  getQuotator(): Observable<[]> {
    return this.quotatorObservable;
  }

  setSellaPayment(payment: boolean) {
    this.sellaPayment.next(payment);
  }

  getSellaPayment(): Observable<boolean> {
    return this.sellaPayment;
  }

  setStorePayment(payment): void {
    this.storedPayment = payment;
  }

  getStorePayment() {
    return this.storedPayment;
  }

  setErrorCode(error: any) {
    this.errorCodeSubject.next(error);
  }

  getErrorCode(): Observable<any> {
    return this.errorCodeObservable;
  }

  setPreventivatoreProduct(product: any) {
    this.preventivatoreProductSubject.next(product);
  }

  getPreventivatoreProduct(): Observable<any> {
    return this.preventivatoreProductObservable;
  }
  setValueInputChoise(value: UntypedFormGroup) {
    this._getValueInputRadioChoise.next(value);
  }
  getValueInputChoise(): Observable<any> {
    return this.getValueInputRadiochoise;
  }

  retrieveCodeAteco(taxcodeVatNumber: string): Observable<any> {
    throw new Error("retrieveCodeAteco")
  }
  getContentsDropdown(): Observable<any> {
    throw new Error("getContentsDropdown")
  }

  getMaximalData(quote: any): Observable<any> {
    throw new Error("getMaximalData")
  }

  setParams(paramsIn: any) {
    if ((this.params !== undefined) && (paramsIn !== undefined)) {
      this.params = Object.assign(this.params, paramsIn);
    }
  }

  getParams() {
    return this.params;
  }

  setAddonIncendio(selected: any) {
    this.incendioSubject.next(selected);
  }

  getAddonIncendio(): Observable<any> {
    return this.incendioObservable;
  }

  setAddonTutela(selected: any) {
    this.tutelaSubject.next(selected);
  }

  getAddonTutela(): Observable<any> {
    return this.tutelaObservable;
  }

  setModalMaximalAddon(maximal: any) {
    this.modalMaximalSubject.next(maximal);
  }

  getModalMaximalAddon(): Observable<any> {
    return this.modalMaximalObservable;
  }

  setRedirectShoppingCartMultirisk(data: any) {
    this.redirectShoppingCartMultiriskSubject.next(data);
  }

  getRedirectShoppingCartMultirisk(): Observable<any> {
    return this.redirectShoppingCartMultiriskObservable;
  }

  setJti(data: any) {
    this.jti.next(data);
  }

  getJti(): Observable<any> {
    return this.jtiObservable;
  }

  public getProperties(): Observable<any> {
    /* Check if view is from intermediary application */
    const params: URLSearchParams = new URLSearchParams(document.location.search);
    const intermediary: string = params.has('embedded').toString();
    /* Set intermediary headers */
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('intermediary', intermediary);
    /* Call API to get token */
    return this.http.get('/nyp/fetoken', {headers});
  }

}


export enum Tenants {
  YOLO_ES,
  YOLO_EN,
  YOLO,
  CHEBANCA,
  INTESA,
  WIND,
  CONTE_VIAGGIO,
  CONTE_PET,
  CONTE_SPORT,
  CONTE_GADGET,
  JUSTEAT,
  INTESA_PET,
  NETINSURANCE,
  BANCAPIACENZA,
  CIVIBANK,
  FCA,
  MOPAR,
  LEASYS,
  CRIF,
  RAVENNA,
  LUCCA,
  IMOLA,
  TIM_EMPLOYEES,
  TIM_CUSTOMERS,
  IMAGIN,
  ILLIMITY,
  BANCA_SELLA,
  BANCO_DESIO,
  SANTA_LUCIA,
  OTHER
}

class TenantMapModel {
  private t: Tenants;
  private v: string;

  constructor(t: Tenants, value: string) {
    this.t = t;
    this.v = value;
  }

  getTenant(): Tenants {
    return this.t;
  }

  getValue(): string {
    return this.v;
  }
}

class TenantEnumMapper {
  private tenants: TenantMapModel[] = [];
  private unknownType: number;

  constructor() {
    this.register(Tenants.CHEBANCA, 'chebanca');
    this.register(Tenants.CONTE_SPORT, 'conte_sport');
    this.register(Tenants.CONTE_VIAGGIO, 'conte_viaggi');
    this.register(Tenants.CONTE_PET, 'conte_pet');
    this.register(Tenants.CONTE_GADGET, 'conte_gadget');
    this.register(Tenants.INTESA, 'intesa_db');
    this.register(Tenants.INTESA_PET, 'intesa-pet_db');
    this.register(Tenants.JUSTEAT, 'justeat');
    this.register(Tenants.WIND, 'wind');
    this.register(Tenants.YOLO, 'yolodb');
    this.register(Tenants.YOLO_ES, 'yolo-es');
    this.register(Tenants.YOLO_EN, 'yolo-en');
    this.register(Tenants.NETINSURANCE, 'net-ins-it-it_db');
    this.register(Tenants.BANCAPIACENZA, 'bancapc-it-it_db');
    this.register(Tenants.CIVIBANK, 'civibank_db');
    this.register(Tenants.FCA, 'fca-bank_db');
    this.register(Tenants.MOPAR, 'mopar_db');
    this.register(Tenants.LEASYS, 'leasys_db');
    this.register(Tenants.CRIF, 'yolo-crif_db');
    this.register(Tenants.RAVENNA, 'ravenna_db');
    this.register(Tenants.LUCCA, 'lucca_db');
    this.register(Tenants.IMOLA, 'imola_db');
    this.register(Tenants.TIM_EMPLOYEES, 'tim-broker-employees_db');
    this.register(Tenants.TIM_CUSTOMERS, 'tim-broker-customers_db');
    this.register(Tenants.IMAGIN, 'imagin-es-es_db');
    this.register(Tenants.ILLIMITY, 'illimity_db');
    this.register(Tenants.ILLIMITY, 'genertel_db');
    this.register(Tenants.BANCA_SELLA, 'banca-sella_db');
    this.register(Tenants.BANCO_DESIO, 'banco-desio_db');
    this.register(Tenants.SANTA_LUCIA, 'santa-lucia_db');
    this.unknownType = this.register(Tenants.OTHER, 'unknown');
  }

  getValue(t: Tenants): string {
    const index = this.tenants.findIndex(model => {
      return model.getTenant() === t;
    });


    return index >= 0 ? this.tenants[index].getValue() : this.tenants[this.unknownType].getValue();
  }

  private register(t: Tenants, value: string): number {
    this.tenants.push(new TenantMapModel(t, value));
    return this.tenants.length - 1;
  }


}
