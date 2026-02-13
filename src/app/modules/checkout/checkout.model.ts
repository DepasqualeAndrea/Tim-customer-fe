import {ResponseOrder, Addons, RequestOrder, Product, OrderAttributes} from '@model';
import moment from 'moment';
import DurationConstructor = moment.unitOfTime.DurationConstructor;

export interface CheckoutPeriod {
  startDate: Date;
  endDate?: Date;
  instant?: boolean;
  code?: string;
}

export interface CheckoutProduct extends CheckoutPeriod {
  id: number;
  addons?: any;
  orderId: string;
  lineItemId: number;
  variantId: number;
  duration?: number;
  durationUnit?: DurationConstructor;
  code: string;
  name: string;
  image: string;
  quantity: number;
  shipmentQuantity?: number;
  // detailItems: CheckoutProductDetailItem[];
  costItems: CheckoutProductCostItem[];
  currency: CheckoutCurrency;
  questions: CheckoutQuestion[];
  extra?: CheckoutExtra;
  order: ResponseOrder;
  originalProduct: any;
  product_name?: any;
  product_structure?: any;
  paymentMethods: any;
  selected_addons?: Array<Addons>;
  detailProductDeleted?: any;
}

// export interface CheckoutProductDetailItem {
//   name: string;
//   amount: number;
// }

export interface CheckoutProductCostItem {
  name: string;
  amount: number;
  multiplicator?: number;
  type?: CheckoutProductCostItemType;
  value?: string;
  period?: number;
}

export enum CheckoutProductCostItemType {
  regular,
  discount,
  total,
  yearlyPayment,
  monthlyPayment,
  propertyValue
}

export interface CheckoutCurrency {
  code: string;
  name?: string;
}

export interface CheckoutQuestion {
  id: number;
  content: string;
  acceptable_answers: AccetableAnswers[];
}

export interface AccetableAnswers {
  id: number;
  question_id: number;
  value: string;
  rule?: string;
  serverId: number;
}

export interface CheckoutExtra {
  label: string;
  values: any;
}

export interface CheckoutData {
  requestOrder: RequestOrder;
  responseOrder: ResponseOrder;
  product: Product;
  fromQuotator?: Boolean;
  quotationOrderAttributes?: OrderAttributes;
}

export type ProductData = CheckoutProduct & ResponseOrder;

