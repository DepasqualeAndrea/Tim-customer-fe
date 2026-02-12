export interface CheckoutScreenProtectionContent {
    checkout_header?: {
        title: string;
        secondary_title: string;
        partner_text: string;
        partner_icon: string;
      };
    card_contractor?: {
        title: string;
        image: string;
        image_alt: string;
      };
    card_survey?: {
        title: string;
        image: string;
        image_alt: string;
        description: string;
        status: string;
      };
    card_payment?: {
        title: string
      };
    card_screen_protection?:{
        title: string;
        package: string;
        insured_number: string;
    };
    cost_item?: {
        validation_title: string;
        cost_detail_title: string;
        product_title_price: string;
        renovation_type: string;    
        informative_set: string;   
      };
}