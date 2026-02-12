/**
 * Component Versio 3.5.1
 */
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxBraintreeService } from './ngx-braintree.service';
import { ConfigureDropinService } from './configure-dropin.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {DataService} from '@services';

type Paypal = {Button: {render: (env, payment) => void } };

declare var braintree: any;

@Component({
  selector: 'ngx-braintree',
  template: `
  <ngb-tabset type="pills" (tabChange)="createDropin($event)">
    <ngb-tab id="creditCard">
    <ng-template ngbTabTitle><input type="radio" name="payType" id="check-credit-card">Carta di credito</ng-template>
      <ng-template ngbTabContent>
      <div class="demo-frame">
      <form action="/" method="post" id="cardForm" >
      <div class="first-section-credit-card">

      <div class="card-custom" style="vertical-align: bottom;">
      <label class="hosted-fields--label" for="card-holder">Intestatario Carta</label>
      <input class="hosted-field" type="text" placeholder="Mario Rossi" id="name-credit-card" />
      </div>

      <div class="card-custom">
      <label class="hosted-fields--label" for="card-number">Numero carta</label>
      <div id="card-number" class="hosted-field"></div>
      </div>

      </div>

      <div class="second-section-credit-card">
      <div class="card-custom">
      <label class="hosted-fields--label" for="expiration-date">Data di scadenza</label>
      <div id="expiration-date" class="hosted-field"></div>
      </div>

      <div class="card-custom">
      <label class="hosted-fields--label" for="cvv">CVV</label>
      <div id="cvv" class="hosted-field"></div>
      </div>
      </div>

      <div class="button-container" >
      <input
      type="submit" class="button button--small button--green" value="ANNULLA" (click)="activeModal.close()" id="annulla" />
      </div>

      <div class="button-container">
      <input type="submit" class="button button--small button--green" value="Aggiungi" (click)="pay()" id="submit"/>
      </div>
    </form>
      <div class="error" *ngIf="errorMessage">Error</div>
      <div class="errorInfoDiv" *ngIf="errorMessage">{{errorMessage}}</div>
      <div *ngIf="showDropinUI && clientToken" ngxBraintreeDirective>
        <div id="dropin-container"></div>
        <button [disabled]="!enablePayButton" class=" {{ enablePayButton ? 'btn' : 'btn-disabled' }} "
        *ngIf="showPayButton" (click)="pay()">
          {{buttonText}}
        </button>
      </div>
      <div *ngIf="clientTokenNotReceived">
        <div class="error">Error! Client token not received.</div>
        <div class="errorInfoDiv">Make sure your clientTokenURL's JSON response is as shown below:
          <pre>{{ '{' }}"token":"braintree_client_token_generated_on_your_server"{{'}'}}</pre>
        </div>
      </div>
      </div>
      </ng-template>
    </ngb-tab>
    <ngb-tab id="payPal">
    <ng-template ngbTabTitle><input type="radio" name="payType" id="check-paypal">PayPal</ng-template>
      <ng-template ngbTabContent>
          <div id="paypal-button"></div>
      </ng-template>
    </ngb-tab>
  </ngb-tabset>
  `,
  styles: [`
    .btn {
      background-color: #363335;
      color: #ffffff;
      border: none;
      border-radius: 4px;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      cursor: pointer;
    }

    .btn-disabled {
      background-color: #363335;
      opacity: 0.5;
      color: #ffffff;
      border: none;
      border-radius: 4px;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      cursor: not-allowed;
    }

    .error {
      color: #ffffff;
      background-color: red;
      font-weight: bolder;
      font-family: monospace;
      border: none;
      border-radius: 4px;
      height: 30px;
      line-height: 30px;
    }

    .errorInfoDiv {
      border-bottom: 2px solid red;
      border-left: 2px solid red;
      border-right: 2px solid red;
      font-family: monospace;
    }
  `]
})
export class NgxBraintreeComponent implements OnInit {

  paypal: Paypal;

  @Output() paymentStatus: EventEmitter<any> = new EventEmitter<any>();

  @Input() clientTokenURL: string;
  @Input() createPurchaseURL: string;
  @Input() chargeAmount: number;

  // Optional inputs
  @Input() buttonText = 'Buy'; // to configure the pay button text
  @Input() allowChoose = false;
  @Input() showCardholderName = false;
  @Input() enablePaypalCheckout = false;
  @Input() enablePaypalVault = false;
  @Input() currency: string;
  @Input() locale: string;

  clientToken: string;
  nonce: string;
  showDropinUI = true;
  errorMessage: string;

  showPayButton = false; // to display the pay button only after the dropin UI has rendered.
  clientTokenNotReceived = false; // to show the error, "Error! Client token not received."
  interval: any;
  instance: any;
  dropinConfig: any = {};
  enablePayButton = false;
  clientIstance: any;
  checkCreditCard: any;
  checkPayPal: any;

  getFields: object;

  @Input() getClientToken: Function = () => this.service.getClientToken(this.clientTokenURL);
  // @Input() createPurchase: Function = (nonce, chargeAmount) => this.service.createPurchase(this.createPurchaseURL, nonce, chargeAmount);

  constructor(
    private service: NgxBraintreeService,
    private configureDropinService: ConfigureDropinService,
    private changeDetectorRef: ChangeDetectorRef,
    private dataService: DataService,
    public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    if (this.enablePaypalCheckout && this.enablePaypalVault) {
      this.errorMessage = 'Please make sure either Paypal Checkout or Paypal Vault is set to true. Both cannot be true at the same time.';
    } else if (this.enablePaypalCheckout && !this.currency) { // user should provide currency for paypal checkout.
      this.errorMessage = 'Please provide the currency for Paypal Checkout. ex: [currency]="\'USD\'"';
    } else {
      this.generateDropInUI();
    }
  }

  generateDropInUI() {
    this.getClientToken()
      .subscribe((clientToken: string) => {
        if (!clientToken) {
          this.clientTokenNotReceived = true;
        } else {
          this.clientToken = clientToken;
          this.clientTokenNotReceived = false;
          this.interval = setInterval(() => {
            this.createDropin();
          }, 0);
        }
      }, (error) => {
        this.clientTokenNotReceived = true;
        console.error(`Client token not received.
          Please make sure your braintree server api is configured properly, running and accessible.`);
        throw error;
      });
  }

  createDropin(item?: any) {
    const that = this;
    this.checkCreditCard = document.querySelector('#check-credit-card');
    this.checkPayPal = document.querySelector('#check-paypal');
    this.checkCreditCard.checked = true;
    this.checkPayPal.checked = false;
    if (typeof braintree !== 'undefined') {
      braintree.client.create({
        authorization: this.clientToken
      }, function (err, clientInstance) {
        if (err) {
          console.error(err);
          throw err;
        }
        that.clientIstance = clientInstance;
        if (item) {
          if (item.nextId === 'creditCard') {
            that.createHostedFields(that.clientIstance);
            that.checkCreditCard.checked = true;
            that.checkPayPal.checked = false;
          }
          if (item.nextId === 'payPal') {
            that.generatePayPalPaymentMethod();
            that.checkPayPal.checked = true;
            that.checkCreditCard.checked = false;
          }
        } else {
          that.createHostedFields(that.clientIstance);
        }

      });
      clearInterval(this.interval);
    }
  }

  createHostedFields(clientInstance) {
    const that = this;
    const form = document.querySelector('#cardForm');
    const submitButton = document.querySelector('input[type="submit"]');
    braintree.hostedFields.create({
      client: clientInstance,
      styles: {
        'input': {
          'font-size': '16px',
          'font-family': 'Roboto, sans-serif',
          'font-weight': 'lighter',
          'color': '#ccc'
        },
        ':focus': {
          'color': 'black'
        },
        '.valid': {
          'color': '#8bdda8'
        }
      },
      fields: {
        number: {
          selector: '#card-number',
          placeholder: '4111 1111 1111 1111'
        },
        cvv: {
          selector: '#cvv',
          placeholder: '123'
        },
        expirationDate: {
          selector: '#expiration-date',
          placeholder: 'MM/YYYY'
        }
      }
    }, function (err, hostedFieldsInstance) {
      if (err) {
        console.error(err);
        throw err;
      }
      that.instance = hostedFieldsInstance;
      form.addEventListener('submit', function (event) {
        event.preventDefault();
      }, false);
    });
  }

  pay(): void {
    if (this.instance) {
      this.instance.tokenize((err, payload) => {
        if (err) {
          console.error(err);
          this.errorMessage = err;
          throw err;
        } else {
          this.errorMessage = null;
        }
        if (!this.allowChoose) { // process immediately after tokenization
          this.nonce = payload.nonce;
          this.showDropinUI = false;
          const nameCreditCard = (<any>document.getElementById('name-credit-card')).value;
          const expirationDate = (<any>document.getElementById('expiration-date')).value;
          const payloadCreditCard = {
            'nameCreditCard': nameCreditCard,
            'expirationDate': expirationDate,
            'payload': payload
          };
          this.paymentStatus.emit(payloadCreditCard);
          // this.paymentStatus.emit(payload);
        }
      });
    }
  }

  generatePayPalPaymentMethod() {
    const that = this;
    braintree.paypalCheckout.create({
      client: this.clientIstance
    }, function (paypalCheckoutErr, paypalCheckoutInstance) {
      if (paypalCheckoutErr) {
        console.error('Error creating PayPal Checkout:', paypalCheckoutErr);
        throw paypalCheckoutErr;
      }
      this.paypal.Button.render({
        env: this.dataService.tenantInfo.payPalEnv, // or 'sandbox'
        payment: function () {
          return paypalCheckoutInstance.createPayment({
            flow: 'vault'
          });
        },
        onAuthorize: function (data, actions) {
          return paypalCheckoutInstance.tokenizePayment(data, function (err, payload) {
            // Submit `payload.nonce` to your server.
            that.paymentStatus.emit(payload);
          });
        },
        onCancel: function (data) {
          console.log('payment cancelled', data);
        },
        /* onAuthorizationDismissed: function (data) {
          console.log('payment dismissed', data);
        }, */
        onError: function (err) {
          console.error('error', err);
          throw err;
        }
      }, '#paypal-button');
    });
  }

}
