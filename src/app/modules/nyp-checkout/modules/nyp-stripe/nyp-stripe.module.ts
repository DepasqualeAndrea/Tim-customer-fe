import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Stripe, StripeElementStyle, StripeElements, loadStripe } from '@stripe/stripe-js';
import { SharedModule } from "../../../../shared/shared.module";
import { ModalStripeWalletListComponent } from './components/modal-stripe-wallet-list/modal-stripe-wallet-list.component';
import { PromoCodeComponent } from './components/promo-code/promo-code.component';
import { StripeAddCardComponent } from './components/stripe-add-card/stripe-add-card.component';
import { StripeAddPaypalComponent } from './components/stripe-add-paypal/stripe-add-paypal.component';
import { StripeAddSepaComponent } from './components/stripe-add-sepa/stripe-add-sepa.component';
import { StripeEmbeddedComponent } from './components/stripe-embedded/stripe-embedded.component';
import { StripeWalletComponent } from './components/stripe-wallet/stripe-wallet.component';
import { SellerCodeComponent } from './components/seller-code/seller-code.component';
import { SellerCodeResolver } from './components/seller-code/configuration/seller-code.resolver';

@NgModule({
  declarations: [
    StripeWalletComponent,
    StripeAddCardComponent,
    ModalStripeWalletListComponent,
    StripeAddPaypalComponent,
    StripeAddSepaComponent,
    StripeEmbeddedComponent,
    PromoCodeComponent,
    SellerCodeComponent
  ],
  exports: [
    StripeWalletComponent,
    StripeAddPaypalComponent,
    StripeEmbeddedComponent,
    PromoCodeComponent,
    SellerCodeComponent
  ],
  bootstrap: [
    StripeWalletComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class NypStripeModule {
  public static STRIPE_PUBLISHABLE_KEY: string;
  private static __stripe: Stripe;
  public static get Stripe(): Promise<Stripe> {
    if (!NypStripeModule.__stripe) {
      return loadStripe(NypStripeModule.STRIPE_PUBLISHABLE_KEY, { locale: 'it-IT' })
        .then(stripe => NypStripeModule.__stripe = stripe)
        .then(() => NypStripeModule.__stripe);
    } else {
      return new Promise((r) => r(NypStripeModule.__stripe));
    }
  }
  public static paymentElement: StripeElements;
  public static CardElementStyle: StripeElementStyle = {
    base: {
      iconColor: '#666EE8',
      color: '#31325F',
      lineHeight: '40px',
      fontWeight: 300,
      fontFamily: 'Helvetica Neue',
      fontSize: '15px',

      '::placeholder': {
        color: '#CFD7E0',
      },
    },
  };
}
