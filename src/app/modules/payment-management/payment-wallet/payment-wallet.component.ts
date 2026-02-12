import { ComponentFeaturesService } from './../../../core/services/componentFeatures.service';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {CheckoutService} from '@services';
import {Observable} from 'rxjs';
import {BraintreePaymentMethod} from '../payment-management.model';

@Component({
  selector: 'app-payment-wallet',
  templateUrl: './payment-wallet.component.html',
  styleUrls: ['./payment-wallet.component.scss']
})
export class PaymentWalletComponent implements OnInit {

  @Input() paymentMethodId: number;
  @Input() paymentMethodName: string;
  @Input() paymentAmount: number;
  @Input() favouriteChoice: boolean;
  @Input() paypal: boolean;
  @Input() creditCard: boolean;
  @Input() collapseWhenPaymentAdded: boolean;
  @Input() paymentWalletSteps: string;
  @Input() braintreeLayout: string;

  @Input() addPaymentEvent: boolean = false;

  @Output() paymentStatusChanged: EventEmitter<BraintreePaymentMethod> = new EventEmitter<BraintreePaymentMethod>();
  form: FormGroup;

  @Input() product: any;
  verifyCardWhenIsAddedToWallet: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private checkoutService: CheckoutService,
    private componentFeaturesService: ComponentFeaturesService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      cardHolder: null,
      cardNumber: null,
      cardExpiration: null,
      cardSecurityCode: null,
    });
    if (this.favouriteChoice) { this.form.addControl('favourite', new FormControl(true)); }
    this.componentFeaturesService.useComponent('payment-wallet');
    this.componentFeaturesService.useRule('verify-card-when-added-to-wallet');
    this.verifyCardWhenIsAddedToWallet = this.componentFeaturesService.isRuleEnabled() ? this.componentFeaturesService.isRuleEnabled() : false;
  }

  getClientToken(): Observable<string> {
    return this.checkoutService.getClientToken(this.paymentMethodId);
  }

  paymentStatus($event): void {
    this.paymentStatusChanged.emit($event);
  }
}
