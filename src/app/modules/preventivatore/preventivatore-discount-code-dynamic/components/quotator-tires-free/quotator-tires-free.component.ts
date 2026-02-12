import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-quotator-tires-free',
  templateUrl: './quotator-tires-free.component.html',
  styleUrls: ['./quotator-tires-free.component.scss']
})
export class QuotatorTiresFreeComponent {

  @Input() product;
  @Output() actionEvent = new EventEmitter<any>();

  constructor (
  ) {
  }


  createOrderObj() {
    return {
      order: {
        promo_token_attributes: {
            code: this.product.coupon_code
         },
        line_items_attributes: {
          0: {
            variant_id: this.product.master_variant,
            quantity: 1
          },
        },
      }
    };
  }

  checkout() {
    const order = this.createOrderObj();
    this.sendCheckoutAction(order);
  }

  sendCheckoutAction(order: any) {
    const action = {
      action: 'checkout_product'
      , payload: {
        product: this.product
        , order: order
        , router: 'checkout'
      }
    };
    this.emitActionEvent(action);
  }

  emitActionEvent(action: any) {
    this.actionEvent.next(action);
  }

}
