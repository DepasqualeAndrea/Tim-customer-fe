import {PaymentMethod} from '../../../../payment-management/payment-management.model';


export enum PaymentMethodsModalConfirmDeleteAction {
  CANCEL,
  OK
}

export interface PaymentMethodsModalConfirmDeleteResult {
  action: PaymentMethodsModalConfirmDeleteAction;
  paymentMethod: PaymentMethod;
}
