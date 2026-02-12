import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CheckoutService, DataService, InsurancesService } from '@services';
import { interval, Subscription, timer } from 'rxjs';
import { map, startWith, switchMap, take } from 'rxjs/operators';
import { PaymentConstants } from '../payment-bank-account-constants';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { NypCheckoutService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-push-modal-verify',
  templateUrl: './push-modal-verify.component.html',
  styleUrls: ['./push-modal-verify.component.scss']
})
export class PushModalVerifyComponent implements OnInit, OnDestroy {

  @Input() kenticoContent: any;
  @Input() sendRequest: any;
  timeInterval: Subscription;
  payment: any;

  constructor(
    public insuranceService: InsurancesService,
    public dataService: DataService,
    private modal: NgbActiveModal,
    public checkoutService: CheckoutService,
    protected nypCheckoutService: NypCheckoutService,
    protected http: HttpClient
  ) {
  }

  ngOnInit(): void {
    this.sendPushNotification(this.sendRequest, 0);
  }

  sendPushNotification(payload: any, resend: number): void {
    throw new Error("sendPushNotification")

  }


  resendPushNotification(): void {
    this.timeInterval.unsubscribe();
    this.nypCheckoutService.getOrder(this.dataService.getResponseOrder().number).subscribe((data) => {
      this.buildRequest();
      this.insuranceService.submitPayment(this.payment).pipe(take(1)).subscribe((firstStep) => {
        this.buildRequest(firstStep);
        this.insuranceService.submitPayment(this.payment).pipe(take(1)).subscribe((secondStep) => {
          this.buildRequest(secondStep);
          this.payment.callback_input = [{ key: 'PROCEED : 0 STOP : 1 ', value: String(0) }];
          this.insuranceService.submitPayment(this.payment).pipe(take(1)).subscribe((thirdStep) => {
            console.log(thirdStep);
            this.buildRequest(thirdStep);
            this.sendPolling(this.payment);
          }, error => {
            console.log(error);
            return this.sendPolling(this.payment)
          });
        });
      });
    });
  }

  sendPolling(req): void {
    throw new Error("sendPolling")

  }

  buildRequest(data?: any): void {
    this.payment = Object.assign({
      uniqueId: this.sendRequest.uniqueId,
      amount: this.sendRequest.amount,
      dataContabile: this.sendRequest.dataContabile,
      contoSelected: this.sendRequest.contoSelected,
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

  ngOnDestroy(): void {
    this.timeInterval.unsubscribe();
  }

}
