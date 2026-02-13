import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CheckoutService, DataService} from '@services';
import { PayPalCheckout, Client } from 'braintree-web';
import { Configuration} from 'braintree-web/modules/client';
import {CheckoutStepPaymentService} from '../../../checkout/checkout-step/checkout-step-payment/checkout-step-payment.service';
import {BraintreePaymentMethod} from '../../payment-management.model';

interface BraintreePaypalConfig extends Configuration {
  paypalCheckout: PayPalCheckout
}

declare var paypal
declare var paypal_sdk

@Component({
    selector: 'app-payment-wallet-paypal',
    templateUrl: './payment-wallet-paypal.component.html',
    styleUrls: ['./payment-wallet-paypal.component.scss'],
    standalone: false
})
export class PaymentWalletPaypalComponent implements OnInit {

  @Input() paymentMethodId: number;

  @Input() paymentMethodName: string;

  @Input() paymentAmount: number;

  @Input() favouriteChoice: boolean;
  checkPaypalDefaultPayment: boolean;

  @Output() paymentStatus: EventEmitter<BraintreePaymentMethod> = new EventEmitter<BraintreePaymentMethod>();

  paypalCheckoutAvailable = true;

  @Input() panelCollapsed: boolean;

  constructor(private checkoutService: CheckoutService,
              private checkoutPaymentService: CheckoutStepPaymentService,
              private dataService: DataService) {
  }

  ngOnInit() {
    const thisInstance = this;
    if (this.favouriteChoice) {
      this.checkPaypalDefaultPayment = true;
    }
    this.checkoutService.getClientToken(this.paymentMethodId).subscribe((clientToken: string) => {
      this.checkoutPaymentService.braintreeProvider$.subscribe((braintree: BraintreePaypalConfig ) => {
        if (braintree) {
          braintree.client.create({authorization: clientToken}, function (clientErr, clientInstance: Client) {
            if (clientErr) {
              console.log('Error creating braintree client instance', clientErr);
            }

            return braintree.paypalCheckout.create({client: clientInstance},
            function (paypalCheckoutErr, paypalCheckoutInstance: PayPalCheckout) {
              if (paypalCheckoutErr) {
                console.log('Error creating paypal checkout instance', paypalCheckoutErr);
                thisInstance.paypalCheckoutAvailable = false;
              }

              return paypalCheckoutInstance.loadPayPalSDK({
                currency: 'EUR',
                vault: true,
                debug: true
              },
              function (loadPayPalSDKErr, paypalConfig) {
                if (loadPayPalSDKErr) {
                  console.log('Error loading paypal SDK', loadPayPalSDKErr);
                }

                return paypal.Buttons({
                  fundingSource: paypal.FUNDING.PAYPAL,
                  style: {height: 35},

                  createBillingAgreement: function () {
                    return paypalCheckoutInstance.createPayment({
                      flow: 'vault' as any,
                      currency: 'EUR'
                    });
                  },

                  onApprove: function (data, actions) {
                    return paypalCheckoutInstance.tokenizePayment(data, function (err, payload) {
                      if (thisInstance.checkPaypalDefaultPayment) {
                        payload.setAsFavourite = thisInstance.checkPaypalDefaultPayment;
                      }
                      thisInstance.paymentStatus.emit(payload);
                    });
                  },

                  onCancel: function () {
                  },

                  onError: function (...err) {
                    console.log(err)
                  }
                }).render('#paypal-button');
              }
              )
            });
          });
        }
      });
    });
  }

  changeCheckPaypalDefaultPayment() {
    this.checkPaypalDefaultPayment = !this.checkPaypalDefaultPayment;
  }


}

function loadPaypalButton() {

}
