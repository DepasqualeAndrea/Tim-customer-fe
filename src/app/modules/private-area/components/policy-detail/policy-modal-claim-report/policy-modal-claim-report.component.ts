import {Component, Input, OnInit} from '@angular/core';
import {Policy} from '../../../private-area.model';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-policy-modal-claim-report',
  templateUrl: './policy-modal-claim-report.component.html',
  styleUrls: ['./policy-modal-claim-report.component.scss']
})
export class PolicyModalClaimReportComponent implements OnInit {
  @Input() kenticoContent: any;
  @Input() policyData: Policy;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
