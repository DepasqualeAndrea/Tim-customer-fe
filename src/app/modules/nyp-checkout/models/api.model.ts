import { FieldsToRecover } from '@NYP/ngx-multitenant-core';


export interface IOrderRequest<R> {
  data: {
    anagState: OrderStates;
    createdBy: string;
    customerId: number;
    orderItem: OrderItem<R>[];
    packetId: number;
    fieldToRecover: FieldsToRecover;
    paymentType: string;
    productId: number;
    updatedBy: string;
  }
}

export interface ProtezioneCasaInsuredItems {
  address: string;
  state_id: number;
  country_id: number;
  city: string;
  house_number: string;
  owner_type: "Proprietario" | "Inquilino";
  usage: "Abitazione principale" | "Altro";
  zipcode: string;
  state: string;
  stateAbbr: string;
  destination?: string;
  overSeventy?: string;
  underSeventy?: string;
  start_date?: string;
  expiration_date?: string;
  seller_code?: string;
}

export interface BillProtectionInsuredItems {
  identity_document_type: 'Carta d’identità' | 'Patente di guida' | 'Passaporto';
  identity_document_number: string;
  identity_document_issue_date: string;
  identity_document_issuer: string;
  identity_document_issuer_state: string;
  identity_document_issuer_city: string;
  politically_exposed: boolean;
  beneficiaries_type: 'Eredi legittimi' | 'Altro';
  destination?: string;
  overSeventy?: string;
  underSeventy?: string;
  start_date?: string;
  expiration_date?: string;
  seller_code?: string;
  beneficiaries?: {
    first_name: string;
    last_name: string;
    tax_code: string;
    percentage: number;
  }[];

}

export interface BillProtectorInsuredItems {
  identity_document_type: 'Carta d’identità' | 'Patente di guida' | 'Passaporto';
  identity_document_number: string;
  identity_document_issue_date: string;
  identity_document_issuer: string;
  identity_document_issuer_state: string;
  identity_document_issuer_city: string;
  politically_exposed: boolean;
  beneficiaries_type: 'Eredi legittimi' | 'Altro';
  destination?: string;
  overSeventy?: string;
  underSeventy?: string;
  start_date?: string;
  expiration_date?: string;
  seller_code?: string;
  beneficiaries?: {
    first_name: string;
    last_name: string;
    tax_code: string;
    percentage: number;
  }[];
  oppucation_type?: string,
  occupation_time?: string
}
export interface MyPetInsuredItems {
  name: string;
  birth_date: string;
  kind: string;
  microchip_code: number;
  destination?: string;
  overSeventy?: string;
  underSeventy?: string;
  start_date?: string;
  expiration_date?: string;
  seller_code?: string
}
export interface ForSkiInsuredItems {
  start_date: string;
  insured_is_contractor: any;
  days_number: number;
  instant: any;
  insurance_info_attributes: {
    extra: any;
  };
  insurance_holders_attributes: {
    last_name: any;
    first_name: any;
    birth_date: any;
  }[];
  expiration_date?: string;
  destination?: string;
  overSeventy?: string;
  underSeventy?: string;
  seller_code?: string;
}
export interface ViaggiRoamingInsuredItems {
  insurance_holders: {
    surname: string;
    name: string;
    birth_date: string;
  }[];
  start_date: string;
  expiration_date?: string;
  seller_code?: string;
  destination: any;
  overSeventy?: string;
  underSeventy?: string;
  insured_is_contractor: boolean;
  quantity?: number;
  days?: number;
  destinationCode?: string;
  insureds_total?: number;
  quotation?: any;
}

export interface ViaggiBreveInsuredItems {
  insurance_holders: {
    surname: string;
    name: string;
    birth_date: string;
  }[];
  start_date?: string;
  destination?: any;
  destinationCode?: string;
  seller_code?: string;
  overSeventy: string | number;
  underSeventy: string | number;

  insured_is_contractor: boolean;
  quantity?: number;
  days?: number;
  expiration_date?: string;
  insureds_total?: number;
}
export interface ViaggiAnnualeInsuredItems {
  insurance_holders: {
    surname: string;
    name: string;
    birth_date: string;
  }[];
  expiration_date?: string;
  start_date: string;
  destination?: any;
  destinationCode?: string;
  seller_code?: string;
  overSeventy?: string;
  underSeventy?: string;
  days?: number;
  insured_is_contractor: boolean;
  extra?: any;
  insureds_total?: number
}
export interface EhealthInsuredItems {
  destination?: string;
  overSeventy?: string;
  underSeventy?: string;
  start_date?: string;
  expiration_date?: string;
  seller_code?: string;
}
export interface SportInsuredItems {
  seller_code?: string;
}

export interface IOrderResponse<R> {
  agenziaDiRiferimento: any;
  anagStates: {
    createdAt: string;
    createdBy: string;
    id: number;
    state: OrderStates;
    updatedAt: string;
    updatedBy: string;
  };
  brokerId: number;
  companyId: number;
  createdAt: string;
  createdBy: string;
  customerId: number;
  fieldToRecover: FieldsToRecover;
  id: number;
  insurancePremium: number;
  language: any;
  orderCode: string;
  orderHistory: any;
  orderItem: OrderItem<R>[];
  packet: { data: Packet };
  packetId: number;
  paymentToken: any;
  paymentTransactionId: any;
  paymentType: string;
  packetDurationDescription: string,
  paymentFrequency: any,
  policyCode: any;
  product: any;
  productId: number;
  productType: string;
  stepState: string[];
  updatedAt: string;
  updatedBy: string;
  utmSource: any;
  version: any;
  data: any;
  survey?: any
  countries?: ICountries;
}

interface OrderItem<R> {
  ceilings?: any;
  expiration_date: string;
  external_id: number;
  id: number;
  instance: {
    chosenWarranties?: {
      data: {
        packetId: number;
        warranties: Warranty[];
        packetCombination: string;
      };
    },
    orderManager: {
      order: any;
    },
    paymentFrequency: string;
    packetDurationDescription?: string;
    filterPackets?: any;
    quotation?: any;
  };
  insured_item: R;
  master_policy_number: number;
  packetId: number;
  policy_number?: any;
  price: string | number;
  product_id: number;
  promotion?: any;
  quantity: number;
  days?: number;
  quotation?: any;
  start_date: string;
  state: string;
  isSeasonal: boolean;
  totalPriceSeasonal: number;
  firstDay: Date;
  lastDay: Date;
  destination?: string,
  totalDays: number,
  destinationCode?: string,
  destinationName?: string,

}

export interface IProduct {
  additionalProductInfo: any;
  business: boolean;
  can_open_claim: boolean;
  catalogId: number;
  categories: Category[];
  code: string;
  conditions: any;
  conditions_package: any;
  configuration: Configuration;
  description: any;
  display_price: any;
  duration: any;
  duration_type: any;
  endDate: any;
  externalId: any;
  holder_maximum_age: number;
  holder_minimum_age: number;
  id: number;
  images: { images: Image[] };
  information_package: any;
  informativeSet: string;
  insuranceCompany: string;
  insuranceCompanyLogo: any;
  maximum_insurable: number;
  only_contractor: boolean;
  packets: Packet[];
  planId: any;
  planName: any;
  price: any;
  privacyDocumentationLink: any;
  productDescription: string;
  productType: string;
  productsPaymentMethods: ProductsPaymentMethod[];
  questions: Question[];
  quotatorType: any;
  recurring: boolean;
  short_description: any;
  showAddonsInShoppingCart: boolean;
  show_in_dashboard: boolean;
  splits: any[];
  startDate: string;
  thumbnail: boolean;
  titleProd: any;
  utmSources: any[];
  properties: Properties[];
}

export interface Category {
  externalCode: string;
  id: number;
  name: string;
}
export interface Properties {
  properties: any[];
}

export interface Question {
  answers: Answer[]
  content: string
  externalCode: any
  id: number
  position: number
}

export interface Answer {
  defaultValue: boolean
  externalCode: any
  id: number
  position: number
  rule?: string
  value: string
}

export interface Configuration {
  canOpenClaim: boolean;
  certificate: string;
  claimProvider: any;
  claimType: string;
  deactivationProvider: any;
  deactivationType: any;
  emission: string;
  emissionPrefix: string;
  id: number;
  quotation: string;
  withdrawType: string;
}

export interface Packet {
  asset: any;
  brokerId: number;
  configuration: { packetDoc: string, emissionPrefix: string; externalCode: string; emission: { imposte: number; premio_imponibile: number; premio_lordo: number; premio_netto: number; } };
  description: any;
  duration: string;
  duration_type: string;
  externalCode: any;
  fixedEndDate: any;
  fixedStartDate: any;
  id: number;
  name: string;
  packetPremium: number;
  packetCombination: string;
  preselected: boolean;
  product: Product;
  sku: string;
  warranties: Warranty[];
  price?: number;
}


export interface Product {
  attachment3_4: any;
  business: boolean;
  can_open_claim: boolean;
  catalogId: number;
  categories: Category[];
  code: string;
  conditions: any;
  conditions_package: any;
  display_price: any;
  duration: any;
  duration_type: any;
  endDate: any;
  externalId: any;
  holder_maximum_age: number;
  holder_minimum_age: number;
  id: number;
  information_package: any;
  informativeSet: string;
  insuranceCompany: string;
  insuranceCompanyLogo: any;
  maximum_insurable: number;
  only_contractor: boolean;
  planId: any;
  planName: any;
  price: any;
  privacyDocumentationLink: any;
  productType: string;
  productsPaymentMethods: ProductsPaymentMethod[];
  questions: Question[];
  quotatorType: any;
  recurring: boolean;
  short_description: any;
  showAddonsInShoppingCart: boolean;
  splits: any[];
  startDate: string;
  thumbnail: boolean;
  title_prod: any;
}

export interface Warranty {
  anagWarranty: AnagWarranty;
  branch: any;
  categoryId: any;
  categoryName: any;
  endDate: any;
  externalCode: string;
  id: number;
  images: any;
  insurancePremium: number;
  internal_code: string
  mandatory: boolean;
  name: string;
  packetId: any;
  parentId: any;
  recurring: boolean;
  startDate: any;
  warrantiesId: any;
  preselected: boolean;
  translationCode: string;
}

export interface AnagWarranty {
  id: number;
  internal_code: string;
  name: string;
}

export interface ProductsPaymentMethod {
  id: number;
  paymentMethod: PaymentMethod;
}

export interface PaymentMethod {
  active: boolean;
  externalId: number;
  id: number;
  paymentMethod: string;
  paymentMethodType: string;
  provider: string;
  type: string;
}

export interface UpdateOrderRequest<R> {
  customerId: number,
  productId: number,
  packet: Packet,
  orderCode: string,
  price: number | string,
  chosenWarranties: RecursivePartial<Warranty[]>,
  additional_packets: RecursivePartial<Warranty[]>,
  insuredItems: RecursivePartial<R>,
  paymentType?: string,
  anagState: OrderStates,
  packetCombination: string,
  packetDurationDescription: string,
  paymentFrequency:  | any,
      quantity: number,
  daysNumber?: number;
  totalDays?: number;
  days?: number;
  start_date?: string;
  destination?: {
    selectedDestinationNumber?: string,
    selectedDestinationName?: string,
  };
  extra?: any,
  total?: string,
    number_employees_exceeded?: any
}

export interface IQandA {
  questionId: number;
  answerId: number;
}

export type RecursivePartial<T> = { [P in keyof T]?: RecursivePartial<T[P]>; };
export type CheckoutStates = 'login-register' | 'user-control' | 'address' | 'insurance-info' | 'survey' | 'payment' | 'thank-you' | 'consensuses';
export type OrderStates = 'Draft' | 'Elaboration' | 'Confirmed';
export type Translation = { [key: string]: TranslationModule };
export type TranslationModule = { [key: string]: string };

export interface IOrderManagerRequest {
  addons?: any[];
  channel?: string;
  order: {
    line_items_attributes: {
      '0': {
        variant_id: number;
      };
    }
  };
  orderCode: string;
  payment_type: string;
  state: string;
  version: string;
};


export interface NypPolicyResponseBE_NOFE {
  additionalPolicyInfo?: any;
  canOpenClaim?: any;
  certificate?: any;
  certificateContentType: string;
  certificateFileName: string;
  certificateFileSize?: any;
  certificateLink: string;
  certificateUpdatedAt?: any;
  choosenProperties?: any;
  createdAt: string;
  customer: {
    id: number;
  };
  endDate: string;
  externalCode?: any;
  id: number;
  insurancePremium?: any;
  insuredIsContractor?: any;
  isDeactivable?: any;
  isWithdrawable?: any;
  markedAsRenewable?: any;
  masterPolicyNumber?: any;
  name: string;
  nextBillingDate?: any;
  numberFailedPayment: number;
  orderCode?: any;
  orderId: number;
  orderIdCode?: any;
  orderItemId: number;
  orderResponse?: any;
  payment: {
    id?: any;
    paymentFrequency: string;
    paymentSources?: any;
    paymentToken?: any;
    paymentTrx?: any;
    paymentType?: any;
  };
  paymentType: string;
  policyCode: string;
  price?: any;
  product: {
    business: boolean;
    can_open_claim: boolean;
    categories?: any;
    code?: any;
    conditions?: any;
    conditions_package?: any;
    configuration?: any;
    description?: any;
    display_price?: any;
    duration?: any;
    duration_type?: any;
    externalId?: any;
    holder_maximum_age?: any;
    holder_minimum_age?: any;
    id: number;
    images?: any;
    information_package?: any;
    informativeSet?: any;
    insuranceCompany?: any;
    insuranceCompanyLogo?: any;
    maximum_insurable?: any;
    only_contractor: boolean;
    packets?: any;
    price?: any;
    productDescription?: any;
    productType?: any;
    productsPaymentMethods?: any;
    properties?: any;
    recurring: boolean;
    short_description?: any;
    show_in_dashboard: boolean;
    titleProd?: any;
  };
  quantity: number;
  renewalDate?: any;
  renewedAt?: any;
  retryBillingDate?: any;
  sendCertificate: boolean;
  startDate: string;
  state: {
    id: number;
    state: string;
  };
  subscription?: any;
  subscriptionId?: any;
  type: string;
  updatedAt: string;
  warranties: any[];
  withdrawalRequestDate?: any;
}
export interface NypPolicy {
  actions_availability: ActionsAvailability
  addons: any[]
  adequacy_survey_url: any
  answers: any[]
  appliances_properties: any
  certificate?: string
  completed_at: string
  days_number: any
  expiration_date: string
  external_id: any
  house_properties: any
  id: number
  installments: Installments
  insurance_info: InsuranceInfo
  insured_entities: InsuredEntities
  insured_is_contractor?: boolean
  marked_as_renewable: any
  master_policy_number: any
  maximum_insurable: number
  name: string
  only_contractor: boolean
  orderCode?: string
  order_id: number
  order_number: any
  papery_docs: boolean
  payment: Payment
  payment_frequency?: string
  pet_properties: any
  policy_number: string
  price: any
  canOpenClaim: boolean
  imageUrl: string
  product: {
    addons: any[]
    business: boolean
    can_open_claim: boolean
    categories: any[]
    category: any
    conditions?: string
    conditions_package?: string
    description: string
    display_price?: string
    hide_policy: boolean
    holder_maximum_age: number
    holder_minimum_age: number
    id: number
    images: Image[]
    information_package: string
    maximum_insurable: number
    name: string
    only_contractor: boolean
    payment_methods: PaymentMethod[]
    price?: number
    product_code: string
    properties: any[]
    recurring: boolean
    short_description?: string
    show_as_recommended: boolean
    show_in_dashboard: boolean
    sku: string
    title_prod: string
    type: string
  }
  quantity: number
  receipt_certificates: any
  refund_requested: boolean
  renew_candidate: any
  replace_enqueued_at: any
  start_date: string
  state: any
  status: string
  subscription: any
  subscription_state: any
  total_addons_price: any
  variant: Variant
  withdrawal_requested: boolean
}



export interface NypPendingPolicy {
  policyCode: string;
  orderItem: OrderItemPendingPolicy
  transactions: TransactionPendingPolicy[]
}
export interface OrderItemPendingPolicy {
  ceilings: any
  emission: any
  expiration_date: string
  external_id: any
  id: number
  instance: Instance
  insured_item: any
  master_policy_number: any
  packetId: number
  packet_id: any
  policy_number: any
  price: string
  product_id: number
  promotion: any
  quantity: number
  quotation: any
  start_date: string
  state: string
  created_at: string
}

export interface Instance {
  chosenWarranties: ChosenWarranties
  orderManager: OrderManager
}

export interface ChosenWarranties {
  data: Data
}

export interface Data {
  packetId: number
  warranties: Warranty[]
}

export interface Warranty {
  anagWarranty: AnagWarranty
  branch: any
  categoryId: any
  categoryName: any
  ceilings: Ceilings
  endDate: any
  externalCode: string
  id: number
  images: any
  insurancePremium: number
  mandatory: boolean
  name: string
  packetId: any
  parentId: any
  preselected: boolean
  recurring: boolean
  rule: Rule
  startDate: any
  taxons: Taxons
  translationCode: string
  warrantiesId: any
}

export interface AnagWarranty {
  id: number
  internal_code: string
  name: string
}

export interface Ceilings {
  ceilings: number[]
  ceilings_rules: CeilingsRules
}

export interface CeilingsRules { }

export interface Rule { }

export interface Taxons { }

export interface OrderManager {
  addons: any
  channel: string
  order: Order
  orderCode: string
  payment_type: any
  state: string
  version: string
}

export interface Order {
  line_items_attributes: LineItemsAttributes
}

export interface LineItemsAttributes {
  "0": N0
}

export interface N0 {
  variant_id: number
}

export interface TransactionPendingPolicy {
  amount: number
  orderCode: string
  paymentDate: string
  paymentFrequency: string
  paymentStatus: string
  paymentType: string
}

export interface ActionsAvailability {
  deactivable: boolean
  withdrawable: boolean
}



export interface Installments { }

export interface InsuranceInfo { }

export interface InsuredEntities {
  pets: Pet[]
}

export interface Pet { }

export interface Payment {
  payment_Trx?: string
  payment_sources: PaymentSource[]
  payment_token?: string
}

export interface PaymentSource {
  amount?: number
  credit_token?: string
  customer_id?: number
  expiration: string
  order_id?: string
  paymentMethod?: string
  payments: Payment2[]
  policy_code?: string
}


export interface Payment2 {
  current_billing_date?: string
  price?: number
  state?: string
}



export interface Image {
  id: any
  image_type: string
  large_url: string
  mini_url: string
  original_url: string
  product_url: string
  small_url: string
}

export interface PaymentMethod {
  name: string
}

export interface Variant { }
export interface IQuote {
  data: Daum[]
  dataOrder: DataOrder
}

export interface Daum {
  currency: string
  discountedTotal: any
  nationalHealthCareTotal: any
  netTotal: any
  packetCode: string
  providerResponse: any
  taxesTotal: any
  total: string
  warranties: any
}

export interface DataOrder {
  data: Data
}
export interface Data {
  agenziaDiRiferimento: any
  anonymousUserData: any
  brokerId: number
  companyId: number
  createdAt: string
  createdBy: string
  customerId: number
  id: number
  insurancePremium: number
  intermediaryOrder: boolean
  language: any
  orderCode: string
  orderHistory: any
  orderItem: OrderItemQuote[];
  packet: any
  packetId: number
  parentOrder: any
  paymentToken: any
  paymentTransactionId: any
  paymentType: string
  policyCode: any
  product: any
  productCode: any
  productId: number
  productType: string
  stepState: any
  updatedAt: string
  updatedBy: string
  utmSource: any
  version: any
}
export interface OrderItemQuote {
  ceilings: any
  emission: any
  expiration_date: string
  external_id: any
  id: number
  instance: Instance
  master_policy_number: any
  packetId: number
  policy_number: any
  price: string
  product_id: number
  promotion: any
  quantity: number
  quotation: any
  start_date: string
  state: string
}

export interface Instance {
  chosenWarranties: ChosenWarranties
  quotation: Quotation
}
export interface Quotation {
  data: Daum2[]
}

export interface Daum2 {
  currency: string
  discountedTotal: any
  nationalHealthCareTotal: any
  netTotal: any
  packetCode: string
  providerResponse: any
  taxesTotal: any
  total: string
  warranties: any
}
export interface ICheckExistingPolicy {
  data: string;
}
export interface ICountries {
  countries: string[]
}

export interface ICountriesBreve {
  countries: ICountriesBreve2[]
}

export interface ICountriesBreve2 {
  align: any
  code: string
  errorMessage: string
  isReadOnly: boolean
  isRequired: boolean
  label: string
  maxLength: any
  options: {}
  type: number
  value: string
}

export interface NatCatnsuredItems {
  destination?: any;
  overSeventy?: string;
  underSeventy?: string;
  start_date?: string;
  expiration_date?: string;
  contraenteProprietarioEConduttore?: boolean,
  cap?: string,
  indirizzo?: string,
  comune?: string,
  provincia?: string,
  provinciaAbbr?: string;
  materialeDiCostruzione?: number,
  annoDiCostruzione?: number,
  numeroPianiEdificio?: number,
  pianoPiuBassoOccupato?: number,
  seller_code?: string
}

export interface NetCyberBusinessInsuredItems {
    destination?: any;
    overSeventy?: string;
    underSeventy?: string;
    start_date?: string;
    expiration_date?: string;
    contraenteProprietarioEConduttore?: boolean,
    cap?: string,
    indirizzo?: string,
    comune?: string,
    provincia?: string,
    materialeDiCostruzione?: number,
    annoDiCostruzione?: number,
    numeroPianiEdificio?: number,
    pianoPiuBassoOccupato?: number,
    seller_code?: string,
    number_employees_exceeded?: boolean
    
}
// WIP
export interface CyberCustomerInsuredItems {
  start_date?: string;
  expiration_date?: string;
  seller_code?: string
}

