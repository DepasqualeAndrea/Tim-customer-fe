export interface CheckoutTelemedicinaContent {
  card_insurance_info: {
    title: string;
    image: string;
    pagamento_text: string;
    insured_subjects: string;
  },
  card_contractor: {
    image: string;
    image_alt: string;
    title: string;
  },
  card_payment: {
    title: string;
  },
  cost_item: {
    product_name: string
    validation_title: string;
    cost_detail_title: string;
    product_title_price: string;
    informative_set: string;
    promo_prefix: string;
    coverage_texts: [];
  },
  checkout_header: {
    title: string;
    partner_text: string;
    partner_icon: string;
  }
}