import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-insurance-info-alert-modal',
  templateUrl: './insurance-info-alert-modal.component.html',
  styleUrls: ['./insurance-info-alert-modal.component.scss']
})
export class InsuranceInfoAlertModalComponent {
  @ViewChild('newAccordion') newAccordion!: ElementRef;
  accordionOpen: boolean[] = [];

  translation: IModalTranslation;

  constructor(public activeModal: NgbActiveModal) { }

  closeNewModal() {
    this.activeModal.dismiss();
  }
  toggleAccordion(index: number) {
    this.accordionOpen[index] = !this.accordionOpen[index];
  }
}

export interface IModalTranslation {
  title: string;
  description: string;


}
