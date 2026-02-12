export interface DiscountCouponValidationResponseModel {
  id?: number;
  code?: string;
  consumed_at?: string | null;
  created_at?: string;
  updated_at?: string;
  product_ids?: number[];
  order_ids?: [];
  status?: string;
  error?: string;
  session_started_at?: Date;
}

export const COUPON_CODE_LOCAL_STORAGE = 'coupon_code';

