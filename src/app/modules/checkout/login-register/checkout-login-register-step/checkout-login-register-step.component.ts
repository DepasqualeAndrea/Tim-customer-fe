import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestOrder } from '@model';
import { AuthService, CheckoutService, DataService } from '@services';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { LoginService } from 'app/modules/security/services/login.service';
import { ContainerComponent } from 'app/modules/tenants/component-loader/containers/container.component';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Subscription } from 'rxjs';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import { CheckoutLinearStepperService } from '../../checkout-linear-stepper/services/checkout-linear-stepper.service';
import { CheckoutStepComponent } from '../../checkout-step/checkout-step.component';
import { CheckoutProduct } from '../../checkout.model';
import { ProductCheckoutStepService } from '../../product-checkout-step-controllers/product-checkout-step.service';
import { CheckoutStepService } from '../../services/checkout-step.service';

type LoginRegister = 'login' | 'register';

@Component({
    selector: 'app-checkout-login-register-step',
    templateUrl: './checkout-login-register-step.component.html',
    styleUrls: ['./checkout-login-register-step.component.scss'],
    standalone: false
})
export class CheckoutLoginRegisterStepComponent extends CheckoutStepComponent implements OnInit {

  @ViewChild('checkoutLoginRegisterForm')
  checkoutLoginRegisterFormComponent: ContainerComponent;

  subscription: Subscription;
  public userType: string;
  public isFacebookDisabled: boolean;
  registerEnabled: boolean;
  ssoRequired = true;
  hideTitle: boolean;
  hideLoginCard: boolean;
  formToShow: LoginRegister = 'register';
  checkoutProduct: CheckoutProduct;

  private showBackButton: boolean = true;
  registerFormReference: Subscription;

  registerInputData: {redirectTo: string, product: CheckoutProduct} = {redirectTo: null, product: null};
  kenticoTitleContentId = 'access.contractor';

  constructor(
    private authService: AuthService,
    private checkoutService: CheckoutService,
    private loginService: LoginService,
    checkoutStepService: CheckoutStepService,
    public dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    componentFeaturesService: ComponentFeaturesService,
    private checkoutLinearStepperService: CheckoutLinearStepperService,
    private productCheckoutStepService: ProductCheckoutStepService,
  ) {
    super(checkoutStepService, componentFeaturesService);
  }

  private attachEventAndPropertiesToRegisterFormComponent(): void {
    this.checkoutLoginRegisterFormComponent
      .getReference().pipe(untilDestroyed(this)).subscribe((componentRef) => {
        componentRef.instance.backButton = true;
        componentRef.instance.goBack.pipe(take(1)).subscribe(() => this.handlePrevStep());
      });
  }

  public triggerFormChange(formToShow: LoginRegister): void {
    if (formToShow === 'register') {
      this.attachEventAndPropertiesToRegisterFormComponent();
    }
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
    this.isFacebookDisabled = this.dataService.getIsFacebookDisabled();
    this.getKenticoTitleContentId();
    this.setupActionAfterLogin();
    this.getComponentFeaturesRules();
    this.ssoRequired = (this.dataService.tenantInfo || {sso: {required: true}}).sso.required;
    this.checkoutProduct = this.checkoutStepService.step.product;
    const redirectUrl: string = this.router.routerState.snapshot.url.replace('login-register', 'address');
    this.registerInputData.redirectTo = redirectUrl;
    this.registerInputData.product = this.checkoutProduct;
  }

  ngAfterViewInit() {
    this.checkoutLinearStepperService.componentFactories$
      .pipe(untilDestroyed(this), take(1)).subscribe(componentFactories => {
        this.createComponentsFromComponentFactories(componentFactories, this.registerInputData.product.code);
      });

    this.checkoutLinearStepperService.state$.pipe(untilDestroyed(this)).subscribe(state => {
      this.updateComponentProperties(state);
    });
    this.checkoutLinearStepperService.loadTemplateComponents();
    this.checkoutLinearStepperService.sendState();
    this.attachEventAndPropertiesToRegisterFormComponent();
  }

  private setupActionAfterLogin(): void {
    const responseOrder = this.dataService.responseOrder;
    if (!!responseOrder && !!responseOrder.checkout_steps
      && responseOrder.checkout_steps[0] === 'address') {
      this.returnToAddresPageAfterLogin();
    } else {
      this.subscription = this.authService.userChangedSource.pipe(
        filter(() => this.authService.loggedIn),
        /*tap(() => this.checkoutStepService.completeStep(this.createCheckoutStepOperation())),*/
        switchMap(() => this.checkoutStepService.checkoutStepAnnounced$),
        filter(step => step.name === 'address'),
      ).subscribe(() => {
        this.checkoutService.cancelOngoingCheckout();
        this.loginService.cancelRedirectAfterLogin();
      });
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
    this.componentFeaturesService.useRule('login');
    this.showBackButton = !this.componentFeaturesService.getConstraints().get('hide-back-button')
  }

  createRequestOrder(): RequestOrder {
    return this.productCheckoutStepService
          .getProductCheckoutController()
          .getLoginRegisterStepController()
          .getOngoingRequestOrder();
  }

  goToNextStep() { }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.checkoutService.cancelStepProgressBarAuthFalse();
  }

  public setForm(formToShow: LoginRegister): void {
    this.formToShow = formToShow;
    this.triggerFormChange(formToShow);
  }
}
