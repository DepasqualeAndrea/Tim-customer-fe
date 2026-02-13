import { AfterViewInit, Component, EventEmitter, Output, ViewChild, ElementRef, Input } from '@angular/core';
import flatpickr from "flatpickr";

@Component({
    selector: 'app-calendar-viaggi-breve',
    template: `
  <div class="w-100 h-100 input-txt-container">
  <div>
    <label 
    for="birthDate" 
    class="label-container" 
    [ngClass]="{
      'error-field': showErrorRangeFlag,
      'input-disabled': false
      }">
      <input #flatpickrInput id="flat-picker" class="input-calendar" [ngClass]="{ 'date-error': showErrorRangeFlag }" type="text" readonly="readonly" placeholder="gg/mm/aaaa - gg/mm/aaaa">
      <span class="up real-label">
        {{ "tim_protezione_viaggi.preventivatore_days_breve" | kentico }}
      </span>
      <i *ngIf="showErrorRangeFlag; else iconCalendar" class="fas fa-times input-error-icon picker-icon"></i>
      <ng-template #iconCalendar>
        <svg class="picker-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M0 2.63143V17.5714H18V2.63143H0ZM17.1429 16.7143H0.857143V6.54857H17.1429V16.7143ZM4.96286 2.625H3.24857V0H4.96286V2.625ZM14.7514 2.625H13.0371V0H14.7514V2.625Z" fill="#004691"/>
        </svg>
      </ng-template>
    </label>
  </div>
</div>`,
    styleUrls: ['./calendar-viaggi-breve.component.scss', "../../../../../styles/checkout-forms.scss"],
    standalone: false
})
export class CalendarViaggiBreveComponent implements AfterViewInit {
  @Output() selectedDates = new EventEmitter<[Date, Date]>();
  @Output() showErrorRange = new EventEmitter<boolean>();
  @ViewChild('flatpickrInput') flatpickrInput: ElementRef;
  @Input() showErrorRangeFlag: boolean = false;
  ngAfterViewInit(): void {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1)
    flatpickr(this.flatpickrInput.nativeElement, {
      mode: "range",
      dateFormat: "d-m-Y",
      minDate: tomorrow,
      onChange: (selectedDates, dateStr, instance) => {
        if (selectedDates.length === 2) {
          const startDate = selectedDates[0];
          const endDate = selectedDates[1];
          const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          let formattedDateStr = `${instance.formatDate(startDate, "d/m/Y")} - ${instance.formatDate(endDate, "d/m/Y")}`;
          if (diffDays > 60) {
            this.showErrorRange.emit(true);
            instance.clear();
            this.flatpickrInput.nativeElement.value = formattedDateStr;
          } else {
            this.showErrorRange.emit(false);
            this.flatpickrInput.nativeElement.value = formattedDateStr;
            this.selectedDates.emit([startDate, endDate]);
          }
        } else if (selectedDates.length === 1) {
          this.flatpickrInput.nativeElement.value = instance.formatDate(selectedDates[0], "d/m/Y");
        }
      }
    });
  }
}