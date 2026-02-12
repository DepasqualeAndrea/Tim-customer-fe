export interface CheckoutYoloMultiriskContent {
    card_contractor?: {
      title: string;
      image: string;
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
      product_name: string,
      validation_title: string,
    };
    completed_steps: {
      insurance_info: {
        content: any
      }
    }
  }
