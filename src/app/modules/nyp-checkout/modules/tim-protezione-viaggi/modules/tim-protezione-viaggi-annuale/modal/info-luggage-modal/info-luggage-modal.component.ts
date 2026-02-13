import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-info-luggage-modal',
    templateUrl: './info-luggage-modal.component.html',
    styleUrls: ['./info-luggage-modal.component.scss', '../../../../../../styles/size.scss', '../../../../../../styles/colors.scss', '../../../../../../styles/text.scss', '../../../../../../styles/common.scss'],
    standalone: false
})
export class InfoLuggageModalComponent implements OnInit {

  public accordionOpen: boolean[] = [false, false, false];

  constructor(public activeModal: NgbActiveModal,) {
  }

  ngOnInit(): void {}

  closeNewModal() {
    this.activeModal.dismiss();
  }

  toggleAccordion(index: number) {
    this.accordionOpen[index] = !this.accordionOpen[index];
  }
}
