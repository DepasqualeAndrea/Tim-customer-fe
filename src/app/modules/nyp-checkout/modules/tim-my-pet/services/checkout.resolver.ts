import { FieldsToRecover } from '@NYP/ngx-multitenant-core';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TIM_MY_PET_KENTICO_SLUG, TIM_MY_PET_PRODUCT_NAME, TIM_MY_PET_KENTICO_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable, of, zip } from 'rxjs';
import { catchError, filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { TimMyPetServiceModule } from '../tim-my-pet.service-module';
import { TimMyPetApiService } from './api.service';
import { TimMyPetCheckoutService } from './checkout.service';

@Injectable({ providedIn: TimMyPetServiceModule })
export class TimMyPetCheckoutResolver  {

  constructor(
    private apiService: TimMyPetApiService,
    private nypDataService: NypDataService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log(TIM_MY_PET_PRODUCT_NAME, 'RESOLVER');

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
      console.warn(TIM_MY_PET_PRODUCT_NAME, 'Error parsing return query params', e);
    }

    return this.apiService.getProduct().pipe(
      filter(product => !!product),
      take(1),
      map(product => product.packets.find(p => !!p.preselected)),
      tap(packet => {
        TimMyPetCheckoutService.InsuranceInfoState$.next('choicePacket');
        TimMyPetCheckoutService.ChosenPackets$.next(packet ? {
          warranties: [],
          price: 0,
          packetCombo: '',
        } : undefined);
      }),
      mergeMap(packet => zip(
        this.nypDataService.downloadKenticoContent(TIM_MY_PET_KENTICO_NAME, TIM_MY_PET_KENTICO_SLUG),
        this.apiService.getOrder(this.nypDataService.OrderCode),
      )),
      tap(([_, order]) => {
        TimMyPetCheckoutService.fieldsToRecover = order.fieldToRecover as FieldsToRecover;
        // const orderWarranties = order?.orderItem?.[0]?.instance?.chosenWarranties;
        // if (!TimMyPetCheckoutService.ChosenPackets$.value && orderWarranties) {
        //   TimMyPetCheckoutService.ChosenPackets$.next({
        //     warranties: orderWarranties.data.warranties?.map(warranty => ({ code: warranty.id, label: warranty.translationCode, checked: warranty.preselected, price: warranty.insurancePremium })),
        //     price: order.packet.data?.packetPremium,
        //     packetCombo: order.packet.data?.sku,
        //   });
        // }
        // metodo mai utilizzato, ma lo lascio per sicurezza capire se necessario altrimenti rimuovere
      }),
      map(() => true),
      catchError(err => {
        this.nypDataService.redirectToSessionOldPath();
        return of(false);
      })
    );
  }
}
