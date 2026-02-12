import { Sexes } from 'app/modules/checkout/checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-genertel-sci/checkout-step-insurance-info-genertel-sci.component';
import { Variant } from './insurance.model';
import { PaymentMethods } from './user.model';

export class RequestOrder {
  state?: string;
  order?: InnerOrder;

  version?: string;

  constructor() {
    this.order = new InnerOrder();
  }
}

export class RequestCheckout {
  token: string;
  order_number: string;
  utm_source: string;
  telemarketer: number;
}

export class InnerOrder {
  line_items_attributes?: LineItemsAttributes;
  bill_address_attributes?: BillItemsAttributes;
  order_attributes?: OrderAttributesModel;
  use_billing?: boolean;
  payments_attributes?: Array<any>;

  constructor() {
    this.line_items_attributes = new LineItemsAttributes();
    this.bill_address_attributes = new BillItemsAttributes();
    this.order_attributes = new OrderAttributesModel();
  }
}

export class LineItemsAttributes {
  '0' = new LineFirstItem();
}

export class LineFirstItem {
  id?: number;
  variant_id?: number;
  quantity?: number;
  insured_is_contractor?: boolean;
  shipment_is_contractor?: boolean;
  insurance_holder_attributes?: InsuranceHoldersAttributes;
  insurance_holders_attributes?: { [key: string]: InsuranceHoldersAttributes };  // TBD
  shipment_address_attributes?: ShipmentAddressAttributes;
  shipments_address_attributes?: { [key: string]: ShipmentAddressAttributes };  // TBD
  vehicle_attributes?: CoveredTiresInfo;
  insurance_info_attributes?: InsuranceInfoAttributes;
  line_item_addons_attributes?: AddonInsuranceInfosAttribute[];
  houses_attributes?: HousesAttributes;
  pets_attributes?: ListPetsAttributes;
  pet_attributes?: PetsAttributes[];
  bike_attributes?: BikeAttributes;
  car_attributes?: CarAttributes;
  home_attributes?: HomeAttributes;
  answers_attributes?: any;
  papery_docs?: boolean;
  house_attributes?: any;
  building_attributes?: any;
  start_date?: any;
  expiration_date?: string;
  instant?: boolean;
  insurance_addons?: any;
  addon_ids?: number[];
  total?: number;
  quotation_number?: string;
  utm_source?: string;
  display_expiration_date?: string;
  payment_frequency?: ResponseOrderPaymentFrequency;
  days_number?: number;
  // To see - should we have these properties here?
  variant?: Variant;
  addons?: any;
  price?: number;
  pricing?: any;


  constructor() {
    this.insurance_info_attributes = new InsuranceInfoAttributes();
    this.insurance_holders_attributes = {};
    this.shipment_address_attributes = {};
    // this.pets_attributes = new ListPetsAttributes();
  }
}

type ResponseOrderPaymentFrequency = null | LineItemPaymentFrequency

export enum LineItemPaymentFrequency {
  MONTHLY = 'M',
  YEARLY = 'Y'
}

export type MyHomeHouseAttributes = {
  address: string;
  zipcode: string;
  state_id: number;
  house_number: string;
  construction_material: string;
  building_type: string;
  city: string;
  id: string | number;
  owner_type: string;
}

export class HomeAttributes {
  address: string;
  zipcode: string;
  state_id: number;
  city: string;
  building_type: string;
  building_floors: number;
  flat_floor: number;
  secure_location?: boolean;
  id: number;
  price?: number;

}

export class BuildingAttributes {
  employees_number: number;
  beds_number: number;
  building_type: string;
  state_id: number;
  address: string;
  city_id: number;
  zipcode: string;
}

export class CarAttributes {
  genertel_brand?: string;
  genertel_brand_description?: string;
  model_description?: string;
  power_supply?: string;
  license_plate?: string;
  displacement?: string;
  family_rc?: string;
  family_rc_license_plate?: string;
  family_rc_fiscal_code?: string;
  family_rc_origin_class?: string;
  registrationYear?: number;
  brandModel?: string;
  setUp?: string;
  vehicleValue?: string;
  airBag?: string;
  vehicleIsSafe?: string;
  abs?: string;
  theftProtection?: string;
  yearlyKm?: string;
  driverAge?: string;
  universalClass?: number;
  assignClass?: string;
  usageType?: string;
  fuel?: string;
  weight?: Number;
}

export class CoveredTiresInfo {
  id?: number;
  brand?: string;
  model?: string;
  licensePlate?: string;
}

export class InsuranceInfoAttributes {
  extra?: string;
  price?: number;
  travel_date?: string;
  travel_end_date?: string;
  booking_id?: string;
  booking_date?: string;
  destination_id?: number;
  axa_destination?: number;
  covercare_brand?: string;
  covercare_model?: string;
  covercare_technology?: string;
  covercare_imei?: string;
  covercare_receipt_number?: string;
  covercare_purchase_date?: string;
  covercare_test_device?: string;
  allianz_destination_id?: number | string;
  travel_destination?: number | string;
  transport_ids?: Array<number>;
  phone_number?: number;
  quotation_number?: string;
  destination_ids?: number[];
  addon_insurance_infos_attributes?: any;
  car_owner_attributes?: any;
  // to DELETE:
  // start_date?: any;
  // expiration_date?: string;
}

export class AddonInsuranceInfosAttribute {
  addon_id: number;
  maximal?: number;
  purchase_date?: string;
  travel_value?: string;
}

export class ListItemsHoldersAttributes {
  '0'?: InsuranceHoldersAttributes;
}

export class InsuranceHoldersAttributes {
  id?: number;
  relationship?: string;
  first_name?: string;
  last_name?: string;
  taxcode?: string;
  birth_date?: string;
  birth_country_id?: number | string;
  birth_state_id?: number | string;
  birth_city_id?: number | string;
  _destroy?: boolean;
  email?: string;
  phone?: number | string;
  address1?: string;
  zipcode?: string;
  city?: string;
  state_id?: string;
  country_id?: number;
  contractor?: boolean;
  only_contractor?: boolean;
  profession?: string;
  address?: string;
  toponym_code?: number;
  domicile_house_number?: string;
}

export class ShipmentAddressAttributes {
  id?: number;
  firstname?: string;
  lastname?: string;
  _destroy?: boolean;
  email?: string;
  phone?: number | string;
  address?: string;
  zipcode?: string;
  city?: string;
  state_id?: string;
  country_id?: number;
  gender?: Sexes
}

export class ListPetsAttributes {
  '0'?: PetsAttributes;
}

export class PetsAttributes {
  birth_date: any;
  kind: string;
  microchip_code?: string;
  name: string;
  breed: string;
  id?: number;
}

export class HousesAttributes {
  '0'?: HouseAttributes;
  '1'?: HouseAttributes;
}

export class HouseAttributes {
  address: string;
  zipcode: string;
  city: string;
  state_id: number;
  country_id: number;
  usage: string;
}

export class BikeAttributes {
  brand: string;
  model: string;
  purchase_date: string;
}

export class BillItemsAttributes {
  firstname?: string;
  lastname?: string;
  taxcode?: string;
  phone?: string;
  birth_date?: string;
  address1?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  country_id?: number;
  state_id?: number;
  birth_country?: string;
  birth_state?: string;
  birth_city?: string;
  birth_city_id?: number;
  birth_state_id?: number;
  birth_country_id?: number;
  business?: boolean;
  company?: string;
  vatcode?: string;
  imagin?: boolean;
  gender?: string;
  birth_state_abbr?: string;
  state_abbr?: string;
}

/** Response Order */
export class ResponseOrder {
  id?: number;
  number?: string;
  total?: number;
  state?: string;
  adjustment_total?: string;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
  completed_at?: string;
  payment_state?: string;
  email?: string;
  type?: string;
  special_instructions?: string;
  channel?: string;
  currency?: string;
  canceler_id?: string;
  item_total?: number;
  payment_total?: number;
  display_item_total?: string;
  total_quantity?: number;
  display_total?: string;
  token?: string;
  checkout_steps?: Array<string>;
  payment_method_id: number;
  payment_methods?: Array<any>;
  bill_address?: any;
  line_items?: Array<any>;
  payments?: Array<any>;
  credit_cards?: Array<any>;
  extra?: any;
  utm_source?: string;
  payments_sources: Array<PaymentMethods>;
  data?: any;
  additional_data?: any;
  estimate?: any;
  common_original_total?: any;
  common_adjustment_total?: any;
}

export interface OrderAttributes {
  number_of_insureds_25: number | string;
  number_of_insureds_50: number | string;
  number_of_insureds_60: number | string;
  number_of_insureds_65: number | string;
}

export class OrderAttributesModel {
  utm_source?: string;
  telemarketer?: number;
  number_of_insureds_25?: number | string;
  number_of_insureds_50?: number | string;
  number_of_insureds_60?: number | string;
  number_of_insureds_65?: number | string;
  [queryParam: string]: string | number | unknown | undefined
}
