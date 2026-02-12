import { Injectable } from '@angular/core';
import { Resolve,  RouterStateSnapshot,  ActivatedRouteSnapshot} from '@angular/router';
import { Observable, of, zip } from 'rxjs';
import { NetCyberBusinessService } from './api.service';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { catchError, filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { NET_CYBER_BUSINESS_KENTICO_SLUG } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { FieldsToRecover } from '@NYP/ngx-multitenant-core';
import { NetCyberBusinessCheckoutService } from './checkout.service';


@Injectable({
  providedIn: 'root'
})
export class NetCyberBusinessCheckoutResolver implements Resolve<boolean> {

    constructor(
      private apiService: NetCyberBusinessService,
      private nypDataService: NypDataService,
    ) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    
      return this.apiService.getProduct().pipe(
        filter(product => !!product),
        take(1),
        map(product => product.packets.find(p => !!p.preselected)),
        tap(packet => {
          NetCyberBusinessCheckoutService.InsuranceInfoState$.next('choicePacket');
          NetCyberBusinessCheckoutService.ChosenPackets$.next(packet ? {
            warranties: [],
            price: 0,
            packetCombo: '',
          } : undefined);
        }),
        mergeMap(packet => zip(
          this.nypDataService.downloadKenticoContent(NET_CYBER_BUSINESS_KENTICO_SLUG, NET_CYBER_BUSINESS_KENTICO_SLUG),
          this.apiService.getOrder(this.nypDataService.OrderCode),
        )),
        tap(([_, order]) => {
          NetCyberBusinessCheckoutService.fieldsToRecover = order.fieldToRecover as FieldsToRecover;
        }),
        map(() => true),
        catchError(err => {
          this.nypDataService.redirectToSessionOldPath();
          return of(false);
        })
      );



  }

}
