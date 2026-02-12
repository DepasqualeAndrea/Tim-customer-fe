import { Injectable } from '@angular/core';
import { RequestOrder } from 'app/core/models/order.model';
import { CheckoutModule } from '../../checkout.module';
import { ProductInfoStepController } from '../product-info-step-controller.interface';
import { CheckoutRouteInput } from '../../checkout-routing.model';
import { CheckoutStepInsuranceInfoComponent } from '../../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.component';

@Injectable({
    providedIn: 'root'
  })
export class PaiInfoStepController implements ProductInfoStepController {
    constructor() { }
    getOngoingRequestOrder(checkoutRouteInput: CheckoutRouteInput): RequestOrder {
        const resolverData = checkoutRouteInput;
        const ongoingRequestOrder = (resolverData || {} as any).ongoingRequestOrder;
        return ongoingRequestOrder;
    }

    checkProductInitialization(infoComponent: CheckoutStepInsuranceInfoComponent) {
      if (infoComponent.currentStep.product.quantity === 1) {
        infoComponent.handleNextStep();
      }
    }
}
