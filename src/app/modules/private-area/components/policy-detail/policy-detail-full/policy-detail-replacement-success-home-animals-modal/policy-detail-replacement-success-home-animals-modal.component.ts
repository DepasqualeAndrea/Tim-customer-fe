import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Policy } from 'app/modules/private-area/private-area.model';
import {DataService} from "@services";

@Component({
  selector: 'app-policy-detail-replacement-success-home-animals-modal',
  templateUrl: './policy-detail-replacement-success-home-animals-modal.component.html',
  styleUrls: ['./policy-detail-replacement-success-home-animals-modal.component.scss']
})
export class PolicyDetailReplacementSuccessHomeAnimalsModalComponent implements OnInit {

  @Input() kenticoContent: any;
  @Input() policyData: Policy;

  constructor(
    public  activeModal: NgbActiveModal,
    public dataService: DataService
  ) { }

  ngOnInit() {
  }
}
