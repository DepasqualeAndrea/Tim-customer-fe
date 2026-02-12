import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NypGupService } from 'app/modules/nyp-checkout/modules/nyp-gup/services/nyp-gup.service';
import { StepGupWalletListContent, GupPaymentMethod, Pitype, CCTypes } from 'app/modules/checkout/checkout-step/checkout-step-payment/checkout-linear-stepper-payment-redirect/checkout-linear-stepper-payment-redirect-gup/gup-payment-methods.interface';
import { PaymentTypeIcons } from 'app/modules/checkout/checkout-step/checkout-step-payment/checkout-linear-stepper-payment-redirect/checkout-linear-stepper-payment-redirect-gup/payment-wallet-list-gup/payment-type-icons.enum';


@Component({
  selector: 'app-modal-wallet-list-gup',
  templateUrl: './modal-wallet-list-gup.component.html',
  styleUrls: ['./modal-wallet-list-gup.component.scss']
})
export class ModalWalletListGupComponent implements OnInit {



  @Input() content: StepGupWalletListContent;
  @Input() paymentMethods: GupPaymentMethod[];

  private pitypePaymentMethodToAdd: Pitype;
  private selectedPaymentMethod: GupPaymentMethod;
  public usesPaycheckCharge: boolean;

  constructor(
    private activeModal: NgbActiveModal,
    private gupService: NypGupService
  ) { }

  ngOnInit() {
    this.usesPaycheckCharge = this.gupService.usesPaycheckChargeMethod()
  }

  public closeModal(): void {
    const eventToSend = this.pitypePaymentMethodToAdd || this.selectedPaymentMethod;
    this.activeModal.close(eventToSend);
  }

  public dismissModal(): void {
    this.activeModal.dismiss();
  }

  public selectPaymentMethod(paymentMethod: GupPaymentMethod): void {
    this.unSelectPaymentMethods();
    paymentMethod.selected = true;
    this.pitypePaymentMethodToAdd = null;
    this.selectedPaymentMethod = paymentMethod;
  }

  public selectPiTypeToAdd(pitype: string): void {
    this.unSelectPaymentMethods();
    this.selectedPaymentMethod = null;
    this.pitypePaymentMethodToAdd = Pitype[pitype];
  }

  private unSelectPaymentMethods(): void {
    if (this.paymentMethods && this.paymentMethods.length) {
      const unselect = (pm) => pm.selected = false;
      this.paymentMethods.forEach(unselect);
    }
  }

  public isPiTypeSelected(pitype: string): boolean {
    return this.pitypePaymentMethodToAdd === Pitype[pitype];
  }


  public getTypeImage(paymentMethod: GupPaymentMethod): string {
    return PaymentTypeIcons[paymentMethod.paymentType];
  }

  public getTypeAlt(paymentMethod: GupPaymentMethod): string {
    return paymentMethod.cc_type || paymentMethod.payment_type;
  }

  public isPaypal(paymentMethod: GupPaymentMethod): boolean {
    return paymentMethod.payment_type === CCTypes.PayPal
  }

  //temp
  getPaypal(paymentMethod) {
    return paymentMethod.email || CCTypes.PayPal
  }

}
