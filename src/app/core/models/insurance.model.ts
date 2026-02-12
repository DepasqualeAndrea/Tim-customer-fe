import { CarAttributes, OrderAttributes } from '@model';

export class InsuranceWrapper {
  insurances?: Insurance[];
  count?: number;
  current_page?: number;
  pages?: number;
  per_page?: number;
  total_count?: number;
  addons: any;
}

export class Insurance {
  // Nyp 
  payment: PolicyPayment;
  orderCode: string;
  refund_requested: boolean;
  insured_entities: Insuredentities;
  // Nyp 

  id?: number;
  policy_number?: string;
  master_policy_number?: string;
  quantity?: number;
  completed_at?: string;
  start_date?: string;
  expiration_date?: string;
  insured_is_contractor?: boolean;
  papery_docs?: boolean;
  withdrawal_requested?: boolean;
  replace_enqueued_at?: any;
  subscription_state?: string;
  appliances_properties?: any;
  pet_properties?: any;
  status?: string;
  actions_availability?: ActionsAvailability;
  insurance_info?: any;
  certificate?: string;
  name?: string;
  state?: string;
  marked_as_renewable?: boolean;
  product?: Product;
  variant?: Variant;
  price?: number;
  claim?: any;
  only_contractor?: boolean;
  maximum_insurable?: number;
}

export class ProductsList {
  products: Product[] | ExternalProduct[];
  count: number;
  total_count: number;
  current_page: number;
  per_page: number;
  pages: number;
}

export class ActionsAvailability {
  deactivable: boolean;
  reactivable: boolean;
  suspendable: boolean;
  withdrawable: boolean;
  renewable: boolean;
  downsellable: boolean;
  markable_as_unrenewable: boolean;
  silent_renewable: boolean;
  claim_eligible: boolean;
}

export class Product {
  id?: number;
  product_code?: string;
  name?: string;
  business?: boolean;
  title_prod?: string;
  short_description?: string;
  description?: string;
  conditions?: string;
  information_package?: string;
  conditions_package?: string;
  display_price?: string;
  price?: number;
  only_contractor?: boolean;
  maximum_insurable?: number;
  can_open_claim?: boolean;
  checkout_behavior?: string;
  holder_maximum_age?: number;
  holder_minimum_age?: number;
  show_in_dashboard?: boolean;
  show_as_recommended?: boolean;
  images?: Image[];
  payment_methods?: PaymentMethod[];
  addons?: any[] | any;
  properties?: Property[];
  type?: string;
  category?: any;
  variants?: Variant[];
  questions?: Question[];
  provider?: Provider;
  master_variant?: number;
  goods?: Goods[];
  extras?: any[];
  means_of_transport?: any;
  start_price?: string;
  available_on?: string;
  sku?: string;
  product_structure?: ProductStructure;
  categories?: string[];
  attributes?: ProductAttributes;
  configuration?: { [key: string]: any };
  promotion?: string

}

export class ProductAttributes {
  show_instant: boolean;
  hide_seasonal: boolean;
  season_start_date: string;
  season_end_date: string;
}
export interface Addon {
  id: number;
  code: string;
  name: string;
  description: string;
  ceilings: number[];
  image: {
    id: number;
    image_type: string;
    mini_url: string;
    small_url: string;
    product_url: string;
    large_url: string;
    original_url: string;
  };
  taxons: any[];
  price: number;
  prices: Price[];
  selectedMaximal?: string;
  datePurchase?: string;
  selected?: boolean;
  valueTravel?: any;
  maximal?: any;
}

export interface Price {
  id: number;
  price: string;
  currency: string;
  country_iso: any;
  addon_id: number;
  deleted_at: any;
  created_at: string;
  updated_at: string;
  variant_id: any;
}

export interface ProductStructure {
  template_properties?: {
    thumbnail?: boolean,
    privacy_documentation_link?: string,
    informative_set?: string,
    attachment_3_4?: string
  };
  product_configuration?: {
    visible?: boolean;
  };
}

export const VARIANT_TYPE_DAY = 'day';

export class ExternalProduct extends Product {
  external_url: string;
}

export class Variant {
  id?: number;
  name?: string;
  option_values?: OptionValue[];
  presentation?: string;
  price?: number;
  duration?: number;
  fixed_start_date?: string;
  fixed_end_date?: string;
  sku?: string;
}

export class OptionValue {
  id?: number;
  name?: string;
  presentation?: string;
  option_type_name?: string;
  option_type_id?: number;
  duration?: number;
}

export class Image {
  id?: number;
  image_type?: string;
  mini_url?: string;
  small_url?: string;
  product_url?: string;
  large_url?: string;
  original_url?: string;
}

export class PaymentMethod {
  id: number;
  name: string;
  type: string;
  externalId?: number;
}

export class Property {
  value: string;
  name: string;
}

export class Question {
  id: number;
  content: string;
  acceptable_answers: AcceptableAnswer[];
}

export class AcceptableAnswer {
  id: number;
  question_id: number;
  value: string;
  rule: any;
  created_at: Date;
  updated_at: Date;
  position: number;
}

export class Provider {
  name: string;
  image_url: string;
}

export class Goods {
  brand?: string;
  model?: string;
  technology?: string;
  variant_id?: number;
}

export class ViaggiQuotationRequest implements OrderAttributes {
  variant_id: number;
  start_date: string;
  duration: number;
  destination_id: number;
  quantity: number;
  addons?: Array<string>;
  number_of_insureds_25: number | string;
  number_of_insureds_50: number | string;
  number_of_insureds_60: number | string;
  number_of_insureds_65: number | string;
}

export class SunnyQuotationRequest {
  start_date: string;
  end_date: string;
  destination: string;
}

export class Addons {
  code: string;
  price: number;
}

export class ViaggiQuotationResponse {
  total: number;
  addons: Array<Addons>;
  total_base: number;
}

export class SunnyQuotationResponse {
  total: number;
  total_base: number;
  price: number;
}

export class BikeQuotationRequest implements OrderAttributes {
  variant_id: number;
  start_date: string;
  duration: number;
  quantity: number;
  addons: Array<string>;
  number_of_insureds_25: number | string;
  number_of_insureds_50: number | string;
  number_of_insureds_60: number | string;
  number_of_insureds_65: number | string;
}

export class BikeQuotationResponse {
  total: number;
  total_base: number;
  addons: Array<Addons>;
}

export class CrumbLink {
  name: string;
  route: string;
}

export enum PolicyNotificationType {
  SubscriptionUncharged = 'subscription_uncharged_successfully',
  SubscriptionCharged = 'subscription_charged_successfully'
}

export class PolicySubscription {
  id: number | string;
  code: string;
  state: string;
  insurance_id: number;
  payment_source_id: number;
  created_at: string;
  updated_at: string;
}

export class PolicyNotification {
  id: number | string;
  kind: PolicyNotificationType;
  current_billing_cycle: number;
  next_billing_date: string;
  subscription: PolicySubscription;
  current_billing_date: string;
  price: number;
  display_price: string;
  receipt_certificate_url?: string;
}

export class PolicyNotificationSummary {
  count: number;
  current_page: number;
  notifications: PolicyNotification[];
  pages: number;
  per_page: number;
  total_count: number;
}

export class PolicyPayments {
  price: number;
  state: string;
  current_billing_date: string;
  next_billing_date: string;
  certificate_url?: string;
}

export class DasQuotationRequest {
  tenant: string;
  product_code: string;
  product_data: {
    variant_sku: string;
    addon_ids: string[];
  };
}

export interface DasQuotationResponse {
  total?: string;
  display_total?: string;
  additional_display_total?: string;
  additional_total?: number;
  addons?: DasQuotationResponseAddon[];
}

class DasQuotationResponseAddon {
  id: string;
  price: string;
}

export class SportQuotationResponse {
  total: number;
  total_base: number;
  addons: Array<Addons>;
}

export class ProvidersQuoteRequest {
  tenant: string;
  product_code: string;
  product_data: {
    variant_name: string;
    quantity: any;
    start_date: string;
    expiration_date: string;
    destinations: DestinationTravelRequest[];
    addons: AddonTravelRequest[];
  };
}

export class ProvidersQuoteRequestMotor {
  order_id: number;
  product_code: string;
  car_data: CarAttributes;
  addons_list?: AddonMotorRequest[];
  user_data?: any;
}

export class ProvidersQuoteRequestHome {
  order_id: number;
  product_code: string;
  car_data?: CarAttributes;
  addons_list?: AddonHomeRequest[];
  user_data?: any;
}

export class ProvidersQuoteRequestHomeProposal {
  line_item_id: number;
}

export class PetHelvetiaRequest {
  token?: string;
  tenant?: string;
  product_code?: string;
  product_data?: {
    variant_name?: string;
    expiration_date?: any;
    start_date?: any;
    payment_type?: string;
    pets?: PetDataInfo[],
    addons?: any;
  };
}

export class PetDataInfo {
  name: any;
  type: any;
  breed: any;
  microchip: any;
  birth_date: any;
}

export class DestinationTravelRequest {
  code: string;
  name?: string;
  helvetia_code?: string;
  zone?: string;
}

export class RCRequest {
  tenant: string;
  product_code: string;
  product_data: {
    zone: string,
    displacement: string,
    quotation_age: number,
    car_type: string
  };
}

export class CyberRequest {
  tenant: string;
  product_code: string;
  product_data: {
    revenue?: string;
    duration?: string
  };
}

export class EhealthStdRequest {
  tenant: string;
  product_code: string;
  product_data: {};
}

export class MotorRequestQuote {
  product_code: string;
  license_plate: string;
  birth_date: string;
  zipcode: string;
  province_code: string;
  toponym: string;
  city: string;
  address: string;
  civic_number: string;
}

export class HomeRequestQuote {
  product_code: string;
  sqm: number;
  usage: string;
  state_id: number;
  start_date: string;
  payment_type: string;
  insured_pets?: number;
  secure_location?: boolean;
  usual_residence?: boolean;
  ceiling?: number;
  addons: AddonHomeRequest[];
}

export class TimMyHomeRequestQuote {
  product_data?: any;
  product_code: string;
  user_id: number;
  secure_location?: boolean;
  usual_residence?: boolean;
  ceiling?: number;
  addons?: AddonHomeRequest[];
}

export class MotorSetUpRequest {
  token: any;
  tenant: string;
  product_code: string;
  product_data: any;
}

export class AddonTravelRequest {
  code: string;
  maximal?: string;
  purchase_date?: string;
  travel_value?: string;
}

export class AddonMotorRequest {
  code: string;
  maximal?: string;
}

export type AddonHomeExtraParams = {
  buildingType?: string;
  material?: string;
  state?: string;
  cityCode?: string;
}

export type AddonHomeRequest = {
  code: string;
  maximal?: string | number;
  params?: AddonHomeExtraParams;
  selected?: boolean;
}

export class RequestWithdraw {
  withdraw: {
    message: string;
    policy_number: number | string;
    data: RequestWithdrawData;
  };
}

export class RequestWithdrawIBAN {
  withdraw: {
    message: string;
    policy_number: number | string;
    iban: string;
  };
}

export class ReplacementRequest {
  recision: {
    reason: string;
  };
}

export class ReplacementRequestWithIBAN {
  recision: {
    reason: string;
    iban: string;
  };
}

export class RequestWithdrawData {
  bank_account: string;
}

export class GenericRequest {
  message: string;
  policy_number: number | string;
  data: GenericRequestData;
}

export class GenericRequestData {
  bank_account: string;
}

export class Quotes {
  estimates?: Quote[];
  count?: number;
  current_page?: number;
  pages?: number;
  per_page?: number;
  total_count?: number;
}

export class Quote {
  id: number;
  estimate_number: string;
  order_id: number;
  created_at: string;
  updated_at: string;
  payment_frequency: string;
  images: Image[];
  product_name: string;
  insured_entities: InsuredEntities;
  order_number: string;
  actions_availability: Actions;
  item_total: number;
  total: number;
  payment_total: number;
  display_item_total: string;
  display_total: string;
  estimate_proposal_url: string;
}

export class Actions {
  can_modify: boolean;
  can_buy: boolean;
  for_sale: boolean;
}

export class InsuredEntities {
  insurance_holders: any;
  shipment_address_attributes: any;
  insureds_excel: any;
  pets: any;
  house: any;
  houses: any;
  car: Car;
  bike: any;
  appliances: any;
}

export class Car {
  id: number;
  license_plate: string;
  brand: string;
  model: string;
  displacement: string;
  power_supply: string;
  universal_class: string;
  registration_year: string;
  value: number;
  has_airbag: boolean;
  in_secure_location: boolean;
  has_abs: boolean;
  alarm: string;
  annual_km: number;
  expert_driver: boolean;
  genertel_evaluation_class: number;
  usage: string;
}

export class ClaimReport {
  policy_number: number | string;
  date: string;
  message: string;
  note: string;
  claim_type?: string;
  attachments_attributes: any[];
}

interface Payment {
  current_billing_date: string;
  price: number;
  state: string;
}
interface Paymentsource {
  amount: number;
  billingId: string;
  credit_token?: any;
  customer_id: number;
  expiration: string;
  holder: string;
  id: number;
  lastDigits?: any;
  order_id: string;
  paymentMethod: string;
  payment_method_id: number;
  payments: Payment[];
  policy_code: string;
  type: string;
}
interface PolicyPayment {
  paymemt_method_id: number;
  payment_Trx?: any;
  payment_sources: Paymentsource[];
  payment_token?: any;
}

interface Pet {
  birth_date?: string;
  kind?: string;
  microchip_code?: string;
  name?: string;
}
interface Insuredentities {
  pets: Pet[];
}