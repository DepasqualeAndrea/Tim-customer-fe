export interface CheckoutTimMyHomeContent {
    checkout_header?: {
      title: string;
      extra_title: string;
      secondary_title: string,
      partner_text: string;
      partner_icon: string;
    };
    card_contractor?: {
      title: string;
      image: string;
      image_recap_proposals: string;
      title_recap_proposals: string;
      title_recap_customized: string;
    };
    card_survey?: {
      title: string;
      image: string;
      description: string;
      status: string;
    };
    card_payment?: {
      title: string
    };
    cost_item?: {
      default_addon: string;
      product_name: string,
      validation_title: string,
      product_title_price: string,
      icon_1: string,
      icon_2: string,
      icon_3: string,
      informative_set: string,
      informative_set_double: string,
      cost_detail_title: string,
      cost_detail_list: string[]
    };
    completed_steps: {
      insurance_info: {
        content: any
      }
    };
  }
