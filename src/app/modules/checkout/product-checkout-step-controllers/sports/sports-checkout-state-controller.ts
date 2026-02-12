import { CheckoutRouteInput } from '../../checkout-routing.model';
import { Injectable } from '@angular/core';
import { CheckoutModule } from '../../checkout.module';
import { ProductCheckoutStateController } from '../product-checkout-state-controller.interface';

@Injectable({
    providedIn: 'root'
  })
export class SportsCheckoutStateController implements ProductCheckoutStateController {
    private checkoutRouteInput: CheckoutRouteInput;
    setCheckoutRouteInput(checkoutrouteinput: CheckoutRouteInput): void {
       this.checkoutRouteInput = checkoutrouteinput;
    }
   getCheckoutRouteInput(): CheckoutRouteInput {
       const currentInput = this.checkoutRouteInput;
       //TODO: to allow to go to previos step after the login,
       //we must set this.checkoutRouteInput to null.
       //Currently we can't go back because in the "CheckoutStepAddressComponent"
       // this.currentStep.previous is null.  The value is not loaded in memory
       return currentInput;
  }
}