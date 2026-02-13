import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from '@services';
import { StripeCardCvcElement, StripeCardExpiryElement, StripeCardNumberElement } from '@stripe/stripe-js';
import { NypStripeModule } from '../../nyp-stripe.module';
import { IStripePayEl, NypStripeService } from '../../services/nyp-stripe.service';

@Component({
    selector: 'nyp-stripe-add-card',
    templateUrl: './stripe-add-card.component.html',
    styleUrls: ['./stripe-add-card.component.scss'],
    standalone: false
})
export class StripeAddCardComponent implements OnInit {
  @Output() tokenFromAddedCard = new EventEmitter<IStripePayEl>();

  public stripeTest: UntypedFormGroup;
  private cardNumber: StripeCardNumberElement;
  private cardExpiry: StripeCardExpiryElement;
  private cardCvc: StripeCardCvcElement;

  constructor(
    private fb: UntypedFormBuilder,
    private nypStripeService: NypStripeService,
    private authService: AuthService,) { }

  ngOnInit(): void {
    this.stripeTest = this.fb.group({
      name: [`${this.authService.loggedUser?.firstname} ${this.authService.loggedUser?.lastname}`, [Validators.required, Validators.minLength(2)]],
      isDefault: [true, [Validators.required]],
    });

    this.cardNumber = NypStripeModule.paymentElement
      .create('cardNumber', { style: NypStripeModule.CardElementStyle });
    this.cardNumber.mount('#card-number-element');

    this.cardExpiry = NypStripeModule.paymentElement
      .create('cardExpiry', { style: NypStripeModule.CardElementStyle });
    this.cardExpiry.mount('#card-expiry-element');

    this.cardCvc = NypStripeModule.paymentElement
      .create('cardCvc', { style: NypStripeModule.CardElementStyle });
    this.cardCvc.mount('#card-cvc-element');
  }

  createToken() {
    const body = {
      name: `${this.stripeTest.get('name').value}`,
    };

    NypStripeModule.Stripe
      .then(s => s.createToken(this.cardNumber, body))
      .then(result => this.nypStripeService.addNewCard(
        result.token?.id,
        this.stripeTest.get('isDefault').value,
        body,
      ))
      .then(newCard$ => newCard$.subscribe(newCard => this.tokenFromAddedCard.emit(newCard)));
  }
}

export interface INewCardStripe {
  token: string;
  isDefault: boolean;
  name: string;
  address_zip: string;
  address_state: string;
  address_city: string;
  address_line1: string;
}