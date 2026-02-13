import { AfterViewInit, Component, ComponentFactory, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router, NavigationEnd } from '@angular/router';
import { CheckoutLinearStepperService } from './services/checkout-linear-stepper.service';
import { StepStatusChanged } from './services/step-status-changed.model';
import { CheckoutStepService } from '../services/checkout-step.service';
import { ResponseOrder } from '@model';
import { DataService } from '@services';
import { CheckoutRouteInput } from '../checkout-routing.model';
import { take } from 'rxjs/operators';
import { CheckoutComponentFactory } from './services/component/checkout-component-factory.model';
import { CheckoutLinearStepperBaseComponent } from './components/checkout-linear-stepper-base/checkout-linear-stepper-base.component';
import { CheckoutLinearStepperGenericState } from './services/state/checkout-linear-stepper-generic-state.model';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { PREVENTIVATORE_URL_KEY } from '../../preventivatore/preventivatore/preventivatore.component';
import { CHECKOUT_OPENED } from '../services/checkout.resolver';
import { LoginService } from '../../security/services/login.service';
import { AllowedParams } from 'app/components/public/internal-redirect/redirect.interfaces';

@Component({
    selector: 'app-checkout-linear-stepper',
    templateUrl: './checkout-linear-stepper.component.html',
    styleUrls: ['./checkout-linear-stepper.component.scss'],
    standalone: false
})
export class CheckoutLinearStepperComponent implements OnDestroy, OnInit, AfterViewInit {
  @ViewChild('header', { read: ViewContainerRef, static: true }) headerContainer;
  @ViewChild('completed_steps', { read: ViewContainerRef, static: true }) completedStepsContainer;
  @ViewChild('uncompleted_steps', { read: ViewContainerRef, static: true }) uncompletedStepsContainer;
  @ViewChild('cost_items_details', { read: ViewContainerRef, static: true }) costItemsDetailContainer;
  @ViewChild('cost_items_details_shopping_cart', { read: ViewContainerRef, static: true }) shoppingCartDetailContainer;

  private headerComponent: CheckoutLinearStepperBaseComponent;
  private completedStepsComponent: CheckoutLinearStepperBaseComponent;
  private costItemDetailsComponent: CheckoutLinearStepperBaseComponent;
  private uncompletedComponent: CheckoutLinearStepperBaseComponent;
  private shoppingCartDetailComponent: CheckoutLinearStepperBaseComponent;

  constructor(private router: Router,
    private checkoutLinearStepperService: CheckoutLinearStepperService,
    private route: ActivatedRoute,
    public checkoutStepService: CheckoutStepService,
    public dataService: DataService,
    private scrollToService: ScrollToService,
    private loginService: LoginService) { }

  public state: any;
  checkoutLayout: string;

  ngOnInit() {
    //const productCodeParam = (this.route.snapshot.queryParams as AllowedParams).product;
    //localStorage.setItem('product_code', productCodeParam);

    this.checkoutLinearStepperService.state$.pipe(untilDestroyed(this)).subscribe(state => {
      this.state = state;
      this.updateComponentProperties(state);
    });
    this.checkoutLinearStepperService.stepStatusChanged$.pipe(untilDestroyed(this)).subscribe((stepStatusChanged) => this.onStepStatusChanged(stepStatusChanged));
    this.checkoutLinearStepperService.responseOrderReceived$.pipe(untilDestroyed(this)).subscribe(responseOrder => this.onResponseOrderReceived(responseOrder));
    this.router.events.pipe(untilDestroyed(this)).subscribe(evt => {
      if (evt instanceof NavigationStart && evt.navigationTrigger === 'popstate' && evt.url.startsWith('/checkout')) {
        this.checkoutLinearStepperService.onInitStep(evt.url.slice(evt.url.lastIndexOf('/') + 1), this.state.resolvedSteps);
      }
      if (evt instanceof NavigationEnd) {
        this.checkoutLinearStepperService.setCurrentUrl(evt.url);
      }
    });
    const input: CheckoutRouteInput = this.route.snapshot.data.input;
    this.checkoutLinearStepperService.createCheckoutFromRouteInput(input);
    this.checkoutLayout = this.dataService.tenantInfo.checkout.layout;
  }

  ngAfterViewInit() {
    this.checkoutLinearStepperService.componentFactories$
      .pipe(untilDestroyed(this), take(1)).subscribe(componentFactories => {
        this.createComponentsFromComponentFactories(componentFactories);
      });
    this.checkoutLinearStepperService.loadTemplateComponents();
    this.checkoutLinearStepperService.sendState();
  }

  ngOnDestroy(): void {
    this.checkoutLinearStepperService.clearCheckout();

    this.headerComponent = undefined;
    this.completedStepsComponent = undefined;
    this.costItemDetailsComponent = undefined;
    this.uncompletedComponent = undefined;
    this.shoppingCartDetailComponent = undefined;


    this.loginService.cancelRedirectAfterLogin();
    localStorage.removeItem(PREVENTIVATORE_URL_KEY);
    localStorage.removeItem(CHECKOUT_OPENED);
    localStorage.removeItem('historyBuildingData');

  }

  private onResponseOrderReceived(responseOrder: ResponseOrder) {
    this.dataService.setResponseOrder(responseOrder);
  }

  private onStepStatusChanged(stepStatusChanged: StepStatusChanged) {
    this.router.navigate([stepStatusChanged.stepName], { relativeTo: this.route, replaceUrl: stepStatusChanged.replaceUrl })
      .then((success) => {
        this.checkoutStepService.handleGtm();
        this.triggerScrollTo();
        return success;
      });
  }

  private createComponentsFromComponentFactories(componentFactories: CheckoutComponentFactory[]) {
    componentFactories.forEach(componentFactory => {
      switch (componentFactory.containerName) {
        case 'header':
          this.headerComponent = this.createComponentInView(this.headerContainer, componentFactory.componentFactory);
          return;
        case 'completed_steps':
          this.completedStepsComponent = this.createComponentInView(this.completedStepsContainer, componentFactory.componentFactory);
          return;
        case 'uncompleted_steps':
          this.uncompletedComponent = this.createComponentInView(this.uncompletedStepsContainer, componentFactory.componentFactory);
          return;
        case 'cost_items_details':
          this.costItemDetailsComponent = this.createComponentInView(this.costItemsDetailContainer, componentFactory.componentFactory);
          return;
        case 'cost_items_details_shopping_cart':
          this.shoppingCartDetailComponent = this.createComponentInView(this.shoppingCartDetailContainer, componentFactory.componentFactory);
          return;
        default:
          return;
      }
    });
  }

  private createComponentInView(view: ViewContainerRef
    , factory: ComponentFactory<CheckoutLinearStepperBaseComponent>): CheckoutLinearStepperBaseComponent {
    const componentRef = view.createComponent(factory);
    return componentRef.instance;
  }

  private updateComponentProperties(state: CheckoutLinearStepperGenericState) {
    if (this.costItemDetailsComponent) {
      this.costItemDetailsComponent.data = state.cost_item;
    }
    if (this.uncompletedComponent) {
      this.uncompletedComponent.data = state.uncompleted_steps;
    }
    if (this.headerComponent) {
      this.headerComponent.data = state.checkout_header;
    }
    if (this.completedStepsComponent) {
      this.completedStepsComponent.data = state.completed_steps;
    }
    if (this.shoppingCartDetailComponent) {
      this.shoppingCartDetailComponent.data = state.cost_item;
    }
  }

  private triggerScrollTo() {
    const currentState = this.checkoutLinearStepperService.getState();
    if (!currentState.scroll || !currentState.scroll.scrollToElement) {
      return;
    }
    let offsetScrolling = 0;
    switch (currentState.model.currentStep.name) {
      case 'insurance-info':
        offsetScrolling = 75;
        break;
      case 'address':
        offsetScrolling = 65;
        break;
      case 'survey':
        offsetScrolling = 50;
        break;
      case 'payment':
        offsetScrolling = 70;
        break;
      case 'confirm':
        offsetScrolling = 45;
        break;
      case 'complete':
        offsetScrolling = 50;
        break;
      default:
        return;
    }
    const config: ScrollToConfigOptions = {
      target: 'checkout-linear-stepper-current-step',
      offset: offsetScrolling
    };
    this.scrollToService.scrollTo(config).subscribe();
  }

  public getLayoutClassForSection(section: string): string {
    return !!this.state && !!this.state.layout && this.state.layout[section] ?
      'layout-' + this.state.layout[section]
      : '';
  }

}
