export interface CheckouTimMotorContent {
  checkout_header?: {
    title: string;
    partner_text: string;
    partner_icon: string;
  };
  cost_item?: {
    validation_title: string,
    informative_set: string,
    icon_1: string,
    icon_3: string,
    product_title_price: string,
    hideCoverageOptionsSection: boolean
  }
}
