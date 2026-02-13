import { NypCheckoutService } from '@NYP/ngx-multitenant-core';
import { Component, Input, OnInit } from '@angular/core';
import { ResponseOrder } from '@model';
import { CheckoutService, DataService } from '@services';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { TimMyBrokerCustomersService } from 'app/core/services/tim-my-broker-customers.service';
import { ExternalRedirectAction, RedirectResponse } from 'app/modules/checkout/checkout-success-payment-gup/external-redirect-action.model';
import { CheckoutProduct } from 'app/modules/checkout/checkout.model';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

const COMPONENT_FEATURE_NAME = 'checkout';
const COMPONENT_FEATURE_RULE = 'gup-external-redirect';

@Component({
    selector: 'app-checkout-linear-stepper-complete-tim-motor',
    templateUrl: './checkout-linear-stepper-complete-tim-motor.component.html',
    styleUrls: ['./checkout-linear-stepper-complete-tim-motor.component.scss'],
    standalone: false
})
export class CheckoutLinearStepperCompleteTimMotorComponent implements OnInit {

  @Input() order: ResponseOrder;
  @Input() product: CheckoutProduct;

  constructor(
    private componentFeaturesService: ComponentFeaturesService,
    private dataService: DataService,
    private timMyBrokerCustomersService: TimMyBrokerCustomersService,
    private nypCheckoutService: NypCheckoutService
  ) { }

  ngOnInit() {
    this.checkForExternalRedirect();
  }

  private checkForExternalRedirect(): void {
    const externalRedirectAction = this.getProductExternalRedirect(this.product.code);
    if (!!externalRedirectAction) {
      this.completeOrderAndRedirect(externalRedirectAction);
    }
  }

  private getProductExternalRedirect(productCode: string): ExternalRedirectAction {
    this.componentFeaturesService.useComponent(COMPONENT_FEATURE_NAME);
    this.componentFeaturesService.useRule(COMPONENT_FEATURE_RULE);
    if (this.componentFeaturesService.isRuleEnabled()) {
      return this.componentFeaturesService.getConstraints().get(productCode);
    }
  }

  private completeOrderAndRedirect(externalRedirectAction: ExternalRedirectAction): void {
    const order = this.dataService.getResponseOrder();
    this.nypCheckoutService.completeOrder(order.number, { state: 'confirm' }, '').pipe(
      catchError(error => of(error)),
      switchMap(() => this.getExternalRedirect(externalRedirectAction, order))
    ).subscribe((redirectResponse: RedirectResponse) => {
      if (!!redirectResponse && redirectResponse.redirect_url) {
        window.location.href = redirectResponse.redirect_url;
      }
    });
  }

  private getExternalRedirect(action: ExternalRedirectAction, order: ResponseOrder): Observable<RedirectResponse | never> {
    switch (action.type) {
      case 'bybits':
        return this.timMyBrokerCustomersService.externalGupRedirect(action.value + order.number);
      default:
        return throwError(new Error('Action type not found'));
    }
  }

}
