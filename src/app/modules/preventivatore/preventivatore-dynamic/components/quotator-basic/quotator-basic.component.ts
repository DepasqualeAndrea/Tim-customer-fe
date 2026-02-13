import {Component, EventEmitter, Input, Output} from '@angular/core';
import { DataService } from '@services';

@Component({
    selector: 'app-quotator-basic',
    templateUrl: './quotator-basic.component.html',
    styleUrls: ['../preventivatore-basic.component.scss'],
    standalone: false
})
export class QuotatorBasicComponent {

  @Input() product;
  @Output() actionEvent = new EventEmitter<any>();
  @Output() swipeEvent = new EventEmitter<string>();

  constructor(public dataService: DataService){
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
    const order = this.createOrderObj(this.product.master_variant);
    this.sendCheckoutAction(order);
    // this.checkoutService.addToChart(order).subscribe((res) => {
    //   this.dataService.setResponseOrder(res);
    //   this.dataService.setProduct(this.product);
    //   return this.router.navigate(['apertura']);
    // });
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

  onSwipe(event) {
    const direction = Math.abs(event.deltaX) > 40 ? (event.deltaX > 0 ? 'right' : 'left') : '';
    this.swipeEvent.next(direction);
  }
}
