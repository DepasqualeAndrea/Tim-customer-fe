import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { NypStripeModule } from '../nyp-stripe.module';

@Injectable({ providedIn: 'root' })
export class NypStripeService {
  private readonly PATHS = {
    POST_INTENT: '/api/latest/wallet_intent',
    GET_SESION_STATUS: '/api/latest/wallet_session_status/',

    GET_WALLET: '/api/latest/wallet',
    GET_WALLET_PAYMENT_METHODS: '/api/latest/wallet_payment_methods',
    GET_WALLET_CARD_BY_ID: '/api/latest/wallet_card_by_id',
    POST_ADD_NEW_CARD: '/api/latest/wallet_add_new_card/',
    POST_UPDATE_CARD_STATUS: '/api/latest/wallet_update_card_status',
    PAY_BY_CARD: '/api/latest/pay_by_card',
    PAY_BY_PAYPAL: '/api/latest/pay_by_paypal',
    PAY_BY_SEPA: '/api/latest/pay_by_sepa',
    UPDATE_SUBSCRIPTION: '/api/latest/update-pm/subscription',
  };

  constructor(private httpClient: HttpClient) { }

  public getWallet(): Observable<IStripePayEl[]> {
    return this.httpClient.get<{ data: IStripePayEl[] }>(this.PATHS.GET_WALLET)
      .pipe(map(res => res.data));
  }

  public getPaymentMethods(): Observable<IStripePaymentMethod[]> {
    return this.httpClient.get<{ data: IStripePaymentMethod[] }>(this.PATHS.GET_WALLET_PAYMENT_METHODS)
      .pipe(map(res => res.data));
  }

  /* public setDefaultCard(paymentToken: string): Observable<void> {
    return of();
  } */

  public addNewCard(paymentToken: string, isDefault: boolean, source_attributes: { [key: string]: string }/* {name: "Luigi"} */): Observable<IStripePayEl> {
    return this.httpClient.post<IStripePayEl>(this.PATHS.POST_ADD_NEW_CARD, {
      payment_method_nonce: paymentToken,
      is_default: `${isDefault}`,
      source_attributes: source_attributes
    });
  }

  // TODO: Ask for response
  public payByCard(orderId: string, paymentToken: string): Observable<IPaymentByCard> {
    return this.httpClient.post<{ clientSecret: string }>(this.PATHS.PAY_BY_CARD, { order_id: orderId });
  }
  // TODO: Ask for response
  public payByPaypal(orderId: string): Observable<IPaymentByPayPal> {
    return this.httpClient.post<{ clientSecret: string }>(this.PATHS.PAY_BY_PAYPAL, { order_id: orderId });
  }
  // TODO: Ask for response
  public payBySepa(orderId: string): Observable<IPaymentBySepa> {
    return this.httpClient.post<{ clientSecret: string }>(this.PATHS.PAY_BY_SEPA, { order_id: orderId });
  }

  public intent(orderId: string): Observable<string> {
    return this.httpClient.post<{ clientSecret: string }>(this.PATHS.POST_INTENT, { order_id: orderId })
      .pipe(map(res => res.clientSecret));
  }

  public wallet_session_status(sessionId: string): Observable<boolean> {
    return this.httpClient.get<{ status: 'complete' | 'open' }>(`${this.PATHS.GET_SESION_STATUS}${sessionId}`)
      .pipe(map(res => res.status == 'complete'));
  }

  public payment_updated_session_status(sessionId: string): Observable<boolean> {
    return this.httpClient.get<{ status: 'complete' | 'open' }>(`${this.PATHS.GET_SESION_STATUS}${sessionId}`)
      .pipe(map(res => res.status == 'complete'));
  }

  public updateSubscription(orderId: string): Observable<{ clientSecret: string }> {
    // return of('cs_test_c17em0Sarr9wd2L4SOKOZfEvsOJYZyBpDkvgOo3Zmc4E5zdB13pYEkqi6E')

    //Added parameter "type" to let know BE service that must return redirect url to not nyp PA.
    return this.httpClient.post<{ clientSecret: string }>(`${this.PATHS.UPDATE_SUBSCRIPTION}`, { order_id: orderId, type: 'no-nyp-ar' })
      .pipe(tap(csi => NypStripeModule.Stripe.then(s => s.redirectToCheckout({ sessionId: csi.clientSecret }))));
  }

  /* public unsubscribe(orderId: string): Observable<ISubscription> {
    return of();
  }

  public getSubscription(orderId: string): Observable<ISubscription> {
    return of();
  }

  public updateSubscription(orderId: string): Observable<ISubscription> {
    return of();
  } */
}

export interface IStripePayEl {
  id: number;
  cc_type?: string;
  month: string;
  name: string;
  type: string;
  year: string;
  default: boolean;
  stripe_customer_id: string;
  json_data?: any;
  last_digits: string;
  'recurring?': boolean;
  payment_token: string;
  payment_method_id: number;
  payment_method_description: string;
  selected?: boolean;
  image?: string;
}

export interface IStripePaymentMethod {
  id: number;
  type: string;
  name: string;
  createdAt: string;
  deletedAt?: any;
  updatedAt?: any;
  recurrent: boolean;
  avaibleToAdmin: boolean;
  avaibleToUsers: boolean;
}

export interface IPaymentByCard { }
export interface IPaymentByPayPal { }
export interface IPaymentBySepa { }
export interface ISubscription { }
