import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Policy } from 'app/modules/private-area/private-area.model';
import {DataService} from "@services";

@Component({
  selector: 'app-policy-detail-replacement-success-not-interested-modal',
  templateUrl: './policy-detail-replacement-success-not-interested-modal.component.html',
  styleUrls: ['./policy-detail-replacement-success-not-interested-modal.component.scss']
})
export class PolicyDetailReplacementSuccessNotInterestedModalComponent implements OnInit {

  @Input() kenticoContent: any;
  @Input() policyData: Policy;

  constructor(
    public  activeModal: NgbActiveModal,
    public dataService: DataService
  ) { }

  ngOnInit() {
  }
  get checkCheBanca(): boolean {
    return this.dataService.tenantInfo.tenant === 'chebanca_db' && this.policyData.product.product_code === 'ge-home';
  }
}
