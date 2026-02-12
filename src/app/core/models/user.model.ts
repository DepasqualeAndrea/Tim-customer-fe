export class User {
  id?: number;
  address?: Address;
  bill_address_attributes?: Address;
  password?: string;
  confirmed?: boolean;
  email?: string;
  firstname?: string;
  lastname?: string;
  birth_date?: string;
  profession?: string;
  education?: string;
  salary?: string;
  phone?: string;
  business?: boolean;
  payment_methods?: PaymentMethods[];
  user_acceptances?: AcceptanceAttributes[];
  user_acceptances_attributes?: AcceptanceAttributes;
  userAcceptances?: any;
  token?: string;
  locked_anagraphic?: boolean;
  utm_source?: string;
  sso_address?: Address;
  is_same_address?: boolean;
  sex?: string;
  data?: {
    ndg?: string;
    cid?: string;
    user_type?: string;
    tim_user_type?: string;
    automatic_discount_code?: string;
    company?: string;
    vatcode?: string;
    sdiCode?: string;
    tax_code?: string;
    difference_taxcode?: string;
    country_id?: number;
    country?: string;
    state_id?: number;
    state?: string;
    state_abbr?: string;
    city_id?: number;
    city?: string;
    street?: string;
    zip_code?: string;
    certifiedMail?: string;
    primary_phone?: string;
    name?: string;
    surname?: string;
    vatTaxDifference?: boolean;
    individualFirm?: boolean;
    legalRepresentativeInfo?: LegalRap[];
  };
  constructor() {
    this.address = new Address();
    this.bill_address_attributes = new Address();
    this.user_acceptances = [];
    this.payment_methods = [];
  }
}

export class QueryParamUserData {
  uid?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  payment_callback_url?: any;
}

export class Address {
  id?: number;
  firstname?: string;
  lastname?: string;
  company?: string;
  address1?: string;
  city?: string;
  city_id?: number;
  zipcode?: string;
  phone?: string;
  taxcode?: string;
  vatcode?: string;
  birth_date?: string;
  country?: Country;
  state?: State;
  birth_state?: State;
  country_id?: number;
  state_id?: number;
  birth_state_id?: number | State;
  birth_country?: Country;
  birth_city?: any;
  residence_country?: string;
  residence_country_id?: number;
  residence_city?: string;
  residence_state?: string;
  birth_country_id?: number;
  birth_city_id?: number;
  locked_anagraphic?: boolean;
  email?: string;
  sex?: string;
  constructor() {
    this.country = new Country();
    this.state = new State();
    this.birth_state = new State();
    this.birth_country = new Country();
    this.birth_city = new City();
  }
}

export class LegalRap {
  lastname?: string;
  firstname?: string;
  taxcode?: string;
  mail?: string;
  country?: string;
  country_id?: number;
  state?: string;
  state_id?: number;
  state_abbr?: string;
  city?: string;
  city_id?: number;
  zipcode?: string;
  street?: string;
}

export class Country {
  id?: number;
  iso_name?: string;
  iso?: string;
  iso3?: string;
  name?: string;
  numcode?: number;
  states_required?: boolean;
  abbr?: string;
}

export class Areas {
  area: number;
  country: string;
  helvetia_code: string;
  id: number;
  position: string;
}

export class Pets {
  dogs: any;
  cats: any;
}

export class State {
  id?: number;
  name?: string;
  abbr?: string;
  country_id?: number;
  cities_required?: boolean;
}

export class City {
  id?: number;
  name?: string;
  state_id?: number;
  code?: string;
}

export class PaymentMethods {
  id?: number;
  month?: string;
  year?: string;
  cc_type?: string;
  last_digits?: string;
  gateway_customer_profile_id?: string;
  gateway_payment_profile_id?: string;
  created_at?: string;
  updated_at?: string;
  name?: string;
  user_id?: number;
  payment_method_id?: number;
  default?: boolean;
  address_id?: number;
  data?: Data;
  deleted_at?: string;
  payment_id?: string;

  constructor() {
    this.data = new Data();
  }
}

export class AcceptanceAttributes {
  [key: string]: {
    id?: number;
    flag_id?: number;
    value?: boolean;
    flag?: string;
    tag?: string;
  }
}

export class Data {
  email?: string;
}

export class SocialAuth {
  auth_hash: {
    uid: string,
    token: string,
    secret: string,
    provider: string,
    email: string
  };
  user: {
    password?: string;
    email?: string;
    firstname?: string;
    lastname?: string;
    birth_date?: string;
    phone: string;
  };
}
