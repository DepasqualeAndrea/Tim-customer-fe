export interface CheckoutYoloForSkiContent {
  checkout_header?: {
    title: string;
    secondary_title: string,
    partner_text: string;
    partner_icon: string;
  };
  card_insured?: {
    title: string,
    package: string,
    insured_subjects: string
  };
  card_contractor?: {
    title: string;
    image: string;
  };
  card_survey?: {
    title: string;
    image: string;
    description: string;
    status: string;
  };
  card_payment?: {
    title: string
  };
  card_date_time?: {
    title: string;
    instant_option: string;
    other_date_option: string;
  };
  banner?: {
    before_seasonal: string;
    inside_seasonal: string;
    after_seasonal: string;
    instant_default: string;
  };
  cost_item?: {
    product_name: string,
    validation_title: string,
    product_title_price: string,
    informative_set: string
    cost_detail_title: string,
    cost_detail_list: string[]
  };
  completed_steps: {
    insurance_info: {
      content: any
    }
  };
}
