import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import flatpickr from "flatpickr";

@Component({
  selector: 'app-calendar-viaggi-roaming',
  template: `
    <div class="w-100 h-100 input-txt-container">
      <div>
        <label 
        for="birthDate" 
        class="label-container" 
        [ngClass]="{
          'error-field': inputHasError,
          'input-disabled': inputDisabled
          }">
          <input #flatpickrInput class="input-calendar flatpickr-input" [ngClass]="{'start-date': calendarType === 'start'}" type="text" readonly="readonly" placeholder="gg/mm/aa">
          <span class="up real-label">
            {{ inputLabel }}
          </span>
          <i *ngIf="inputHasError; else iconCalendar" class="fas fa-times input-error-icon picker-icon"></i>
          <ng-template #iconCalendar>
            <svg class="picker-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0 2.63143V17.5714H18V2.63143H0ZM17.1429 16.7143H0.857143V6.54857H17.1429V16.7143ZM4.96286 2.625H3.24857V0H4.96286V2.625ZM14.7514 2.625H13.0371V0H14.7514V2.625Z" fill="#004691"/>
            </svg>
          </ng-template>
        </label>
      </div>
    </div>`,
  styleUrls: ['./calendar-viaggi-roaming.component.scss', "../../../../../styles/checkout-forms.scss"]
})
export class CalendarViaggiRoamingComponent implements AfterViewInit {
  @Input() calendarType: 'start' | 'end' = 'start';
  @Input() startDate?: Date;
  @Input() inputDisabled: boolean = false;
  @Input() errorMessage?: string;
  @Input() inputLabel?: string;
  @Output() selectedDate = new EventEmitter<Date>();
  @Output() showErrorRange = new EventEmitter<boolean>();
  @ViewChild('flatpickrInput') flatpickrInput: ElementRef;
  private fp: any;
  public inputHasError: boolean = false;

  ngAfterViewInit(): void {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const baseConfig = {
      dateFormat: "d-m-Y",
      enableTime: false,
      static: true,
      showMonths: 1,
      animate: false,
      disableMobile: true // Importante per evitare il fallback mobile
    };

    const startConfig = {
      ...baseConfig,
      defaultDate: today,
      clickOpens: false,
      onChange: ([date]) => this.selectedDate.emit(date)
    };

    const endConfig = {
      ...baseConfig,
      minDate: tomorrow,
      clickOpens: true,
      onChange: ([date]) => {
        if (date && this.startDate) {
          const diffTime = Math.abs(date.getTime() - this.startDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays > 31) {
            this.inputHasError = true;
            this.showErrorRange.emit(true);
            this.fp.clear();
          } else {
            this.inputHasError = false;
            this.showErrorRange.emit(false);
            this.selectedDate.emit(date);
          }
        }
      }
    };

    const config = this.calendarType === 'start' ? startConfig : endConfig;
    this.fp = flatpickr(this.flatpickrInput.nativeElement, config);

    if (this.calendarType === 'start') {
      this.flatpickrInput.nativeElement.value = flatpickr.formatDate(today, "d-m-Y");
      this.selectedDate.emit(today);
    }
  }
}
