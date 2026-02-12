import { PreventivatoreDiscountCodeAbstractStateReducer } from './preventivatore-discount-code-abstract-state-reducer';
import { PreventivatoreDiscountCodeStateReducer } from './preventivatore-discount-code-state-reducer';
import { PreventivatoreDiscountCodeDymanicState } from './preventivatore-discount-code-dymanic-state.model';


export class PreventivatoreDiscountCodeGenericStateReducer
    extends PreventivatoreDiscountCodeAbstractStateReducer
    implements PreventivatoreDiscountCodeStateReducer {
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
    private getEmptyState(): PreventivatoreDiscountCodeDymanicState {
        return {
            howWorks: null,
            bgImgHero: null
        };
    }
}
