import { FieldsToRecover } from '@NYP/ngx-multitenant-core';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TIM_PROTEZIONE_VIAGGI_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { TimProtezioneViaggiAnnualeServiceModule } from '../tim-protezione-viaggi-annuale.service-module';
import { TimProtezioneViaggiAnnualeApiService } from './api.service';
import { TimProtezioneViaggiAnnualeCheckoutService } from './checkout.service';

@Injectable({ providedIn: TimProtezioneViaggiAnnualeServiceModule })
export class TimProtezioneViaggiAnnualeCheckoutResolver implements Resolve<boolean> {

  constructor(
    private apiService: TimProtezioneViaggiAnnualeApiService,
    private nypDataService: NypDataService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log(TIM_PROTEZIONE_VIAGGI_PRODUCT_NAME, 'RESOLVER');

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
      console.warn(TIM_PROTEZIONE_VIAGGI_PRODUCT_NAME, 'Error parsing return query params', e);
    }

    return this.apiService.getProduct().pipe(
      filter(product => !!product),
      take(1),
      map(product => product.packets.find(p => !!p.preselected)),
      tap(packet => {
        TimProtezioneViaggiAnnualeCheckoutService.InsuranceInfoState$.next('choicePet');
        TimProtezioneViaggiAnnualeCheckoutService.ChosenPacketsName = [];
        TimProtezioneViaggiAnnualeCheckoutService.ChosenPackets$.next(packet ? {
          warranties: packet?.warranties?.map(warranty => ({ code: warranty.id, label: warranty.translationCode, checked: warranty.preselected, price: warranty.insurancePremium })),
          price: packet?.packetPremium,
          packetCombo: packet?.sku,
        } : undefined);
      }),
      mergeMap(packet => this.apiService.getOrder(this.nypDataService.OrderCode)),
      tap((order) => {
        TimProtezioneViaggiAnnualeCheckoutService.fieldsToRecover = order.fieldToRecover as FieldsToRecover;
      }),
      map(() => true),
      catchError(err => {
          this.nypDataService.redirectToSessionOldPath();
          return of(false);
        })
    );
  }
}
