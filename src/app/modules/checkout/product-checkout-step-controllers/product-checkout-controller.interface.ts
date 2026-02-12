import { ProductLoginRegisterStepController } from './product-login-register-step-controller.interface';
import { ProductInfoStepController } from './product-info-step-controller.interface';
import { ProductAddressStepController } from './product-address-step-controller.interface';
import { ProductCheckoutStateController } from './product-checkout-state-controller.interface';
import { ProductStepsController } from './product-steps-controller.interface';

export interface ProductCheckoutController {
     getStepController(): ProductStepsController;
     getLoginRegisterStepController(): ProductLoginRegisterStepController;
     getInfoStepController(): ProductInfoStepController;
     getAddressStepController(): ProductAddressStepController;
     getProductCheckoutStateController(): ProductCheckoutStateController;
}