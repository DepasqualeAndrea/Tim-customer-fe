
import { Subject, Subscription } from 'rxjs';
import { PreventivatoreDiscountCodeAbstractComponent } from '../components/preventivatore-abstract/preventivatore-discount-code-abstract.component';
import { PreventivatoreDiscountCodeStateReducer } from '../state/preventivatore-discount-code-state-reducer';
import { PreventivatoreDiscountCodeReducerProvider } from '../state/preventivatore-discount-code-reducer-provider';
import { PreventivatoreDiscountCodeDymanicState } from '../state/preventivatore-discount-code-dymanic-state.model';

export class PreventivatoreDiscountCodeDynamicService {
  private bgImgHeroDCComponent: PreventivatoreDiscountCodeAbstractComponent;
  private howWorksDCComponent: PreventivatoreDiscountCodeAbstractComponent;
  private whatToKnowDCComponent: PreventivatoreDiscountCodeAbstractComponent;
  private subscriptions: Subscription[] = [];
  private onCheckoutActionSubject = new Subject<any>();
  public onCheckoutAction$ = this.onCheckoutActionSubject.asObservable();
  private preventivatoreStateReducer: PreventivatoreDiscountCodeStateReducer;
  constructor(preventivatoreReducerProvider: PreventivatoreDiscountCodeReducerProvider, productCodes: string[]) {
    this.preventivatoreStateReducer = preventivatoreReducerProvider.getReducer(productCodes[0]);
    this.preventivatoreStateReducer.getInitialState();
  }

  public onDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
      subscription = null;
    });
    this.subscriptions = null;
  }

  public setBgImgHeroDCComponent(component: PreventivatoreDiscountCodeAbstractComponent) {
    this.bgImgHeroDCComponent = component;
    this.subscribeComponentAction(component);
  }

  public setHowWorksDCComponent(component: PreventivatoreDiscountCodeAbstractComponent) {
    this.howWorksDCComponent = component;
    this.subscribeComponentAction(component);
  }
  public setWhatToKnowDCComponent(component: PreventivatoreDiscountCodeAbstractComponent) {
    this.whatToKnowDCComponent = component;
    this.subscribeComponentAction(component);
  }

  public sendAction(actionName: string, payload: any) {
    if (actionName === 'checkout_product') {
      this.onCheckoutAction(payload);
    }
    this.preventivatoreStateReducer.reduce(actionName, payload);
    this.onStateChanged();
  }

  private onEventAction(action: any) {
    this.sendAction(action.action, action.payload);
  }

  private subscribeComponentAction(component: PreventivatoreDiscountCodeAbstractComponent) {
    const subscription = component.actionEvent.subscribe(action => this.onEventAction(action));
    this.subscriptions.push(subscription);
  }

  private onCheckoutAction(payload: any) {
    this.onCheckoutActionSubject.next(payload);
  }

  private onStateChanged() {
    const state = this.preventivatoreStateReducer.getState();
    this.onBgImgHeroChanged(state, this.bgImgHeroDCComponent);
    this.onHowWorksChanged(state, this.howWorksDCComponent);
    this.onWhatToKnowChanged(state, this.whatToKnowDCComponent);
  }

  private onBgImgHeroChanged(state: PreventivatoreDiscountCodeDymanicState, bgImgHeroDCComponent: PreventivatoreDiscountCodeAbstractComponent) {
    if (bgImgHeroDCComponent) {
      bgImgHeroDCComponent.data = state.bgImgHero;
    }
  }

  private onHowWorksChanged(state: PreventivatoreDiscountCodeDymanicState, howWorksDCComponent: PreventivatoreDiscountCodeAbstractComponent) {
    if (howWorksDCComponent) {
      howWorksDCComponent.data = state.howWorks;
    }
  }
  private onWhatToKnowChanged(state: PreventivatoreDiscountCodeDymanicState, whatToKnowDCComponent: PreventivatoreDiscountCodeAbstractComponent) {
    if (whatToKnowDCComponent) {
      whatToKnowDCComponent.data = state.whatToKnow;
    }
  }
}
