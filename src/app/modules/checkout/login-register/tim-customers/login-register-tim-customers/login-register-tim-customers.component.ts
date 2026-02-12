import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, DataService } from '@services';
import { RouterService } from 'app/core/services/router.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { Subscription, zip } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { RouteHash } from './route-hashes.enum';
import { NypApiService } from 'app/modules/nyp-checkout/services/api.service';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';
import { NYP_ENABLED_PRODUCTS } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';

@Component({
  selector: 'app-login-register-tim-customers',
  templateUrl: './login-register-tim-customers.component.html',
  styleUrls: ['./login-register-tim-customers.component.scss']
})
export class LoginRegisterTimCustomersComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private kenticoTranslateService: KenticoTranslateService,
    private router: Router,
    private auth: AuthService,
    private dataService: DataService,
    private routerService: RouterService,
    private nypApiService: NypApiService,
    private nypDataService: NypDataService,
    private nypInsuranceService: NypInsurancesService,
  ) { }

  hideLegacyRegistration: boolean = true;

  private subscriptions: Subscription[] = [];
  content: any

  ngOnInit() {
    this.getKenticoContent()
    this.subscribeAuthentication()
    this.setDefaultNavigationHash()
    this.overridePopStateEvent()
    if (this.dataService.Yin) localStorage.setItem('yin', JSON.stringify(this.dataService.Yin));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  private overridePopStateEvent(): void {
    window.onpopstate = () => {
      window.location.href = this.routerService.previousUrl
    }
  }

  private setDefaultNavigationHash(): void {
    if (!this.activatedRoute.snapshot.fragment) {
      this.router.navigate(['user-access'], { fragment: RouteHash.LOGIN })
    }
  }

  public showFormPage(form: string): boolean {
    return this.activatedRoute.snapshot.fragment === RouteHash[form]
  }

  public getHeaderLabel(): string {
    return this.activatedRoute.snapshot.fragment === RouteHash.REGISTER ?
      this.content['registration_header'] :
      this.content['login_header']
  }

  private getKenticoContent(): void {
    this.kenticoTranslateService.getItem<any>('access_customers').pipe(take(1)).subscribe(kenticoItem => {
      this.content = {
        background_tl: kenticoItem['background'].value[0].url,
        background_bl: kenticoItem['background'].value[1].url,
        background_tr: kenticoItem['background'].value[2].url,
        background_br: kenticoItem['background'].value[3].url,

        registration_header: kenticoItem['registration_title'].value,
        login_header: kenticoItem['access_title'].value,
        sign_in_link: kenticoItem['sign_in_link'].value,

        customers_login_form: {
          want_to_register: kenticoItem['want_to_register'].value,
          already_registered: kenticoItem['already_registered'].value,
          access_title: kenticoItem['access_title'].value,
          customer_access: kenticoItem['customer_access'].value,
          not_customer: kenticoItem['not_customer'].value,
          icon: kenticoItem['icon'].value[0].url,
          login_form: {
            password_form_label: kenticoItem['password'].value,
            password_form_placeholder: kenticoItem['password'].value,
            taxcode_form_label: kenticoItem['taxcode'].value,
            taxcode_form_placeholder: kenticoItem['taxcode'].value,
            forgot_password: kenticoItem['forgot_password'].value
          }
        },

        customers_register_form: {
          registration_successful: kenticoItem['registration_successful'].value,
          registration_unsuccessful: kenticoItem['registration_unsuccessful'].value,
        },

        ndg_migration_form: {
          taxcode_form_label: kenticoItem['taxcode'].value,
          not_customer: kenticoItem['not_customer'].value,
          migration_successful: kenticoItem['migration_successful'].value,
          migration_unsuccessful: kenticoItem['migration_unsuccessful'].value,
        }
      }
    })
  }

  public navigateToForm(routeFragment: string): void {
    this.router.navigate(['/user-access'], { fragment: RouteHash[routeFragment] })
  }

  private subscribeAuthentication(): void {
    const userChangedSubscription = this.auth.userChangedSource.subscribe(() => {
      if (this.auth.loggedIn) {
        if (!!this.dataService.Yin) {
          zip(
            this.nypInsuranceService.getProducts(),
            this.nypApiService.getProduct(),
          ).pipe(
            tap(([old_, n]) => {
              const yin = this.dataService.Yin;
              localStorage.setItem('tenant', this.dataService.Yin.tenant);

              const oldProduct = old_.products.find(p => p.product_code == yin?.product);
              if (!!oldProduct) this.dataService.setProduct(oldProduct);

              if (NYP_ENABLED_PRODUCTS.includes(yin?.product)) {
                this.nypDataService.StateAfterRedirect = 'payment';
                this.router.navigate(['/nyp-checkout', yin?.product, 'payment']);
              } else {
                this.router.navigate(['/checkout/payment', { 'order-number': this.dataService.Yin.orderNumber, 'tenant': 'yin', }]);
              }
            })
          ).subscribe();
        } else
          this.router.navigate(['/private-area/user-details'])
      }
    })
    this.subscriptions.push(userChangedSubscription);
  }

}
