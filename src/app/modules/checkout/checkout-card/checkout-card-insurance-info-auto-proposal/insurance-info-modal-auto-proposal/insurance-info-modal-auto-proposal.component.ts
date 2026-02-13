import { DataService } from './../../../../../core/services/data.service';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-insurance-info-modal-auto-proposal',
    templateUrl: './insurance-info-modal-auto-proposal.component.html',
    styleUrls: ['./insurance-info-modal-auto-proposal.component.scss'],
    standalone: false
})
export class InsuranceInfoModalAutoProposalComponent implements OnInit {

  @Input() proposal: any;

  selectedPack = [];

  constructor(
    public activeModal: NgbActiveModal,
    public dataService: DataService
  ) { }

  ngOnInit() {
    this.proposal.addons.map(item => {
      if (item.selezionata) {
        this.selectedPack.push(item);
      }
    });
  }

  getCurrencySymbolDot(addon: number) {
    return new Intl.NumberFormat('it', {  minimumFractionDigits: 0, maximumFractionDigits: 0}).format(addon);
  }

}
