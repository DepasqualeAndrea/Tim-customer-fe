import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, InsurancesService, ONGOING_CHECKOUT_DATA_LOCAL_STORAGE_KEY, UserService } from '@services';
import { ContactMailPayload, ContactMailResponse } from 'app/components/public/contatti/tim/tim-customers-contacts-form/contacts-form-content.model';
import { RedirectResponse } from 'app/modules/checkout/checkout-success-payment-gup/external-redirect-action.model';
import { CHECKOUT_OPENED } from 'app/modules/checkout/services/checkout.resolver';
import { PREVENTIVATORE_URL_KEY } from 'app/modules/preventivatore/preventivatore/preventivatore.component';
import { FTTH_QUERY_PARAM } from 'app/shared/shared-queryparam-keys';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Product } from '../models/insurance.model';
import { CookieService } from './cookie.service';
import { DataService } from './data.service';
import { ModalService } from './modal.service';
import { ConsistencyResponse, ProductConsistencyService } from './product-consistency.service';
import { NypInsurancesService, NypTimBrokerCustomersService, NypUserService } from '@NYP/ngx-multitenant-core';

export enum QueryParamKey {
  SOURCE_URL = 'source',
  USER_TOKEN = 'thirdPartJwt',
}

type FtthPurchaseResponse = { user_id: number, already_purchased: boolean }

@Injectable({
  providedIn: 'root'
})
export class TimMyBrokerCustomersService {

  constructor(
    protected http: HttpClient,
    private dataService: DataService,
    private nypInsuranceService: NypInsurancesService,
    private router: Router,
    private consistencyService: ProductConsistencyService,
    private auth: AuthService,
    private cookieService: CookieService,
    private modalService: ModalService,
    protected nypUserService: NypUserService,
    protected nypTimMyBrokerCustomersService: NypTimBrokerCustomersService,
  ) {
  }

  get origin(): string {
    return window.location.origin
  }

  public redirectToMyTimAuth(urlToRedirectAfterSso: string){
    this.dataService.persistFieldToRecover();
    const state = urlToRedirectAfterSso || '/private-area/user-details';
    this.redirectToNewSsoAuth(state);
  }

  public redirectToOldSssoAuth(): void {
    const urlToRedirectAfterSso = '/preventivatore;code=ehealth-quixa-homage'
    const url = this.origin + '/api/legacy/sso/auth/tim_customers' + this.encodeStateAsQueryParam(this.origin, urlToRedirectAfterSso)
    window.location.href = url
  }

  public redirectToNewSsoAuth(urlToRedirectAfterSso: string, token: string = ''): void {
    const url =
      this.origin +
      environment.GATEWAY_URL +
      '/sso/auth/tim_customers_new' + this.encodeStateAsQueryParam(this.origin, urlToRedirectAfterSso) + this.encodeUserTokenAsQueryParam(token);
    window.location.href = url;
  }

  private encodeStateAsQueryParam(url: string, redirectUrl: string): string {
    if (!redirectUrl.includes('/')) {
      redirectUrl = '/' + redirectUrl
    }
    return `?state=${btoa(url + redirectUrl)}`
  }

  private encodeUserTokenAsQueryParam(token: string): string {
    return !!token ? `&thirdpartjwt=${token}` : '';
  }

  public restoreCheckoutState(): void {
    localStorage.removeItem(PREVENTIVATORE_URL_KEY)
    localStorage.removeItem(CHECKOUT_OPENED)
    const ongoingCheckoutData = JSON.parse(localStorage.getItem(ONGOING_CHECKOUT_DATA_LOCAL_STORAGE_KEY));
    const responseOrder = ongoingCheckoutData.responseOrder;
    this.dataService.setResponseOrder(responseOrder)
    this.dataService.setProduct(ongoingCheckoutData.product)
    this.nypInsuranceService.getProducts().pipe(
      tap(productList => {
        this.consistencyService.getProductsConsistencyMapping();
        this.consistencyService.setNoConistencyProducts(productList.products);
      }),
      switchMap(() => this.consistencyService.consistency()),
      switchMap((consistencies) => {
        const productCode = ongoingCheckoutData.product.product_code;
        const consistencyPricePayload = this.consistencyService.getPricingConsistency(productCode);
        return productCode === 'tim-my-home'
          ? this.consistencyService.priceConsistency(consistencyPricePayload)
          : of(consistencies)
      })
    ).subscribe(consistencies => this.redirectIfUserNotEligible(consistencies))
  }

  private redirectIfUserNotEligible(consistencies: ConsistencyResponse): void {
    this.consistencyService.saveConsistenciesResponse(consistencies)
    const product = this.dataService.getResponseProduct()
    const isEligible = this.consistencyService.isUserEligibleForProduct(product.product_code)
    const isProductNoConsistency = this.consistencyService.isProductNoConsistency(product.product_code)
    if (isEligible || isProductNoConsistency) {
      this.router.navigate(['checkout'])
      if (this.consistencyService.isUserLoggedInWithSso && !this.cookieService.getCookie('privacy-modal')) {
        this.auth.loadPrivacyModal();
      }
      this.showFtthModals(product);
    } else {
      this.router.navigate(['products']);
    }
  }

  private showFtthModals(product: Product): void {
    const queryParamFtth = localStorage.getItem(FTTH_QUERY_PARAM);
    localStorage.removeItem(FTTH_QUERY_PARAM);
    if (product.product_code === 'tim-my-home' && queryParamFtth) {
      this.nypUserService.getUserDetails(this.auth.currentUser.id).subscribe(data => {
        this.auth.loggedUser = data;
        if (!this.isUserFtth()) {
          this.modalService.openModalCentered('modal_ftth_tim_casa', 'FtthModal');
        } else {
          this.nypTimMyBrokerCustomersService.alreadyPurchasedFtth().subscribe(response => {
            if (!!response.already_purchased) {
              this.modalService.openModalCentered('modal_ftth_tim_myhome_already_purchased', 'FtthModal');
            }
          });
        }
      });
    }
  }

  public isUserFtth(): boolean {
    if (this.auth.loggedIn) {
      const userData = this.auth.loggedUser.data;
      return !!userData && !!userData.tim_user_type && userData.tim_user_type === 'ftth';
    }
  }

  public sendContactsMail(data: ContactMailPayload): Observable<ContactMailResponse> {
    throw new Error("sendContactsMail")
  }


  public externalGupRedirect(endpoint: string): Observable<RedirectResponse> {
    throw new Error("externalGupRedirect")
  }

}
