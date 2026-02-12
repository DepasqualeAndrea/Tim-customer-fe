import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { zip } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { NypStripeModule } from '../../nyp-stripe.module';
import { IStripePayEl, IStripePaymentMethod, NypStripeService } from '../../services/nyp-stripe.service';
import { ModalStripeWalletListComponent } from '../modal-stripe-wallet-list/modal-stripe-wallet-list.component';
import { INewCardStripe } from '../stripe-add-card/stripe-add-card.component';

@Component({
  selector: 'nyp-stripe-wallet',
  templateUrl: './stripe-wallet.component.html',
  styleUrls: ['./stripe-wallet.component.scss']
})
export class StripeWalletComponent implements OnInit {
  @Input() productPaymentMethodIds: number[];
  @Input() productPaymentRecurent: boolean;
  @Output() selectedCard = new EventEmitter<string>();

  public wallet: IStripePayEl[];
  private suitableMethods: IStripePaymentMethod[] = [];
  private untouchedMethods: IStripePaymentMethod[] = [];
  private suitableWallet: IStripePayEl[] = [];
  private untoucheWallet: IStripePayEl[] = [];
  public selectedElement: IStripePayEl;

  constructor(
    private nypStripeService: NypStripeService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    /* zip(
      this.nypStripeService.getPaymentMethods().pipe(tap(v => this.untouchedMethods = v)),
      this.nypStripeService.getWallet().pipe(tap(v => this.untoucheWallet = v)),
    )
      .subscribe(([methods, wallet]) => {
        this.filterWalletCard(methods, wallet);
        NypStripeModule.paymentElement = NypStripeModule.Stripe.elements({ clientSecret: NypStripeModule.clientSecret });
      }); */
  }

  private filterWalletCard(methods: IStripePaymentMethod[], wallet: IStripePayEl[]) {
    this.suitableMethods = methods
      .filter(m => m.recurrent == this.productPaymentRecurent)
      .filter(m => this.productPaymentMethodIds.includes(m.id))
      ;
    this.suitableWallet = wallet
      .filter(w => this.suitableMethods.some(s => s.id == w.payment_method_id))
      ;

    this.selectCard(this.selectedElement?.payment_token);
  }

  public addNewCard(event: INewCardStripe) {
    this.nypStripeService.addNewCard(event.token, event.isDefault, {
      name: event.name,
      address_zip: event.address_zip,
      address_state: event.address_state,
      address_city: event.address_city,
      address_line1: event.address_line1,
    })
      .pipe(
        mergeMap(() => this.nypStripeService.getWallet().pipe(tap(v => this.untoucheWallet = v))),
        tap(() => this.filterWalletCard(this.untouchedMethods, this.untoucheWallet)),
        tap(() => this.selectedElement = this.suitableWallet.find(w => w.payment_token == event.token)),
      )
      .subscribe();
  }

  public selectCard(paymentToken: string) {
    this.suitableWallet.forEach(w => {
      if (paymentToken ? w.payment_token == paymentToken : w.default) {
        w.selected = true;
        this.selectedElement = w;
      } else {
        w.selected = false;
      }

      switch (w.cc_type.toLowerCase()) {
        case 'visa': w.image = './assets/images/payment/gup/visa.png'; break;
        case 'mastercard': w.image = './assets/images/payment/gup/mastercard.png'; break;
        case 'diners': w.image = './assets/images/payment/gup/diners.png'; break;
        case 'amex': w.image = './assets/images/payment/gup/amex.png'; break;
        // paypal -> not covered by stripe's wallet.
      }
    });

    if (this.selectedElement) this.selectedCard.emit(this.selectedElement.payment_token);
  }

  openPaymentMethodsListModal() {
    const modalRef = this.modalService.open(ModalStripeWalletListComponent, {
      size: 'lg',
      windowClass: 'modal-window',
    });
    modalRef.componentInstance.wallet = this.suitableWallet;
    modalRef.componentInstance.choosePaymentMethod = (paymentMethod: string /* idToken | 'ppal' | 'sepa' | 'card  */, newCard?: IStripePayEl) => {
      if (newCard) this.suitableWallet.push(newCard);
      if (paymentMethod != 'ppal' && paymentMethod != 'sepa') this.selectCard(paymentMethod);

      alert(paymentMethod);
    };
  }
}
