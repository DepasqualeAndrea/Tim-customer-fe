import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-details-modal',
    templateUrl: './info-details-modal.component.html',
    styleUrls: ['./info-details-modal.component.scss', '../../../../../../styles/size.scss', '../../../../../../styles/colors.scss', '../../../../../../styles/text.scss', '../../../../../../styles/common.scss'],
    standalone: false
})
export class InfoDetailsModalComponent implements OnInit {
  public accordionOpen: boolean[] = [false, false, false];
  //public Price$ = this.checkoutService.ChosenPackets$.pipe(map(cp => cp?.price));
  @Input() isEurope: boolean;
  @Input() isWorld: boolean;

  constructor(public activeModal: NgbActiveModal,) {
  }

  ngOnInit(): void { }

  closeNewModal() {
    this.activeModal.dismiss();
  }

  toggleAccordion(index: number) {
    this.accordionOpen[index] = !this.accordionOpen[index];
  }
}
