import { Injectable } from '@angular/core';
import { CheckoutModule } from '../../checkout.module';
import { ProductCheckoutController } from '../product-checkout-controller.interface';
import { ProductLoginStepBaseController } from '../base-controller/product-login-step-base-controller';
import { ProductAddressStepBaseController } from '../base-controller/product-address-step-base-controller';
import { ProductInfoStepBaseController } from '../base-controller/product-info-step-base-controller';
import { ProductCheckoutStateBaseController } from '../base-controller/product-checkout-state-base-controller';
import { ProductLoginRegisterStepController } from '../product-login-register-step-controller.interface';
import { ProductInfoStepController } from '../product-info-step-controller.interface';
import { ProductAddressStepController } from '../product-address-step-controller.interface';
import { ProductCheckoutStateController } from '../product-checkout-state-controller.interface';
import { CseSerenetaStepsController } from './cse-sereneta-steps-controller';
import { ProductStepsController } from '../product-steps-controller.interface';

@Injectable({
    providedIn: 'root'
})

export class CseSerenetaController implements ProductCheckoutController {

    constructor(private productLoginRegisterStepController: ProductLoginStepBaseController
        , private productInfoStepController: ProductInfoStepBaseController
        , private productAddressStepController: ProductAddressStepBaseController
        , private productCheckoutStateController: ProductCheckoutStateBaseController
        , private productStepsController: CseSerenetaStepsController) {
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