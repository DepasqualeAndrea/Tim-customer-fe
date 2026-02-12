import { Injectable } from '@angular/core';
import { CheckoutModule } from 'app/modules/checkout/checkout.module';
import { CheckoutGenericComponentProvider } from './checkout-generic-component-provider';
import { CheckoutComponentProvider } from './checkout-component-provider.interface';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class CheckoutComponentProviderService {
    constructor(private genericComponentFactoriesProvider: CheckoutGenericComponentProvider) {
    }
    getComponentFactoriesProvider(productCode: string): CheckoutComponentProvider {
        if (this.genericComponentFactoriesProvider.canGetComponentsForProduct(productCode)) {
            return this.genericComponentFactoriesProvider;
        }
        return null;
    }
}