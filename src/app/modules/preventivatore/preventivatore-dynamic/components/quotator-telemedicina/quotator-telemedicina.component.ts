import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';
import { PreventivatoreComponent } from 'app/modules/preventivatore/preventivatore/preventivatore.component';
import _ from 'lodash';

@Component({
    selector: 'app-quotator-telemedicina',
    templateUrl: './quotator-telemedicina.component.html',
    styleUrls: ['./quotator-telemedicina.component.scss'],
    standalone: false
})
export class QuotatorTelemedicinaComponent extends PreventivatoreComponent implements OnInit, DoCheck{

  @Input() product;
  @Output() actionEvent = new EventEmitter<any>();
  @Output() swipeEvent = new EventEmitter<string>();
  @Output() selectedPrice = new EventEmitter<number>();
  selectedProduct: any = null;

  variants = [];
  price: number = 7.5;
  hideSticky: number;

  ngOnInit() {
    this.setPackage(this.price);
  }

  ngDoCheck() {
    if (document.documentElement.scrollWidth < 400 && document.documentElement.scrollWidth > 350) {
      this.hideSticky = 2800;
    }
    else if (document.documentElement.scrollWidth < 350) {
      this.hideSticky = 3100;
    }
    else {
      this.hideSticky = 2540;
    }
  }

  setPackage(price) {
    this.price = price;
    this.selectedPrice.emit(price);
    this.selectedProduct = price === 90 ? this.product[0] : this.product[1];
  }

  createOrderObj(variant) {
    return {
      order: {
        line_items_attributes: {
          0: {
            variant_id: variant,
            quantity: 1
          },
        },
      }
    };
  }

  checkout() {
    const order = (this.price === 90) ? this.createOrderObj(this.product[0].master_variant) : this.createOrderObj(this.product[1].master_variant);
    this.sendCheckoutAction(order);
  }

  sendCheckoutAction(order: any) {
    const action = {
      action: 'checkout_product'
      , payload: {
        product: this.selectedProduct
        , order: order
        , router: 'checkout'
      }
    };
    this.emitActionEvent(action);
  }

  emitActionEvent(action: any) {
    this.actionEvent.next(action);
  }

  scrollHeight() {
    return document.documentElement.scrollTop;
  }

}
