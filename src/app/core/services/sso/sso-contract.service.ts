import { NypUserService } from '@NYP/ngx-multitenant-core';
import { Directive } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { QueryParamUserData } from '@model';
import { CheckoutService } from '@services';
import { GET_TOKEN } from 'app/core/models/token-interceptor.model';
import { Stack } from 'app/shared/data-structures/stack.model';
import * as moment from 'moment';
import { AuthService } from '../auth.service';
import { RouterService } from '../router.service';
import { UserService } from '../user.service';
import { SSOProvider } from './sso-provider.interface';
@Directive()
export abstract class SSOContractService implements SSOProvider {
  urlAfterTokenRedirect: Stack<string> = new Stack<string>();
  protected tokenCode: string;
  private readonly CALLBACK_URL = 'callback?';
  private readonly CALLBACK_URL_PARAM_CODE = 'code';
  private readonly CALLBACK_URL_PARAM = 'callback?code=';
  private readonly FORCE_AUTH_PARAMETER = 'force_auth';
  private readonly LOCAL_STORAGE_REDIRECT_URL_KEY = 'redirectUrl';
  private readonly LOCAL_STORAGE_REDIRECT_EXPIRATION_KEY = 'redirectExpiryDate';
  private readonly REDIRECT_EXPIRATES_AFTER = [5, 'minutes'];
  constructor(
    protected authService: AuthService,
    protected router: Router,
    protected routerService: RouterService,
    protected userService: UserService,
    protected nypUserService: NypUserService,
    protected checkoutService: CheckoutService
  ) {
  }
  public handle(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url = window.location.href;
    const token = GET_TOKEN();
    const user = JSON.parse(localStorage.getItem('user'));
    const forceAuth = route.queryParamMap.get(this.FORCE_AUTH_PARAMETER);
    const codefromGet = route.queryParamMap.get(this.CALLBACK_URL_PARAM_CODE);
    const userData: QueryParamUserData = {
      uid: route.queryParamMap.get('userId') ? route.queryParamMap.get('userId').replace(/\s/g, '+') : null,
      firstName: route.queryParamMap.get('firstName') ? route.queryParamMap.get('firstName').replace(/\s/g, '+') : null,
      lastName: route.queryParamMap.get('lastName') ? route.queryParamMap.get('lastName').replace(/\s/g, '+') : null,
      email: route.queryParamMap.get('email') ? route.queryParamMap.get('email').replace(/\s/g, '+') : null,
      phone: route.queryParamMap.get('phone') ? route.queryParamMap.get('phone').replace(/\s/g, '+') : null,
      payment_callback_url: route.queryParamMap.get('callback') ? route.queryParamMap.get('callback').replace(/\s/g, '+') : null
    };
    let code: string;
    if (!!codefromGet) {
      code = codefromGet.replace(/\s/g, '+');
    }
    if (token && (user || {}).id) { // user is already authenticated and token is not expired
      this.checkToken(user.id, this.urlAfterTokenRedirect.get() || state.url);
    } else if (url.includes(this.CALLBACK_URL) && !!code || !!userData) { // coming back from SSO login
      this.getUserByCode(code, userData);
    } else if (forceAuth === 'true') { // coming from an external website
      this.passBySSOLogin(state.url);
    } else if (url.includes('gigya_request')) {
      code = '';
      this.getUserByCode(code, userData);
    } else if (url.includes('gigya_callback')) {
      this.gigyaCallBack(route);
    } else { // first arrival on website
      this.router.navigate(['/landing-page']);
    }
  }
  public gigyaCallBack(route: ActivatedRouteSnapshot) { }
  public getFullCodeByUrl(url: string): string {
    return this.CALLBACK_URL_PARAM_CODE + '=' + this.getCodeValue(this.CALLBACK_URL_PARAM_CODE, url);
  }
  public hasQueryParam(param: string, url: string): boolean {
    return this.getCodeValue(param, url) === '' ? false : true;
  }
  public hasCodeParam(url: string): boolean {
    return this.hasQueryParam(this.CALLBACK_URL_PARAM_CODE, url);
  }
  public getCodeValue(param: string, url: string): string {
    const regex = new RegExp('[?&]' + param + '=([^&]+).*$');
    const returnVal = url.match(regex);
    return returnVal === null ? '' : decodeURIComponent(returnVal[1].replace(/\+/g, ' '));
  }
  protected abstract getUserByCode(code: string, data?: object);
  protected redirectAfterSSOLogin(): void {
    const redirectUrl = sessionStorage.getItem(this.LOCAL_STORAGE_REDIRECT_URL_KEY);
    if (redirectUrl) {
      const productRedirectExpiry = sessionStorage.getItem(this.LOCAL_STORAGE_REDIRECT_EXPIRATION_KEY);
      if (new Date().getTime() < new Date(productRedirectExpiry).getTime()) { // redirect not expired
        console.log('redirect not expired');
        this.router.navigate([redirectUrl]);
        return;
      }
    }
    this.routerService.navigateBaseUrl();
  }
  /**
   * When coming from an external website (i.e. with ?forceAuth=true), a redirect
   * is expected after SSO
   * @param currentRelativeUrl
   */
  private passBySSOLogin(currentRelativeUrl: string) {
    // Rimuovi solo il parametro force_auth, preservando gli altri query params
    let redirectUrl = currentRelativeUrl;
    const queryIndex = currentRelativeUrl.indexOf('?');
    if (queryIndex !== -1) {
      const path = currentRelativeUrl.substring(0, queryIndex);
      const queryString = currentRelativeUrl.substring(queryIndex + 1);
      const params = new URLSearchParams(queryString);
      params.delete(this.FORCE_AUTH_PARAMETER);
      const remainingParams = params.toString();
      redirectUrl = remainingParams ? `${path}?${remainingParams}` : path;
    }
    sessionStorage.setItem(this.LOCAL_STORAGE_REDIRECT_URL_KEY, redirectUrl);
    // set an expiry date to prevent "state" bugs
    sessionStorage.setItem(this.LOCAL_STORAGE_REDIRECT_EXPIRATION_KEY, moment().add(...this.REDIRECT_EXPIRATES_AFTER).format());
    this.authService.redirectToSsoPage();
  }
  private checkToken(userId, url?: string) {
    this.nypUserService.getUserDetails(userId).subscribe(() => {
      this.authService.userTokenVerified = true;
      if (url) {
        const domainRegex: RegExp = new RegExp(/(.*\/\/)*(.*?)\//);
        url = url.replace(domainRegex, '');
        this.router.navigateByUrl(url);
      } else {
        this.routerService.navigateBaseUrl();
      }
    }, () => {
      this.authService.userTokenVerified = false;
      localStorage.clear();
      this.router.navigate(['/landing-page']);
    });
  }
  public getCodeByUrl(url: string): string {
    const startIndex: number = url.lastIndexOf(this.CALLBACK_URL_PARAM) + this.CALLBACK_URL_PARAM.length;
    const endIndex: number = (url.substring(startIndex)).indexOf('&') + startIndex;
    // endIndex will be > of startIndex if the first '&' char after code has been matched.
    // endIndex will be < if no '&' char has been found.
    if (endIndex < startIndex) {
      return url.substring(startIndex);
    } else {
      return url.substring(startIndex, endIndex);
    }
  }
}
