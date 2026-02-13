import { Component, OnInit } from '@angular/core';
import { NypStripeModule } from '../../nyp-stripe.module';
import { NypStripeService } from '../../services/nyp-stripe.service';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';

@Component({
    selector: 'nyp-stripe-embedded',
    template: '<div id="embedded-element"></div>',
    styleUrls: [],
    standalone: false
})
export class StripeEmbeddedComponent implements OnInit {

  constructor(
    private nypStripeService: NypStripeService,
    private nypDataService: NypDataService,
  ) { }

  ngOnInit(): void {
    this.nypStripeService.intent(this.nypDataService.Order$.value.orderCode)
      .subscribe(cs => NypStripeModule.Stripe
        .then(s => s.initEmbeddedCheckout({ clientSecret: cs }))
        .then(element => element.mount('#embedded-element'))
      );
  }

}
