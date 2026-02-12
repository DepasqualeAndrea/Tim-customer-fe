import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderAttributesModel, RequestCheckout, RequestOrder, ResponseOrder } from '@model';
import { DataService } from './data.service';
import { CheckoutData, CheckoutProduct } from 'app/modules/checkout/checkout.model';
import { PreventivatoreConstants } from 'app/modules/preventivatore/PreventivatoreConstants';
import { catchError, finalize, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { StepProgressBarAuthFalse } from '../../modules/checkout/checkout-step/checkout-step.model';
import { environment } from '../../../environments/environment';
import { ExternalPlatformRequestOrder } from '../models/externalCheckout/external-platform-request-order.model';
import { ContinueCheckout } from '../models/externalCheckout/continue-checkout.model';
import { LoaderService } from './loader.service';
import { NypCheckoutService, NypInsurancesService } from '@NYP/ngx-multitenant-core';

export const ONGOING_CHECKOUT_DATA_LOCAL_STORAGE_KEY = 'ongoingCheckoutData';
export const QUOTATOR_REDIRECT_ORDER_SESSION_STORAGE_KEY = 'quotatorRedirectOrder';

const externalTenants = [{ code: 'w', name: 'Wind' }, { code: 'je', name: 'JustEat' }, { code: 'ct', name: 'ConTe' }];

@Injectable()
export class CheckoutService {
  utm_source_prev: string;
  tenant: string;
  urlPreventivatore: string;
  stepProgressBarAuthFalse: StepProgressBarAuthFalse;
  addonsStepInsuranceInfo: any;

  constructor(
    private http: HttpClient,
    private dataService: DataService,
    public loaderService: LoaderService,
    protected nypCheckoutService: NypCheckoutService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  public addToChart(reqOrder: RequestOrder): Observable<ResponseOrder> {
    const idProduct = reqOrder.order.line_items_attributes['0'].variant_id;
    const version = NypInsurancesService.products?.products.find(product => {
      if (product.id == idProduct) {
        return true;
      }
      else if (product.variants?.length > 0) {
        return product.variants.some((variant: any) => variant.id == idProduct)
      } else {
        return false;
      }
    }).version;

    localStorage.setItem("version", version)

    this.dataService.preventivatoreUrl.next();
    this.dataService.setRequestOrder(reqOrder);
    localStorage.setItem("reqOrder", JSON.stringify(reqOrder))
    this.dataService.loadFieldToRecover();

    return this.nypCheckoutService.addToChart(reqOrder, () => this.updateReqOrderForAllProduct(reqOrder));
  }
  public continueCheckout(reqCheckout: RequestCheckout): string {
    const url = `/continue_checkout?token=${reqCheckout.token}&order_number=${reqCheckout.order_number}&utm_source=${reqCheckout.utm_source}&telemarketer=${reqCheckout.telemarketer}`;
    return (this.dataService.apiUrl + url);
  }

  public getClientToken(paymentId: number): Observable<string> {
    throw new Error("getClientToken")
  }

  public paymentSourceInfo(paymentSourceInfo: { payment_method_id: number, wallet_payment_source_id: number, order_number: string }): Observable<any> {
    throw new Error("paymentSourceInfo")
  }

  public paymentSourceInfoFromInsurance(paymentSourceInfo: { payment_method_id: number, wallet_payment_source_id: number, insurance_id: number }): Observable<any> {
    throw new Error("paymentSourceInfoFromInsurance")
  }

  public getProduct(id: number): Observable<any> {
    throw new Error("getProduct")
  }

  public saveTimestamp(idInsurance: number): Observable<any> {
    throw new Error("saveTimestamp")
  }

  saveOngoingCheckout(checkoutData: CheckoutData) {
    localStorage.setItem(ONGOING_CHECKOUT_DATA_LOCAL_STORAGE_KEY, JSON.stringify(checkoutData));
    this.cancelStepProgressBarAuthFalse();
  }

  cancelOngoingCheckout() {
    localStorage.removeItem(ONGOING_CHECKOUT_DATA_LOCAL_STORAGE_KEY);
  }

  getOngoingCheckoutData(cleanLocalStorage = true): CheckoutData {
    const dataFromLocalStorage = localStorage.getItem(ONGOING_CHECKOUT_DATA_LOCAL_STORAGE_KEY);
    if (cleanLocalStorage) {
      localStorage.removeItem(ONGOING_CHECKOUT_DATA_LOCAL_STORAGE_KEY);
    }
    return JSON.parse(dataFromLocalStorage);
  }

  setRedirectFromUserActivation() {
    const dataFromLocalStorage = localStorage.getItem(ONGOING_CHECKOUT_DATA_LOCAL_STORAGE_KEY);
    if (!!dataFromLocalStorage) {
      const checkoutData = JSON.parse(dataFromLocalStorage);
      if (!!checkoutData.fromQuotator) {
        checkoutData.fromQuotator = false;
      }
    }
  }

  getTenantName() {
    return externalTenants.find(externalTenant => externalTenant.code === this.dataService.tenantInfo.main.layout).name;
  }

  addUtmSource(order: RequestOrder, utm: string, telemarketer: number): RequestOrder {
    const orderAttributes = {
      order_attributes: {
        utm_source: utm || this.getTenantName(),
        telemarketer: telemarketer || 0
      }
    };
    return {
      order: Object.assign({}, order.order, orderAttributes)
    };
  }

  public addQueryParamsToOrderRequest(requestOrder: RequestOrder): RequestOrder {
    const queryParams = this.activatedRoute.snapshot.queryParamMap
    if (!!queryParams) {
      if (!requestOrder.order.order_attributes) {
        requestOrder.order.order_attributes = new OrderAttributesModel();
      }
      const orderAttributes = requestOrder.order.order_attributes
      const paramValues = Object.values(queryParams)[0]
      for (const [key, value] of Object.entries(paramValues)) {
        if (key && value) {
          orderAttributes[key] = value
        }
      }
    }
    return requestOrder;
  }

  redirectExternalCheckout(order: RequestOrder, product: CheckoutProduct): void {
    const features: any = this.dataService.getFeatureToggle() || { legacyCheckout: true };
    const legacyCheckout: boolean = features.legacyCheckout;
    if (legacyCheckout) {
      this.redirectOnPlatformLegacy(order, product.code);
    } else {
      this.redirectOnPlatformVersion2(order, product.id);
    }
  }

  public retailOrder(retailOrder): Observable<ResponseOrder> {
    throw new Error("retailOrder")
  }

  setQuotatorOrder(order) {
    localStorage.setItem(QUOTATOR_REDIRECT_ORDER_SESSION_STORAGE_KEY, JSON.stringify(order));
  }

  getQuotatorOrder() {
    const order = JSON.parse(localStorage.getItem(QUOTATOR_REDIRECT_ORDER_SESSION_STORAGE_KEY));
    this.cancelQuotatorOrder();
    return order;
  }

  cancelQuotatorOrder() {
    localStorage.removeItem(QUOTATOR_REDIRECT_ORDER_SESSION_STORAGE_KEY);
  }

  updateReqOrderForAllProduct(requestOrder: RequestOrder): RequestOrder {
    // insert utm_source if passed in queryparams
    const queryParams = this.activatedRoute.snapshot.queryParamMap
    const utmSource = queryParams.get('utm_source');
    if (!!queryParams && utmSource) {
      if (!requestOrder.order.order_attributes) {
        requestOrder.order.order_attributes = new OrderAttributesModel();
      }
      requestOrder.order.order_attributes.utm_source = utmSource;
    }
    this.addQueryParamsToOrderRequest(requestOrder)
    return requestOrder;
  }

  setStepProgressBarAuthFalse(stepProgressBarAuthFalse: StepProgressBarAuthFalse) {
    this.stepProgressBarAuthFalse = stepProgressBarAuthFalse;
  }

  getStepProgressBarAuthFalse() {
    return this.stepProgressBarAuthFalse;
  }

  cancelStepProgressBarAuthFalse() {
    this.stepProgressBarAuthFalse = null;
  }

  setAddonsStepInsuranceInfo(addons: any) {
    this.addonsStepInsuranceInfo = addons;
  }

  getAddonsStepInsuranceInfo() {
    return this.addonsStepInsuranceInfo;
  }

  private redirectOnPlatformVersion2(order: RequestOrder, productId: number): void {
    throw new Error("redirectOnPlatformVersion2")
  }

  private redirectOnPlatformLegacy(orderWithUtm: RequestOrder, productCode: string): void {
    if (!!productCode) {
      this.loaderService.start(PreventivatoreConstants.blockUiMainName, PreventivatoreConstants.RedirectLoadingMessagesMap.get(productCode) || 'Loading...');
    } else {
      this.loaderService.start(PreventivatoreConstants.blockUiMainName);
    }
    setTimeout(() => {
      this.addToChart(orderWithUtm)
        .pipe(finalize(() => {
          this.loaderService.stop(PreventivatoreConstants.blockUiMainName);
        }))
        .subscribe((res) => {
          let req: RequestCheckout;
          req = {
            order_number: res.number,
            token: res.token,
            utm_source: orderWithUtm.order.order_attributes.utm_source || this.getTenantName(),
            telemarketer: orderWithUtm.order.order_attributes.telemarketer || 0
          };
          const url = this.continueCheckout(req);
          window.location.assign(url);
        }, (err) => {
          console.error(err);
        });
    }
    );
  }

  public basicCheckout(lineItemId: any): Observable<any> {
    throw new Error("basicCheckout")
  }


  public fullCheckout(lineItemId: any): Observable<any> {
    throw new Error("fullCheckout")
  }

  public multiriskCCQuote(lineItemId: any, addons: any): Observable<any> {
    throw new Error("multiriskCCQuote")
  }

  public buildingCreate(idOrder: string, reqOrder: RequestOrder): Observable<any> {
    throw new Error("buildingCreate")
  }

  public setPaymentFrequency(idOrder: number, paymentFrequency: string): Observable<any> {
    throw new Error("setPaymentFrequency")
  }
}
