import {RequestOrder} from '@model';
import {CheckoutProduct, CheckoutProductCostItem} from '../checkout.model';

export interface CheckoutStep {
  stepnum: number;
  name: string;
  completed: boolean;
  product: CheckoutProduct;
  previous?: CheckoutStep;
}

export interface CheckoutStepOperation {
  step: CheckoutStep;
  data: RequestOrder;
  confirm?: boolean;
}

export interface CheckoutStepPriceChange {
  additional_data?: any;
  previous: number;
  current: number;
  reason?: string;
  costItems?: CheckoutProductCostItem[];
  addons?: any;
}

export interface StepProgressBarAuthFalse {
  stepnum: number;
  name: string;
}

export interface CheckoutInfoDataWithAddons {
  employees_number: string;
  beds_number: string;
  building_type: string;
  province: string;
}
