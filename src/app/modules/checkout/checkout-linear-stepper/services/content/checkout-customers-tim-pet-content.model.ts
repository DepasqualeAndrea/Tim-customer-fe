export interface CheckoutCustomersTimPetContent {
    checkout_header?: {
      title: string;
      secondary_title: string;
      partner_text: string;
      partner_icon: string;
    };
    card_pet?: {
      title: string;
      pet_type_label: string; 
      pet_type_image: string; 
      pet_type_alt: string;
      choose_policy_label: string; 
      choose_policy_image: string; 
      choose_policy_alt: string; 
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
      title: string
    };
    cost_item?: {
      product_name: string;
      validation_title: string;
      renovation_type: string;
      product_title_price: string;
      informative_set: string;
      cost_detail_title: string;
      cost_detail_list: string[]
    };
    // step_info?: {
    //   dog_cat_title_label: string;
    //   pet_selection_label: string;
    //   pet_name_label: string;
    //   pet_birth_date_label: string;
    //   pet_extra_info_label: string;
    // }
    completed_steps: {
      insurance_info: {
        content: any;
      }
    };
  }