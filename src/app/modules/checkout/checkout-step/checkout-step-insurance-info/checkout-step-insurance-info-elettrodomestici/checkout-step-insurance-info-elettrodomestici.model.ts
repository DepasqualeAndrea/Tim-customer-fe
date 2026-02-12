import {CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';

export interface CheckoutStepInsuranceInfoElettrodomesticiProduct extends CheckoutStepInsuranceInfoProduct {
  registerAppliancesLater: boolean;
  appliances: DomesticAppliance[];
}

export interface DomesticAppliance {
  id?: number;
  kind: { key: string, value: string };
  brand: { key: string, value: string };
  model: string;
  receiptNumber?: string;
  purchaseDate: Date;
  category?: string;
  _destroy?: boolean;
}

export interface DomesticApplianceKind {
  key: string;
  value: string;
  category: string;
}

export interface ApplianceProperties {
  categories: { [key: string]: { kinds: Array<string> } };
  constraints: { categories: { [key: string]: number } };
  kinds: { [key: string]: string };
  brands: { [key: string]: string },
  max_insurable: number;
}

export const mockAppliances: { [key: string]: string } = {
  'aeg': 'Aeg',
  'akai': 'Akai'
};
