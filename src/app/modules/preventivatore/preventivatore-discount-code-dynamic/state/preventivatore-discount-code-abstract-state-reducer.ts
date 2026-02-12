import { PreventivatoreDiscountCodeDymanicState } from './preventivatore-discount-code-dymanic-state.model';


export abstract class PreventivatoreDiscountCodeAbstractStateReducer {
    protected state: PreventivatoreDiscountCodeDymanicState;
    protected common(actionName: string, payload: any) {
        switch (actionName) {            
            case 'addBgImgHero':
                this.state = this.addBgImgHero(this.state, payload);
                break;
            case 'addHowWorks':
                this.state = this.addHowWorks(this.state, payload);
                break;
            case 'addWhatToKnow':
                this.state = this.addWhatToKnow(this.state, payload);
                break;
        }
        return this.state;
    }

    private addBgImgHero(state: PreventivatoreDiscountCodeDymanicState, bgImgHero: any) {
        const obj = Object.assign({}, bgImgHero);
        state.bgImgHero = obj;
        return state;
    }

    private addHowWorks(state: PreventivatoreDiscountCodeDymanicState, howWorks: any) {
        const obj = Object.assign({}, howWorks);
        state.howWorks = obj;
        return state;
    }

    private addWhatToKnow(state: PreventivatoreDiscountCodeDymanicState, whatToKnow: any) {
        const obj = Object.assign({}, whatToKnow);
        state.whatToKnow = obj;
        return state;
    }
}
