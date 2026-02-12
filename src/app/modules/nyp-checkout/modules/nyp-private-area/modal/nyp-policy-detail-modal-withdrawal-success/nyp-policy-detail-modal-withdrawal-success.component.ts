import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-nyp-policy-detail-modal-withdrawal-success',
  templateUrl: './nyp-policy-detail-modal-withdrawal-success.component.html',
  styleUrls: ['./nyp-policy-detail-modal-withdrawal-success.component.scss'],
})
export class NypPolicyDetailModalWithdrawalSuccessComponent {
  constructor(public activeModal: NgbActiveModal) { }
}

