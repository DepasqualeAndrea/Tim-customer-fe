import {CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';

export interface BikeTopInfo {
  brand: string;
  model: string;
  purchaseDate: Date;
}

export interface CheckoutStepInsuranceInfoBikeTopProduct extends CheckoutStepInsuranceInfoProduct, BikeTopInfo {

}
