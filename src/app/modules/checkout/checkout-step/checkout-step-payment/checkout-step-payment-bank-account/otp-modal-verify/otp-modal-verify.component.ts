import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {DataService, InsurancesService} from '@services';
import {take} from 'rxjs/operators';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PaymentConstants, PaymentResponseCode} from '../payment-bank-account-constants';

@Component({
  selector: 'app-otp-modal-verify',
  templateUrl: './otp-modal-verify.component.html',
  styleUrls: ['./otp-modal-verify.component.scss']
})
export class OtpModalVerifyComponent implements OnInit {

  @Input() kenticoContent: any;
  @Input() sendRequest: any;
  @ViewChild('ngOtpInput', { static: true }) ngOtpInput: any;
  otp: string;
  resendMessage: any;
  confirmRequest: any;

  constructor(
    public insuranceService: InsurancesService,
    public dataService: DataService,
    private modal: NgbActiveModal
  ) {
    this.resendMessage = this.sendRequest;
  }

  ngOnInit(): void {
    this.sendMessage(this.sendRequest, 0);
    this.resendMessage = this.sendRequest;
    this.confirmRequest = this.sendRequest;
  }

  sendMessage(payload: any, resend: number): void {
    payload.callback_input = [{key: 'PROCEED : 0 STOP : 1 ', value: String(resend)}];
    payload.callback_output = [{key: PaymentConstants.SCA_TYPE, value: PaymentConstants.OTP}];
    this.insuranceService.submitPayment(payload).pipe(take(1)).subscribe((data) => {
      this.confirmRequest.auth_id = data.response_data.auth_id;
      this.confirmRequest.callback_input = data.response_data.callback_input;
      this.confirmRequest.callback_output = data.response_data.callback_output;
    });
  }

  resendAnotherMessage(payload: any, resend: number): void {
    payload.callback_input = [{key: 'Enter OTP', value: ''}, {key: 'Submit OTP : 0 Request OTP : 1 ', value: String(resend)}];
    this.insuranceService.submitPayment(payload).pipe(take(1)).subscribe((data) => {
      this.confirmRequest.auth_id = data.response_data.auth_id;
      this.confirmRequest.callback_input = data.response_data.callback_input;
      this.confirmRequest.callback_output = data.response_data.callback_output;
    });
  }

  onOtpChange(otp: string): void {
    if (otp.length === 6) {
      this.confirmRequest.callback_input[0].value = String(otp);
      this.confirmRequest.callback_input[1].value = String(0);
      this.insuranceService.submitPayment(this.confirmRequest).pipe(take(1)).subscribe((data) => {
        if (data.response_code === PaymentResponseCode.OTP_VALID) {
          this.dataService.setSellaPayment(true);
        } else {
          this.dataService.setErrorCode(data);
          this.dataService.setSellaPayment(false);
        }
      }, (error) => {
        this.dataService.setSellaPayment(false);
      });
      this.modal.close();
    }
  }

}
