import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExternalProduct, Product, ResponseOrder } from '@model';
import { CheckoutService, DataService, InsurancesService } from '@services';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { LoaderService } from 'app/core/services/loader.service';
import { TimMyBrokerCustomersService } from 'app/core/services/tim-my-broker-customers.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { PREVENTIVATORE_URL_KEY } from 'app/modules/preventivatore/preventivatore/preventivatore.component';
import { PreventivatoreConstants } from 'app/modules/preventivatore/PreventivatoreConstants';
import { ContentItem } from 'kentico-cloud-delivery';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { CHECKOUT_OPENED } from '../services/checkout.resolver';
import { ExternalRedirectAction, RedirectResponse } from './external-redirect-action.model';
import { NypCheckoutService, NypInsurancesService } from '@NYP/ngx-multitenant-core';
const COMPONENT_FEATURE_NAME = 'checkout'
const COMPONENT_FEATURE_RULE = 'gup-external-redirect'

@Component({
  selector: 'app-checkout-success-payment-gup',
  templateUrl: './checkout-success-payment-gup.component.html',
  styleUrls: ['./checkout-success-payment-gup.component.scss']
})
export class CheckoutSuccessPaymentGupComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private checkoutService: CheckoutService,
    protected nypCheckoutService: NypCheckoutService,
    private dataService: DataService,
    private router: Router,
    private nypInsurancesService: NypInsurancesService,
    private kenticoTranslateService: KenticoTranslateService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private componentFeaturesService: ComponentFeaturesService,
    private timMyBrokerCustomersService: TimMyBrokerCustomersService
  ) { }

  private checkoutProduct: Product | ExternalProduct;
  private checkoutOrder: ResponseOrder;

  ngOnInit() {
    this.dataService.loadFieldToRecover();

    this.loaderService.start(PreventivatoreConstants.blockUiMainName);
    localStorage.removeItem(PREVENTIVATORE_URL_KEY);
    localStorage.removeItem(CHECKOUT_OPENED);
    this.restoreCheckoutAndShowSuccess();
  }

  private restoreCheckoutAndShowSuccess(): void {
    const queryParams = this.route.snapshot.queryParams
    const successMessage$ = this.kenticoTranslateService.getItem<ContentItem>('checkout')
    const order$ = this.nypCheckoutService.getOrder(queryParams.order);
    const productsList$ = this.nypInsurancesService.getProducts();

    if (queryParams && queryParams.order) {
      successMessage$.pipe(
        tap(message => {
          this.toastr.success(message?.payment_success?.value ?? "Pagamento avvenuto con successo.");
          this.loaderService.stop(PreventivatoreConstants.blockUiMainName);
        }),
        switchMap(() => order$),
        map(order => Object.assign(order, { state: 'success' })),
        tap(order => this.checkoutOrder = order),
        switchMap(() => productsList$),
        tap(productsList => {
          this.checkoutProduct = productsList.products.find(product =>
            product.product_code === this.checkoutOrder.line_items[0].product.product_code
          );
        }),
        switchMap(() => {
          if (this.checkoutProduct.product_code === 'tim-motor') {
            const completeOrder$ = this.nypCheckoutService.completeOrder(this.checkoutOrder.number, { state: 'success' }, '');
            return completeOrder$;
          }
          return of({});
        }),
        switchMap(() => {
          const externalRedirectAction = this.getProductExternalRedirect(this.checkoutProduct);
          if (!!externalRedirectAction) {
            return this.getExternalRedirect(externalRedirectAction, this.checkoutOrder);
          } else {
            this.restoreCheckoutState(this.checkoutOrder, this.checkoutProduct);
            return of({});
          }
        }),
      ).subscribe((redirectAction: RedirectResponse) => {
        if (!!redirectAction && redirectAction.redirect_url) {
          window.location.href = redirectAction.redirect_url;
        }
      })
    }
  }

  private getProductExternalRedirect(product: Product | ExternalProduct): ExternalRedirectAction {
    this.componentFeaturesService.useComponent(COMPONENT_FEATURE_NAME);
    this.componentFeaturesService.useRule(COMPONENT_FEATURE_RULE);
    if (this.componentFeaturesService.isRuleEnabled()) {
      return this.componentFeaturesService.getConstraints().get(product.product_code);
    }
  }

  private getExternalRedirect(action: ExternalRedirectAction, order: ResponseOrder): Observable<RedirectResponse | never> {
    switch (action.type) {
      case 'bybits':
        return this.timMyBrokerCustomersService.externalGupRedirect(action.value + order.number);
      default:
        return throwError(new Error('Action type not found'));
    }
  }

  private restoreCheckoutState(order: ResponseOrder, product: Product | ExternalProduct): void {
    this.dataService.setProduct(product);
    this.dataService.setResponseOrder(order)
    this.router.navigate(['checkout']);
  }
}
