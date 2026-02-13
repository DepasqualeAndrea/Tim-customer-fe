import { FieldsToRecover } from '@NYP/ngx-multitenant-core';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TIM_FOR_SKI_GOLD_PRODUCT_NAME, TIM_FOR_SKI_PLATINUM_PRODUCT_NAME, TIM_FOR_SKI_SILVER_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable, of, zip } from 'rxjs';
import { catchError, filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { TimForSkiServiceModule } from '../tim-for-ski.service-module';
import { TimForSkiApiService } from './api.service';
import { TimForSkiCheckoutService } from './checkout.service';

@Injectable({ providedIn: TimForSkiServiceModule })
export class TimForSkiCheckoutResolver  {

  constructor(
    private apiService: TimForSkiApiService,
    private nypDataService: NypDataService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log(TIM_FOR_SKI_SILVER_PRODUCT_NAME, TIM_FOR_SKI_GOLD_PRODUCT_NAME, TIM_FOR_SKI_PLATINUM_PRODUCT_NAME, 'RESOLVER');

    try {
      const orderFromQuery = route.queryParams?.['order'] as string | undefined;
      let orderParam = orderFromQuery;
      if (!orderParam) {
        const queryString = (state && state.url && state.url.indexOf('?') > -1) ? state.url.split('?')[1] : '';
        if (queryString) {
          const params = new URLSearchParams(queryString);
          orderParam = params.get('order') || undefined;
        }
      }
      if (orderParam) {
        this.nypDataService.OrderCode = orderParam;
        this.nypDataService.StateAfterRedirect = 'thank-you';
      }
    } catch (e) {
      console.warn(TIM_FOR_SKI_SILVER_PRODUCT_NAME, TIM_FOR_SKI_GOLD_PRODUCT_NAME, TIM_FOR_SKI_PLATINUM_PRODUCT_NAME, 'Error parsing return query params', e);
    }

    // Data priorita verticale sul prodotto, in base ai dati che abbiamo durante la login, con sso.
    const productCodeFromOrderRaw = this.nypDataService?.Order$?.value?.product?.data?.code;
    const productCodeFromOrder$ = typeof productCodeFromOrderRaw === 'string' ? productCodeFromOrderRaw : undefined;
    const productCodeFromLocalStorage = localStorage.getItem('product_code') ?? undefined;
    const productCodeToUse: string = productCodeFromOrder$
      ?? productCodeFromLocalStorage
      ?? TIM_FOR_SKI_SILVER_PRODUCT_NAME;

    return this.apiService.getProduct(productCodeToUse).pipe(
      filter(product => !!product),
      take(1),
      map(product => product.packets.find(p => !!p.preselected)),
      tap(packet => {
        TimForSkiCheckoutService.InsuranceInfoState$.next('choicePet');
        TimForSkiCheckoutService.ChosenPacketsName = [];
        TimForSkiCheckoutService.ChosenPackets$.next(packet ? {
          warranties: packet?.warranties?.map(warranty => ({ code: warranty.id, label: warranty.translationCode, checked: warranty.preselected, price: warranty.insurancePremium })),
          price: packet?.packetPremium,
          packetCombo: packet?.sku,
        } : undefined);
      }),
      mergeMap(packet => this.apiService.getOrder(this.nypDataService.OrderCode)),
      tap((order) => {
        TimForSkiCheckoutService.fieldsToRecover = order.fieldToRecover as FieldsToRecover;
      }),
      map(() => true),
      catchError(err => {
        this.nypDataService.redirectToSessionOldPath();
        return of(false);
      })
    );
  }
}
