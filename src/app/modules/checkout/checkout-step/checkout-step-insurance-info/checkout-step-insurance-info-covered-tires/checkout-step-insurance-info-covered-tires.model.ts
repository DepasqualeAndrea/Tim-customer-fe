import {CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';

export interface CoveredTiresInfo {
   id: number;
    brand: string;
    model: string;
    licensePlate: string;
  }

  export interface CheckoutStepInsuranceInfoCoveredTiresProduct extends CheckoutStepInsuranceInfoProduct, CoveredTiresInfo {
  }
