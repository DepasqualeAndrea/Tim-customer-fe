import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable } from 'rxjs';
import { SELLER_CODE_KENTICO_NAME, SELLER_CODE_KENTICO_SLUG } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { SellerCodeServiceModule } from './seller-code.service-module';

@Injectable({ providedIn: SellerCodeServiceModule })
export class SellerCodeResolver  {

  constructor(
    private nypDataService: NypDataService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.nypDataService.downloadKenticoContent(SELLER_CODE_KENTICO_NAME, SELLER_CODE_KENTICO_SLUG);
  }
}
