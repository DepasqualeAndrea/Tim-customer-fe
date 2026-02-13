import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
    selector: 'app-payment-bank-transfer',
    templateUrl: './payment-bank-transfer.component.html',
    styleUrls: ['./payment-bank-transfer.component.scss'],
    standalone: false
})
export class PaymentBankTransferComponent implements OnInit {

  form: UntypedFormGroup;

  constructor() { }

  ngOnInit() {
  }

}
