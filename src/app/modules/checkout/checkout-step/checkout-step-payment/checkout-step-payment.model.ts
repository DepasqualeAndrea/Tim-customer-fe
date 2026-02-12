import {CheckoutProduct} from '../../checkout.model';
import {PaymentMethod} from '../../../payment-management/payment-management.model';

export interface CheckoutStepPaymentPromoCode {
  value: string;
  applied: boolean;
  promotion_name: string;
}

export interface CheckoutStepPaymentDocumentsAcceptance {
  informationNoteRead: boolean;
  informationNoteDownloaded?: boolean;
  privacyPolicyAccepted: boolean;
  privacyPolicyDownloaded?: boolean;
  paperCopyRequest: boolean;
}

export interface CheckoutStepPaymentProduct extends CheckoutProduct {
  paymentMethod: PaymentMethod;
  promoCode: CheckoutStepPaymentPromoCode;
  documentsAcceptance: CheckoutStepPaymentDocumentsAcceptance;
}

export interface PayLoad {
  payment_method_id: number;
  order_number: string;
}
