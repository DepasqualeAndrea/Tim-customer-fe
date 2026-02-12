import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TIM_PROTEZIONE_VIAGGI_KENTICO_NAME, TIM_PROTEZIONE_VIAGGI_KENTICO_SLUG, TIM_PROTEZIONE_VIAGGI_ROAMING_PRODUCT_NAME, } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TimProtezioneViaggiRoamingServiceModule } from '../tim-protezione-viaggi-roaming.service-module';
import { TimProtezioneViaggiRoamingApiService } from './api.service';

@Injectable({ providedIn: TimProtezioneViaggiRoamingServiceModule })
export class TimProtezioneViaggiRoamingPreventivatoreResolver implements Resolve<boolean> {

  constructor(
    private nypDataService: NypDataService,
    private apiService: TimProtezioneViaggiRoamingApiService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log(TIM_PROTEZIONE_VIAGGI_ROAMING_PRODUCT_NAME, 'RESOLVER-PREVENTIVATORE');
    return this.apiService.getProduct().pipe(
      switchMap(() => {
        return this.nypDataService.downloadKenticoContent(TIM_PROTEZIONE_VIAGGI_KENTICO_NAME, TIM_PROTEZIONE_VIAGGI_KENTICO_SLUG)
      }),
      map(() => true)
    );
  }
}
