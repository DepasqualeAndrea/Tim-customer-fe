import { Injectable } from '@angular/core';
import { PreventivatoreDiscountCodeStateReducer } from './preventivatore-discount-code-state-reducer';
import { PreventivatoreDiscountCodeGenericStateReducer } from './preventivatore-discount-code-generic-state-reducer';

@Injectable(
    {
        providedIn: 'root'
    }
)

export class PreventivatoreDiscountCodeReducerProvider {
    private productProviderMap: Map<string, any> = new Map<string, any>();
    setReducer(productCode: string, createReducerFunction: any) {
        this.productProviderMap.set(productCode, createReducerFunction);
    }
    getReducer(productCode: string): PreventivatoreDiscountCodeStateReducer {
        const reducer = this.productProviderMap.get(productCode);
        if (typeof reducer !== 'function') {
            return new PreventivatoreDiscountCodeGenericStateReducer();
        }
        return reducer();
    }
}
