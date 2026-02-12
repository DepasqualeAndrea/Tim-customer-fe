import { CheckoutRouteInput } from '../../checkout-routing.model';
import { Injectable } from '@angular/core';
import { CheckoutModule } from '../../checkout.module';
import { ProductCheckoutStateController } from '../product-checkout-state-controller.interface';

@Injectable({
    providedIn: 'root'
  })
export class ProductCheckoutStateLinearStepperController implements ProductCheckoutStateController {
    private checkoutRouteInput: CheckoutRouteInput;
    setCheckoutRouteInput(checkoutrouteinput: CheckoutRouteInput): void {
       this.checkoutRouteInput = checkoutrouteinput;
    }
   getCheckoutRouteInput(): CheckoutRouteInput {
       const result = this.checkoutRouteInput;
       this.checkoutRouteInput = null;
       return result;
  }
}