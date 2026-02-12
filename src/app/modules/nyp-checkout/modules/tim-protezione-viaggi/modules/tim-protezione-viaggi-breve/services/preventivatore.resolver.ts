import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TIM_PROTEZIONE_VIAGGI_EUROPE_BREVE_PRODUCT_NAME, TIM_PROTEZIONE_VIAGGI_KENTICO_NAME, TIM_PROTEZIONE_VIAGGI_KENTICO_SLUG, TIM_PROTEZIONE_VIAGGI_WORLD_BREVE_PRODUCT_NAME, } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TimProtezioneViaggiBreveServiceModule } from '../tim-protezione-viaggi-breve.service-module';

@Injectable({ providedIn: TimProtezioneViaggiBreveServiceModule })
export class TimProtezioneViaggiBrevePreventivatoreResolver implements Resolve<boolean> {

  constructor(
    private nypDataService: NypDataService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log(TIM_PROTEZIONE_VIAGGI_EUROPE_BREVE_PRODUCT_NAME,
      TIM_PROTEZIONE_VIAGGI_WORLD_BREVE_PRODUCT_NAME, 'RESOLVER-PREVENTIVATORE');
    return this.nypDataService.downloadKenticoContent(TIM_PROTEZIONE_VIAGGI_KENTICO_NAME, TIM_PROTEZIONE_VIAGGI_KENTICO_SLUG).pipe(
      map(() => true)
    );
  }
}
