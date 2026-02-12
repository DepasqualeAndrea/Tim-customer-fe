import {CheckoutProduct} from './checkout.model';
import {CheckoutStep} from './checkout-step/checkout-step.model';
import { RequestOrder, ResponseOrder } from '@model';

export interface CheckoutRouteInput {
  steps: CheckoutStep[];
  product: CheckoutProduct;
  ongoingRequestOrder?: RequestOrder;
  responseOrder: ResponseOrder;
}
