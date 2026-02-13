import { NypUserService } from '@NYP/ngx-multitenant-core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@model';
import { AuthService, CheckoutService, DataService, UserService } from '@services';
import { SET_TOKEN } from 'app/core/models/token-interceptor.model';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { RouterService } from 'app/core/services/router.service';
import { RouteHash } from 'app/modules/checkout/login-register/tim-retirees/login-register-tim-retirees/route-hashes.enum';
import { CHECKOUT_OPENED } from 'app/modules/checkout/services/checkout.resolver';
import { PREVENTIVATORE_URL_KEY } from 'app/modules/preventivatore/preventivatore/preventivatore.component';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { take } from 'rxjs/operators';
import { KenticoTranslateService } from '../../../kentico/data-layer/kentico-translate.service';
import { LoginService } from '../../services/login.service';

@Component({
    selector: 'app-activate',
    templateUrl: './activate.component.html',
    styleUrls: ['../common/login-register-forms.scss', './activate.component.scss'],
    standalone: false
})
export class ActivateComponent implements OnInit, OnDestroy {
  errorMessage: boolean;
  userFromConfirm: User;
  userConfirmSuccess = false;

  logoCodename: string = 'navbar.logo_activate'
  logoImage: string;

  constructor(
    private userService: UserService,
    protected nypUserService: NypUserService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private routerService: RouterService,
    private loginService: LoginService,
    public dataService: DataService,
    private checkoutService: CheckoutService,
    private router: Router,
    private kenticoTranslateService: KenticoTranslateService,
    private componentFeaturesService: ComponentFeaturesService
  ) { }

  ngOnInit() {
    this.getAltLogo()

    this.userConfirmSuccess = true;

    this.kenticoTranslateService.getItem<any>(this.logoCodename).pipe(take(1)).subscribe(item => {
      this.logoImage = item.images[0].url;
    });
  }

  private getAltLogo() {
    this.componentFeaturesService.useComponent('activate')
    this.componentFeaturesService.useRule('alt-logo')
    if (this.componentFeaturesService.isRuleEnabled()) {
      this.logoCodename = this.componentFeaturesService.getConstraints().get('codename')
    }
  }

  checkRedirectToCheckout() {
    localStorage.removeItem(CHECKOUT_OPENED);
    const userProperties = this.dataService.getTenantUserProperties();
    if (!!userProperties && !!userProperties.redirectToCheckoutAfterAccountActivation) {
      const redirectOrder = this.checkoutService.getQuotatorOrder();
      if (!!redirectOrder) {
        this.cleanLocalStorage();
        this.router.navigate(['/preventivatore', redirectOrder], { skipLocationChange: true });
        return true;
      }
    }
  }

  cleanLocalStorage() {
    this.checkoutService.cancelOngoingCheckout();
    localStorage.removeItem(PREVENTIVATORE_URL_KEY);
    localStorage.removeItem(CHECKOUT_OPENED);
  }

  login() {
    SET_TOKEN(this.userFromConfirm.token);
    this.nypUserService.getUserDetails(this.userFromConfirm.id).pipe(take(1)).subscribe(
      user => {
        const loginUser = Object.assign(this.userFromConfirm, user);
        this.authService.userChangedSource.pipe(untilDestroyed(this)).subscribe((userChanged) => {
          if (!!userChanged) {
            const redirect = this.checkRedirectToCheckout();
            this.checkoutService.setRedirectFromUserActivation();
            if (!redirect && !this.loginService.redirectFromLocalStorage()) {
              this.routerService.navigateBaseUrl();
            }
          }
        });
        this.authService.performLoginSuccess(loginUser);
      }
    );
  }

  redirectToLogin() {
    localStorage.removeItem(CHECKOUT_OPENED);
    this.router.navigate(['user-access'], { fragment: RouteHash.LOGIN });
  }

  ngOnDestroy(): void {
  }

}
