import {Component, Input, OnInit} from '@angular/core';
import {Policy} from '../../../private-area.model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DataService} from '@services';

@Component({
  selector: 'app-policy-confirm-modal-claim-tim-my-sci',
  templateUrl: './policy-confirm-modal-claim-tim-my-sci.component.html',
  styleUrls: ['./policy-confirm-modal-claim-tim-my-sci.component.scss']
})
export class PolicyConfirmModalClaimTimMySciComponent implements OnInit {
  @Input() kenticoContent: any;
  @Input() policyData: Policy;
  constructor(
    public activeModal: NgbActiveModal,
    public dataService: DataService
  ) { }

  ngOnInit() {
  }

}
