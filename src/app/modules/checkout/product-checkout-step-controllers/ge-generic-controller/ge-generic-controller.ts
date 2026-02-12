import { ProductCheckoutController } from '../product-checkout-controller.interface';
import { Injectable } from '@angular/core';
import { ProductLoginRegisterStepController } from '../product-login-register-step-controller.interface';
import { CheckoutModule } from '../../checkout.module';
import { ProductInfoStepController } from '../product-info-step-controller.interface';
import { ProductAddressStepController } from '../product-address-step-controller.interface';
import { ProductCheckoutStateController } from '../product-checkout-state-controller.interface';
import { ProductStepsBaseController } from '../base-controller/product-steps-base-controller';
import { ProductStepsController } from '../product-steps-controller.interface';
import { GeGenericLoginStepController } from './ge-generic-login-step-controller';
import { ProductInfoStepBaseController } from '../base-controller/product-info-step-base-controller';
import { ProductAddressStepBaseController } from '../base-controller/product-address-step-base-controller';
import { ProductCheckoutStateLinearStepperController } from '../base-controller/product-checkout-state-linear-stepper.controller';

@Injectable({
    providedIn: 'root'
})
export class GeGenericController implements ProductCheckoutController {
    constructor(private loginRegisterStepController: GeGenericLoginStepController,
        private productInfoStepController: ProductInfoStepBaseController,
        private productAddressStepController: ProductAddressStepBaseController,
        private productCheckoutStateController: ProductCheckoutStateLinearStepperController,
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
