import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService, DataService } from '@services';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { RouterService } from 'app/core/services/router.service';
import { take } from 'rxjs/operators';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { KenticoTranslateService } from '../../../kentico/data-layer/kentico-translate.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  userDetailsLoaded = false;
  canRegister: boolean;
  isFacebookDisabled: boolean;
  navbarLogo: string;
  accessLogo: any;
  returnUrl: string;
  redirectAfterLogin: string;
  subscriptions: Subscription[] = [];
  selectedTenants = ['santa-lucia_db'];

  constructor(
    private auth: AuthService,
    private router: Router,
    public dataService: DataService,
    private loginService: LoginService,
    private routerService: RouterService,
    private kenticoTranslateService: KenticoTranslateService,
    private componentFeaturesService: ComponentFeaturesService,
    private route: ActivatedRoute,
  ) {
    localStorage.clear();
    sessionStorage.clear();
  }

  logoImage: string;

  ngOnInit() {
    this.route.queryParams.subscribe(params => this.returnUrl = params['return'] || '/');
    this.checkLoginEnabled();
    this.checkSso();
    this.redirectAfterLogin = this.returnUrl || '/private-area/home';
    this.isFacebookDisabled = this.dataService.getIsFacebookDisabled();
    const userChangedSubscription = this.auth.userChangedSource.subscribe(() => {
      if (this.auth.loggedIn) {
        if (!this.loginService.redirectFromLocalStorage()) {
          this.router.navigate([this.redirectAfterLogin]);
        }
      }
      this.userDetailsLoaded = true;
    });
    this.subscriptions.push(userChangedSubscription);
    this.defineRegisterCondition();
    this.kenticoTranslateService.getItem<any>('navbar.logo').pipe(take(1)).subscribe(item => {
      this.logoImage = item.value[0].url;
    });
  }

  defineRegisterCondition() {
    this.componentFeaturesService.useComponent('login');
    this.componentFeaturesService.useRule('registration');
    this.canRegister = this.componentFeaturesService.isRuleEnabled();
  }

  private checkLoginEnabled() {
    if (this.dataService.getIsLoginDisabled()) {
      this.routerService.navigateBaseUrl();
    }
  }
  private checkSso() {
    const ssoRequired = (this.dataService.tenantInfo || { sso: { required: true } }).sso.required;
    const legacyLogin = (this.dataService.tenantInfo || { sso: { legacyLoginEnabled: false } }).sso.legacyLoginEnabled;
    if (ssoRequired && !legacyLogin) {
      this.routerService.navigateBaseUrl();
    }
  }
  toBeHidden() {
    return this.selectedTenants.includes(this.dataService.tenantInfo.tenant);
  }

  // for untilDestroyed(this)
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }
}
