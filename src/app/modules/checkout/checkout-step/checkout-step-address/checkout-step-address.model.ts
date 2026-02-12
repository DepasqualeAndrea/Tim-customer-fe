import { CheckoutProduct } from '../../checkout.model';

export interface CheckoutContractor {
  firstName: string;
  lastName: string;
  fiscalCode: string;
  email?: string;
  phoneNumber: string;
  birthDate: string;
  birthCountry?: string;
  birthState?: string;
  birthCity?: string;
  birthCountryId?: number;
  birthStateId?: number;
  birthCityId?: number;
  address: string;
  residenceCity?: string;
  zipCode: string;
  residenceCountry?: string;
  residendeState?: string;
  residenceCountryId?: number;
  residendeStateId?: number;
  locked_anagraphic?: boolean;
  data?: {
    ndg: string;
  };
  address1?: string;
  city?: string;
  taxcode?: string;
  company?: string;
  vatcode?: string;
  stateId?: number;
  countryId?: number;
  business?: boolean;
  ldap_eligible?: boolean;
  dataTreatment?: boolean;
  ageConfirm?: boolean;
  gender?: string;
}

export interface CheckoutStepAddressProduct extends CheckoutProduct {
  contractor: CheckoutContractor;
}
