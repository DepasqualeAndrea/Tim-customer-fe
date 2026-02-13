import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, NgClass, formatDate,  } from '@angular/common';
import { InsuranceInfoStates, NetCyberBusinessCheckoutService } from '../../../services/checkout.service';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RecursivePartial, IOrderResponse, NetCyberBusinessInsuredItems } from 'app/modules/nyp-checkout/models/api.model';
import { Observable } from 'rxjs';
import { take, toArray } from 'rxjs/operators';
import { NetCyberBusinessService } from '../../../services/api.service';

@Component({
    selector: 'app-checkout-step-insurance-info-insurance-data',
    templateUrl: './checkout-step-insurance-info-insurance-data.component.html',
    styleUrls: [
        './checkout-step-insurance-info-insurance-data.component.scss',
        '../../../../../styles/checkout-forms.scss',
        '../../../../../styles/size.scss',
        '../../../../../styles/colors.scss',
        '../../../../../styles/text.scss',
        '../../../../../styles/common.scss'
    ],
    standalone: false
})

export class CheckoutStepInsuranceInfoInsuranceDataComponent implements OnInit {

  @Input() kenticoContent: any;

  /* insuranceInfoState: InsuranceInfoStates = 'insuranceData'; */
  selectedCoverageStart: string = 'tomorrow';
  isNextButtonEnabled = true;
  customDate = '';
  startDateValue = '';
  safeMessageHtml: SafeHtml | null = null;

  minSelectableDate: Date;
  maxSelectableDate: Date;

  constructor(
    public checkoutService: NetCyberBusinessCheckoutService,
    public nypDataService: NypDataService,
    private sanitizer: DomSanitizer,
    private apiService:  NetCyberBusinessService
  ) { }

  ngOnInit(): void {
    const now = new Date();
    const min = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const max = new Date(min.getFullYear(), min.getMonth(), min.getDate() + 29);

    min.setHours(0, 0, 0, 0);
    max.setHours(0, 0, 0, 0);

    this.minSelectableDate = min;
    this.maxSelectableDate = max;

    const message = this.kenticoContent?.message?.value;
    if (message) {
      this.safeMessageHtml = this.sanitizer.bypassSecurityTrustHtml(this.decodeHtml(message));
    }

    const existingStartDate = this.nypDataService.Order$.value?.orderItem?.[0]?.start_date;

    if (existingStartDate) {
      const selectedDate = new Date(existingStartDate);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      const isTomorrow = selectedDate.getTime() === tomorrow.getTime();

      this.selectedCoverageStart = isTomorrow ? 'tomorrow' : 'customDate';
      this.startDateValue = existingStartDate;
      this.customDate = !isTomorrow ? formatDate(selectedDate, 'yyyy-MM-dd', 'en-US') : '';
      this.isNextButtonEnabled = true;
    }
  }


  decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  handleRadioChange(value: string): void {
    this.selectedCoverageStart = value;
    this.customDate = this.startDateValue = '';
    this.isNextButtonEnabled = (value === 'tomorrow');
  }

  handleDateInput(event: any): void {
    this.customDate = event.target.value;
    const selected = new Date(this.customDate);
    const minDate = new Date(this.minSelectableDate);
    const maxDate = new Date(this.maxSelectableDate);

    [selected, minDate, maxDate].forEach(date => date.setHours(0, 0, 0, 0));

    const isValid = selected >= minDate && selected <= maxDate;

    this.startDateValue = isValid ? formatDate(selected, 'yyyy-MM-ddT00:00:00.000000', 'en-US') : '';
    this.isNextButtonEnabled = isValid;
  }

  handleNextStep(): void {
    if (this.selectedCoverageStart === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.startDateValue = formatDate(tomorrow, 'yyyy-MM-ddT00:00:00.000000', 'en-US');
    }

    this.updateOrder().subscribe(() => {
      const currentOrder = this.nypDataService.Order$.value;
      currentOrder.orderItem[0].start_date = this.startDateValue;
      this.nypDataService.Order$.next({ ...currentOrder });
      this.nypDataService.CurrentState$.next('login-register');
    });
  }

  handlePrevStep(): void {
    this.checkoutService.InsuranceInfoState$.next('paymentSplitSelection');
  }

  private updateOrder(): Observable<(RecursivePartial<IOrderResponse<NetCyberBusinessInsuredItems>> | void)[]> {
    return this.apiService.putOrder({ start_date: this.startDateValue }).pipe(toArray(), take(1));
  }

  getCheckedStyle(id: string): boolean {
    const el= document.getElementById(id) as HTMLInputElement;
    return el?.checked;
  }
}
