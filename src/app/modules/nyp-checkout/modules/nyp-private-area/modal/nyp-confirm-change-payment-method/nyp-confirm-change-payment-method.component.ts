import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-nyp-confirm-change-payment-method',
    templateUrl: './nyp-confirm-change-payment-method.component.html',
    styleUrls: ['./nyp-confirm-change-payment-method.component.scss'],
    standalone: false
})
export class NypConfirmChangePaymentMethodComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  closeModal() {
    this.activeModal.dismiss();
  }

}
