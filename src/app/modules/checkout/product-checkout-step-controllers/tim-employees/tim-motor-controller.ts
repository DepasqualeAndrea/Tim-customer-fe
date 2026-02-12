import { ProductCheckoutController } from '../product-checkout-controller.interface';
import { Injectable } from '@angular/core';
import { ProductLoginRegisterStepController } from '../product-login-register-step-controller.interface';
import { CheckoutModule } from '../../checkout.module';
import { ProductAddressStepController } from '../product-address-step-controller.interface';
import { ProductAddressStepBaseController } from '../base-controller/product-address-step-base-controller';
import { ProductCheckoutStateController } from '../product-checkout-state-controller.interface';
import { ProductStepsController } from '../product-steps-controller.interface';
import { ProductStepsBaseController } from '../base-controller/product-steps-base-controller';
import { ProductInfoStepController } from '../product-info-step-controller.interface';
import { ProductCheckoutStateLinearStepperController } from '../base-controller/product-checkout-state-linear-stepper.controller';
import { TimMotorLoginStepController } from './tim-motor-login-controller';
import { TimMotorInfoStepController } from './tim-motor-info-step-controller';

@Injectable({
  providedIn: 'root'
})
export class TimMotorController implements ProductCheckoutController {
  constructor(
      private productLoginRegisterStepController: TimMotorLoginStepController
    , private productInfoStepController: TimMotorInfoStepController
    , private productAddressStepController: ProductAddressStepBaseController
    , private productCheckoutStateController: ProductCheckoutStateLinearStepperController
    , private productStepsController: ProductStepsBaseController) {
  }
  getStepController(): ProductStepsController {
    return this.productStepsController;
  }
  getLoginRegisterStepController(): ProductLoginRegisterStepController {
    return this.productLoginRegisterStepController;
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