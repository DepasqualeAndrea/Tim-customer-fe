import { PreventivatoreAbstractStateReducer } from './preventivatore-abstract-state-reducer';
import { PreventivatoreStateReducer } from './preventivatore-state-reducer';
import { PreventivatoreDynamicState } from './preventivatore-dynamic-state.model';

export class PreventivatoreGenericStateReducer extends PreventivatoreAbstractStateReducer implements PreventivatoreStateReducer {

  constructor() {
    super();
  }

  getInitialState() {
    this.state = this.getEmptyState();
    return this.state;
  }

  reduce(actionName: string, payload: any) {
    switch (actionName) {
    }
    return super.common(actionName, payload);
  }

  getState() {
    return this.state;
  }

  private getEmptyState(): PreventivatoreDynamicState {
    return {
      header: null,
      hero: null,
      howWorks: null,
      forWho: null,
      whatToKnow: null,
      moreInfo: null,
      component1: null,
      component2: null,
      component3: null,
      component4: null,
      component5: null,
      component6: null,
      component7: null,
      component8: null
    };
  }
}
