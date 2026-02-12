import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-payment-bank-transfer',
  templateUrl: './payment-bank-transfer.component.html',
  styleUrls: ['./payment-bank-transfer.component.scss']
})
export class PaymentBankTransferComponent implements OnInit {

  form: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
