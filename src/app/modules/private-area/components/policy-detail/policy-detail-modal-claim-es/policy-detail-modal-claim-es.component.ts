import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';
import { Policy } from 'app/modules/private-area/private-area.model';

@Component({
  selector: 'app-policy-detail-modal-claim-es',
  templateUrl: './policy-detail-modal-claim-es.component.html',
  styleUrls: ['./policy-detail-modal-claim-es.component.scss']
})
export class PolicyDetailModalClaimEsComponent implements OnInit {

  @Input() kenticoContent: any;
  @Input() policyData: Policy;
  assistanceFlag: boolean = true;
  allOtherFlag: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    public dataService: DataService,) {
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
