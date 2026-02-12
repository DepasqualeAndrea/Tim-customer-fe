import { PreventivatoreAbstractStateReducer } from './preventivatore-abstract-state-reducer';
import { PreventivatoreStateReducer } from './preventivatore-state-reducer';
import { PreventivatoreDynamicState } from './preventivatore-dynamic-state.model';

export class PreventivatorePaiStateReducer
    extends PreventivatoreAbstractStateReducer
    implements PreventivatoreStateReducer {
    constructor() {
        super();
    }
    getInitialState() {
        this.state = this.getEmptyState();
        return this.state;
    }
    reduce(actionName: string, payload: any) {
        switch (actionName) {
            case 'selected_product':
                this.state = this.setFocusProduct(this.state, payload);
                break;
            case 'quotationChanged':
                this.state = this.quotationChanged(this.state, payload);
                break;
            case 'date64Received':
                this.state = this.date64Received(this.state, payload);
                break;
            case 'selectedDriverChanged':
                this.state = this.selectedDriverChanged(this.state, payload);
                break;
        }

        return super.common(actionName, payload);

    }
    private selectedDriverChanged(state: PreventivatoreDynamicState, payload: any) {
        state.bgImgHero.products.forEach(productElement => {
            const selected_values = Object.assign(productElement.selected_values);
            productElement.selected_values = selected_values;
            productElement.selected_values.selected_drivers = payload.selectedDriver;
        });
        return state;
    }
    private setFocusProduct(state: PreventivatoreDynamicState, payload: any) {
        const selected_code = payload.product.product_code;

        state.bgImgHero.products.forEach(productElement => {
            const selected_values = Object.assign(productElement.selected_values);
            productElement.selected_values = selected_values;
            if (productElement.product_code === selected_code) {
                productElement.selected_values.focus = true;
            } else {
                productElement.selected_values.focus = false;
            }
        });
        return state;
    }
    private quotationChanged(state: PreventivatoreDynamicState, payload: any) {
        state.bgImgHero.products.forEach(productElement => {
            const selected_values = Object.assign(productElement.selected_values, payload);
            productElement.selected_values = selected_values;
        });
        return state;
    }
    private date64Received(state: PreventivatoreDynamicState, payload: any) {
        const dateBase64 = payload.dateBase64;
        if (!dateBase64) {
            state.bgImgHero.products.forEach(productElement => {
                const selected_values = Object.assign(productElement.selected_values);
                productElement.selected_values = selected_values;
                selected_values.dates_from_url = false;
            });
            return state;
        }
        const decodedDate = this.decodeBase64String(dateBase64);
        //---TODO: check dates are valid
        const dates = decodedDate.split('|');
        const fromDate = this.getDateFromUrlDateParam(dates[0]);
        const toDate = this.getDateFromUrlDateParam(dates[1]);

        state.bgImgHero.products.forEach(productElement => {
            const selected_values = Object.assign({}, productElement.selected_values);
            productElement.selected_values = selected_values;
            selected_values.dates_from_url = true;
            selected_values.fromDate = fromDate;
            selected_values.toDate = toDate;
        });
        return state;
    }
    decodeBase64String(dateBase64: string): string {
        return atob(dateBase64);
    }
    getDateFromUrlDateParam(dateString: string): Date {
        const newDate = new Date(dateString);
        newDate.setHours(0, 0, 0, 0);
        return newDate;
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
            moreInfo: null
        };
    }
    public getStringFromDate(date: Date) {
        let day = date.getDate().toString();
        if (day.length === 1) {
            day = '0' + day;
        }
        let month = (date.getMonth() + 1).toString();
        if (month.length === 1) {
            month = '0' + month;
        }
        const formattedDate = date.getFullYear() + '-' + month + '-' + day;
        return formattedDate;
    }
}
