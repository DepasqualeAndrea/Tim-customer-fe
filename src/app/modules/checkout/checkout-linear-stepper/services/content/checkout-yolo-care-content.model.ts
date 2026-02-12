export interface CheckoutYoloCareContent {
  checkout_header?: {
    title: string;
    secondary_title: string,
    partner_text: string;
    partner_icon: string;
  };
  card_insured?: {
    title: string,
    coverage_type: string,
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
  cost_item?: {
    product_name: string,
    validation_title: string,
    product_title_price: string,
    informative_set: string,
    cost_detail_title: string,
    cost_detail_list: string[]
  };
  completed_steps: {
    insurance_info: {
      content: any
    }
  };
}
