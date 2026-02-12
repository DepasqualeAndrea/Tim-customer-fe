import { Injectable } from '@angular/core';
import { CheckoutService, DataService, InsurancesService } from '@services';
import moment from 'moment';
import { ModalConstants, PaymentConstants, PaymentResponseCode } from './payment-bank-account-constants';
import { ChangeStatusService } from '../../../../../core/services/change-status.service';
import { switchMap, take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '../../../../../core/services/modal.service';
import { Router } from '@angular/router';
import { NypCheckoutService } from '@NYP/ngx-multitenant-core';

@Injectable({
  providedIn: 'root'
})
export class ScaManagerService {

  responseOrder: any;
  payment: any;
  bankAccount: any;

  constructor(
    public checkoutService: CheckoutService,
    protected nypCheckoutService: NypCheckoutService,
    public dataService: DataService,
    public changeStatusService: ChangeStatusService,
    public insuranceService: InsurancesService,
    public toastrService: ToastrService,
    public modalService: ModalService,
    public router: Router,
  ) {
  }

  setBankAccount(bankAccount: string): void {
    this.bankAccount = bankAccount;
  }

  initFlow(): void {
    this.nypCheckoutService.getOrder(this.dataService.getResponseOrder().number).subscribe((data) => {
      this.responseOrder = data;
      this.buildRequest();
      this.sendPayment();
    });
  }

  buildRequest(data?: any): void {
    this.payment = Object.assign({
      uniqueId: this.changeStatusService.getStatusRequest().idOperation,
      amount: String(this.responseOrder.total),
      dataContabile: moment().format('DD/MM/YYYY'),
      contoSelected: this.bankAccount.aliasConto,
      entity_type: PaymentConstants.ENTITY_TYPE
    });
    if (data && data.response_data.auth_id) {
      this.payment.auth_id = data.response_data.auth_id;
    }
    if (data && data.response_data.callback_input) {
      this.payment.callback_input = data.response_data.callback_input;
      this.payment.callback_input[0].value = String(0);
    }
    if (data && data.response_data.callback_output) {
      this.payment.callback_output = data.response_data.callback_output;
    }
  }

  sendPayment(payload?: any): void {
    this.buildRequest(payload);
    this.insuranceService.submitPayment(this.payment).pipe(take(1)).subscribe((data) => {
      if (data.response_data.callback_output && data.response_data.callback_output[0].key === PaymentConstants.SCA_TYPE) {
        if (data.response_data.callback_output[0].value === PaymentConstants.OTP) {
          this.buildRequest(data);
          this.openModal(ModalConstants.MODAL_OTP_ITEM, ModalConstants.MODAL_OTP_NAME);
        } else if (data.response_data.callback_output[0].value === PaymentConstants.PUSH_NOTIFICATION) {
          this.buildRequest(data);
          this.openModal(ModalConstants.MODAL_PUSH_NOTIFICATION_ITEM, ModalConstants.MODAL_PUSH_NOTIFICATION_NAME);
        }
      } else {
        this.sendPayment(data);
      }
    }, (error) => {
      this.toastrService.error(error.response_desc);
    });
  }

  openModal(kenticoItem: string, modalName: string): void {
    this.modalService.openModalSCA(kenticoItem, modalName, this.payment);
  }

}
