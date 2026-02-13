import { FieldsToRecover } from '@NYP/ngx-multitenant-core';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TIM_EHEALTH_QUIXA_STANDARD_KENTICO_NAME, TIM_EHEALTH_QUIXA_STANDARD_KENTICO_SLUG, TIM_EHEALTH_QUIXA_STANDARD_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable, of, zip } from 'rxjs';
import { catchError, filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { TimEhealthQuixaStandardServiceModule } from '../tim-ehealth-quixa-standard.service-module';
import { TimEhealthQuixaStandardApiService } from './api.service';
import { TimEhealthQuixaStandardCheckoutService } from './checkout.service';

@Injectable({ providedIn: TimEhealthQuixaStandardServiceModule })
export class TimEhealthQuixaStandardCheckoutResolver  {

  constructor(
    private apiService: TimEhealthQuixaStandardApiService,
    private nypDataService: NypDataService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log(TIM_EHEALTH_QUIXA_STANDARD_PRODUCT_NAME, 'RESOLVER');

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
      console.warn(TIM_EHEALTH_QUIXA_STANDARD_PRODUCT_NAME, 'Error parsing return query params', e);
    }

    return this.apiService.getProduct().pipe(
      filter(product => !!product),
      take(1),
      map(product => product.packets.find(p => !!p.preselected)),
      tap(packet => {
        TimEhealthQuixaStandardCheckoutService.InsuranceInfoState$.next('insured-documents');
        TimEhealthQuixaStandardCheckoutService.ChosenPacketsName = [];
        TimEhealthQuixaStandardCheckoutService.ChosenPackets$.next(packet ? {
          warranties: packet?.warranties?.map(warranty => ({ code: warranty.id, label: warranty.translationCode, checked: warranty.preselected, price: warranty.insurancePremium })),
          price: packet?.packetPremium,
          packetCombo: packet?.sku,
        } : undefined);
      }),
      mergeMap(packet => zip(
        this.nypDataService.downloadKenticoContent(TIM_EHEALTH_QUIXA_STANDARD_KENTICO_NAME, TIM_EHEALTH_QUIXA_STANDARD_KENTICO_SLUG),
        this.apiService.getOrder(this.nypDataService.OrderCode),
      )),
      tap(([_, order]) => {
        TimEhealthQuixaStandardCheckoutService.fieldsToRecover = order.fieldToRecover as FieldsToRecover;
      }),
      map(() => true),
      catchError(err => {
        this.nypDataService.redirectToSessionOldPath();
        return of(false);
      })
    );
  }
}
