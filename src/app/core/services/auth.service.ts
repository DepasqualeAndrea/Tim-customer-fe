import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@model';
import { NypUserService } from '@NYP/ngx-multitenant-core';
import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject } from 'rxjs';
import { catchError, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { KenticoTranslateService } from '../../modules/kentico/data-layer/kentico-translate.service';
import { GET_TOKEN, SET_TOKEN } from '../models/token-interceptor.model';
import { AdobeAnalyticsDatalayerService } from './adobe_analytics/adobe-init-datalayer.service';
import { AuthStatus } from './auth-status.interface';
import { CheckTenantAndUserType } from './check-tenant-user-type';
import { DataService } from './data.service';
import { ModalService } from './modal.service';
import { RouterService } from './router.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService implements AuthStatus {

  userChangedSource = new ReplaySubject<User>(1);
  loggedIn = false;
  redirectUrl: string;
  currentUser: User = new User();
  loggedUser: User = new User();
  userTokenVerified = false;

  constructor(
    private router: Router,
    private kenticoTranslateService: KenticoTranslateService,
    private toastrService: ToastrService,
    private dataService: DataService,
    private routerService: RouterService,
    private modalService: ModalService,
    protected nypUserService: NypUserService,
    private httpClient: HttpClient,

  ) {
    let token = null;
    const loadToken = this.loadTokenFromLocalStorageOnNewInstance();

    if (loadToken) token = GET_TOKEN();
    else this.removeUserInfo();

    if (token) this.setCurrentUserFromLocalStorage();
    else this.userChangedSource.next(null);
  }

  loadTokenFromLocalStorageOnNewInstance() {
    const url = window.location.href;
    if (url.includes('/users/auth/imagin/callback')) {
      return false;
    }
    if (!url.includes('/users/auth/intesa/callback') && !url.includes('/users/auth/cse/callback')
      && !url.includes('/users/auth/fca/callback') && !url.includes('/users/auth/fca/saml-callback')
      && !url.includes('/users/auth/tim/callback') && !url.includes('/users/auth/tim_customers/callback')
      && !url.includes('/users/auth/banca_sella/callback') && !url.includes('/users/auth/banco_desio/callback')
    ) {
      return true;
    }
    if (!this.dataService.tenantInfo.sso) {
      return true;
    }
    if (!this.dataService.tenantInfo.sso.required) {
      return true;
    }
    if (this.dataService.tenantInfo.sso.legacyLoginEnabled) {
      return true;
    }
    return false;
  }

  setCurrentUserFromLocalStorage() {
    const savedUsr = localStorage.getItem('user');
    if (savedUsr) {
      this.setCurrentUser(JSON.parse(savedUsr));
    }
  }

  login(emailAndPassword): Observable<any> {
    let toastMessage;
    return this.kenticoTranslateService.getItem('toasts.user_not_confirmed').pipe(
      tap(message => toastMessage = message),
      mergeMap(() => this.nypUserService.login(emailAndPassword)),
      tap(token => SET_TOKEN(token)),
      map(res => {
        this.setCurrentUser(undefined);
        return this.loggedIn = true;
      })
    );
  }

  performLoginSuccess(token: string, session = false) {
    SET_TOKEN(token)
    this.setCurrentUser(token);
    return this.loggedIn = true;
  }

  removeUserInfo() {
    localStorage.clear();
    this.loggedIn = false;
    this.currentUser = new User();
    this.userTokenVerified = false;
    this.loggedUser = new User();
  }

  logout(internalLoginPage?: string) {
    localStorage.clear();
    sessionStorage.clear();
    this.nypUserService.logout().subscribe(() => {
      this.removeUserInfo();
      this.redirectToLoginPage(internalLoginPage);
    });
  }

  public reloadCurrentUserInfo() {
    const userId = this.loggedUser.id;
    this.nypUserService.getUserDetails(userId).subscribe(data => {

      // If birth places are provided, lock the anag. Similar to solidus, but made on fe.
      if ([data.address.birth_country?.name, data.address.birth_state?.name, data.address.birth_city?.name,].every(v => !!v)) data.locked_anagraphic = true;

      this.loggedUser = { data, ...data };

      this.loggedIn = data && !!data.email;
      this.userChangedSource.next(data);
      localStorage.setItem('user', JSON.stringify(this.currentUser));
    }, () => this.userChangedSource.next(null),);
  }

  redirectToSsoPage() {
    window.location.assign(this.dataService.apiUrl + this.dataService.tenantInfo.sso.url);
  }

  private redirectToLoginPage(_internalLoginPage) {
    if (_internalLoginPage) {
      this.router.navigate([_internalLoginPage], { queryParamsHandling: 'preserve' });
    } else {
      this.routerService.navigateBaseUrl();
    }
  }

  private setCurrentUser(decodedUser) {
    this.setCurrentUserObs(decodedUser).subscribe(
      { error: () => this.userChangedSource.next(null) }
    );
  }

  public setCurrentUserObs(decodedUser = undefined): Observable<any> {
    return this.nypUserService.getUserDetails(decodedUser).pipe(tap(data => {
      const tenantUser = this.dataService.getTenantInfo().user;
      const tenantType = !!tenantUser && !!tenantUser.user_type ? tenantUser.user_type : undefined;
      const userValid = CheckTenantAndUserType.check(tenantType, data);
      if (!userValid) {
        this.userTypeIsNotValidForTenant();
        return;
      }

      // If birth places are provided, lock the anag. Similar to solidus, but made on fe.
      if ([data.address.birth_country?.name, data.address.birth_state?.name, data.address.birth_city?.name,].every(v => !!v)) data.locked_anagraphic = true;
      this.currentUser = { data: data, ...data };
      this.loggedUser = { data: data, ...data }; // TODO: non mi piace questo
      this.loggedIn = data && !!data.email;
      this.userChangedSource.next(data);
      localStorage.setItem('user', JSON.stringify(this.currentUser));
    }));
  }

  private userTypeIsNotValidForTenant() {
    this.logout('login');
    this.kenticoTranslateService.getItem<any>('toasts.invalid_tenant').pipe(take(1)).subscribe(
      toastMessage => this.toastrService.error(toastMessage.value)
    );
  }


  ndgLogin(ndgAndPassword): Observable<any> {
    let toastMessage;

    return this.kenticoTranslateService.getItem('toasts.user_not_confirmed').pipe(
      switchMap(message => {
        toastMessage = message;
        return this.nypUserService.ndgLogin(ndgAndPassword).pipe(
          tap(token => {
            SET_TOKEN(token);
            this.performLoginSuccess(token, true);
          }),
          tap(() => AdobeAnalyticsDatalayerService.ADOBE_LOG({
            'loginId': ndgAndPassword.user.ndg_code,
            'loginEventType': 'customer_id'
          }, 'attachIdentity')),
          catchError(error => {
            throw ({ message: toastMessage, status: error.status })
          })
        );
      })
    );
  }
  loadPrivacyModal() {
    this.modalService.openModalCentered('modal_privacy', 'PrivacyModal');
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  getLanguage() {
    let language = 'it_IT'
    if (!!localStorage.getItem('language')) {
      language = localStorage.getItem('language') as string;
    }
    return language;
  }

  public getHeaders(): HttpHeaders {
    return new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', `Bearer ${this.getToken()}`)
      .set('x-tenant-language', this.getLanguage());
  }

  public getUser(): Observable<any> {
    const headers: HttpHeaders = this.getHeaders();
    return this.httpClient.get('/api/latest/customer/token', {headers});
  }

  public getNypUser(): Observable<any> {
    const headers: HttpHeaders = this.getHeaders();
    return this.httpClient.get('/nyp/getUserDetails', {headers});
  }

  public nypLogin(body): Observable<any> {
    return this.httpClient.post('/nyp/login', body);
  }

}
