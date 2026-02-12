import { Injectable } from '@angular/core';
import { PreventivatoreStateReducer } from './preventivatore-state-reducer';
import { PreventivatoreGenericStateReducer } from './preventivatore-generic-state-reducer';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class PreventivatoreReducerProvider {
    private productProviderMap: Map<string, any> = new Map<string, any>();
    setReducer(productCode: string, createReducerFunction: any) {
        this.productProviderMap.set(productCode, createReducerFunction);
    }
    getReducer(productCode: string): PreventivatoreStateReducer {
        const reducer = this.productProviderMap.get(productCode);
        if (typeof reducer !== 'function') {
            return new PreventivatoreGenericStateReducer();
        }
        return reducer();
    }
}
