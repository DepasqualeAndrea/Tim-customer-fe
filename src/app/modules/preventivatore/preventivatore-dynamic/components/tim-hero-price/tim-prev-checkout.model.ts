import { Product, RequestOrder } from "@model"

export class CheckoutBehaviourRequest {
  product: Product;
  order: RequestOrder;
  router: string;
}
