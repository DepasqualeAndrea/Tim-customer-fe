import {Component, Input, OnInit} from '@angular/core';
import {Policy} from '../../../private-area.model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';

@Component({
    selector: 'app-policy-detail-modal-withdrawal',
    templateUrl: './policy-detail-modal-withdrawal.component.html',
    styleUrls: ['./policy-detail-modal-withdrawal.component.scss'],
    standalone: false
})
export class PolicyDetailModalWithdrawalComponent implements OnInit {

  @Input() policyData: Policy;

  withdrawReason: string;

  constructor(
    public activeModal: NgbActiveModal,
    public dataService: DataService
    ) { }

  ngOnInit() {
  }

}
