export interface CheckoutLinearStepperReducer {
    getInitialState(): any;
    reduce(actionName: string, payload: any): any;
    getState(): any;
}