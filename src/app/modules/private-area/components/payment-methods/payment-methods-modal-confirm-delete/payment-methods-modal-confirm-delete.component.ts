import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PaymentMethodsModalConfirmDeleteAction} from './payment-methods-modal-confirm-delete.model';
import {PaymentMethod} from '../../../../payment-management/payment-management.model';
import { DataService } from '@services';

@Component({
    selector: 'app-payment-methods-modal-confirm-delete',
    templateUrl: './payment-methods-modal-confirm-delete.component.html',
    styleUrls: ['./payment-methods-modal-confirm-delete.component.scss'],
    standalone: false
})
export class PaymentMethodsModalConfirmDeleteComponent implements OnInit {

  paymentMethod: PaymentMethod;

  constructor(private activeModal: NgbActiveModal, public dataService: DataService) {
  }

  ngOnInit() {
  }

  handleCancelClick() {
    this.sendResult(PaymentMethodsModalConfirmDeleteAction.CANCEL, this.paymentMethod);
  }

  handleOkClick() {
    this.sendResult(PaymentMethodsModalConfirmDeleteAction.OK, this.paymentMethod);
  }

  sendResult(action: PaymentMethodsModalConfirmDeleteAction, paymentMethod: PaymentMethod) {
    this.activeModal.close({action, paymentMethod});

  }

}
