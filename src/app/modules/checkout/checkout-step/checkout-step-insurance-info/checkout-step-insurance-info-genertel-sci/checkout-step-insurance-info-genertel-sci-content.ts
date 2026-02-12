export interface CheckoutSciGenertelContent {
  step_1?: {
    start_insurance?: string;
    choose_date_label?: string;
    choose_date_desc?: string;
    insurance_starting_date?: string;
    insurance_start_placeholder?: string;
    error_insurance_start?: string;
    start_today_label?: string;
    start_today_title?: string;
    start_today_desc?: string;
    title_insurance_seasonal?: string;
    desc_insurance_seasonal?: string;
    icon_seasonal?: string;
    seasonStartedActivation: string
    seasonNotStartedActivation: string
  };
  step_2?: {
    insured_title?: string;
    insured_number?: string;
    contractor_switch?: string;
    contractor_switch_secondary?: string;
    name?: string;
    error_name?: string;
    surname_label?: string;
    error_surname?: string;
    sex?: string;
    error_sex?: string;
    birth_date?: string;
    error_adult?: string;
    error_birth_date?: string;
  };
  step_3?: {
    title?: string;
    name?: string;
    error_name?: string;
    surname?: string;
    error_surname?: string;
    sex?: string;
    error_sex?: string;
    birth_date?: string;
    error_birth_date?: string;
    error_adult?: string;
    profession?: string;
    error_profession?: string;
    residence_title?: string;
    residence_province?: string;
    error_residence_province?: string;
    residence_city?: string;
    error_residence_city?: string;
    postal_code?: string;
    error_postal_code?: string;
    address?: string;
    error_address?: string;
    civic_number?: string;
    error_civic_number?: string;
  };
  step_4?: {
    title?: string;
    email?: string;
    confirm_email?: string;
    error_different_email?: string;
    phone?: string;
    privacy_info_txt?: string;
    privacy_info?: string;
    bubble_info?: string;
  };
  step_5?: {
    verify_data?: string;
    insurance_start_date?: string;
    insurance_end_date?: string;
    insurance_start_time?: string;
    insurance_end_time?: string;
    start_time_label?: string;
    end_time_label?: string;
    contractor_label?: string;
    contractor_name?: string;
    contractor_tax_code?: string;
    insured_label?: string;
    insured_name?: string;
    insured_tax_code?: string;
    info_set?: string;
    end_time_label_seasonal?: string;
  };
  step_6?: {
    payment_method?: string;
    credit_card?: string;
    paypal?: string;
    confirm_pay_btn?: string;
  };
  complete?: {
    success_title?: string;
    success_title_secondary?: string;
    success_img?: string;
    thank_you_page_txt?: string;
    thank_you_page_main_scelta_data?: string;
    thank_you_page_main_da_subito?: string;
    insurance_secondary_desc?: string;
    back_site_btn?: string;
  };
  checkout_common_labels?: {
    back?: string;
    continue?: string;
    genertel_icon?: string;
    date_icon?: string;
    select_icon?: string;
    info_icon?: string;
    date_placeholder: string;
    birth_country?: string,
    error_birth_country?:  string,
    birth_state: string;
    error_birth_state: string;
    birth_city: string;
    error_birth_city: string;
    tax_code: string;
    error_tax_code?: string;
    error_check_cin?: string;
    continue_for?: string;
  };
  modal?: {
    modal_txt?: string;
    btn_txt?: string;
  };

}

