import { Injectable, Inject, Injector } from '@angular/core';
import { PreventivatoreDiscountCodeContentProvider } from './preventivatore-discount-code-content-provider.interface';

@Injectable(
    {
        providedIn: 'root'
    }
)

export class PreventivatoreDiscountCodeContentProviderService {
    constructor(@Inject(Injector) private injector: Injector) {
    }
    private productContentProviderMap: Map<string, any> = new Map<string, any>();
    setProvider(productCodes: string[], providerContentFunction: any) {
        productCodes.map(pc => this.productContentProviderMap.set(pc, providerContentFunction))
    }
    getProvider(productCodes: string[]): PreventivatoreDiscountCodeContentProvider {
        const contentProvider = this.productContentProviderMap.get(productCodes[0]) || this.productContentProviderMap.get(productCodes[1]);
        return this.injector.get(contentProvider);
    }
}