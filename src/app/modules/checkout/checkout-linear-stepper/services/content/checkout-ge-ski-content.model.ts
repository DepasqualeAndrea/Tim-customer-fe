export interface CheckoutGeSkiContent {
  checkout_header?: {
    title: string;
    secondary_title: string,
    partner_text: string;
    partner_icon: string;
    partner_icon_white: string;
    assicurazione_sci_plus: string;
    assicurazione_sci_premium: string;
  };
  card_insured?: {
    title: string,
    package: string,
    insured: string,
    where_play_sport: string,
    duration: string,
    protezione_sport_invernali: string
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
    cost_detail_by_product: any,
    insurance_package: string,
    optional_packages: string,
    protezione_sport_invernali_plus: string,
    protezione_sport_invernali_premium: string,
    assicurazione_sci_plus_1: string,
    assicurazione_sci_premium_2: string,
  };
  completed_steps: {
    insurance_info: {
      content: any
    }
  };
}
