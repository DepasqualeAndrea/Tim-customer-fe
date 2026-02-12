import { FieldsToRecover } from '@NYP/ngx-multitenant-core';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TIM_CYBER_CONSUMER_KENTICO_SLUG, TIM_CYBER_CONSUMER_PRODUCT_NAME, TIM_CYBER_CONSUMER_KENTICO_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable, of, zip } from 'rxjs';
import { catchError, filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { TimCyberConsumerServiceModule } from '../tim-cyber-consumer.service-module';
import { TimCyberConsumerApiService } from './api.service';
import { TimCyberConsumerCheckoutService } from './checkout.service';

@Injectable({ providedIn: TimCyberConsumerServiceModule })
export class TimCyberConsumerCheckoutResolver implements Resolve<boolean> {

  constructor(
    private apiService: TimCyberConsumerApiService,
    private nypDataService: NypDataService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log(TIM_CYBER_CONSUMER_PRODUCT_NAME, 'RESOLVER');

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
      console.warn(TIM_CYBER_CONSUMER_PRODUCT_NAME, 'Error parsing return query params', e);
    }

    return this.apiService.getProduct().pipe(
      filter(product => !!product),
      take(1),
      map(product => product.packets.find(p => !!p.preselected)),
      tap(packet => {
        TimCyberConsumerCheckoutService.InsuranceInfoState$.next('choicePacket');
        TimCyberConsumerCheckoutService.ChosenPackets$.next(packet ? {
          warranties: [],
          price: 0,
          packetCombo: '',
        } : undefined);
      }),
      mergeMap(packet => zip(
        this.nypDataService.downloadKenticoContent(TIM_CYBER_CONSUMER_KENTICO_NAME, TIM_CYBER_CONSUMER_KENTICO_SLUG),
        this.apiService.getOrder(this.nypDataService.OrderCode),
      )),
      tap(([_, order]) => {
        TimCyberConsumerCheckoutService.fieldsToRecover = order.fieldToRecover as FieldsToRecover;
      }),
      map(() => true),
      catchError(err => {
        this.nypDataService.redirectToSessionOldPath();
        return of(false);
      })
    );
  }
}
