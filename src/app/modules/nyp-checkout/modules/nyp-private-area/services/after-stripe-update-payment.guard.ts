import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AppComponent } from 'app/app.component';
import { Observable, of, zip } from 'rxjs';
import { delay, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NypStripeService } from '../../nyp-stripe/services/nyp-stripe.service';
import { NypApiService } from 'app/modules/nyp-checkout/services/api.service';
import { LoaderService } from 'app/core/services/loader.service';
import { NypConfirmChangePaymentMethodComponent } from '../modal/nyp-confirm-change-payment-method/nyp-confirm-change-payment-method.component';

@Injectable({
  providedIn: 'root'
})
export class AfterStripeUpdatePaymentGuard  {

  constructor(
    private router: Router,
    protected modalService: NgbModal,
    private nypStripeService: NypStripeService,
    private nypApiService: NypApiService,
    private loaderService: LoaderService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const sessionId = route.queryParamMap.get('session_id');
    const orderCode = route.queryParamMap.get('order');
    console.log(`payment_updated -> order: ${orderCode}; session: ${sessionId}.`)

    return AppComponent.AppReady$
      .pipe(
        filter(v => v === true),
        delay(500),
        tap(() => this.loaderService.start('block-ui-main')),
        mergeMap(() => zip(
          this.nypApiService.getPolicies().pipe(map(policies => policies.find(p => p.orderCode == orderCode))),
          of(true), // this.nypStripeService.payment_updated_session_status(sessionId),
        )),
        switchMap(([policy, sessionStatus]) => {
          return this.router.navigate(['/private-area/my-policies/detail'], { state: { policy: policy, sessionStatus: sessionStatus } })
            .then(() => this.openModalAfterRedirect())
            .then(() => {
              this.enableScrolling();
              return true;
            })
            .finally(() => {
              this.loaderService.stop('block-ui-main');
              this.loaderService.reset('block-ui-main');
            });
        })
      );
  }

  private openModalAfterRedirect() {
    const modalRefSuccess = this.modalService.open(NypConfirmChangePaymentMethodComponent, {
      size: 'sm',
      backdropClass: 'backdrop-class ',
      windowClass: 'modal-window'
    });
  }
  private enableScrolling(): void {
    document.body.style.overflow = 'auto';
  }
}
