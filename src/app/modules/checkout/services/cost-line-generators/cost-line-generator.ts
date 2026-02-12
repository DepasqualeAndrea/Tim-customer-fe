import { CheckoutProductCostItem } from '../../checkout.model';
export interface CostLineGenerator {
  computeCostItems(labelCostItems: string[]): CheckoutProductCostItem[];
}