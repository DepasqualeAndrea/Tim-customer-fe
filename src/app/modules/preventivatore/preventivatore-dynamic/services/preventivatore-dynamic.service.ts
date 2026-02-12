import { PreventivatoreAbstractComponent } from '../components/preventivatore-abstract/preventivatore-abstract.component';
import { PreventivatoreDynamicState } from '../state/preventivatore-dynamic-state.model';
import { Subject, Subscription } from 'rxjs';
import { PreventivatoreStateReducer } from '../state/preventivatore-state-reducer';
import { PreventivatoreReducerProvider } from '../state/preventivatore-reducer-provider';


export class PreventivatoreDynamicService {
  private headerComponent: PreventivatoreAbstractComponent;
  private howWorksComponent: PreventivatoreAbstractComponent;
  private moreInfoComponent: PreventivatoreAbstractComponent;
  private whatToKnowComponent: PreventivatoreAbstractComponent;
  private forWhoComponent: PreventivatoreAbstractComponent;
  private heroComponent: PreventivatoreAbstractComponent;
  private bgImgHeroComponent: PreventivatoreAbstractComponent;
  // generic containers
  private component1: PreventivatoreAbstractComponent;
  private component2: PreventivatoreAbstractComponent;
  private component3: PreventivatoreAbstractComponent;
  private component4: PreventivatoreAbstractComponent;
  private component5: PreventivatoreAbstractComponent;
  private component6: PreventivatoreAbstractComponent;
  private component7: PreventivatoreAbstractComponent;
  private component8: PreventivatoreAbstractComponent;

  private subscriptions: Subscription[] = [];
  private onCheckoutActionSubject = new Subject<any>();
  public onCheckoutAction$ = this.onCheckoutActionSubject.asObservable();
  private preventivatoreStateReducer: PreventivatoreStateReducer;
  constructor(preventivatoreReducerProvider: PreventivatoreReducerProvider, productCodes: string[]) {
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

  public setHeroComponent(component: PreventivatoreAbstractComponent) {
    this.heroComponent = component;
    this.subscribeComponentAction(component);
  }

  public setBgImgHeroComponent(component: PreventivatoreAbstractComponent) {
    this.bgImgHeroComponent = component;
    this.subscribeComponentAction(component);
  }

  public setHeaderComponent(component: PreventivatoreAbstractComponent) {
    this.headerComponent = component;
    this.subscribeComponentAction(component);
  }

  public setHowWorksComponent(component: PreventivatoreAbstractComponent) {
    this.howWorksComponent = component;
    this.subscribeComponentAction(component);
  }

  public setMoreInfoComponent(component: PreventivatoreAbstractComponent) {
    this.moreInfoComponent = component;
    this.subscribeComponentAction(component);
  }

  public setWhatToKnowComponent(component: PreventivatoreAbstractComponent) {
    this.whatToKnowComponent = component;
    this.subscribeComponentAction(component);
  }

  public setForWhoComponent(component: PreventivatoreAbstractComponent) {
    this.forWhoComponent = component;
    this.subscribeComponentAction(component);
  }

  // for generic containers
  public setComponent(component: PreventivatoreAbstractComponent, index: number) {
    this[`component${index}`] = component;
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

  private subscribeComponentAction(component: PreventivatoreAbstractComponent) {
    const subscription = component.actionEvent.subscribe(action => this.onEventAction(action));
    this.subscriptions.push(subscription);
  }

  private onCheckoutAction(payload: any) {
    this.onCheckoutActionSubject.next(payload);
  }

  private onStateChanged() {
    const state = this.preventivatoreStateReducer.getState();
    this.onHeaderStateChanged(state, this.headerComponent);
    this.onHowWorksStateChanged(state, this.howWorksComponent);
    this.onMoreInfoStateChanged(state, this.moreInfoComponent);
    this.onWhatToKnowChanged(state, this.whatToKnowComponent);
    this.onForWhoChanged(state, this.forWhoComponent);
    this.onHeroStateChanged(state, this.heroComponent);
    this.onBgImgHeroChanged(state, this.bgImgHeroComponent);

    // for generic containers
    Object.keys(this).filter(key => key.match(/^component\d+$/))
      .sort((keyA, keyB) => keyA.localeCompare(keyB))
      .map(k => this[k])
      .forEach((c, i) => {
        const index = i + 1;
        this.onComponentStateChanged(state, c, index);
      });

  }

  private onHeroStateChanged(state: PreventivatoreDynamicState, heroComponent: PreventivatoreAbstractComponent) {
    if (heroComponent) {
      heroComponent.data = state.hero;
    }
  }

  private onBgImgHeroChanged(state: PreventivatoreDynamicState, bgImgHeroComponent: PreventivatoreAbstractComponent) {
    if (bgImgHeroComponent) {
      bgImgHeroComponent.data = state.bgImgHero;
    }
  }

  private onHeaderStateChanged(state: PreventivatoreDynamicState, headerComponent: PreventivatoreAbstractComponent) {
    if (headerComponent) {
      headerComponent.data = state.header;
    }
  }

  private onHowWorksStateChanged(state: PreventivatoreDynamicState, howWorksComponent: PreventivatoreAbstractComponent) {
    if (howWorksComponent) {
      howWorksComponent.data = state.howWorks;
    }
  }

  private onMoreInfoStateChanged(state: PreventivatoreDynamicState, moreInfoComponent: PreventivatoreAbstractComponent) {
    if (moreInfoComponent) {
      moreInfoComponent.data = state.moreInfo;
    }
  }

  private onWhatToKnowChanged(state: PreventivatoreDynamicState, whatToKnow: PreventivatoreAbstractComponent) {
    if (whatToKnow) {
      whatToKnow.data = state.whatToKnow;
    }
  }

  private onForWhoChanged(state: PreventivatoreDynamicState, forWhoComponent: PreventivatoreAbstractComponent) {
    if (forWhoComponent) {
      forWhoComponent.data = state.forWho;
    }
  }

  // for generic containers
  private onComponentStateChanged(state: PreventivatoreDynamicState, component: PreventivatoreAbstractComponent, index: number) {
    if (component) {
      component.data = state[`component${index}`];
    }
  }
}
