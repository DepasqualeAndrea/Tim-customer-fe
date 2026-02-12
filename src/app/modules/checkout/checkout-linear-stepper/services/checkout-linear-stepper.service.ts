import { CheckoutRouteInput } from '../../checkout-routing.model';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { CheckoutStep, CheckoutStepOperation, CheckoutStepPriceChange } from '../../checkout-step/checkout-step.model';
import { CheckoutStepService } from '../../services/checkout-step.service';
import { StepStatusChanged } from './step-status-changed.model';
import { RequestOrder, ResponseOrder } from '@model';
import { take, tap, map } from 'rxjs/operators';
import { AuthService, CheckoutService, DataService } from '@services';
import { Injectable } from '@angular/core';
import { CheckoutModule } from '../../checkout.module';
import { CheckoutComponentProviderService } from './component/checkout-component-provider.service';
import { CheckoutContentProviderService } from './content/checkout-content-provider.service';
import { CheckoutLinearStepperReducerProvider } from './state/checkout-linear-stepper-reducer-provider';
import { CheckoutLinearStepperReducer } from './state/checkout-linear-stepper-reducer';
import { CheckoutComponentProvider } from './component/checkout-component-provider.interface';
import { CheckoutContentProvider } from './content/checkout-content-provider.interface';
import { CheckoutComponentFactory } from './component/checkout-component-factory.model';
import { ProductCheckoutStepService } from '../../product-checkout-step-controllers/product-checkout-step.service';
import { CheckoutStepPaymentPromoCode } from '../../checkout-step/checkout-step-payment/checkout-step-payment.model';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { GtmInitDataLayerService } from 'app/core/services/gtm/gtm-init-datalayer.service';
import { NypCheckoutLinearStepperService, NypCheckoutService, NypUserService } from '@NYP/ngx-multitenant-core';
import { AdobeAnalyticsDatalayerService } from 'app/core/services/adobe_analytics/adobe-init-datalayer.service';
import { CheckoutHeaderComponent } from '../components/checkout-header/checkout-header.component';

@Injectable(
  { providedIn: 'root' }
)
export class CheckoutLinearStepperService {
  private stateReducer: CheckoutLinearStepperReducer;
  private componentFactoriesProvider: CheckoutComponentProvider;
  private contentProvider: CheckoutContentProvider;
  private stateSubject = new Subject<any>();
  public state$ = this.stateSubject.asObservable();
  private stepStatusChangedSubject = new Subject<StepStatusChanged>();
  public stepStatusChanged$ = this.stepStatusChangedSubject.asObservable();
  private responseOrderReceivedSubject = new Subject<ResponseOrder>();
  public responseOrderReceived$ = this.responseOrderReceivedSubject.asObservable();
  private componentFactoriesSubject = new Subject<CheckoutComponentFactory[]>();
  public componentFactories$ = this.componentFactoriesSubject.asObservable();
  private subscriptions: Subscription[] = [];
  private productCode: string;

  constructor(private checkoutStepService: CheckoutStepService,
    private checkoutService: CheckoutService,
    protected nypCheckoutService: NypCheckoutService,
    protected nypCheckoutLinearStepperService: NypCheckoutLinearStepperService,
    private checkoutComponentProviderService: CheckoutComponentProviderService,
    private checkoutContentProviderService: CheckoutContentProviderService,
    private checkoutLinearStepperReducerProvider: CheckoutLinearStepperReducerProvider,
    private productCheckoutStepService: ProductCheckoutStepService,
    private toastrService: ToastrService,
    private dataService: DataService,
    protected authService: AuthService,
    private gtmInitDataLayerService: GtmInitDataLayerService) {
  }

  public loadTemplateComponents() {
    this.sendComponentFactories();
  }

  public createCheckoutFromRouteInput(input: CheckoutRouteInput) {
    this.clearCheckout();
    this.initializeProviders(input);
    this.stateReducer.getInitialState();
    this.loadContent(this.contentProvider, this.stateReducer, input);
  }

  public sendState() {
    const state = this.stateReducer.getState();
    this.stateSubject.next(state);
  }

  public computeSteps(steps: CheckoutStep[]): CheckoutStep[] {
    return this.productCheckoutStepService
      .getProductCheckoutControllerFromCode(this.productCode)
      .getStepController().computeSteps(steps);
  }

  public onInitStep(resolvedChild: string, steps: CheckoutStep[], addToHistory: boolean = true) {
    const actualStep = this.resolveStepByName(resolvedChild, steps);
    this.onStepStatusChanged(actualStep, steps, addToHistory);
  }

  public setCurrentUrl(url: string) {
    this.stateReducer.reduce('setCurrentUrl', { url: url });
    this.sendState();
  }

  public getStepStatus(steps, currentStep) {
    steps = steps.sort(function (a, b) {
      return a.stepnum - b.stepnum;
    }).map(step => {
      return {
        name: step.name,
        stepnum: step.stepnum
      };
    });
    const indexOfCurrentStep = steps.indexOf(steps.find(step =>
      step.stepnum === currentStep.stepnum && step.name === currentStep.name
    ));
    const completedSteps = steps.slice(0, indexOfCurrentStep);
    const uncompletedSteps = steps.slice(indexOfCurrentStep + 1, steps.length);
    return {
      completed_steps: completedSteps
      , uncompleted_steps: uncompletedSteps
      , current_step: currentStep
    };
  }

  public clearCheckout() {
    this.productCode = null;
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
      subscription = null;
    });
    this.subscriptions = [];
    this.checkoutService.cancelOngoingCheckout();
  }

  public getState(): any {
    return this.stateReducer.getState();
  }

  private initializeProviders(input: CheckoutRouteInput) {
    const productCode = input.product.code;
    this.productCode = productCode;
    this.stateReducer = this.checkoutLinearStepperReducerProvider.getReducer(productCode);
    this.componentFactoriesProvider = this.checkoutComponentProviderService.getComponentFactoriesProvider(productCode);
    this.contentProvider = this.checkoutContentProviderService.getContentProvider(productCode);
  }

  private sendComponentFactories() {
    const factoriesComponents = this.componentFactoriesProvider.getComponentFactories(this.productCode);
    this.componentFactoriesSubject.next(factoriesComponents);
  }

  private loadContent(contentProvider: CheckoutContentProvider
    , stateReducer: CheckoutLinearStepperReducer, input: CheckoutRouteInput) {
    const subscription = contentProvider.getContent().pipe(take(1)).subscribe(content => {
      stateReducer.reduce('setContent', content);
      this.sendState();
      this.initializeSteps(input);
    });
    this.subscriptions.push(subscription);
  }

  private initializeSteps(input: CheckoutRouteInput) {
    const resolvedSteps = this.computeSteps(input.steps);
    this.stateReducer.reduce('setProduct', input.product);
    this.stateReducer.reduce('setResolvedSteps', resolvedSteps);
    this.stateReducer.reduce('setLoading', false);
    const responseOrder = input.responseOrder;
    this.stateReducer.reduce('setResponseOrder', responseOrder);
    this.sendState();

    const stateAfterPayment = 'confirm';

    this.onInitStep(responseOrder.state == stateAfterPayment ? stateAfterPayment : undefined, resolvedSteps, false);
    const state = this.stateReducer.getState();
    const subscriptionStepCompleted = this.checkoutStepService.checkoutStepCompleted$.subscribe(stepOperation => this.handleStepComplete(stepOperation, state.model.steps));
    const subscriptionStepBack = this.checkoutStepService.checkoutStepBack$.subscribe(stepOperation => this.handleStepBack(stepOperation, state.model.steps));
    const subscriptionPriceChanged = this.checkoutStepService.checkoutStepPriceChange$.subscribe(priceChange => this.handlePriceChange(priceChange));
    const couponApplied = this.checkoutStepService.checkoutCouponApplied$.subscribe(stepPaymentPromoCode => this.handlePaymentPromoCode(stepPaymentPromoCode));
    const subscriptionPriceChangedWithAddons = this.checkoutStepService.checkoutStepPriceChangeAfterSelectedAddons$.subscribe(quoteResponse => this.handlePriceChangeAfterSelectedAddons(quoteResponse));
    const subscriptionPriceChangedWithAddonsMotor = this.checkoutStepService.checkoutStepPriceChangeAfterSelectedAddonsMotor$.subscribe(quoteResponse => this.handlePriceChangeAfterSelectedAddonsMotor(quoteResponse));
    const subscriptionPriceChangedWithAddonsHome = this.checkoutStepService.checkoutStepPriceChangeAfterSelectedAddonsHome$.subscribe(quoteResponse => this.handlePriceChangeAfterSelectedAddonsHome(quoteResponse));
    const subscriptionInfoDataWithAddons = this.checkoutStepService.checkoutStepChangeInfoDataWithAddons$.subscribe(quoteResponse => this.handleInfoDataWithAddons(quoteResponse));
    const subscriptionInfoDataBuilding = this.checkoutStepService.checkoutStepChangeInfoDataBuilding$.subscribe(dataBuilding => this.handleInfoDataBuldingChange(dataBuilding));
    const subscriptionInfoRecap = this.checkoutStepService.checkoutStepChangeInfoRecap$.subscribe(infoRecap => this.handleInfoRecapChange(infoRecap));
    const subscriptionShoppingCartInfo = this.checkoutStepService.checkoutStepChangeShoppingCartInfo$.subscribe(shoppingCartInfo => this.handleShoppingCartInfoChange(shoppingCartInfo));
    const subscriptionPriceChangedInfo = this.checkoutStepService.checkoutStepPriceChangeInfo$.subscribe(priceChange => this.handlePriceChangeInfo(priceChange));
    const subscriptionPriceChangedPayment = this.checkoutStepService.checkoutStepChangeShoppingCartPayment$.subscribe(priceChange => this.handlePriceChangePayment(priceChange));
    const sunscriptionOrderChanged = this.checkoutStepService.checkoutOrderChange$.subscribe(order => this.handleOrderChange(order));
    const subscriptionStepSet = this.checkoutStepService.reducerSetStep$.subscribe(stepName => this.handleStepSet(stepName));
    const subscriptionProposalTitle = this.checkoutStepService.proposalSelectedTitle.subscribe(selectedTitle => this.handleProposalTitle(selectedTitle));
    const subscriptionCustomReduce = this.checkoutStepService.customReduce$.subscribe(request => this.handleCustomReduce(request));
    const reducerPropertyUpdated = this.checkoutStepService.reducerPropertyUpdate$.subscribe(payload => {
      this.stateReducer.reduce('setProperty', payload);
      this.sendState();
    });

    this.subscriptions.push(
      subscriptionStepCompleted,
      subscriptionStepBack,
      subscriptionPriceChanged,
      couponApplied,
      subscriptionPriceChangedWithAddons,
      subscriptionPriceChangedWithAddonsMotor,
      subscriptionPriceChangedWithAddonsHome,
      subscriptionInfoDataWithAddons,
      sunscriptionOrderChanged,
      reducerPropertyUpdated,
      subscriptionStepSet,
      subscriptionCustomReduce,
      subscriptionProposalTitle,
      subscriptionInfoDataBuilding,
      subscriptionInfoRecap,
      subscriptionShoppingCartInfo,
      subscriptionPriceChangedInfo,
      subscriptionPriceChangedPayment
    );
  }

  private resolveStepByName(name: string, steps: CheckoutStep[]) {
    return steps.find(item => item.name === name);
  }

  private resolveCurrentStep(currentStep: CheckoutStep, steps: CheckoutStep[]) {
    return currentStep || this.lastStepAvailable(steps);
  }

  private lastStepAvailable(steps: CheckoutStep[]): CheckoutStep {
    return steps.sort((s1, s2) => s1.stepnum - s2.stepnum).find(step => step.completed === false);
  }

  private onStepStatusChanged(step: CheckoutStep, steps: CheckoutStep[], addToHistory: boolean = true): Promise<boolean> {
    const currentStep = this.resolveCurrentStep(step, steps);
    this.stateReducer.reduce('setStepsAndCurrentStep', { steps: steps, currentStep: currentStep });
    const stepStatus = this.getStepStatus(steps, currentStep);
    this.stateReducer.reduce('setUncompletedSteps', stepStatus.uncompleted_steps);
    this.stateReducer.reduce('setCompletedStepsVisibility', stepStatus.completed_steps);
    this.sendState();
    const state = this.stateReducer.getState();
    this.checkoutStepService.announceStep(state.model.currentStep);
    if (state.model.currentStep.stepnum > 2) {
      this.checkoutStepService.potentialPriceChange(null);
    }
    this.sendStepStatusChanged(state.model.currentStep.name, !addToHistory);
    return of(true).toPromise();
  }

  private sendStepStatusChanged(stepName: string, replaceUrl: boolean) {
    const statusChanged: StepStatusChanged = {
      stepName: stepName,
      replaceUrl: replaceUrl
    };
    this.stepStatusChangedSubject.next(statusChanged);
  }

  private handleStepComplete(stepOperation: CheckoutStepOperation, steps: CheckoutStep[]): Observable<ResponseOrder> {
    if (!this.dataService.CheckoutLinearStepperService__ORDER)
      this.dataService.CheckoutLinearStepperService__ORDER = stepOperation.data;

    if (!!this.dataService.Yin)
      return of(true).pipe(
        map(() => this.dataService.getResponseOrder()),
        tap(() => {
          this.checkoutStepService.orderUpdated.next();
          const newSteps = this.computeSteps(steps);
          const newStep = newSteps.find(item => item.stepnum === stepOperation.step.stepnum);
          newStep.completed = true;
          return this.onStepStatusChanged(this.nextStep(newStep, newSteps), newSteps);
        })
      );

    const checkoutAction: Observable<ResponseOrder> = this.nypCheckoutLinearStepperService.executeStepOperation(stepOperation, this.stateReducer.getState(), null, localStorage.getItem("paymentType"), localStorage.getItem('tenant')).pipe(
      tap(responseOrder => {
        this.dataService.setResponseOrder(responseOrder);

        const apiEventKey: { [key: string]: string } = {
          'address': 'custom-insurance-info',
          'survey': 'custom-survey',
          'payment': 'custom-checkout',
          'complete': 'custom-purchase',
        };

        const createDetails = (details: [string, any][]): string =>
          details
            .filter(([key, value]) => !!value)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n;')
          ;

        AdobeAnalyticsDatalayerService.ADOBE_LOG({
          "eventName": "custom",
          "apiEventKey": apiEventKey[responseOrder.state],
          "ci360_productId": responseOrder.line_items?.[0]?.product?.id,
          "ci360_productName": CheckoutHeaderComponent.PRODUCT_NAME /* responseOrder.line_items?.[0]?.product?.properties?.properties?.find(p => p.name == 'uniq_name')?.value ?? responseOrder.line_items[0].product.productDescription */,
          "ci360_productDetails": createDetails([
            ['Product_name', responseOrder.line_items?.[0]?.product?.properties?.properties?.find(p => p.name == 'uniq_name')?.value],
            ['isLoggedIn', this.authService.loggedIn ? 'Logged in' : 'notLogged In'],
            ['productId', responseOrder.line_items?.[0]?.product?.id],
            ['Pacchetto', this.dataService.selectedPacketName],
            ['Provincia ubicazione immobile', NypUserService.states?.find(s => s.id == this.dataService.CheckoutLinearStepperService__ORDER.order.line_items_attributes[0].house_attributes?.state_id)?.name],
            ['Comune ubicazione immobile', this.dataService.CheckoutLinearStepperService__ORDER.order.line_items_attributes[0].house_attributes?.city],
            ['CAP ubicazione immobile', this.dataService.CheckoutLinearStepperService__ORDER.order.line_items_attributes[0].house_attributes?.zipcode],
            ['Tipologia di Costruzione', this.dataService.CheckoutLinearStepperService__ORDER.order.line_items_attributes[0].house_attributes?.construction_material],
            ['Proprietario o inquilino', this.dataService.CheckoutLinearStepperService__ORDER.order.line_items_attributes[0].house_attributes?.owner_type],
            ['Prezzo Totale', responseOrder.line_items?.[0]?.total],
            ['Inzio copertura', responseOrder.line_items?.[0]?.start_date],

          ]),
        }, 'send');
      })
    );
    checkoutAction.pipe(take(1)).subscribe(responseOrder => {

      this.dataService.price = responseOrder.total;

      console.log(responseOrder)
      if (this.dataService.tenantInfo.tenant === 'genertel_db' && responseOrder.state === 'complete') {
        this.gtmInitDataLayerService.pushTag({
          event: 'purchase',
          eventCategory: 'Proposta Preventivo Sci',
          eventAction: 'Acquisto andato a buon fine',
          eventName: 'purchase_preventivo_sci',
          eventLabel: responseOrder.line_items[0].variant.sku.includes('NORMAL')
            ? 'Genertel Sci'
            : 'Genertel Sci +',
          value: responseOrder.display_total,
          transID: responseOrder.payments.find(payment =>
            payment.state === 'completed'
          ).response_code
        })
      }

      this.responseOrderReceivedSubject.next(responseOrder);
      this.stateReducer.reduce('setResponseOrder', responseOrder);
      this.sendState();
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

  private nextStep(step: CheckoutStep, steps: CheckoutStep[]): CheckoutStep {
    return steps.find(item => item.stepnum === (step.stepnum + 1)) || step;
  }

  private handleStepBack(stepOperation: CheckoutStepOperation, steps: CheckoutStep[]): Promise<boolean> {
    return this.onStepStatusChanged(this.prevStep(stepOperation.step, steps), steps);
  }

  private prevStep(step: CheckoutStep, steps: CheckoutStep[]): CheckoutStep {
    return steps.find(item => item.stepnum === (step.stepnum - 1)) || step;
  }

  private handleOrderChange(order: ResponseOrder): void {
    this.stateReducer.reduce('setOrderChange', order);
    this.sendState();
  }

  private handlePriceChange(priceChange: CheckoutStepPriceChange) {
    this.stateReducer.reduce('setCostItem', priceChange);
    this.sendState();
  }

  private handlePriceChangeAfterSelectedAddons(responseQuote: CheckoutStepPriceChange) {
    this.stateReducer.reduce('setCostItemAfterSelectedAddons', responseQuote);
    this.sendState();
  }

  private handlePriceChangeAfterSelectedAddonsMotor(responseQuote: CheckoutStepPriceChange) {
    this.stateReducer.reduce('setCostItemAfterSelectedAddonsMotor', responseQuote);
    this.sendState();
  }

  private handlePriceChangeAfterSelectedAddonsHome(responseQuote: CheckoutStepPriceChange) {
    this.stateReducer.reduce('setCostItemAfterSelectedAddonsHome', responseQuote);
    this.sendState();
  }

  private handleInfoDataWithAddons(responseQuote: any) {
    this.stateReducer.reduce('setCostItemInfoDataWithAddons', responseQuote);
    this.sendState();
  }

  private handleInfoDataBuldingChange(responseQuote: any) {
    this.stateReducer.reduce('setCostItemInfoDataBuilding', responseQuote);
    this.sendState();
  }

  private handleInfoRecapChange(responseQuote: any) {
    this.stateReducer.reduce('setCostItemInfoRecap', responseQuote);
    this.sendState();
  }

  private handleShoppingCartInfoChange(responseQuote: any) {
    this.stateReducer.reduce('setCostItemShoppingCartInfo', responseQuote);
    this.sendState();
  }

  private handlePriceChangeInfo(priceChange: any) {
    this.stateReducer.reduce('setCostItem', priceChange);
    this.sendState();
  }
  private handlePriceChangePayment(payment: any) {
    this.stateReducer.reduce('setCostItemPayment', payment);
    this.sendState();
  }
  private handleCustomReduce(request: { reduceKey: string, payload: any }) {
    this.stateReducer.reduce(request.reduceKey, request.payload);
    this.sendState();
  }

  private handlePaymentPromoCode(promoCode: CheckoutStepPaymentPromoCode) {
    this.stateReducer.reduce('setPromoCode', promoCode);
    const state = this.stateReducer.getState();
    const order = state.order.number;
    this.nypCheckoutService.getOrder(order).subscribe(responseOrder => {
      this.stateReducer.reduce('setResponseOrder', responseOrder);
      this.dataService.setResponseOrder(responseOrder);
      this.sendState();
      this.dataService.price = responseOrder.total;
      this.checkoutStepService.afterCouponApplied();
      this.dataService.setResponseOrder(responseOrder);
    }
    );
  }

  private handleStepSet(stepName: string): void {
    const state = this.stateReducer.getState();
    this.checkoutStepService.step = state.model.steps.find(step => step.name === stepName);
  }

  private handleProposalTitle(proposalTitle) {
    this.stateReducer.reduce('proposalTitle', proposalTitle);
  }

}
