export interface CheckoutGeHolidayHouseContent {
  checkout_header?: {
    title: string;
    partner_text: string;
    partner_icon: string;
  };
  card_house?: {
    title: string,
    duration_insurance: string,
    package: string,
    insured: string
  };
  card_insurance?: {
    title: string;
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
    product_price: string,
    informative_set: string,
    cost_detail_title: string,
    discount_title: string,
    cost_detail_by_product: string[]
  };
  completed_steps:
    { insurance_info: { content: any } };
}
