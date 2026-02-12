import { FieldsToRecover } from '@NYP/ngx-multitenant-core';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TIM_PROTEZIONE_CASA_KENTICO_NAME, TIM_PROTEZIONE_CASA_KENTICO_SLUG, TIM_PROTEZIONE_CASA_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable, of, zip } from 'rxjs';
import { catchError, filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { TimProtezioneCasaServiceModule } from '../tim-protezione-casa.service-module';
import { TimProtezioneCasaApiService } from './api.service';
import { TimProtezioneCasaCheckoutService } from './checkout.service';

@Injectable({ providedIn: TimProtezioneCasaServiceModule })
export class TimProtezioneCasaCheckoutResolver implements Resolve<boolean> {

  constructor(
    private apiService: TimProtezioneCasaApiService,
    private nypDataService: NypDataService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log(TIM_PROTEZIONE_CASA_PRODUCT_NAME, 'RESOLVER');

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
      console.warn(TIM_PROTEZIONE_CASA_PRODUCT_NAME, 'Error parsing return query params', e);
    }

    return this.apiService.getProduct().pipe(
      filter(product => !!product),
      take(1),
      tap(() => {
        TimProtezioneCasaCheckoutService.InsuranceInfoState$.next('packet-selector');
        TimProtezioneCasaCheckoutService.ChosenPacketsName = [];
        TimProtezioneCasaCheckoutService.ChosenPackets$.next(undefined);
        TimProtezioneCasaCheckoutService.SelectedPackets = {
          mutualExclusive: undefined, photovoltaic: false, smartII: true, deluxeII: true, lightWarranties: [], smartWarranties: [], deluxeWarranties: [], photovoltaicWarranties: [], lightPrice: 0, smartPrice: 0, deluxePrice: 0, photovoltaicPrice: 0, currentPacketConfiguration: {
            'Light': { 'basic': undefined },
            'Smart': { 'basic': undefined, 'ii': undefined, 'photovoltaic': undefined },
            'Deluxe': { 'basic': undefined, 'ii': undefined, 'photovoltaic': undefined },
            'Photovoltaic': { 'basic': undefined },
          },
          currentPacket: undefined
        };
      }),
      mergeMap(product => zip(
        this.nypDataService.downloadKenticoContent(TIM_PROTEZIONE_CASA_KENTICO_NAME, TIM_PROTEZIONE_CASA_KENTICO_SLUG),
        this.apiService.getOrderByCode(this.nypDataService.OrderCode),
      )),
      tap(([_, order]) => {
        TimProtezioneCasaCheckoutService.fieldsToRecover = order.fieldToRecover as FieldsToRecover;
      }),
      map(() => true),
      catchError(err => {
        this.nypDataService.redirectToSessionOldPath();
        return of(false);
      })
    );
  }
}
