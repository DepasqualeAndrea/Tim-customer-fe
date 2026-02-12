import { NypUserService } from '@NYP/ngx-multitenant-core';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { CheckoutService, DataService, JwtHelperService } from '@services';
import { CONSTANTS } from 'app/app.constants';
import { SET_TOKEN } from 'app/core/models/token-interceptor.model';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { RouterService } from '../router.service';
import { UserService } from '../user.service';
import { SSOContractService } from './sso-contract.service';

declare let gigya: any;

@Injectable({ providedIn: 'root' })
export class SSOGigyaService extends SSOContractService {

  private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document,
    protected authService: AuthService,
    protected router: Router,
    protected routerService: RouterService,
    protected userService: UserService,
    protected nypUserService: NypUserService,
    private jwtHelper: JwtHelperService,
    private dataService: DataService,
    protected checkoutService: CheckoutService
  ) {
    super(authService, router, routerService, userService, nypUserService, checkoutService);
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  script: any;

  protected getUserByCode(code: string) {
    console.log('chiamata a gigya');

    this.loadGigyaScript();

    this.script.onload = () => {

      this.getJWTGigya().subscribe((respGetJWT: any) => {

        if (respGetJWT.status === 'FAIL') {
          this.gigyaSsoLogin();
        } else {
          //let gigyaInfo = this.jwtHelper.decodeToken(response.id_token);

          this.userService.ssoAuthGigya(respGetJWT.id_token).subscribe((res) => {
            SET_TOKEN(res.token);
            this.nypUserService.getUserDetails(res.id).subscribe(
              data => {
                delete res.token;
                delete respGetJWT.id_token;
                this.authService.currentUser = res;
                this.authService.loggedUser = data;
                this.authService.loggedIn = true;
                localStorage.setItem('user', JSON.stringify(res));
                this.authService.userTokenVerified = true;
                this.authService.userChangedSource.next(data);
                this.redirectAfterSSOLogin();
              });
          }, (err) => {
            if (err.status === 403) {
              this.router.navigate(['/not-confirmed']);
            } else {
              console.log(err);
              const queryParams = {};
              queryParams[CONSTANTS.SSO_UNEXPECTED_ERROR_PARAM] = true;
              this.router.navigate(['/not-confirmed'], { queryParams });
            }
          });
        }
      });
    };
  }

  public gigyaCallBack(route: ActivatedRouteSnapshot) {

    const gigUid: string = route.queryParamMap.get('gig_uid');
    const gigUidSig: string = route.queryParamMap.get('gig_uidSig');
    const gigSigTimestamp: string = route.queryParamMap.get('gig_sigTimestamp');
    console.log('Risposta da gigya: ', gigUid, ' - ', gigUidSig, ' - ', gigSigTimestamp);

    if (gigUid !== null && gigUid !== '' && gigUidSig !== null && gigUidSig !== '' && gigSigTimestamp !== null && gigSigTimestamp !== '') {
      this.loadGigyaScript();

      this.script.onload = () => {

        this.getJWTGigya().subscribe((respGetJWT: any) => {
          if (respGetJWT.status === 'FAIL') {
            this.gigyaSsoLogin();
          } else {
            //let gigyaInfo = this.jwtHelper.decodeToken(response.id_token);

            this.userService.ssoAuthGigya(respGetJWT.id_token).subscribe((res) => {
              SET_TOKEN(res.token);
              this.nypUserService.getUserDetails(res.id).subscribe(
                data => {
                  delete res.token;
                  delete respGetJWT.id_token;
                  this.authService.currentUser = res;
                  this.authService.loggedUser = data;
                  this.authService.loggedIn = true;
                  localStorage.setItem('user', JSON.stringify(res));
                  this.authService.userTokenVerified = true;
                  this.authService.userChangedSource.next(data);
                  this.redirectAfterSSOLogin();
                });
            }, (err) => {
              if (err.status === 403) {
                this.router.navigate(['/not-confirmed']);
              } else {
                console.log(err);
                const queryParams = {};
                queryParams[CONSTANTS.SSO_UNEXPECTED_ERROR_PARAM] = true;
                this.router.navigate(['/not-confirmed'], { queryParams });
              }
            });
          }

        });
      };

    }
  }

  private loadGigyaScript() {
    if (!this.document.getElementById('gigya')) {
      this.script = this.renderer.createElement('script');
      this.script.type = 'text/javascript';
      this.script.src = 'https://cdns.eu1.gigya.com/js/gigya.js?apikey=' + this.dataService.tenantInfo.ssoGigyaApikey;
      this.script.id = 'gigya';
      this.renderer.appendChild(this.document.head, this.script);
    }
  }

  private getJWTGigya() {
    return new Observable((observer) => {
      gigya.accounts.getJWT({
        fields: 'firstName,lastName,country,email,phones,data.crmID,data.VAT,locale,UID',
        callback: (response) => {
          console.log('getJwt: ', response);
          observer.next(response);
        }
      });
    });
  }

  private gigyaSsoLogin() {
    console.log('gigyaSsoLogin');
    gigya.sso.login({
      authFlow: 'redirect',
      redirectURL: window.location.origin + '/users/auth/fca/sso-gigya/gigya_callback',
      context: {
        target: this.dataService.tenantInfo.ssoGigyaUrl + window.location.origin + '/users/auth/fca/sso-gigya/gigya_callback',
        fcaSegment: 'Italia'
      }
    });
  }

}
