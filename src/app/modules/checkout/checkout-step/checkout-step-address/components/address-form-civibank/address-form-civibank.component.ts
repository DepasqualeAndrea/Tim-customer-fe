import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CheckoutContractor} from '../../checkout-step-address.model';
import {AddressFormComponent} from '../address-form/address-form.component';
import {CheckoutAddressForm} from '../../checkout-address-forms.interface';

@Component({
  selector: 'app-address-form-civibank',
  templateUrl: './address-form-civibank.component.html',
  styleUrls: ['./address-form-civibank.component.scss']
})
export class AddressFormCivibankComponent implements CheckoutAddressForm, OnInit {

  @Input() contractor: CheckoutContractor;
  @Input() residentDataDisabled: boolean;
  @Output() validityChange = new EventEmitter<boolean>();
  @Output() allFilled = new EventEmitter<boolean>();
  @ViewChild('addressform', { static: true }) addressFormComponent: AddressFormComponent;

  constructor() {
  }

  ngOnInit() {
  }

  validateChange(event) {
    this.validityChange.emit(event);
  }

  getContractorFromForm(): CheckoutContractor {
    return this.addressFormComponent.getContractorFromForm();
  }

  disableFields(fieldNames: string[]) {
    throw new Error('Method not implemented.');
  }
}
