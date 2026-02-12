export interface CheckoutFcaRcAutoContent {
    checkout_header?: {
        title: string;
        partner_text: string;
        partner_icon: string;
    };
    card_vehicle?: {
        title: string,
        displacement: string,
        birth_date: string,
        residential_city: string
    };
    card_contractor?: {
        title: string;
        image: string;
    };
    card_consents?: {
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
        product_title_price: string,
        informative_set: string,
        informative_set_truck: string,
        cost_detail_title: string,
        cost_detail_list: string[]
    };
    completed_steps:
    { insurance_info: { content: any } };
}
