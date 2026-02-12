import { CheckoutRouteInput } from '../../checkout-routing.model';
import { Injectable } from '@angular/core';
import { CheckoutModule } from '../../checkout.module';
import { ProductCheckoutStateController } from '../product-checkout-state-controller.interface';

@Injectable({
    providedIn: 'root'
  })
export class ProductCheckoutStateBaseController implements ProductCheckoutStateController {
    private checkoutRouteInput: CheckoutRouteInput;
    setCheckoutRouteInput(checkoutrouteinput: CheckoutRouteInput): void {
       this.checkoutRouteInput = checkoutrouteinput;
    }
   getCheckoutRouteInput(): CheckoutRouteInput {
       return this.checkoutRouteInput;
  }
}