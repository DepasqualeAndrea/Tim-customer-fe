export interface CheckoutScooterBikeContentModel {
  checkout_header?: {
    title: string;
    partner_text: string;
    partner_icon: string;
  };
  card_scooter_bike?: {
    title: string,
    product_variant: string
  };
  card_contractor?: {
    title: string;
    image: string;
  };
  card_payment?: {
    title: string
  };
  cost_item?: {
    product_name: string,
    validation_title: string,
    informative_set: string,
    cost_detail_title: string,
    cost_detail_by_product: string[],
    cost_detail_list: string[]
  };
  completed_steps:
    { insurance_info: { content: any } };
}
