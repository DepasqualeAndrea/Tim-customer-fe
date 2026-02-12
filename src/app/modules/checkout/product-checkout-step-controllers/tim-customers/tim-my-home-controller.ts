import { Injectable } from "@angular/core";
import { ProductAddressStepBaseController } from "../base-controller/product-address-step-base-controller";
import { ProductCheckoutStateBaseController } from "../base-controller/product-checkout-state-base-controller";
import { ProductLoginStepBaseController } from "../base-controller/product-login-step-base-controller";
import { ProductStepsBaseController } from "../base-controller/product-steps-base-controller";
import { ProductAddressStepController } from "../product-address-step-controller.interface";
import { ProductCheckoutController } from "../product-checkout-controller.interface";
import { ProductCheckoutStateController } from "../product-checkout-state-controller.interface";
import { ProductInfoStepController } from "../product-info-step-controller.interface";
import { ProductLoginRegisterStepController } from "../product-login-register-step-controller.interface";
import { ProductStepsController } from "../product-steps-controller.interface";
import { TimMyHomeInfoStepController } from "./tim-my-home-info-step-controller";
import { CheckoutStep } from '../../checkout-step/checkout-step.model';

@Injectable({
  providedIn: 'root'
})
export class TimMyHomeController implements ProductCheckoutController {
  constructor(private productLoginRegisterStepController: ProductLoginStepBaseController
    , private productInfoStepController: TimMyHomeInfoStepController
    , private productAddressStepController: ProductAddressStepBaseController
    , private productCheckoutStateController: ProductCheckoutStateBaseController
    , private productStepsController: ProductStepsBaseController) {
  }
  getStepController(): ProductStepsController {
    return this;
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

  computeSteps(steps: CheckoutStep[]): CheckoutStep[] {
    const newSteps = steps.map(item => Object.assign({}, item)).filter(v => v.name != 'survey');
    newSteps.forEach((value, index, array) => {
      value.previous = array[index - 1];
      if (value.stepnum - value.previous?.stepnum == 2) value.stepnum -= 1;
    });
    return newSteps;
  }
}