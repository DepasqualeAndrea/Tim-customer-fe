 import { Component, OnInit, Input } from '@angular/core';
import { CheckoutProduct } from '../../checkout.model';
import { CheckoutStepPriceChange } from '../../checkout-step/checkout-step.model';

@Component({
  selector: 'app-checkout-card-recap-complete',
  templateUrl: './checkout-card-recap-complete.component.html',
  styleUrls: ['./checkout-card-recap-complete.component.scss']
})
export class CheckoutCardRecapCompleteComponent implements OnInit {

  @Input() product: CheckoutProduct;

  @Input() totalPrice: any;

  order: string;

  constructor(
  ) { }

  ngOnInit() {
   this.order = this.product.orderId;
  }

}
