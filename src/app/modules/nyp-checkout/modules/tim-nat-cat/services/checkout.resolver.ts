import { FieldsToRecover } from '@NYP/ngx-multitenant-core';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {TIM_NAT_CAT_PRODUCT_NAME, TIM_NAT_CAT_KENTICO_SLUG } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable, of, zip } from 'rxjs';
import { catchError, filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { TimNatCatService } from './api.service';
import { TimNatCatServiceModule } from '../tim-nat-cat.service-module';
import { TimNatCatCheckoutService } from './checkout.service';

@Injectable({ providedIn: 'root' })
export class TimNatCatCheckoutResolver  {

  constructor(
    private apiService: TimNatCatService,
    private nypDataService: NypDataService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.apiService.getProduct().pipe(
      filter(product => !!product),
      take(1),
      map(product => product.packets.find(p => !!p.preselected)),
      tap(packet => {
        TimNatCatCheckoutService.InsuranceInfoState$.next('realEstateInformation');
        TimNatCatCheckoutService.ChosenPackets$.next(packet ? {
          warranties: [],
          price: 0,
          packetCombo: '',
        } : undefined);
      }),
      mergeMap(packet => zip(
        this.nypDataService.downloadKenticoContent(TIM_NAT_CAT_KENTICO_SLUG, TIM_NAT_CAT_KENTICO_SLUG),
        this.apiService.getOrder(this.nypDataService.OrderCode),
      )),
      tap(([_, order]) => {
        TimNatCatCheckoutService.fieldsToRecover = order.fieldToRecover as FieldsToRecover;
      }),
      map(() => true),
      catchError(err => {
        this.nypDataService.redirectToSessionOldPath();
        return of(false);
      })
    );
  }
}
