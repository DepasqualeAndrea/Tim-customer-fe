import {Injectable} from '@angular/core';
import Cookies from 'js-cookie';
import {GtmInitDataLayerService} from './gtm/gtm-init-datalayer.service';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  tenantOwnerCookies: Array<string> = ['fca-bank_db', 'mopar_db', 'leasys_db'];

  constructor(
    private gtmDataLayerService: GtmInitDataLayerService,
    private dataService: DataService
  ) {
  }

  public getCookie(key) {
    return Cookies.get(key);
  }

  public setCookie(key, value): void {
    Cookies.set(key, value, {expires: 180, path: '/', sameSite: 'none', secure: true});
  }

  public refuseAllCookies(): void {
    const listCookies = [
      {name: 'required', enabled: false},
      {name: 'experience', enabled: false},
      {name: 'adv', enabled: false}
    ];
    this.setCookiesUserPreferences('user-cookie-preferences', listCookies);
  }

  public acceptAllCookies(): void {
    const listCookies = [
      {name: 'required', enabled: true},
      {name: 'experience', enabled: true},
      {name: 'adv', enabled: true}
    ];
    this.setCookiesUserPreferences('user-cookie-preferences', listCookies);
  }

  public acceptNecessaryCookies(): void {
    const listCookies = [
      {name: 'required', enabled: true},
      {name: 'experience', enabled: false},
      {name: 'adv', enabled: false}
    ];
    this.setCookiesUserPreferences('user-cookie-preferences', listCookies);
  }

  public setCookiesUserPreferences(key, value): void {
    Cookies.set(key, JSON.stringify(value), {expires: 180, path: '/', sameSite: 'none', secure: true});
    this.handleUserPreferences(key);
  }

  public handleUserPreferences(key): void {
    const cookies = JSON.parse(Cookies.get(key) || "[]");
    cookies.filter((cookie) => {
      if (cookie.name === 'required') {
      } else if (cookie.name === 'experience') {
        // analytics_storage are site analysis cookies
        this.gtmDataLayerService.setAnalyticsStorageConsent(cookie.enabled);
      } else if (cookie.name === 'adv') {
        // ad_storage are marketing cookies
        this.gtmDataLayerService.setAdStorageConsent(cookie.enabled);
      }
    });
    this.hasTenantOwnerCookies(cookies);
    this.gtmDataLayerService.initGtm();
  }

  public hasTenantOwnerCookies(cookies): void {
    if (this.tenantOwnerCookies.includes(this.dataService.tenantInfo.tenant)) {
      cookies.filter((cookie) => {
        if (cookie.name === 'required') {
          this.setCookie('opncl_essential', cookie.enabled);
        } else if (cookie.name === 'experience') {
          this.setCookie('opncl_comfort', cookie.enabled);
          this.setCookie('opncl_performance', cookie.enabled);
        } else if (cookie.name === 'adv') {
          this.setCookie('opncl_advertising', cookie.enabled);
        }
      });
    }
  }

}
