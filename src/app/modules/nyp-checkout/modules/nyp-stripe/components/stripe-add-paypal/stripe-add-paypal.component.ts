import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NypStripeModule } from '../../nyp-stripe.module';
import { NypStripeService } from '../../services/nyp-stripe.service';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';

@Component({
    selector: 'nyp-stripe-add-paypal',
    templateUrl: './stripe-add-paypal.component.html',
    styleUrls: ['./stripe-add-paypal.component.scss'],
    standalone: false
})
export class StripeAddPaypalComponent implements OnInit {
  @Output() paid = new EventEmitter<void>();

  constructor(
    private nypStripeService: NypStripeService,
    private nypDataService: NypDataService,
  ) { }

  ngOnInit(): void {
    NypStripeModule.paymentElement
      .create('expressCheckout')
      .on('confirm', this.pay)
      .mount('#express-checkout-element')
      ;
  }

  pay() {
    this.nypStripeService
      .payBySepa(this.nypDataService.Order$.value.orderCode)
      .subscribe(() => this.paid.emit());
  }
}
