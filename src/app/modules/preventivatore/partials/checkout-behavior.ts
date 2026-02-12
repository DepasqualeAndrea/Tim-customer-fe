import { NypCheckoutService } from '@NYP/ngx-multitenant-core';
import { Router } from '@angular/router';
import { Product, RequestOrder, ResponseOrder } from '@model';
import { CheckoutService, DataService } from '@services';
import { CheckoutStepService } from 'app/modules/checkout/services/checkout-step.service';

export class CheckOutBehavior {
  dataService: DataService;
  checkoutservice: CheckoutService;
  router: Router;

  constructor(checkoutservice: CheckoutService, dataservice: DataService, router: Router) {
    this.dataService = dataservice;
    this.checkoutservice = checkoutservice;
    this.router = router;
  }

  //--TODO: 'redirectAfterLogin'
  setupRedirectAfterLogin(url: string) {
    localStorage.setItem('redirectAfterLogin', url);
  }

  setupOrder(responseOrder) {
    localStorage.setItem('order', JSON.stringify(responseOrder));
  }

  public checkout(
    order: RequestOrder,
    product: Product,
    url: string,
    setQuotatorParamInURL: boolean,
    preserveQueryParams: boolean = false) {
    this.checkoutservice.addToChart(order).subscribe((res: ResponseOrder) => {
      this.dataService.setResponseOrder(res);
      this.dataService.setProduct(product);
      this.setupOrder(res);
      this.setupRedirectAfterLogin(url);
      this.checkoutservice.saveOngoingCheckout({
        requestOrder: null,
        responseOrder: res,
        product: product,
        fromQuotator: setQuotatorParamInURL
      });
      if (['ehealth-quixa-standard'].includes(product.product_code)) {

        const fields = this.dataService.persistFieldToRecover();

        const dataOrder = {
          data: {
            order: order.order,
            state: 'insurance_info',
            version: NypCheckoutService.version,
            fieldToRecover: fields,
            productCode: this.dataService.product?.product_code,
          },
          orderNumber: this.dataService.getResponseOrder().number
        };
        window.parent.postMessage(dataOrder, '*');
        this.dataService.setRequestOrder(dataOrder.data);
        this.dataService.persistFieldToRecover();
      }
      return this.router.navigate([url],
        { queryParamsHandling: preserveQueryParams ? 'preserve' : '' });
    });

  }
}

export class CheckOutMultipleOrderBehavior {
  dataService: DataService;
  checkoutservice: CheckoutService;
  router: Router;
  checkoutStepService: CheckoutStepService;

  constructor(checkoutservice: CheckoutService,
    dataservice: DataService,
    router: Router,
    checkoutStepService: CheckoutStepService
  ) {
    this.dataService = dataservice;
    this.checkoutservice = checkoutservice;
    this.router = router;
    this.checkoutStepService = checkoutStepService;
  }

  private setupOrder(responseOrder: ResponseOrder): void {
    localStorage.setItem('order', JSON.stringify(responseOrder));
  }

  public checkout(order: RequestOrder, product: Product, url: string, setQuotatorParamInURL: boolean) {
    this.checkoutservice.addToChart(order).subscribe((res) => {
      this.dataService.setResponseOrder(res);
      this.dataService.setProduct(product);
      this.setupOrder(res);
      // this.checkoutservice.saveOngoingCheckout({
      //   requestOrder: null,
      //   responseOrder: res,
      //   product: product,
      //   fromQuotator: setQuotatorParamInURL
      // });
      this.checkoutservice.cancelOngoingCheckout();
      this.checkoutStepService.orderChange(res);
      this.checkoutStepService.setCurrentStep('insurance-info');
      return this.router.navigate([url], { queryParams: { upselling: res.line_items[0].id } });
    });
  }
}
