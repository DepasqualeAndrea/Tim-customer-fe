import { CheckoutComponentFactory } from './checkout-component-factory.model';

export interface CheckoutComponentProvider {
    getComponentFactories(productCode: string): CheckoutComponentFactory[];
    canGetComponentsForProduct(productCode: string): boolean;
}
