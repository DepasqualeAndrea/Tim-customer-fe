export interface CheckoutYoloTutelaLegaleContent {
    checkout_header?: {
        title: string;
        partner_text: string;
        partner_icon: string;
    };
    card_company?: {
        title: string,
        employees_number: string,
        payment_method: string,
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
        cost_detail_title: string,
        cost_detail_list: string[],
        informative_set: string,
        product_title_price_month: string;
        product_title_price_annual: string;
    };
    completed_steps:
    { insurance_info: { content: any } };
}