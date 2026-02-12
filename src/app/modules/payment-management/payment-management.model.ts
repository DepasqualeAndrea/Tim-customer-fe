export class BraintreePaymentMethod {
  payload: { nonce: string };
  nameCreditCard: string;
  year?: number;
  setAsFavourite?: boolean;
}

export class Wallet {
  cc_type: string; // "master"
  customer_id: string; // "tbjlldqe-sharklasers-com-258"
  payment_token?: string;
  data: {
    prepaid: string | boolean; // "Unknown"
    payroll: string | boolean; // "Unknown"
    debit: string | boolean; // "Unknown
  };
  default?: boolean;
  recurring?: boolean;
  id: number;
  insurances: string[];
  last_digits: string;
  month: string; // '11'
  name: string; // 'Mario Rossi';
  payment_method_id: number; // 2
  year: string; // '2020'
  wallet_payment_source_id?: number
}

export interface PaymentMethod {
  id: number;
  type: string;
  holder?: string;
  lastDigits?: string;
  expiration?: string; // "10/19",
  wallet?: Wallet;
  wallet_payment_source_id?: number;
  sourceType?: string;
}
