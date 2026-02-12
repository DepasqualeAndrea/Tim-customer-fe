export interface CheckoutTimMySciContent {
    checkout_header?: {
      title: string;
      extra_title: string;
      secondary_title: string,
      partner_text: string;
      partner_icon: string;
    };
    card_contractor?: {
      insured_number: string;
      insured_number_image: string;
      insured_number_alt: string;

      policy_duration: string;
      policy_duration_image: string;
      policy_duration_alt: string;

      image_recap_proposals: string;
      title_recap_proposals: string;
      image_alt_recap_proposals: string

      insured_data: string;
      insured_data_image: string;
      insured_data_alt: string;

      title: string;
      image: string;
      image_alt: string;
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
      cost_detail_title: string,
      cost_detail_list: string[]
    };
    completed_steps: {
      insurance_info: {
        content: any,
        display_data?: {value: string, label: string}[]
      }
    };
  }