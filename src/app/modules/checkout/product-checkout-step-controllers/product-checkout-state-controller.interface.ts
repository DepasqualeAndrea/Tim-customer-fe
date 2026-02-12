import { CheckoutRouteInput } from '../checkout-routing.model';

export interface ProductCheckoutStateController {
    setCheckoutRouteInput(checkoutrouteinput: CheckoutRouteInput): void;
    getCheckoutRouteInput(): CheckoutRouteInput;
}
