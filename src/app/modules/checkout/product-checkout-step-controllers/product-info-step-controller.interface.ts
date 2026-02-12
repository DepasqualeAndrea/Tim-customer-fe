import { RequestOrder, ResponseOrder } from '@model';
import { CheckoutRouteInput } from '../checkout-routing.model';
import { CheckoutStepInsuranceInfoComponent } from '../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.component';

export interface ProductInfoStepController {
       getOngoingRequestOrder(checkoutRouteInput: CheckoutRouteInput): RequestOrder;
       checkProductInitialization(infoComponent: CheckoutStepInsuranceInfoComponent);
    }
