import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-modal-termini-condizioni-investor',
  templateUrl: './modal-termini-condizioni-investor.component.html',
  styleUrls: ['./modal-termini-condizioni-investor.component.scss']
})
export class ModalTerminiCondizioniInvestorComponent implements OnInit {


  body: any;
  @Input() kenticoItem: any;

  constructor(public activeModal: NgbActiveModal) { }


  ngOnInit() {
      this.body= {
        content: this.kenticoItem.card_list
      }
  }
}
