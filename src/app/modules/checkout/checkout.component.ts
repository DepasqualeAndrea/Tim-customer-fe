import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { CheckoutProduct, CheckoutProductCostItemType } from './checkout.model';
import { CheckoutRouteInput } from './checkout-routing.model';
import { CheckoutStep, CheckoutStepOperation, CheckoutStepPriceChange } from './checkout-step/checkout-step.model';
import { CheckoutService, DataService } from '@services';
import { Observable, Subscription } from 'rxjs';
import { ResponseOrder } from '@model';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { distinctUntilChanged, take } from 'rxjs/operators';
import { NavbarCbVariantSkinComponent } from '../../components/public/navbar/navbar-cb/navbar-cb-variant-skin.component';
import { CheckoutStepService } from './services/checkout-step.service';
import { LoginService } from '../security/services/login.service';
import { PREVENTIVATORE_URL_KEY } from '../preventivatore/preventivatore/preventivatore.component';
import { CHECKOUT_OPENED } from './services/checkout.resolver';
import { ToastrService } from 'ngx-toastr';
import { NypCheckoutService } from '@NYP/ngx-multitenant-core';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { AdobeAnalyticsDatalayerService } from 'app/core/services/adobe_analytics/adobe-init-datalayer.service';

type CheckoutModel = {
  product: CheckoutProduct,
  steps: CheckoutStep[],
  currentStep: CheckoutStep,
  priceChange: CheckoutStepPriceChange
}

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss'],
    standalone: false
})
export class CheckoutComponent extends NavbarCbVariantSkinComponent implements OnInit, OnDestroy {

  model: CheckoutModel = {
    product: null,
    steps: [],
    currentStep: null,
    priceChange: null
  };
  checkoutLayout: string;
  subscriptions: Subscription[] = [];

  constructor(public dataService: DataService,
    private checkoutService: CheckoutService,
    protected nypCheckoutService: NypCheckoutService,
    private checkoutStepService: CheckoutStepService,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private toastrService: ToastrService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
  ) {
    super();
  }

  ngOnInit() {
    // send _satellite track
    let digitalData: digitalData = window['digitalData'];
    this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);

    const input: CheckoutRouteInput = this.route.snapshot.data.input;
    this.model.product = input.product;
    this.checkoutLayout = this.dataService.tenantInfo.checkout.layout;
    const resolvedSteps = this.computeSteps(input.steps);
    this.onInitStep(null, resolvedSteps, false);
    const nextStepSubscription = this.checkoutStepService.checkoutStepCompleted$.pipe(
      untilDestroyed(this)
    ).subscribe(stepOperation =>
      this.handleStepComplete(stepOperation, this.model.steps)
    );
    this.subscriptions.push(nextStepSubscription)
    this.checkoutStepService.checkoutStepBack$.pipe(untilDestroyed(this)).subscribe(stepOperation => this.handleStepBack(stepOperation, this.model.steps));
    this.checkoutStepService.checkoutStepPriceChange$.pipe(untilDestroyed(this)).subscribe(priceChange => this.handlePriceChange(priceChange));
    this.router.events.pipe(untilDestroyed(this)).subscribe(evt => {
      if (evt instanceof NavigationStart && evt.navigationTrigger === 'popstate' && evt.url.startsWith('/apertura')) {
        this.onInitStep(evt.url.slice(evt.url.lastIndexOf('/') + 1), resolvedSteps);
      }
    });
  }

  onInitStep(resolvedChild: string, steps: CheckoutStep[], addToHistory: boolean = true) {
    const actualStep = this.resolveStepByName(resolvedChild, steps);
    this.onStepStatusChanged(actualStep, steps, addToHistory);
  }

  public goToStep(stepName: string) {
    const actualStep = this.resolveStepByName(stepName, this.model.steps);
    this.onStepStatusChanged(actualStep, this.model.steps, true);
  }

  private onStepStatusChanged(step: CheckoutStep, steps: CheckoutStep[], addToHistory: boolean = true): Promise<boolean> {
    this.model.steps = steps;
    this.model.currentStep = this.resolveCurrentStep(step, steps);
    this.checkoutStepService.announceStep(this.model.currentStep);
    // removing price change notification after the second step
    if (this.model.currentStep.stepnum > 2) {
      this.checkoutStepService.potentialPriceChange(null);
    }
    return this.router.navigate([this.model.currentStep.name], { relativeTo: this.route, replaceUrl: !addToHistory })
      .then((success) => {
        this.checkoutStepService.handleGtm();
        return success;
      });
  }

  private resolveCurrentStep(currentStep: CheckoutStep, steps: CheckoutStep[]) {
    return currentStep || this.lastStepAvailable(steps);
  }

  private handleStepComplete(stepOperation: CheckoutStepOperation, steps: CheckoutStep[]): Observable<ResponseOrder> {
    const checkoutAction: Observable<ResponseOrder> = this.executeStepOperation(stepOperation);
    checkoutAction.pipe(take(1)).subscribe(responseOrder => {
      this.dataService.setResponseOrder(responseOrder);
      Object.assign(this.model.product.order, responseOrder);
      this.checkoutStepService.orderUpdated.next();
      const newSteps = this.computeSteps(steps);
      const newStep = newSteps.find(item => item.stepnum === stepOperation.step.stepnum);
      newStep.completed = true;
      return this.onStepStatusChanged(this.nextStep(newStep, newSteps), newSteps);
    }, error => {
      if (stepOperation.confirm) {
        this.toastrService.error(error.error.errors.base[1] || error.error.errors.base[0]);
        return this.onStepStatusChanged(this.prevStep(stepOperation.step, steps), steps);
      } else {
        throw error;
      }
    });
    return checkoutAction;
  }

  private handleStepBack(stepOperation: CheckoutStepOperation, steps: CheckoutStep[]): Promise<boolean> {
    return this.onStepStatusChanged(this.prevStep(stepOperation.step, steps), steps);
  }

  private handlePriceChange(priceChange: CheckoutStepPriceChange) {
    if (priceChange) {
      this.model.product.costItems = (priceChange.costItems || this.model.product.costItems).map(item => {
        if (item.type === CheckoutProductCostItemType.total) {
          return Object.assign({}, item, { amount: priceChange.current });
        }
        return item;
      });
      if (this.dataService.tenantInfo.tenant !== 'santa-lucia_db') {
        this.model.product.order.display_total = this.model.product.costItems[this.model.product.costItems.length - 1].amount.toFixed(2).toString();
      }
      else if (this.dataService.tenantInfo.tenant === 'santa-lucia_db') {
        this.model.product.order.display_total = this.model.product.costItems[this.model.product.costItems.length - 1].amount.toString();
      }
    }
    this.model.priceChange = priceChange;
  }

  private lastStepAvailable(steps: CheckoutStep[]): CheckoutStep {
    return steps.sort((s1, s2) => s1.stepnum - s2.stepnum).find(step => step.completed === false);
  }

  private nextStep(step: CheckoutStep, steps: CheckoutStep[]): CheckoutStep {
    return steps.find(item => item.stepnum === (step.stepnum + 1)) || step;
  }

  private prevStep(step: CheckoutStep, steps: CheckoutStep[]): CheckoutStep {
    return steps.find(item => item.stepnum === (step.stepnum - 1)) || step;
  }

  private resolveStepByName(name: string, steps: CheckoutStep[]) {
    return steps.find(item => item.name === name);
  }

  private executeStepOperation(stepOperation: CheckoutStepOperation): Observable<ResponseOrder> {
    if (!stepOperation.confirm) {
      if (!stepOperation.data) stepOperation.data = this.dataService.getRequestOrder();

      return this.nypCheckoutService.orderToNextStep(this.dataService.getResponseOrder().number, stepOperation.data);
    }
    return this.nypCheckoutService.completeOrder(this.dataService.getResponseOrder().number, stepOperation.data, '', this.dataService?.paymentType);
  }

  private computeSteps(steps: CheckoutStep[]): CheckoutStep[] {
    const newSteps = steps.map(item => Object.assign({}, item));
    newSteps.forEach((value, index, array) => {
      value.previous = array[index - 1];
    });
    return newSteps;
  }

  showGuaranteesCard() {
    if (this.model.product.code.startsWith('ge-ski-seasonal')) {
      return true;
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.loginService.cancelRedirectAfterLogin();
    this.checkoutService.cancelOngoingCheckout();
    localStorage.removeItem(PREVENTIVATORE_URL_KEY);
    localStorage.removeItem(CHECKOUT_OPENED);
    if (this.subscriptions.length) {
      this.subscriptions.forEach(sub => sub.unsubscribe())
    }
  }

  getProduct() {
    return this.model.product.code;
  }
}
