export interface CheckoutMyPetContent {
  checkout_header?: {
    title: string;
    secondary_title: string;
    partner_text: string;
    partner_icon: string;
  };
  card_pet?: {
    title: string;
    pet_name: string;
    pet_type: string;
    birth_date: string;
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
  completed_steps: {
    insurance_info: {
      content: any;
    }
  };
}
