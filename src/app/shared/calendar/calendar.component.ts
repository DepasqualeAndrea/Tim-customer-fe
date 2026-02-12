import { AfterViewInit, Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import flatpickr from "flatpickr";

@Component({
  selector: 'app-calendar',
  template: '<input #flatpickrInput class="input-calendar col-12" type="text" readonly="readonly" placeholder="GG/MM/AAAA - GG/MM/AAAA">',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements AfterViewInit {
  @Output() selectedDates = new EventEmitter<[Date, Date]>();
  @Output() showErrorRange = new EventEmitter<boolean>();
  @ViewChild('flatpickrInput') flatpickrInput: ElementRef;

  ngAfterViewInit(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = today;

    flatpickr(this.flatpickrInput.nativeElement, {
      mode: "range",
      dateFormat: "d-m-Y",
      defaultDate: [startDate, null],
      minDate: startDate,
      onReady: (selectedDates, dateStr, instance) => {

        instance.setDate([startDate, null]);
        this.flatpickrInput.nativeElement.value = `${instance.formatDate(startDate, "d-m-Y")} - `;
      },
      onChange: (selectedDates, dateStr, instance) => {
        if (selectedDates.length === 2 && selectedDates[1]) {
          const endDate = selectedDates[1];
          const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays > 31) {
            this.showErrorRange.emit(true);
            instance.clear();
            instance.setDate([startDate, null]);
            this.flatpickrInput.nativeElement.value = `${instance.formatDate(startDate, "d-m-Y")} - `;
          } else {
            this.showErrorRange.emit(false);
            let formattedDateStr = `${instance.formatDate(startDate, "d-m-Y")} - ${instance.formatDate(endDate, "d-m-Y")}`;
            this.flatpickrInput.nativeElement.value = formattedDateStr;
            this.selectedDates.emit([startDate, endDate]);
          }
        } else if (selectedDates.length === 1) {
          this.flatpickrInput.nativeElement.value = `${instance.formatDate(startDate, "d-m-Y")} - ${instance.formatDate(selectedDates[0], "d-m-Y")}`;
        }
      }
    });
  }
}
