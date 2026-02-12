import { CheckoutLinearStepperReducer } from './checkout-linear-stepper-reducer';
import { Injectable } from '@angular/core';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class CheckoutLinearStepperReducerProvider {
    private products: Map<string, any> = new Map<string, any>();
    setReducer(productCode: string, createReducerFunction: any) {
        this.products.set(productCode, createReducerFunction);
    }
    getReducer(productCode: string): CheckoutLinearStepperReducer {
        const reducer = this.products.get(productCode);
        if (typeof reducer !== 'function') {
            return reducer;
        }
        return reducer();
    }
}