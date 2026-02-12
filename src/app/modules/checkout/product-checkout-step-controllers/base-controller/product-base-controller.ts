import { ProductCheckoutController } from '../product-checkout-controller.interface';
import { Injectable } from '@angular/core';
import { ProductLoginRegisterStepController } from '../product-login-register-step-controller.interface';
import { ProductLoginStepBaseController } from './product-login-step-base-controller';
import { CheckoutModule } from '../../checkout.module';
import { ProductInfoStepController } from '../product-info-step-controller.interface';
import { ProductInfoStepBaseController } from './product-info-step-base-controller';
import { ProductAddressStepController } from '../product-address-step-controller.interface';
import { ProductAddressStepBaseController } from './product-address-step-base-controller';
import { ProductCheckoutStateBaseController } from './product-checkout-state-base-controller';
import { ProductCheckoutStateController } from '../product-checkout-state-controller.interface';
import { ProductStepsController } from '../product-steps-controller.interface';
import { ProductStepsBaseController } from './product-steps-base-controller';

@Injectable({
  providedIn: 'root'
})
export class ProductBaseController implements ProductCheckoutController {
  constructor(private productLoginRegisterStepController: ProductLoginStepBaseController
    , private productInfoStepController: ProductInfoStepBaseController
    , private productAddressStepController: ProductAddressStepBaseController
    , private productCheckoutStateController: ProductCheckoutStateBaseController
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