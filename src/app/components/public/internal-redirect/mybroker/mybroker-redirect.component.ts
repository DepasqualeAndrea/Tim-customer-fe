import { NypInsurancesService } from '@NYP/ngx-multitenant-core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductsList, RequestOrder } from '@model';
import { AuthService, CheckoutService, DataService } from '@services';
import { AppComponent } from 'app/app.component';
import { IProduct } from 'app/modules/nyp-checkout/models/api.model';
import { NYP_ENABLED_PRODUCTS, TIM_EHEALTH_QUIXA_STANDARD_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypApiService } from 'app/modules/nyp-checkout/services/api.service';
import { CheckOutBehavior } from 'app/modules/preventivatore/partials/checkout-behavior';
import { CheckoutBehaviourRequest } from 'app/modules/preventivatore/preventivatore-dynamic/components/tim-hero-price/tim-prev-checkout.model';
import { Subscription, concat, of, zip } from 'rxjs';
import { filter, mergeMap, take, toArray } from 'rxjs/operators';
import { AllowedParams } from '../redirect.interfaces';
import { GREAT_FLOOD } from 'app/core/models/token-interceptor.model';
import { TimEhealthQuixaStandardApiService } from 'app/modules/nyp-checkout/modules/tim-ehealth-quixa-standard/services/api.service';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';

@Component({
  selector: 'app-internal-redirect',
  template: ''
})
export class MyBrokerRedirectComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private nypInsuranceService: NypInsurancesService,
    private dataService: DataService,
    private checkoutService: CheckoutService,
    private apiService: NypApiService,
    private nypDataService: NypDataService,
    private timEhealthQuixaStandardApiService: TimEhealthQuixaStandardApiService,
    private authService: AuthService,
  ) { }

  private readonly subscribtions: Subscription[] = [];

  ngOnInit(): void {
    this.subscribtions.push(this.getCheckoutInitSubscription())
  }

  ngOnDestroy(): void {
    this.subscribtions.forEach(s => s.unsubscribe())
  }

  private getCheckoutInitSubscription(): Subscription {
    return AppComponent.AppReady$
      .pipe(
        filter(v => v === true),
        mergeMap(() => zip(
          this.nypInsuranceService.getProducts(),
          this.apiService.getProduct(),
        )),
      ).subscribe(([products, latestProducts]: [ProductsList, IProduct[]]) => {
        const productCodeParam = (this.route.snapshot.queryParams as AllowedParams).product || localStorage.getItem('product_code');
        const idOrder = localStorage.getItem('id_order');
        const currentProduct = products?.products.find(p => p.product_code === productCodeParam);
        const currentLatestProduct = latestProducts.find(p => p.code === productCodeParam);

        GREAT_FLOOD();

        localStorage.setItem('product_code', productCodeParam);
        localStorage.setItem('id_order', idOrder);
        localStorage.removeItem('fieldToRecover');

        if (!currentProduct && !currentLatestProduct) this.router.navigate(['/notfound']);

        console.log('\n', productCodeParam, !!currentProduct ? 'legacy-path' : 'latest-path', '\n');

        if (NYP_ENABLED_PRODUCTS.includes(productCodeParam) && !!currentLatestProduct) {
          this.apiService.postOrder({
            customerId: this.authService.loggedUser?.id,
            packetId: currentLatestProduct?.packets?.find(p => p.preselected)?.id ?? currentLatestProduct?.packets?.[0]?.id,
            productId: currentLatestProduct?.id,
          })
            .pipe(mergeMap(order => {
              if (productCodeParam == TIM_EHEALTH_QUIXA_STANDARD_PRODUCT_NAME)
                return concat(
                  this.timEhealthQuixaStandardApiService.putOrder({
                    anagState: 'Elaboration',
                  }),
                  this.apiService.legacyRequest(this.nypDataService.Order$.value?.orderCode, this.timEhealthQuixaStandardApiService.GET_EMISSIONBODY(order.orderCode, currentLatestProduct?.id)),
                ).pipe(toArray(), take(1));
              else
                return of(true);
            }))
            .subscribe(() => {
              sessionStorage.setItem('old_path', this.router.url);
              this.router.navigate(['/nyp-checkout', productCodeParam])
            });
        } else if (!!currentProduct) {
          const order = this.createOrderObj(currentProduct);
          const payload = this.createPayload(order, currentProduct);
          this.redirectCheckout(payload);
        } else {
          this.router.navigate(['/notfound']);
        }
      });
  }

  private createOrderObj(product: Product): RequestOrder {
    return {
      order: {
        line_items_attributes: {
          0: {
            variant_id: product.master_variant,
            quantity: 1,
          },
        },
      }
    };
  }

  private redirectCheckout(payload: CheckoutBehaviourRequest) {
    const checkoutBehavior = new CheckOutBehavior(this.checkoutService, this.dataService, this.router);
    checkoutBehavior.checkout(payload.order, payload.product, payload.router, true, true);
  }

  private createPayload(order: RequestOrder, product: Product): CheckoutBehaviourRequest {
    const payload = {
      product: product,
      order: order,
      router: 'checkout'
    };
    return payload;
  }


}
