import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-insurance-info-modal-tim-my-pet-proposal',
    templateUrl: './insurance-info-modal-tim-my-pet-proposal.component.html',
    styleUrls: ['./insurance-info-modal-tim-my-pet-proposal.component.scss'],
    standalone: false
})
export class InsuranceInfoModalTimMyPetProposalComponent implements OnInit {

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
