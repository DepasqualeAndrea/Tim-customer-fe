export interface PreventivatoreStateReducer {
    getInitialState(): any;
    reduce(actionName: string, payload: any): any;
    getState(): any;
}