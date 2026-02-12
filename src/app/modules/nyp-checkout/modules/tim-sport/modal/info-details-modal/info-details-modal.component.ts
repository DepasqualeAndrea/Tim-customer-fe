import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TimBillProtectionCheckoutService } from 'app/modules/nyp-checkout/modules/tim-bill-protection-2/services/checkout.service';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-details-modal',
  templateUrl: './info-details-modal.component.html',
  styleUrls: ['./info-details-modal.component.scss']
})
export class InfoDetailsModalComponent implements OnInit {
  public accordionOpen: boolean;
  public Price$ = this.checkoutService.ChosenPackets$.pipe(map(cp => cp?.price));

  constructor(public activeModal: NgbActiveModal, public checkoutService: TimBillProtectionCheckoutService) { }

  ngOnInit(): void { }

  closeNewModal() {
    this.activeModal.dismiss();
  }

  toggleAccordion(index: number) {
    this.accordionOpen = !this.accordionOpen;
  }
}
