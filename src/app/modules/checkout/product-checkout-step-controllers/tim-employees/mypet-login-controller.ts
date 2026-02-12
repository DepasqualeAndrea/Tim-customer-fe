import { Injectable } from '@angular/core';
import { ProductLoginRegisterStepController } from '../product-login-register-step-controller.interface';
import { RequestOrder } from 'app/core/models/order.model';
import { AuthService, CheckoutService } from '@services';
import { CheckoutModule } from '../../checkout.module';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
  })
export class MypetLoginStepController implements ProductLoginRegisterStepController {
    constructor(
      private checkoutService: CheckoutService
    ) { }
    getOngoingRequestOrder(): RequestOrder {
        const checkoutData = this.checkoutService.getOngoingCheckoutData(false);
        if (!checkoutData) {
            return null;
        }
        return checkoutData.requestOrder;
    }
}