import { CheckoutProduct } from './../checkout.model';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CheckoutStepComponent } from '../checkout-step/checkout-step.component';
import { CheckoutStepService } from '../services/checkout-step.service';
import { RequestOrder } from '@model';
import { AuthService, CheckoutService, DataService } from '@services';
import { LoginService } from 'app/modules/security/services/login.service';
import { filter, switchMap, tap, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ContainerComponent } from 'app/modules/tenants/component-loader/containers/container.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { ProductCheckoutStepService } from '../product-checkout-step-controllers/product-checkout-step.service';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent extends CheckoutStepComponent implements OnInit, OnDestroy {
  @ViewChild('checkoutLoginRegisterForm', { static: true }) checkoutLoginRegisterFormComponent: ContainerComponent;
  subscription: Subscription;
  public userType: string;
  public isFacebookDisabled: boolean;
  registerEnabled: boolean;
  ssoRequired = true;
  hideTitle: boolean;
  hideLoginCard: boolean;

  registerInputData: { redirectTo: string, product: CheckoutProduct } = { redirectTo: null, product: null };
  kenticoTitleContentId = 'access.contractor';

  checkoutProduct: CheckoutProduct;

  public hasSingleCardLayout: boolean = false;

  constructor(
    private authService: AuthService,
    private checkoutService: CheckoutService,
    private loginService: LoginService,
    checkoutStepService: CheckoutStepService,
    public dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    public componentFeaturesService: ComponentFeaturesService,
    private productCheckoutStepService: ProductCheckoutStepService,
  ) {
    super(checkoutStepService, componentFeaturesService);
  }
  attachEventAndPropertiesToRegisterFormComponent() {
    this.checkoutLoginRegisterFormComponent
      .getReference().pipe(take(1)).subscribe((componentRef) => {
        componentRef.instance.backButton = true;
        componentRef.instance.goBack.pipe(take(1)).subscribe(() => this.handlePrevStep());
      }
      );
  }

  returnToAddresPageAfterLogin() {
    const basePathCheckout = this.route.snapshot.parent.routeConfig.path === 'checkout' ?
      this.route.snapshot.parent.routeConfig.path : 'apertura';
    this.subscription = this.authService.userChangedSource.pipe(
      filter(() => this.authService.loggedIn),
    ).subscribe(() => {
      this.loginService.cancelRedirectAfterLogin();
      this.router.navigate([basePathCheckout + '/address']);
    });
  }

  private getKenticoTitleContentId() {
    const product = this.checkoutStepService.step.product;
    this.componentFeaturesService.useComponent('login-register');
    this.componentFeaturesService.useRule('title');
    const itemId: string = this.componentFeaturesService.getConstraints().get(product.code);
    if (!!itemId) {
      this.kenticoTitleContentId = itemId;
    }
  }

  ngOnInit() {
    const responseOrder = this.dataService.responseOrder;
    this.isFacebookDisabled = this.dataService.getIsFacebookDisabled();
    this.getKenticoTitleContentId();
    if (!!responseOrder && !!responseOrder.checkout_steps
      && responseOrder.checkout_steps[0] === 'address') {
      this.returnToAddresPageAfterLogin();
    } else {
      this.subscription = this.authService.userChangedSource.pipe(
        filter(() => this.authService.loggedIn),
        tap(() => this.checkoutStepService.completeStep(this.createCheckoutStepOperation(!!this.dataService.Yin ? this.dataService.yinStepLogin : undefined))),
        switchMap(() => this.checkoutStepService.checkoutStepAnnounced$),
        filter(step => step.name === 'address'),
      ).subscribe(() => {
        this.checkoutService.cancelOngoingCheckout();
        this.loginService.cancelRedirectAfterLogin();
      });
    }

    this.getComponentFeaturesRules();

    this.ssoRequired = (this.dataService.tenantInfo || { sso: { required: true } }).sso.required;

    this.checkoutProduct = this.checkoutStepService.step.product;

    const redirectUrl: string = this.router.routerState.snapshot.url.replace('login-register', 'address');
    this.registerInputData.redirectTo = redirectUrl;
    this.registerInputData.product = this.checkoutProduct;
  }

  ngAfterViewInit() {
    if (!this.hideLoginCard && !this.hasSingleCardLayout) {
      this.attachEventAndPropertiesToRegisterFormComponent();
    }
  }

  getComponentFeaturesRules() {
    this.componentFeaturesService.useComponent('login-register');
    this.componentFeaturesService.useRule('hide-title');
    this.hideTitle = this.componentFeaturesService.isRuleEnabled();
    this.componentFeaturesService.useRule('registration');
    this.registerEnabled = this.componentFeaturesService.isRuleEnabled();
    this.componentFeaturesService.useRule('hide-login-card');
    this.hideLoginCard = this.componentFeaturesService.isRuleEnabled();
    this.hasSingleCardLayout = this.getSingleCardLayoutRule();
  }

  private getSingleCardLayoutRule(): boolean {
    this.componentFeaturesService.useComponent('checkout');
    this.componentFeaturesService.useRule('single-card-login-register');
    return this.componentFeaturesService.isRuleEnabled();
  }

  createRequestOrder(): RequestOrder {
    return this.productCheckoutStepService
      .getProductCheckoutController()
      .getLoginRegisterStepController()
      .getOngoingRequestOrder();
  }

  goToNextStep() { }

  ngOnDestroy() {
    // untilDestroyed was not working here...
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.checkoutService.cancelStepProgressBarAuthFalse();
  }
}
