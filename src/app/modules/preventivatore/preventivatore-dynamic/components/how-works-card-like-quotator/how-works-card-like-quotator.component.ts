import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PreventivatoreAbstractComponent} from '../preventivatore-abstract/preventivatore-abstract.component';
import {DataService} from '@services';

@Component({
  selector: 'app-how-works-card-like-quotator',
  templateUrl: './how-works-card-like-quotator.component.html',
  styleUrls: ['./how-works-card-like-quotator.component.scss']
})
export class HowWorksCardLikeQuotatorComponent extends PreventivatoreAbstractComponent implements OnInit {

  product: any;

  constructor(
    ref: ChangeDetectorRef,
    private dataService: DataService
  ) {
    super(ref);
    this.dataService.getDataScooterBike().subscribe((data) => {
      this.product = data;
    });
  }

  ngOnInit() {
  }

  getVariantId(product: any, sku: string) {
    return product.variants.find(variant => variant.sku === sku).id;
  }

  getVariantPrice(sku: string) {
    return this.product.variants.find((variant) => variant.sku === sku).price.toFixed(2).toString().split('.')[0];
  }

  getVariantPriceDecimal(sku: string) {
    const price = this.product.variants.find((variant) => variant.sku === sku).price.toFixed(2).toString().split('.')[1];
    if (price === '00') {
      return undefined;
    } else {
      return price;
    }
  }

  selectedTab(productVariant) {
    this.data.selected_tab = productVariant;
  }

  createOrderObj(sku: string) {
    return {
      order: {
        line_items_attributes: {
          0: {
            variant_id: this.getVariantId(this.product, sku),
            quantity: 1
          }
        }
      }
    };
  }

  checkout(sku: string) {
    const order = this.createOrderObj(sku);
    this.sendCheckoutAction(order);
  }

  sendCheckoutAction(order: any) {
    const action = {
      action: 'checkout_product',
      payload: {
        product: this.product,
        order: order,
        router: 'checkout'
      }
    };
    this.sendActionEvent(action);
  }

}
