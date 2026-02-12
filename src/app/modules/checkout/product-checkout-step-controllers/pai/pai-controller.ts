import { ProductCheckoutController } from '../product-checkout-controller.interface';
import { Injectable } from '@angular/core';
import { ProductLoginRegisterStepController } from '../product-login-register-step-controller.interface';
import { ProductLoginStepBaseController } from '../base-controller/product-login-step-base-controller';
import { CheckoutModule } from '../../checkout.module';
import { ProductAddressStepController } from '../product-address-step-controller.interface';
import { ProductAddressStepBaseController } from '../base-controller/product-address-step-base-controller';
import { ProductCheckoutStateController } from '../product-checkout-state-controller.interface';
import { ProductStepsController } from '../product-steps-controller.interface';
import { ProductStepsBaseController } from '../base-controller/product-steps-base-controller';
import { PaiInfoStepController } from './pai-info-step-controller';
import { ProductInfoStepController } from '../product-info-step-controller.interface';
import { ProductCheckoutStateLinearStepperController } from '../base-controller/product-checkout-state-linear-stepper.controller';

@Injectable({
  providedIn: 'root'
})
export class PaiController implements ProductCheckoutController {
  constructor(private productLoginRegisterStepController: ProductLoginStepBaseController
    , private productInfoStepController: PaiInfoStepController
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
