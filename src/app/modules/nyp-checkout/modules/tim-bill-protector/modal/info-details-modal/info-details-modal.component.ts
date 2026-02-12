import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TimBillProtectorCheckoutService } from 'app/modules/nyp-checkout/modules/tim-bill-protector/services/checkout.service';

@Component({
  selector: 'app-details-modal',
  templateUrl: './info-details-modal.component.html',
  styleUrls: ['./info-details-modal.component.scss']
})
export class InfoDetailsModalComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() price: string = '';
  @Input() content: string = '';

  constructor(public activeModal: NgbActiveModal, public checkoutService: TimBillProtectorCheckoutService) { }

  closeModal(): void {
    const modalElement = document.querySelector(".modal-dialog");
    if (modalElement) {
      modalElement.classList.add("slide-out");

      setTimeout(() => {
        this.activeModal.dismiss(false);
      }, 300);
    } else {
      this.activeModal.dismiss(false);
    }
  }
}