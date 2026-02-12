import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-policy-detail-modal-submit-multirisk',
  templateUrl: './policy-detail-modal-submit-multirisk.component.html',
  styleUrls: ['./policy-detail-modal-submit-multirisk.component.scss']
})
export class PolicyDetailModalSubmitMultiriskComponent implements OnInit {
  @Input() kenticoContent: any;

  constructor( public  activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
