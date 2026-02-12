import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AppComponent } from 'app/app.component';
import { IProduct } from 'app/modules/nyp-checkout/models/api.model';
import { NypApiService } from 'app/modules/nyp-checkout/services/api.service';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable, zip } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { NypStripeService } from '../modules/nyp-stripe/services/nyp-stripe.service';

@Injectable({ providedIn: 'root' })
export class AfterStripeGuard implements CanActivate {

  constructor(
    private router: Router,
    private nypStripeService: NypStripeService,
    private nypApiService: NypApiService,
    private nypDataService: NypDataService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const productCode = localStorage.getItem('product_code');
    return this.initializeFunnel(route.routeConfig.path, productCode, route.queryParamMap.get('session_id'));
  }

  private initializeFunnel(route: string, productCode: string, session_id: string): Observable<boolean> {
    return AppComponent.AppReady$
      .pipe(
        filter(v => v === true),
        mergeMap(() => zip(
          this.nypStripeService.wallet_session_status(session_id),
          this.nypApiService.getProduct(),
        )),
        map(([status, latestProducts]: [boolean, IProduct[]]) => {
          if (status) {
            this.nypDataService.StateAfterRedirect = 'thank-you';
            this.router.navigate(['/nyp-checkout', productCode, 'thank-you']);
          } else {
            this.nypDataService.StateAfterRedirect = 'payment';
            this.router.navigate(['/nyp-checkout', productCode, 'payment']);
          }
          return false;
        }),
      );
  }

}
