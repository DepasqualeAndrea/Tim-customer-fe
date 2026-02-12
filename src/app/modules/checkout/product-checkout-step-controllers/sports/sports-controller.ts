import { ProductCheckoutController } from '../product-checkout-controller.interface';
import { Injectable } from '@angular/core';
import { ProductLoginRegisterStepController } from '../product-login-register-step-controller.interface';
import { CheckoutModule } from '../../checkout.module';
import { SportsLoginStepController } from './sports-login-step-controller';
import { SportsInfoStepController } from './sports-info-step-controller';
import { ProductInfoStepController } from '../product-info-step-controller.interface';
import { ProductAddressStepController } from '../product-address-step-controller.interface';
import { SportAddressStepController } from './sports-address-step-controller';
import { ProductCheckoutStateController } from '../product-checkout-state-controller.interface';
import { SportsCheckoutStateController } from './sports-checkout-state-controller';
import { ProductStepsBaseController } from '../base-controller/product-steps-base-controller';
import { ProductStepsController } from '../product-steps-controller.interface';

@Injectable({
    providedIn: 'root'
})
export class SportsController implements ProductCheckoutController {
    constructor(private loginRegisterStepController: SportsLoginStepController,
        private productInfoStepController: SportsInfoStepController,
        private productAddressStepController: SportAddressStepController,
        private productCheckoutStateController: SportsCheckoutStateController,
        private productStepsController: ProductStepsBaseController) {
    }
    getStepController(): ProductStepsController {
        return this.productStepsController;
    }
    getLoginRegisterStepController(): ProductLoginRegisterStepController {
        return this.loginRegisterStepController;
    }
    getInfoStepController(): ProductInfoStepController {
        return this.productInfoStepController;
    }
    getAddressStepController(): ProductAddressStepController {
        return this.productAddressStepController;
    }
    getProductCheckoutStateController(): ProductCheckoutStateController {
        return this.productCheckoutStateController;
    }
}