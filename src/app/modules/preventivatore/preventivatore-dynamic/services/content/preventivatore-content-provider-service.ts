import { Injectable, Inject, Injector } from '@angular/core';
import { PreventivatoreContentProvider } from './preventivatore-content-provider.interface';

@Injectable(
    {
        providedIn: 'root'
    }
)

export class PreventivatoreContentProviderService {
    constructor(@Inject(Injector) private injector: Injector) {
    }
    private productContentProviderMap: Map<string, any> = new Map<string, any>();
    setProvider(productCodes: string[], providerContentFunction: any) {
        productCodes.map(pc => this.productContentProviderMap.set(pc, providerContentFunction))
    }
    getProvider(productCodes: string[]): PreventivatoreContentProvider {
        const contentProvider = this.productContentProviderMap.get(productCodes[0]) || this.productContentProviderMap.get(productCodes[1]);
        return this.injector.get(contentProvider);
    }
}