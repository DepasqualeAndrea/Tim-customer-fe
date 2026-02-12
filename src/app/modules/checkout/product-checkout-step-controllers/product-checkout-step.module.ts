import { NgModule } from '@angular/core';
import { ProductInfoStepBaseController } from './base-controller/product-info-step-base-controller';
import { ProductLoginStepBaseController } from './base-controller/product-login-step-base-controller';
import { SportsController } from './sports/sports-controller';
import { SportsInfoStepController } from './sports/sports-info-step-controller';
import { SportsLoginStepController } from './sports/sports-login-step-controller';
import { SportAddressStepController } from './sports/sports-address-step-controller';
import { ProductAddressStepBaseController } from './base-controller/product-address-step-base-controller';
import { SportsCheckoutStateController } from './sports/sports-checkout-state-controller';
import { ProductCheckoutStateBaseController } from './base-controller/product-checkout-state-base-controller';
import { GeGenericController } from './ge-generic-controller/ge-generic-controller';

@NgModule({
    providers: [
        ProductInfoStepBaseController,
        ProductLoginStepBaseController,
        SportsController,
        SportsInfoStepController,
        SportsLoginStepController,
        SportAddressStepController,
        ProductAddressStepBaseController,
        SportsCheckoutStateController,
        ProductCheckoutStateBaseController,
        GeGenericController
    ]
})
export class ProductCheckoutStepModule {
}
