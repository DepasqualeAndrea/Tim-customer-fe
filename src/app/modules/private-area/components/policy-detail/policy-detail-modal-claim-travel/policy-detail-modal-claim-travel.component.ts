import {Component, Input, OnInit} from '@angular/core';
import {Policy} from '../../../private-area.model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-policy-detail-modal-claim-travel',
    templateUrl: './policy-detail-modal-claim-travel.component.html',
    styleUrls: ['./policy-detail-modal-claim-travel.component.scss'],
    standalone: false
})
export class PolicyDetailModalClaimTravelComponent implements OnInit {

  @Input() kenticoContent: any;
  @Input() policyData: Policy;
  assistanceFlag: boolean = true;
  allOtherFlag: boolean = false;

  constructor(
    public activeModal: NgbActiveModal
  ) {
  }

  ngOnInit() {
  }

  changeAssistanceFlag() {
    if (this.assistanceFlag === false) {
      this.assistanceFlag = !this.assistanceFlag;
      this.allOtherFlag = !this.allOtherFlag;
    }
    return this.assistanceFlag;
  }

  changeAllOtherFlag() {
    if (this.allOtherFlag === false) {
      this.allOtherFlag = !this.allOtherFlag;
      this.assistanceFlag = !this.assistanceFlag;
    }
    return this.allOtherFlag;
  }

}
