import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StepGupWalletListContent, GupPaymentMethod, GupAddEvent, Pitype, CCTypes } from 'app/modules/checkout/checkout-step/checkout-step-payment/checkout-linear-stepper-payment-redirect/checkout-linear-stepper-payment-redirect-gup/gup-payment-methods.interface';
import { DropdownBoxtemplate } from 'app/modules/checkout/checkout-step/checkout-step-payment/checkout-linear-stepper-payment-redirect/checkout-linear-stepper-payment-redirect-gup/payment-wallet-list-gup/dropdown-box-template.enum';
import { PaymentTypeIcons } from 'app/modules/checkout/checkout-step/checkout-step-payment/checkout-linear-stepper-payment-redirect/checkout-linear-stepper-payment-redirect-gup/payment-wallet-list-gup/payment-type-icons.enum';
import { ContainerComponent } from 'app/modules/tenants/component-loader/containers/container.component';


@Component({
  selector: 'app-wallet-list-gup',
  templateUrl: './wallet-list-gup.component.html',
  styleUrls: ['./wallet-list-gup.component.scss']
})
export class WalletListGupComponent implements OnInit, OnDestroy {

  @Input() content: StepGupWalletListContent
  @Input() defaultPaymentMethod: GupPaymentMethod
  @Input() paymentMethods: GupPaymentMethod[]
  @Output() paymentMethodchanged = new EventEmitter<GupAddEvent>()

  pitypePaymentMethodToAdd: Pitype
  selectedPaymentMethod: GupPaymentMethod

  constructor(
    private ngbModal: NgbModal
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.ngbModal.hasOpenModals()) {
      this.ngbModal.dismissAll()
    }
  }

  ngOnChanges() {
    this.selectedPaymentMethod = this.defaultPaymentMethod
  }

  public getDropdownBoxToShow() {
    if (this.selectedPaymentMethod) {
      return DropdownBoxtemplate.EXISTING_METHOD
    }
    if (!this.selectedPaymentMethod && this.pitypePaymentMethodToAdd) {
      return DropdownBoxtemplate.NON_EXISTING_METHOD
    }
    return DropdownBoxtemplate.DEFAULT
  }

  public getDropdownBoxTemplate(template: string) {
    return DropdownBoxtemplate[template]
  }

  openPaymentMethodsListModal() {
    const modalRef = this.ngbModal.open(ContainerComponent, {
      size: 'lg',
      windowClass: 'modal-window',
    })
    modalRef.componentInstance.type = 'NYPWalletListGupModal';
    modalRef.componentInstance.componentInputData = {
      content: this.content,
      paymentMethods: this.paymentMethods
    }
    modalRef.result.then(event => {
      if (this.instanceOfGupPaymentMethod(event)) {
        this.selectedPaymentMethod = event
        this.pitypePaymentMethodToAdd = null
      } else {
        this.pitypePaymentMethodToAdd = event
        this.selectedPaymentMethod = null
      }
      const eventData = {
        paymentMethod: this.selectedPaymentMethod,
        pitype: this.pitypePaymentMethodToAdd
      }
      this.paymentMethodchanged.emit(eventData)
    })
  }

  private instanceOfGupPaymentMethod(event: any): event is GupPaymentMethod {
    if (Object.values(Pitype).includes(event)) {
      return false
    }
    return 'billing_id' in event
  }

  hideIfDefaultPayment(paymentMethod): boolean {
    return paymentMethod === this.selectedPaymentMethod
  }

  getTypeImage(paymentMethod: GupPaymentMethod): string {
    return PaymentTypeIcons[paymentMethod.paymentType];
  }

  public isPaypal(paymentMethod: GupPaymentMethod): boolean {
    return paymentMethod.payment_type === CCTypes.PayPal
  }

  getTypeAlt(paymentMethod: GupPaymentMethod): string {
    return paymentMethod.cc_type
  }

  public getPiTypeContent(): string {
    switch (this.pitypePaymentMethodToAdd) {
      case Pitype.PayPal: return this.content.addPaypalAccount;
      case Pitype.CreditCard: return this.content.addCreditCard;
      case Pitype.NoPayment: return this.content.paycheckCharge;
      default: return;
    }
  }

  //temp
  getPaypal(paymentMethod) {
    return paymentMethod.email || CCTypes.PayPal
  }

}
