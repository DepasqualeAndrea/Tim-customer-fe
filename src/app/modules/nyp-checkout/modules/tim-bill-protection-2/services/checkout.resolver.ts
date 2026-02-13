import { FieldsToRecover } from '@NYP/ngx-multitenant-core';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TIM_BILL_PROTECTION_2_KENTICO_NAME, TIM_BILL_PROTECTION_2_KENTICO_SLUG, TIM_BILL_PROTECTION_2_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable, of, zip } from 'rxjs';
import { catchError, filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { TimBillProtectionServiceModule } from '../tim-bill-protection.service-module';
import { TimBillProtectionApiService } from './api.service';
import { TimBillProtectionCheckoutService } from './checkout.service';

@Injectable({ providedIn: TimBillProtectionServiceModule })
export class TimBillProtectionCheckoutResolver  {

  constructor(
    private apiService: TimBillProtectionApiService,
    private nypDataService: NypDataService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log(TIM_BILL_PROTECTION_2_PRODUCT_NAME, 'RESOLVER');
    return this.apiService.getProduct().pipe(
      filter(product => !!product),
      take(1),
      map(product => product.packets.find(p => !!p.preselected)),
      tap(packet => {
        TimBillProtectionCheckoutService.InsuranceInfoState$.next('choice-packet');
        TimBillProtectionCheckoutService.ChosenPacketsName = [];
        TimBillProtectionCheckoutService.ChosenPackets$.next(packet ? {
          warranties: packet?.warranties?.map(warranty => ({ code: warranty.id, label: warranty.translationCode, checked: warranty.preselected, price: warranty.insurancePremium })),
          price: packet?.packetPremium,
          packetCombo: packet?.sku,
        } : undefined);
      }),
      mergeMap(packet => zip(
        this.nypDataService.downloadKenticoContent(TIM_BILL_PROTECTION_2_KENTICO_NAME, TIM_BILL_PROTECTION_2_KENTICO_SLUG),
        this.apiService.getOrder(this.nypDataService.OrderCode),
      )),
      tap(([_, order]) => {
        TimBillProtectionCheckoutService.fieldsToRecover = order.fieldToRecover as FieldsToRecover;
      }),
      map(() => true),
      catchError(err => {
        this.nypDataService.redirectToSessionOldPath();
        return of(false);
      })
    );
  }
}
