import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {PaymentMethod} from '../payment-management.model';

@Component({
    selector: 'app-payment-wallet-list',
    templateUrl: './payment-wallet-list.component.html',
    styleUrls: ['./payment-wallet-list.component.scss'],
    standalone: false
})
export class PaymentWalletListComponent implements OnInit, OnChanges {

  @Input() wallet: PaymentMethod[];

  @Input() selectedPaymentMethod: PaymentMethod;

  @Input() bankTransferType: string;

  @Output() paymentMethodChanged: EventEmitter<PaymentMethod> = new EventEmitter<PaymentMethod>();

  form: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group(this.fromModelToView(this.selectedPaymentMethod, this.wallet));
    this.form.controls.paymentMethod.setValidators(Validators.required);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.wallet && !changes.wallet.firstChange) ||
      (changes.selectedPaymentMethod && !changes.selectedPaymentMethod.firstChange)) {
      this.form.patchValue(this.fromModelToView(this.selectedPaymentMethod, this.wallet));
    }
  }

  fromModelToView(paymentMethod: PaymentMethod, wallet: PaymentMethod[]): { [key: string]: any } {
    const selected = (wallet || []).find(pm => !!paymentMethod && pm.id === paymentMethod.id);
    return {paymentMethod: selected};
  }

  fromViewToModel(form: UntypedFormGroup): PaymentMethod {
    return form.get('paymentMethod').value;
  }

  onPaymentMethodChanged() {
    this.paymentMethodChanged.emit(this.fromViewToModel(this.form));
  }

}
