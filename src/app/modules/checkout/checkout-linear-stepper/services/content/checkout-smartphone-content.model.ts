export interface CheckoutSmartphoneContent {
  checkout_header?: {
    title: string;
    partner_text: string;
    partner_icon: string;
};
card_insured?: {
    title: string,
    insured_name: string,
    birth_date: string,
    package: string,
    model: string,
    brand: string,
    kind: string,
    price_range: string,
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
    renovation_type: string,
    product_title_price: string,
    cost_detail_title: string,
    cost_detail_list: string[],
    informative_set: string,
};
completed_steps:
{ insurance_info: { content: any } };
}
