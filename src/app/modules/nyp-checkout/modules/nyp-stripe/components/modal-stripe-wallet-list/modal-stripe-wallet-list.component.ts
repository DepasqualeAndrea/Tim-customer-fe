import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { IStripePayEl, NypStripeService } from '../../services/nyp-stripe.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-stripe-wallet-list',
  templateUrl: './modal-stripe-wallet-list.component.html',
  styleUrls: ['./modal-stripe-wallet-list.component.scss']
})
export class ModalStripeWalletListComponent {
  // Input
  public wallet: IStripePayEl[];
  // Output
  public choosePaymentMethod: (paymentMethod: string /* 'ppal' | payment_token */, newCard?: IStripePayEl) => void;

  public isMobile: boolean = window.innerWidth < 768;
  public isCardVisible: boolean = false;
  public isStripeWalletVisible: boolean = false;
  public isPpalClickedPaypal: boolean = false;
  public isSepaClickedPaypal: boolean = false;

  @HostListener('window:resize', ['$event'])
  onWindowResize(event): void {
    this.isMobile = event.target.innerWidth < 768;
  }

  constructor(public ngbActiveModal: NgbActiveModal) { }

  public close(newCard?: IStripePayEl) {
    // If i click on another payment method over 'add new card', let's reset the variable.
    this.isCardVisible = false;

    if (this.isPpalClickedPaypal)
      this.choosePaymentMethod?.('ppal');
    else if (this.isSepaClickedPaypal)
      this.choosePaymentMethod?.('sepa');
    else if (newCard)
      this.choosePaymentMethod?.(newCard.payment_token, newCard);
    else
      this.choosePaymentMethod?.(this.wallet.find(w => w.selected)?.payment_token);

    this.ngbActiveModal.close();
  }

  public select(what: string /* idToken | 'ppal' | 'sepa' | 'card */, newCard?: IStripePayEl) {
    this.isPpalClickedPaypal = what == 'ppal';
    this.isSepaClickedPaypal = what == 'sepa';

    if (newCard) this.close(newCard);
  }
}
