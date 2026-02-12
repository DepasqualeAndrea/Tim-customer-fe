export interface CheckoutBikeContent {
  checkout_header?: {
    title: string;
    partner_text: string;
    partner_icon: string;
  };
  card_bike?: {
    title: string,
    start_date: string,
    end_date: string,
    duration_insurance: string,
    duration_insurance_value: string,
    payment: string,
    payment_value: string,
    brand_bike: string,
    model_bike: string,
    date_purchase: string
  };
  card_insurance?: {
    insurance_data: string,
    required_fields: string
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
    renovation_type: string,
    product_title_price: string,
    discount_title: string,
    recurrent_installment_title_price: string,
    recurrent_installment_unit: number,
    informative_set: string,
    cost_detail_title: string,
    cost_detail_by_product: string[]
  };
  completed_steps:
    { insurance_info: { content: any } };
}
