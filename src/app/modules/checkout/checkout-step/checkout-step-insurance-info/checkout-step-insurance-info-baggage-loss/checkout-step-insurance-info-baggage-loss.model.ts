import {CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';

export interface CheckoutStepInsuranceInfoBaggageLossProduct extends CheckoutStepInsuranceInfoProduct {
  bookingId?: string;
  plate?: string;
}
