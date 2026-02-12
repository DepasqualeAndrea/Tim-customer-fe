import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LinkedAddon } from 'app/modules/checkout/checkout-step/checkout-step-insurance-info/checkout-step-insurance-info-tim-my-home/my-home-addon-content.interface';

@Component({
  selector: 'app-tim-my-home-linked-addon-modal',
  templateUrl: './tim-my-home-linked-addon-modal.component.html',
  styleUrls: ['./tim-my-home-linked-addon-modal.component.scss']
})
export class TimMyHomeLinkedAddonModalComponent implements OnInit {

  @Input() data: any;
  @Input() option: boolean;
  @Input() linkedAddons: LinkedAddon[]
  @Input() isAddonActive: boolean;

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
  }

  public closeModal(linkedAddons: LinkedAddon[]) {
    this.activeModal.close(linkedAddons);
  }

  public dismissModal() {
    this.activeModal.dismiss();
  }

  public isRichTextEmpty(innerHtmlText: string) {
    return innerHtmlText === "<p><br></p>"
  }

}
