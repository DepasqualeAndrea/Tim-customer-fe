import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import {PaymentMethod} from '../payment-management.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '@services';

@Component({
  selector: 'app-payment-wallet-stepper-list',
  templateUrl: './payment-wallet-stepper-list.component.html',
  styleUrls: ['./payment-wallet-stepper-list.component.scss']
})
export class PaymentWalletStepperListComponent implements  OnInit, OnChanges {

  @Input() wallet: PaymentMethod[];

  @Input() selectedPaymentMethod: PaymentMethod;

  @Output() paymentMethodChanged: EventEmitter<PaymentMethod> = new EventEmitter<PaymentMethod>();

  @Input() initialCollapse = true;
  @Input() showDefaultAsDefault = true;

  form: FormGroup;

  public isCollapsed = true;

  constructor(private formBuilder: FormBuilder,
              public dataService: DataService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group(this.fromModelToView(this.selectedPaymentMethod, this.wallet));
    this.form.controls.paymentMethod.setValidators(Validators.required);
    this.isCollapsed = this.initialCollapse;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.wallet && changes.wallet.firstChange) ||
    (changes.selectedPaymentMethod && changes.selectedPaymentMethod.firstChange)) {
      if (this.showDefaultAsDefault) {
        this.selectedPaymentMethod = this.wallet.find(pm => pm.wallet.default) || this.wallet[0];
      }
      this.paymentMethodChanged.emit(this.selectedPaymentMethod);
    }
    if ((changes.wallet && !changes.wallet.firstChange) ||
      (changes.selectedPaymentMethod && !changes.selectedPaymentMethod.firstChange)) {
      this.form.patchValue(this.fromModelToView(this.selectedPaymentMethod, this.wallet));
    }
  }

  fromModelToView(paymentMethod: PaymentMethod, wallet: PaymentMethod[]): { [key: string]: any } {
    const selected = (wallet || []).find(pm => !!paymentMethod && pm.id === paymentMethod.id);
    return {paymentMethod: selected};
  }

  fromViewToModel(form: FormGroup): PaymentMethod {
    return form.get('paymentMethod').value;
  }

  onPaymentMethodChanged() {
    this.selectedPaymentMethod = this.form.get('paymentMethod').value;
    this.paymentMethodChanged.emit(this.fromViewToModel(this.form));
  }


}
