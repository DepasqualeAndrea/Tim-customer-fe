import { Component, OnInit, Input } from '@angular/core';
import {CheckoutProduct, CheckoutProductCostItem, CheckoutProductCostItemType} from '../checkout.model';

@Component({
  selector: 'app-checkout-shopping-cart-payment-details',
  templateUrl: './checkout-shopping-cart-payment-details.component.html',
  styleUrls: ['./checkout-shopping-cart-payment-details.component.scss']
})
export class CheckoutShoppingCartPaymentDetailsComponent implements OnInit {

  constructor() { }

  @Input() product: CheckoutProduct;

  ngOnInit() {
  }
  isAmountItem(item: CheckoutProductCostItem): boolean {
    return item.type === CheckoutProductCostItemType.regular || item.type === CheckoutProductCostItemType.discount || item.type === CheckoutProductCostItemType.total;
  }
  isValueItem(item: CheckoutProductCostItem): boolean {
    return item.type === CheckoutProductCostItemType.propertyValue;
  }
  isUnknownItem(item: CheckoutProductCostItem): boolean {
    return !this.isAmountItem(item) && !this.isValueItem(item);
  }

  getItemValue(item: CheckoutProductCostItem) {
    if(this.isAmountItem(item)) {
      return (item.amount || 0) * (item.period || 1);
    } else if(this.isValueItem(item)) {
      if(!!item.value)
        return item.value;
      else
        return (item.amount || 0) * (item.period || 1)
    }

    return '';
  }

}
