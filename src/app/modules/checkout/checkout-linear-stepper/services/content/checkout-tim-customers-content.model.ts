export interface  CheckoutTimCustomersContent {
  checkout_header: {
    title:            string,
    secondary_title:  string,
    partner_text:     string,
    partner_icon:     string
  },
  cost_item: {
    validation_title:     string,
    cost_detail_title:    string,
    informative_set:      string,
    icon_1:               string,
    icon_2:               string,
    icon_3:               string,
    product_title_price:  string,
    hide_payment_price :       boolean,
    one_month_homage : string,
    priceFromQuote : string,
    cost_detail_by_product: string[]
  },
  card_contractor: {
    image:      string,
    image_alt:  string,
    title:      string
  },
  card_payment: {
    title:      string
  },
}