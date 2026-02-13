import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TIM_FOR_SKI_GOLD_PRODUCT_NAME, TIM_FOR_SKI_KENTICO_NAME, TIM_FOR_SKI_KENTICO_SLUG, TIM_FOR_SKI_PLATINUM_PRODUCT_NAME, TIM_FOR_SKI_SILVER_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TimForSkiServiceModule } from '../tim-for-ski.service-module';

@Injectable({ providedIn: TimForSkiServiceModule })
export class TimForSkiPreventivatoreResolver  {

  constructor(
    private nypDataService: NypDataService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log(TIM_FOR_SKI_SILVER_PRODUCT_NAME, TIM_FOR_SKI_GOLD_PRODUCT_NAME, TIM_FOR_SKI_PLATINUM_PRODUCT_NAME, 'RESOLVER-PREVENTIVATORE');
    return this.nypDataService.downloadKenticoContent(TIM_FOR_SKI_KENTICO_NAME, TIM_FOR_SKI_KENTICO_SLUG).pipe(
      map(() => true)
    );
  }
}
