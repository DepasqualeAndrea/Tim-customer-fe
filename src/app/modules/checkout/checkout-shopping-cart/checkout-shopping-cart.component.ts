import {Component, Input, OnInit} from '@angular/core';
import {CheckoutProduct, CheckoutProductCostItem, CheckoutProductCostItemType} from '../checkout.model';
import {CheckoutStepPriceChange} from '../checkout-step/checkout-step.model';
import {KenticoTranslateService} from 'app/modules/kentico/data-layer/kentico-translate.service';
import {DataService} from '@services';

@Component({
  selector: 'app-checkout-shopping-cart',
  templateUrl: './checkout-shopping-cart.component.html',
  styleUrls: ['./checkout-shopping-cart.component.scss']
})
export class CheckoutShoppingCartComponent implements OnInit {
  cart: any;
  addonsPlusTotal: any;
  paymentType: number;
  tenant: string;
  @Input() product: CheckoutProduct;
  @Input() priceChange: CheckoutStepPriceChange;

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    public dataService: DataService,
    ) {
  }



  ngOnInit() {
    this.paymentType = this.product.paymentMethods[0].id;
    this.tenant = this.dataService.tenantInfo.tenant;
    if (this.product.code === 'trvlpcknet') {
      this.addonsPlusTotal = this.product.costItems.shift();
    }
    if (this.product.code !== 'chubb-deporte-rec' && this.dataService.tenantInfo.tenant !== 'yolo-crif_db') {
      this.mounthlyCost();
    }


  }

  mounthlyCost() {
    if (this.product.paymentMethods[0].type === 'Spree::Gateway::BraintreeRecurrent' || this.product.paymentMethods[0].type === 'Solidus::Gateway::YpaymentsGateway') {
      this.kenticoTranslateService.getItem<any>('checkout.monthly_payment').pipe().subscribe(item => {
        return this.product.costItems[0].name = item.value;
      });
    }
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
    if (this.isAmountItem(item)) {
      return (item.amount || 0) * (item.period || 1);
    } else if (this.isValueItem(item)) {
      if (!!item.value) {
        return item.value;
      }
      else {
        return (item.amount || 0) * (item.period || 1)
      }
    }

    return '';
  }

}
