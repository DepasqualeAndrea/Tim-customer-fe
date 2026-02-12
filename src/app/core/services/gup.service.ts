import { NypUserService } from '@NYP/ngx-multitenant-core';
import { Injectable } from '@angular/core';
import { PaymentMethod } from '@model';
import { AuthService, DataService } from '@services';
import { UserTypes } from 'app/components/public/products-container/products-tim-employees/user-types.enum';
import { GupPaymentWalletList, GupRequest } from 'app/modules/checkout/checkout-step/checkout-step-payment/checkout-linear-stepper-payment-redirect/checkout-linear-stepper-payment-redirect-gup/gup-payment-methods.interface';
import { CheckoutStepPaymentProduct } from 'app/modules/checkout/checkout-step/checkout-step-payment/checkout-step-payment.model';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, takeWhile, tap } from 'rxjs/operators';
import { ComponentFeaturesService } from './componentFeatures.service';

@Injectable({
  providedIn: 'root'
})
export class GupService {

  private readonly COMPONENT_FEATURE_NAME = 'checkout-step-payment'
  private readonly GUP_PAYMENT_TYPE_RULE = 'get-gup-payment-method'
  private readonly PAYCHECK_CHARGE_RULE = 'gup-paycheck-charge';
  private readonly CODES_CONSTRAINT = 'product-codes'

  private gupLegacyPaymentMethod: PaymentMethod;

  constructor(
    protected nypUserService: NypUserService,
    private toastrService: ToastrService,
    private componentFeaturesService: ComponentFeaturesService,
    private authService: AuthService,
    private dataService: DataService,
  ) { }

  public getGupLegacyPaymentMethod(): PaymentMethod {
    return this.gupLegacyPaymentMethod;
  }

  /**
  * Returns the observable of an API GET call to get all
  * tenant's payment methods, and finds actual product's gupPaymentType 
  * then makes an API GET call to get all user's wallet containing
  * all of their payment methods that are of the gupPaymentType
  * @param gupPaymentType is the product's payment type (recurrent or one-shot) 
  * @return observable of the API response
  */
  public getUserGupWalletList(gupPaymentType: string, product: CheckoutStepPaymentProduct): Observable<GupPaymentWalletList> {
    this.gupLegacyPaymentMethod = product?.paymentMethods?.find(paymentMethod => paymentMethod?.name === gupPaymentType);

    return of(this.gupLegacyPaymentMethod).pipe(
      takeWhile(() => !!this.gupLegacyPaymentMethod),
      switchMap(() => this.nypUserService.getGupPaymentMethodList(this.gupLegacyPaymentMethod.externalId)),
      catchError(error => {
        this.toastrService.error(error.error.exception);
        throw error;
      })
    )
  }

  /**
  * Gets gupPaymentType from componentFeatures
  * @returns actual product's gupPaymentType (recurrent, one-shot OR both) from MongoDB's componentFeatures
  */
  public getGupPaymentType(productCode: string): string | string[] {
    this.componentFeaturesService.useComponent(this.COMPONENT_FEATURE_NAME);
    this.componentFeaturesService.useRule(this.GUP_PAYMENT_TYPE_RULE);
    if (this.componentFeaturesService.isRuleEnabled()) {
      const productCodesPaymentMethods = this.componentFeaturesService.getConstraints().get(this.CODES_CONSTRAINT);
      return productCodesPaymentMethods.find(kv => kv.code === productCode).payment;
    }
  }

  /**
  * Makes an API POST call to create a payment
  * @return observable of the API response
  * @param payload is the API request
  * @see GupRequest
  */
  public pay(payload: GupRequest): Observable<any> {
    this.dataService.persistFieldToRecover();

    payload.payment_method_id = this.gupLegacyPaymentMethod.externalId;
    payload.amount = this.dataService?.price;
    return this.nypUserService.gupPayment(payload).pipe(
      tap(() => localStorage.setItem("paymentType", this.computePaymentType(payload.payment_method_id))),
      catchError(error => {
        this.toastrService.error(error.error.exception);
        throw error;
      })
    )
  }

  computePaymentType(paymentType) {
    const paymentIds: { [key: number]: string } = { 1: 'SINGLE', 2: 'RECURRENT' };
    console.log(paymentIds[paymentType])
    return paymentIds[paymentType]
  }
  /**
  * Gets paycheck charge (no payment) rule from componentFeatures
  * @returns if rule is enabled and user is an employee
  */
  public usesPaycheckChargeMethod(): boolean {
    this.componentFeaturesService.useComponent(this.COMPONENT_FEATURE_NAME);
    this.componentFeaturesService.useRule(this.PAYCHECK_CHARGE_RULE);
    const userData = this.authService.loggedUser.data
    return this.componentFeaturesService.isRuleEnabled() && userData && userData.user_type !== UserTypes.RETIREE;
  }
}
