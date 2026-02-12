import { Attachment, PolicyNotification, PolicyPayments, Product } from '@model';
import { Wallet } from '../payment-management/payment-management.model';

export class Policy {
  // Nyp 
  policy_number?: string;
  // Nyp 
  payments: PolicyPayments;
  payment_sources: PaymentSource[];
  id: number | string;
  order_id?: any;
  addons: Addon[];
  external_id?: number | string;
  insuredSubjectsUrl?: string;
  name: string;
  imageUrl: string;
  policyNumber: number | string;
  masterPolicyNumber: number | string;
  status: string;
  statusLabel: string;
  price: number;
  orderCode?: string;
  currency: string;
  startDate: Date;
  expirationDate: Date;
  completedAt: Date;
  paymentMethod: PolicyPaymentMethod;
  certificateUrl: string;
  surveyUrl: string;
  canOpenClaim: Boolean;
  insured_is_contractor?: boolean;
  product: Product;
  insuredEntities?: any;
  variant: any;
  insurance_info: any;
  pet_properties: any;
  appliance_properties?: any;
  actions: PolicyAction;
  wallets?: Wallet[];
  notifications?: PolicyNotification[];
  sku?: string;
  renewCandidate?: Policy;
  papery_docs = false;
  subscription?: any;
  setInfoUrl?: string;
  installments?: Installment[];
  nameProduct?: string;
  payment_frequency: string;
  refund_requested?: boolean;
  withdrawal_requested?: boolean;
  total_addons_price?: number;
}
export class PolicyPayment {
  paymemt_method_id: number;
  payment_Trx: any;
  payment_sources: PaymentSource[];
  payment_token: any;
}

export class PaymentSource {
  amount: number;
  billingId: string;
  credit_token: any;
  customer_id: number;
  expiration: string;
  holder: string;
  id: number;
  lastDigits: string;
  order_id: string;
  paymentMethod: string;
  payment_method_id: number;
  payments: Payment[];
  policy_code: string;
  type: string;
}

export class Payment {
  current_billing_date: string;
  price: number;
  state: string;
}


class Addon {
  addon_line_item_id: number;
  available: boolean;
  code: string;
  cover_details?: string;
  description: string;
  id: number;
  image?: AddonImage;
  maximal?: number;
  name: string;
  price: number;
  purchase_date?: unknown;
  taxons: Taxon[];
  travel_value?: unknown;
  upselled?: boolean;
  validators?: unknown[];
}

class AddonImage {
  id: number;
  image_type: string;
  mini_url: string;
  small_url: string;
  product_url: string;
  large_url: string;
  original_url: string;
}

class Taxon {
  id: number;
  name: string;
  parent_id: number;
  pretty_name: string;
  taxonomy_id: number;
}

export class PolicyPaymentMethod {
  id: number;
  type: PolicyPaymentMethodType;
  holder: string;
  lastDigits?: string;
  expiration?: string; // "10/2019",
  email?: string;
  sourceType: string;
  payment_sources?: any[];
}

export class Installment {
  id: number;
  expiration_date: string;
  payment_date: string;
  start_date: string;
  state: string;
}

export enum PolicyPaymentMethodType {
  mastercard = 'Mastercard',
  visa = 'Visa',
  paypal = 'PayPal',
  banktransfer = 'Spree::PaymentMethod::Transfer',
  sia = 'Sia'
}

export class Claim {
  id?: number | string;
  product: string;
  claim_date?: string;
  claim_open_date?: string;
  message?: string;
  claim_number?: string;
  note?: string;
  policy_number?: string;
  docs?: Attachment[];
}


export class MenuItem {
  id: number;
  name: string;
  route: string;
  isActive: boolean;
}

export class PolicyAction {
  deactivable: boolean;
  downsellable: boolean;
  markable_as_unrenewable: boolean;
  deactivate_and_withdraw: boolean;
  reactivable: boolean;
  renewable: boolean;
  silent_renewable: boolean;
  suspendable: boolean;
  withdrawable: boolean;
  claim_eligible: boolean;
  refundable: boolean;
  coupon_used: boolean;
  recisionable: boolean;
}
