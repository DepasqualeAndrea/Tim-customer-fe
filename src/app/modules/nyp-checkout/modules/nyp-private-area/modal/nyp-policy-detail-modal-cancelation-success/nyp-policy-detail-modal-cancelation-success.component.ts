import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-nyp-policy-detail-modal-cancelation-success',
  templateUrl: './nyp-policy-detail-modal-cancelation-success.component.html',
  styleUrls: ['./nyp-policy-detail-modal-cancelation-success.component.scss'],
})
export class NypPolicyDetailModalCancelationSuccessComponent {
  constructor(public activeModal: NgbActiveModal) { }
}

