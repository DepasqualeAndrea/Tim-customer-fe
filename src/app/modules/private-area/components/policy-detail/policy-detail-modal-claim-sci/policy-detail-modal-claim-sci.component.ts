import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { Policy } from 'app/modules/private-area/private-area.model';
import { ContainerComponent } from 'app/modules/tenants/component-loader/containers/container.component';
import { PolicyDetailRecapDynamicComponent } from '../policy-detail-recaps/policy-detail-recap-dynamic.component';

@Component({
  selector: 'app-policy-detail-modal-claim-sci',
  templateUrl: './policy-detail-modal-claim-sci.component.html',
  styleUrls: ['./policy-detail-modal-claim-sci.component.scss']
})
export class PolicyDetailModalClaimSciComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  @Input() kenticoContent: any;
  @Input() policyData: Policy;
  assistanceFlag: boolean = true;
  allOtherFlag: boolean = false;

  constructor(

    public activeModal: NgbActiveModal,

    public dataService: DataService,) {
    super();
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
