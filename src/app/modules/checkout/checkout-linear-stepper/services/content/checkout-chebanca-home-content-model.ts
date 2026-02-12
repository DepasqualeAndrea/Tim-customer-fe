export interface CheckoutChebancaHomeContent {
  checkout_header?: {
    title: string;
    extra_title: string;
    secondary_title: string,
    partner_text: string;
    partner_icon: string;
    monthly_payment: string;
    annual_payment: string;
  };
  card_insured?: {
    title: string;
    metri_q: string;
    province: string;
    maximal: string;
    maximal_conduction: string;
    payment: string;
  };
  card_contractor?: {
    title: string;
    image: string;
    image_recap_proposals: string;
    title_recap_proposals: string;
    title_recap_customized: string;
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
    informative_set_gold: string,
    informative_set_silver: string,
    cost_detail_title: string,
    cost_detail_list: string[]
  };
  completed_steps: {
    insurance_info: {
      content: any
    }
  };
}
