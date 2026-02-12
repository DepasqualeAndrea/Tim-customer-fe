import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {DataService} from '@services';
import {Policy} from "../../../private-area.model";

@Component({
  selector: 'app-policy-detail-modal-cancelation-success',
  templateUrl: './policy-detail-modal-cancelation-success.component.html',
  styleUrls: ['./policy-detail-modal-cancelation-success.component.scss']
})
export class PolicyDetailModalCancelationSuccessComponent implements OnInit {
  @Input() policyData: Policy;
  constructor(public activeModal: NgbActiveModal,
              public dataService: DataService) {
  }

  ngOnInit() {

  }

}
