import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-insurance-info-details-modal',
  templateUrl: './insurance-info-details-modal.component.html',
  styleUrls: ['./insurance-info-details-modal.component.scss', '../../../../../../styles/size.scss', '../../../../../../styles/colors.scss', '../../../../../../styles/text.scss', '../../../../../../styles/common.scss']
})
export class InsuranceInfoDetailsModalComponent {
  @ViewChild('newAccordion') newAccordion!: ElementRef;
  accordionOpen: boolean[] = [];

  translation: IModalTransaltion;

  constructor(public activeModal: NgbActiveModal) { }

  closeNewModal() {
    this.activeModal.dismiss();
  }
  toggleAccordion(index: number) {
    this.accordionOpen[index] = !this.accordionOpen[index];
  }
}

export interface IModalTransaltion {
  title: string;
  price: number;

  warranties: {
    title: string;
    description: string;
  }[];
}