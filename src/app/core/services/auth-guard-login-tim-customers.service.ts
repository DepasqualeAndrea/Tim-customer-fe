import { NypCheckoutService, NypIadTokenService, NypInsurancesService } from '@NYP/ngx-multitenant-core';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AppComponent } from 'app/app.component';
import { CONSTANTS } from 'app/app.constants';
import { NYP_ENABLED_PRODUCTS } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypApiService } from 'app/modules/nyp-checkout/services/api.service';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable, of, zip } from 'rxjs';
import { filter, mergeMap, tap } from 'rxjs/operators';
import { REMOVE_TOKEN, SET_TOKEN } from '../models/token-interceptor.model';
import { AdobeAnalyticsDatalayerService } from './adobe_analytics/adobe-init-datalayer.service';
import { AuthGuardLogin } from './auth-guard-login.service';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { SSOService } from './sso/sso.service';
import { TimMyBrokerCustomersService } from './tim-my-broker-customers.service';

@Injectable()
export class AuthGuardLoginTimCustomers extends AuthGuardLogin {
  // Per testare da locale
  // localhost:4200/users/auth/tim_customers/callback?code=ef316ec8-c896-4a6d-9ddf-46b971ffd65a&state=aHR0cHM6Ly93d3cudGltbXlicm9rZXIuaXQvWS0wMTYxNzcy
  // To make login without sso, but just trying the path of this service use the indications below:
  // In getUserByCode, replace 
  // - this.nypIadToken.accessToken(code)
  // with
  // + this.authService.ndgLogin({ user: { ndg_code: environment.username, password: environment.password } })
  constructor(
    public authService: AuthService,
    protected router: Router,
    protected dataService: DataService,
    protected ssoService: SSOService,
    private nypIadToken: NypIadTokenService,
    private nypDataService: NypDataService,
    private nypApiService: NypApiService,
    private nypInsuranceService: NypInsurancesService,
    private timMyBrokerCustomersService: TimMyBrokerCustomersService
  ) {
    super(authService, router, dataService, ssoService);
  }

  private readonly CALLBACK_URL_PARAM_CODE = 'code';
  private readonly CALLBACK_URL_PARAM_STATE = 'state';
  private readonly CHECKOUT_ORDER_IDENTIFIER = 'Y';
  private stateFromGet: string;
  private decodedState: string;

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    REMOVE_TOKEN();
    this.authService.userTokenVerified = false;
    // To redirect user after sso to checkout we should add this line and forse redirect to landing page.
    // this.ssoTimCustomers.urlAfterTokenRedirect.push(this.dataService.tenantInfo.baseUrl);
    const codeFromGet = route.queryParamMap.get(this.CALLBACK_URL_PARAM_CODE);
    this.stateFromGet = route.queryParamMap.get(this.CALLBACK_URL_PARAM_STATE);
    let code: string;
    if (!!codeFromGet) {
      code = codeFromGet.replace(/\s/g, '+');
    }
    this.decodedState = atob(this.stateFromGet);
    this.getUserByCode(code);
    return of(this.authService.loggedIn);
  }

  private getUserByCode(code: string): void {
    this.nypIadToken.accessToken(code)
      .pipe(
        tap((res: string) => {
          SET_TOKEN(res);
          this.dataService.setResponseOrder(JSON.parse(localStorage.getItem('responseOrderStepAddress')));
          NypCheckoutService.version = localStorage.getItem('version');

          this.dataService.loadFieldToRecover();

          AppComponent.setToken(res, 'user');
        }),
        mergeMap(() => this.authService.setCurrentUserObs()),
        tap(() => AdobeAnalyticsDatalayerService.ADOBE_LOG({
          'loginId': this.authService.currentUser.email,
          'loginEventType': 'customer_id'
        }, 'attachIdentity')),
        mergeMap(() => {
          return AppComponent.AppReady$
            .pipe(
              filter(v => v === true),
              mergeMap(() => zip(
                this.nypInsuranceService.getProducts(),
                this.nypApiService.getProduct(),
              )),
              tap(([old_, n]) => {
                const oldProduct = old_.products.find(p => p.product_code == this.dataService.Yin?.product);
                if (!!oldProduct) this.dataService.setProduct(oldProduct);

                if (!!this.dataService.Yin) this.redirectAfterSSOLoginYIN();
                else this.redirectAfterSSOLogin();
              }),
            )
        })
      )
      .subscribe(
        () => { },
        (err) => {
          if (err.status === 403) {
            this.router.navigate(['/not-confirmed']);
          } else {
            const queryParams = {};
            queryParams[CONSTANTS.SSO_UNEXPECTED_ERROR_PARAM] = true;
            this.router.navigate(['/not-confirmed'], { queryParams });
          }
        });
  }

  private redirectAfterSSOLogin() {
    const productCode = localStorage.getItem('product_code');

    if (NYP_ENABLED_PRODUCTS.includes(productCode)) {
      this.nypDataService.StateAfterRedirect = 'address';
      this.router.navigate(['/nyp-checkout', productCode, 'address']);
    } else {
      const lastUrlSegment: string = this.decodedState.split('/').pop();
      if (!!this.stateFromGet) {
        if (this.isCheckoutOrder(lastUrlSegment)) {
          this.timMyBrokerCustomersService.restoreCheckoutState();
        } else {
          window.location.href = this.decodedState;
        }
      }
    }
  }

  private redirectAfterSSOLoginYIN() {
    const yin = this.dataService.Yin;

    if (NYP_ENABLED_PRODUCTS.includes(yin.product)) {

      localStorage.setItem('product_code', yin.product);
      localStorage.setItem('id_order', yin.orderNumber);

      this.nypDataService.StateAfterRedirect = 'payment';
      this.router.navigate(['/nyp-checkout', yin.product, 'payment', { 'order-number': yin.orderNumber, 'tenant': 'yin', }]);
    } else {
      if (!!this.stateFromGet) {
        localStorage.setItem('tenant', yin.tenant);
        this.router.navigate(['/checkout/payment', { 'order-number': yin.orderNumber, 'tenant': 'yin', }]);
      }
    }
  }

  private isCheckoutOrder(urlSegment: string): boolean {
    return urlSegment.startsWith(this.CHECKOUT_ORDER_IDENTIFIER);
  }
}
