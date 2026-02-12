import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PaymentWalletComponent} from './payment-wallet/payment-wallet.component';
import {PaymentWalletListComponent} from './payment-wallet-list/payment-wallet-list.component';
import {PaymentWalletCreditCardComponent} from './payment-wallet/payment-wallet-credit-card/payment-wallet-credit-card.component';
import {PaymentWalletPaypalComponent} from './payment-wallet/payment-wallet-paypal/payment-wallet-paypal.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxBraintreeModule} from '../ngx-braintree/ngx-braintree.module';
import { PaymentBankTransferComponent } from './payment-bank-transfer/payment-bank-transfer/payment-bank-transfer.component';
import { PaymentWalletStepperListComponent } from './payment-wallet-stepper-list/payment-wallet-stepper-list.component';

@NgModule({
  declarations: [
    PaymentWalletComponent,
    PaymentWalletListComponent,
    PaymentWalletCreditCardComponent,
    PaymentWalletPaypalComponent,
    PaymentBankTransferComponent,
    PaymentWalletStepperListComponent
  ],
  exports: [
    PaymentWalletComponent,
    PaymentWalletListComponent,
    PaymentWalletCreditCardComponent,
    PaymentWalletPaypalComponent,
    PaymentBankTransferComponent,
    PaymentWalletStepperListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule.forRoot(),
    NgxBraintreeModule
  ]
})
export class PaymentManagementModule { }
