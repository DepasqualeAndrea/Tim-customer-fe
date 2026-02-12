import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-details-modal',
  templateUrl: './more-details-modal.component.html',
  styleUrls: ['./more-details-modal.component.scss', '../../../../../../styles/size.scss', '../../../../../../styles/colors.scss', '../../../../../../styles/text.scss', '../../../../../../styles/common.scss']
})
export class MoreDetailsModalComponent implements OnInit {
  public accordionOpen: boolean;

  constructor(public activeModal: NgbActiveModal,) { }

  ngOnInit(): void { }

  closeNewModal() {
    this.activeModal.dismiss();
  }

  toggleAccordion(index: number) {
    this.accordionOpen = !this.accordionOpen;
  }
}
