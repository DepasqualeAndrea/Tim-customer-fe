import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Policy } from 'app/modules/private-area/private-area.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';
import { NypPolicy } from 'app/modules/nyp-checkout/models/api.model';

@Component({
  selector: 'app-nyp-policy-detail-modal-withdrawal',
  templateUrl: './nyp-policy-detail-modal-withdrawal.component.html',
  styleUrls: ['./nyp-policy-detail-modal-withdrawal.component.scss']
})
export class NypPolicyDetailModalWithdrawalComponent implements OnInit {

  @Input() policyData: NypPolicy;
  @Input() modalOpen: boolean;
  @Output() close = new EventEmitter<void>();

  withdrawReason: string;

  constructor(
    public activeModal: NgbActiveModal,
    public dataService: DataService
  ) { }

  ngOnInit() {
  }
  closeModal() {
    this.close.emit();
  }
}
