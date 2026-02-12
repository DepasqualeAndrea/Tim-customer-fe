export interface CheckoutTravelContent {
  checkout_header?: {
    title: string;
    extra_title: string;
    secondary_title: string;
    partner_text: string;
    partner_icon: string;
  };
  card_insured?: {
    title: string;
    destination: string;
    travel_start_date: string;
    travel_end_date: string;
    insured_number: string;
    traveler_number: string;
  };
  insured_subject?: {
    birthCountry: string
  };
  card_contractor?: {
    title: string;
    image: string;
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
    product_name: string;
    validation_title: string;
    renovation_type: string;
    product_title_price: string;
    cost_detail_title: string;
    cost_detail_list: string[];
    informative_set: string;
  };
  completed_steps:
  { insurance_info: { content: any } };
}
