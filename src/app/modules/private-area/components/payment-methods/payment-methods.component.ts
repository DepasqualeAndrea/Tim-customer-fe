import { Component, OnInit } from '@angular/core';
import { UserService, DataService } from '@services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentMethodsModalConfirmDeleteComponent } from './payment-methods-modal-confirm-delete/payment-methods-modal-confirm-delete.component';
import { PaymentMethodsModalConfirmDeleteAction, PaymentMethodsModalConfirmDeleteResult } from './payment-methods-modal-confirm-delete/payment-methods-modal-confirm-delete.model';
import { ToastrService } from 'ngx-toastr';
import { PaymentMethod } from '../../../payment-management/payment-management.model';
import { switchMap, take } from 'rxjs/operators';
import { KenticoTranslateService } from '../../../kentico/data-layer/kentico-translate.service';
import { NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
    selector: 'app-payment-methods',
    templateUrl: './payment-methods.component.html',
    styleUrls: ['./payment-methods.component.scss'],
    standalone: false
})
export class PaymentMethodsComponent implements OnInit {

  paymentMethods: PaymentMethod[];
  noPaymentMethods: boolean;

  constructor(private userService: UserService,
    protected nypUserService: NypUserService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private kenticoTranslateService: KenticoTranslateService,
    public dataService: DataService
  ) { }

  ngOnInit() {
    this.loadWallet();
  }

  loadWallet() {
    this.nypUserService.getWallets().subscribe(wallets => {
      this.paymentMethods = (wallets.payment_source || [])
        .map(wallet => this.convertWallet(wallet));
    });
  }

  convertWallet(wallet: any): PaymentMethod {
    return {
      id: wallet.id,
      type: wallet.cc_type,
      holder: wallet.name,
      lastDigits: wallet.last_digits,
      expiration: `${wallet.month}/${wallet.year}`,
      wallet
    };
  }

  openPaymentMethodModalConfirmDelete(pm: PaymentMethod): void {
    const modalRef = this.modalService.open(PaymentMethodsModalConfirmDeleteComponent);
    modalRef.componentInstance.paymentMethod = pm;
    modalRef.result.then(this.handlePaymentMethodModalConfirmDeleteResult());
  }

  handlePaymentMethodModalConfirmDeleteResult(): (value: PaymentMethodsModalConfirmDeleteResult) => void {

    return (value: PaymentMethodsModalConfirmDeleteResult) => {
      if (value.action === PaymentMethodsModalConfirmDeleteAction.OK) {
        this.userService.deletePaymentMethod(value.paymentMethod.id).pipe(
          switchMap(() => this.kenticoTranslateService.getItem<any>('toasts.delete_method_payment')),
          take(1),
        )
          .subscribe(toastMessage => {
            this.toastrService.success(toastMessage.value);
            this.loadWallet();
          });
      }
    };
  }

}
