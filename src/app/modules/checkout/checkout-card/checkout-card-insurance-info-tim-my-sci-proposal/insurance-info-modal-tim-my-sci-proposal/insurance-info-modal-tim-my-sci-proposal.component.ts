import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AnyTxtRecord } from 'dns';

@Component({
  selector: 'app-insurance-info-modal-tim-my-sci-proposal',
  templateUrl: './insurance-info-modal-tim-my-sci-proposal.component.html',
  styleUrls: ['./insurance-info-modal-tim-my-sci-proposal.component.scss']
})
export class InsuranceInfoModalTimMySciProposalComponent implements OnInit {

  @Input() proposal: any;
  @Input() kenticoItems: any;

  selectedPack = [];

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.proposal.warranties.map(warrenty => {
      if (warrenty.included) {
        this.selectedPack.push(warrenty);
      }
    });
  }


}
