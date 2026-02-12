export const GUP_PAYMENT_METHOD_NAME = 'Gup'
export const GUP_RECURRENT_PAYMENT_METHOD_NAME = 'Gup recurrent'

export enum Pitype {
  CreditCard = 'CC',
  PayPal = 'PPAL',
  NoPayment = 'NOPAYMENT'
}

export enum CCTypes {
  PayPal = "Paypal"
}

export type GupAddEvent = {
  paymentMethod: GupPaymentMethod,
  pitype: Pitype
}

export interface GupPaymentWalletList {
  payment_sources: GupPaymentMethod[]
}

export interface GupPaymentMethod {
  billing_id: string
  last_digits?: string
  payment_type: string
  month?: string
  year?: string
  cc_type?: string
  email?: string
  selected?: boolean;
  paymentType?: string;
}

export interface StepGupContent {
  paymentData?: string
  paymentDataChoice?: string
  paymentEligibility?: string
  paymentWalletListGupContent: StepGupWalletListContent
}

export interface StepGupWalletListContent {
  addCreditCard?: string
  addPaypalAccount?: string
  choosePaymentMethod?: string
  paymentMethodsLabel?: string
  confirmButton?: string
  cancelButton?: string
  paycheckCharge?: string
}

export interface GupRequest {
  billing_id?: string
  pitype?: Pitype
  payment_method_id: number
  order_number: string
  amount?: number;
}

export class NoPaymentRequest {
  payment_method_id: number
  source_attributes: SourceAttributes
  constructor(id: number) {
    this.payment_method_id = id
    this.source_attributes = new SourceAttributes()
  }
}

class SourceAttributes {
  verification_value: string
  number: string
  month: string
  year: string
  name: string
  constructor() {
    this.verification_value = '12345'
    this.number = '12345'
    this.month = '12'
    this.year = '2099'
    this.name = 'NoPayment'
  }
}