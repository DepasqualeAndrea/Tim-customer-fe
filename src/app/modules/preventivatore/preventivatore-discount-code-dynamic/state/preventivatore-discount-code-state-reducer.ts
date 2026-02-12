export interface PreventivatoreDiscountCodeStateReducer {
    getInitialState(): any;
    reduce(actionName: string, payload: any): any;
    getState(): any;
}