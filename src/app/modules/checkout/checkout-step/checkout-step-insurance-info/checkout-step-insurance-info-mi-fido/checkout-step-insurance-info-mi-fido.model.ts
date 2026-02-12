import {CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';

export interface PetInfo {
  petName: string;
  kind: string;
  chip: string;
  breed: string;
  birthDate: Date;
  informationPackage: boolean;
}

export interface CheckoutStepInsuranceInfoMiFidoProduct extends CheckoutStepInsuranceInfoProduct, PetInfo {
}
