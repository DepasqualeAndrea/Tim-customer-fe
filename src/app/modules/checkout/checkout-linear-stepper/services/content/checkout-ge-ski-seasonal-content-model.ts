export interface CheckoutGeSkiContent {
  checkout_header?: {
    title: string;
    secondary_title: string,
    partner_text: string;
    partner_icon: string;
  };
  card_insured?: {
    title: string,
    package: string,
    insured: string,
    where_play_sport: string,
    duration: string
  };
  card_contractor?: {
    title: string;
    image: string;
  };
  card_survey?: {
    title: string; a
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
    informative_set_gold: string,
    informative_set_silver: string,
    cost_detail_title: string,
    cost_detail_list: string[],
    cost_detail_by_product: any;
    coverage_options_splited: any;
    const_detail_coverage_options: any;
  };
  completed_steps: {
    insurance_info: {
      content: any
    }
  };
}
