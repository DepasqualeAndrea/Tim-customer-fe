import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {
  TIM_PROTEZIONE_VIAGGI_KENTICO_NAME, TIM_PROTEZIONE_VIAGGI_KENTICO_SLUG, TIM_PROTEZIONE_VIAGGI_EUROPE_Y_ANNUALE_PRODUCT_NAME,
  TIM_PROTEZIONE_VIAGGI_WORLD_Y_ANNUALE_PRODUCT_NAME,
} from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TimProtezioneViaggiAnnualeServiceModule } from '../tim-protezione-viaggi-annuale.service-module';

@Injectable({ providedIn: TimProtezioneViaggiAnnualeServiceModule })
export class TimProtezioneViaggiAnnualePreventivatoreResolver  {

  constructor(
    private nypDataService: NypDataService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log(TIM_PROTEZIONE_VIAGGI_EUROPE_Y_ANNUALE_PRODUCT_NAME, TIM_PROTEZIONE_VIAGGI_WORLD_Y_ANNUALE_PRODUCT_NAME, 'RESOLVER-PREVENTIVATORE');
    return this.nypDataService.downloadKenticoContent(TIM_PROTEZIONE_VIAGGI_KENTICO_NAME, TIM_PROTEZIONE_VIAGGI_KENTICO_SLUG).pipe(
      map(() => true)
    );
  }
}
