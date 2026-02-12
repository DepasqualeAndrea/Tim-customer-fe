import { EventEmitter } from '@angular/core';
import { User, RequestOrder } from '@model';
import { CheckoutContractor } from './checkout-step-address.model';

export interface CheckoutAddressForm {
    contractor: CheckoutContractor;
    validityChange: EventEmitter<boolean>;
    residentDataDisabled: boolean;
    getContractorFromForm(): CheckoutContractor;
    disableFields(fieldNames: string[]);
}
