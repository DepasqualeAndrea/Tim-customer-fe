import { BusinessFormState } from './business-form-state.model';
import { Country } from '@model';

export interface BusinessForm {
  id?: number;
  password?: string;
  email?: string;
  company?: string;
  vatcode?: string;
  officeaddress?: string;
  officezipcode?: string;
  officecity?: string;
  officestate?: BusinessFormState;
  phone?: string;
  country_id?: number;
  officestate_id?: number;
  firstname?: string;
  lastname?: string;
  taxcode?: string;
}
