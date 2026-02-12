export interface CheckoutMoparContent {
  checkout_header?: {
    title: string;
    secondary_title: string,
    partner_text: string;
    partner_icon: string;
  };
  card_vehicle?: {
    title: string,
    coverage_start_date: string,
    coverage_expiration_date: string,
    license_plate: string;
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
    title: string
  };
  cost_item?: {
    product_name: string,
    validation_title: string,
    activate_from: string,
    product_title_price: string,
    informative_set: string,
    next_price_text: string,
    next_price: string,
    zero_price: string,
    shopping_free_month: string,
    cost_detail_title: string,
    cost_detail_list: string[]
  };
  completed_steps: {
    insurance_info: {
      content: any
    }
  };
}
