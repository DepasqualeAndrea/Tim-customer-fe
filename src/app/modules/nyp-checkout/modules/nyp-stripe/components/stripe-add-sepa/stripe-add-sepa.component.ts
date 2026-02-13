import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from '@services';
import { StripeIbanElement } from '@stripe/stripe-js';
import { NypStripeModule } from '../../nyp-stripe.module';
import { NypStripeService } from '../../services/nyp-stripe.service';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';

@Component({
    selector: 'nyp-stripe-add-sepa',
    templateUrl: './stripe-add-sepa.component.html',
    styleUrls: ['./stripe-add-sepa.component.scss'],
    standalone: false
})
export class StripeAddSepaComponent implements OnInit {
  private ibanElement: StripeIbanElement;
  public stripeTest: UntypedFormGroup;
  @Output() paid = new EventEmitter<void>();

  constructor(
    private fb: UntypedFormBuilder,
    private nypStripeService: NypStripeService,
    private nypDataService: NypDataService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.stripeTest = this.fb.group({
      name: [`${this.authService.loggedUser?.firstname} ${this.authService.loggedUser?.lastname}`, [Validators.required, Validators.minLength(2)]],
      email: [`${this.authService.loggedUser?.email}`, [Validators.required, Validators.email]],
    });

    this.ibanElement = NypStripeModule.paymentElement
      .create('iban', {
        supportedCountries: ['SEPA',],
      });

    this.ibanElement.mount('#iban-element');
  }

  pay() {
    /* NypStripeModule
      .Stripe
      .confirmSepaDebitPayment(NypStripeModule.clientSecret, {
        payment_method: {
          sepa_debit: this.ibanElement,
          billing_details: {
            name: `${this.stripeTest.get('name').value}`,
            email: `${this.stripeTest.get('email').value}`,
          }
        }
      }).then(result => {
        if (result.error)
          alert(result.error.message)
        else {
          this.nypStripeService
            .payBySepa(this.nypDataService.Order$.value.orderCode)
            .subscribe(() => this.paid.emit());
        }
      }) */
  }

}
