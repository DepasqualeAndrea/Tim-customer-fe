import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '@services';
import { ConsistencyTarget } from 'app/core/services/product-consistency.interface';
import { ProductConsistencyService } from 'app/core/services/product-consistency.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take } from 'rxjs/operators';
import { RouteHash } from '../login-register-tim-customers/route-hashes.enum';

@Component({
    selector: 'app-login-register-tim-customers-checkout',
    templateUrl: './login-register-tim-customers-checkout.component.html',
    styleUrls: ['./login-register-tim-customers-checkout.component.scss'],
    standalone: false
})
export class LoginRegisterTimCustomersCheckoutComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private kenticoTranslateService: KenticoTranslateService,
    private router: Router,
    private productConsistencyService: ProductConsistencyService,
    private dataService: DataService
  ) { }

  content: any
  hideLegacyLogin: boolean
  hideSsoLogin: boolean

  ngOnInit() {
    this.getKenticoContent()
    this.setDefaultNavigationHash()
    this.setformVisibilityBasedOnConsistency()
  }

  ngOnDestroy() { }

  private setDefaultNavigationHash(): void {
    if (!this.activatedRoute.snapshot.fragment) {
      this.activatedRoute.snapshot.fragment = RouteHash.LOGIN
      this.router.navigate(['checkout/login-register'], { preserveFragment: true })
    }
  }

  showFormPage(form: string) {
    return this.activatedRoute.snapshot.fragment === RouteHash[form]
  }

  getHeaderLabel(): string {
    return this.activatedRoute.snapshot.fragment === RouteHash.REGISTER ?
      this.content['registration_header'] :
      this.content['login_header']
  }

  getKenticoContent() {
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

  navigateToForm(routeFragment: string) {
    this.router.navigate(['/checkout/login-register'], { fragment: RouteHash[routeFragment] });
  }

  private setformVisibilityBasedOnConsistency() {
    const target = !!this.dataService.Yin
      ? ConsistencyTarget.BOTH
      : this.productConsistencyService.getProductConsistencyTargets(this.dataService.product.product_code);

    if (target === ConsistencyTarget.TIM) {
      this.hideLegacyLogin = true
    }
    if (target === ConsistencyTarget.MY_BROKER) {
      this.hideSsoLogin = true
    }
  }

}
