import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';
import { Policy } from 'app/modules/private-area/private-area.model';

@Component({
  selector: 'app-policy-confirm-modal-claim-home-protection',
  templateUrl: './policy-confirm-modal-claim-home-protection.component.html',
  styleUrls: ['./policy-confirm-modal-claim-home-protection.component.scss']
})
export class PolicyConfirmModalClaimHomeProtectionComponent implements OnInit {

  @Input() kenticoContent: any;
  @Input() policyData: Policy;

  constructor(
    public activeModal: NgbActiveModal,
    public dataService: DataService
  ) { }

  ngOnInit() {
  }

}
