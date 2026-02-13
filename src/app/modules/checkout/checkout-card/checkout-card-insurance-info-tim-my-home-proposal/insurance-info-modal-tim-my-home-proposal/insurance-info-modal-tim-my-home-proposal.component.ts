import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-insurance-info-modal-tim-my-home-proposal',
    templateUrl: './insurance-info-modal-tim-my-home-proposal.component.html',
    styleUrls: ['./insurance-info-modal-tim-my-home-proposal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class InsuranceInfoModalTimMyHomeProposalComponent implements OnInit {

  @Input() proposal: any;

  selectedPack = [];

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.proposal.addons.map(item => {
      if (item.selezionata) {
        this.selectedPack.push(item);
      }
    });
  }

}
