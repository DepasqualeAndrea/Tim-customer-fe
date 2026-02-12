import {CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';

export interface CheckoutStepInsuranceInfoSmartphoneProduct extends CheckoutStepInsuranceInfoProduct {
  model?: string;
  brand?: string;
  technology?: string;
  imeiCode?: string;
  receiptNumber?: string;
  purchaseDate?: string;
  askForDeviceCheck?: string;
  phoneNumber?: number;
}
