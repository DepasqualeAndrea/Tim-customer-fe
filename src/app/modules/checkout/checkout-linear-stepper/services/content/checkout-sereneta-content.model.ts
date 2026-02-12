export interface CheckoutSerenetaContent {
  checkout_header?: {
    title: string;
    partner_text: string;
    partner_icon: string;
  };
  card_sereneta?: {
    title: string;
    name_insurance_holder: string;
    surname_insurance_holder: string;
    age_insurance_holder_label: string;
    age_insurance_holder_value: string;
    duration_insurance_label: string;
    duration_insurance_value: string;
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
    product_name: string,
    validation_title: string,
    product_title_price: string,
    informative_set: string,
    cost_detail_title: string,
    cost_detail_list: string[]
  };
  completed_steps:
    { insurance_info: { content: any } };
}
