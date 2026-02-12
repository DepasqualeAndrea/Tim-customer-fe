export interface CheckoutPetContent {
  checkout_header?: {
    title: string;
    extra_title: string;
    secondary_title: string;
    partner_text: string;
    partner_icon: string;
    monthly_payment: string;
    annual_payment: string;
  };
  card_insured?: {
    title: string;
    payment_title: string;
    insurances_quantity: string;
    microchip: string;
  };
  insured_subject?: {
    birthCountry: string
  };
  card_contractor?: {
    title: string;
    image: string;
    image_alt: string;
  };
  card_survey?: {
    title: string;
    status: string;
    description: string;
    image: string;
  };
  card_payment?: {
    title: string;
  };
  cost_item?: {
    validation_title: string;
    cost_detail_title: string;
    informative_set: string;
    product_title_price_month: string;
    product_title_price_annual: string;
    icon_1: any;
    icon_2: any;
    icon_3: any;
    cost_detail_with_code_by_product: {
      hpetbasic: any;
      hpetprestige: any;
      hpetvip: any;
    }
  };
  completed_steps:
    { insurance_info: { content: any } };
}
