import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-quotator-mopar-std',
    templateUrl: './quotator-mopar-std.component.html',
    styleUrls: ['./quotator-mopar-std.component.scss'],
    standalone: false
})
export class QuotatorMoparStdComponent  {

  
  @Input() product;
  @Output() actionEvent = new EventEmitter<any>();

  constructor (
  ) {
  }


  createOrderObj() {
    return {
      order: {
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

