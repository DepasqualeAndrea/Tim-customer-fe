import {CheckoutStep, CheckoutStepPriceChange} from 'app/modules/checkout/checkout-step/checkout-step.model';
import {CheckoutProduct} from 'app/modules/checkout/checkout.model';
import {CheckoutContractor} from 'app/modules/checkout/checkout-step/checkout-step-address/checkout-step-address.model';
import {CheckoutStepPaymentPromoCode} from 'app/modules/checkout/checkout-step/checkout-step-payment/checkout-step-payment.model';

export interface CheckoutLinearStepperGenericState {

  layout?: Partial<CheckoutLinearStepperLayout>;

  checkout_header: any;
  loading?: boolean;
  resolvedSteps?: CheckoutStep[];
  currentUrl?: string;
  scroll?: {
    scrollToElement: boolean
  };
  linerStepperBar?: {
    title: string,
    productName: string,
    partnerTitle: string,
    partnerImage: string
  };
  completed_steps?: {
    cost_item?: any,
    insurance_info?: any,
    insurance_holder?: any,
    insurance_survey?: any,
    insuranceHolder?: {
      visible?: boolean,
      contractor?: CheckoutContractor
    },
    survey?: {
      visible?: boolean,
    }
    payment?: {
      visible?: boolean
    }
  };
  uncompleted_steps?: string[];
  uncompleted_step_titles: { name?: string; title?: string; }[];
  cost_item?: any;
  payment_frequency?: any;
  model?: {
    product?: CheckoutProduct, steps?: CheckoutStep[], currentStep?: CheckoutStep, priceChange?: CheckoutStepPriceChange
  };
  order: {
    number: string
  };
  addons?: any[];
  addonsProposal?: any[];
  payment: {
    promoCode: CheckoutStepPaymentPromoCode;
  };
  collaboration_section?: {
    title: string;
    image: string;
  };
}

type CheckoutLinearStepperLayout = {
  container: string;
  header: string,
  completedSteps: string,
  uncompletedSteps: string,
  shoppingCart: string,
  costItemsDetails: string,
}
