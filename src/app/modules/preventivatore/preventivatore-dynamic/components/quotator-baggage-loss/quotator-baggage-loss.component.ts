import { UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef, OnChanges, OnDestroy } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
    selector: 'app-quotator-baggage-loss',
    templateUrl: './quotator-baggage-loss.component.html',
    styleUrls: ['./quotator-baggage-loss.component.scss', '../preventivatore-basic.component.scss'],
    standalone: false
})
export class QuotatorBaggageLossComponent extends PreventivatoreAbstractComponent implements OnInit, OnChanges, OnDestroy {

  formGroup: UntypedFormGroup;

  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  fromDatePlaceholder = '';
  toDatePlaceholder = '';
  calendarMinDate: NgbDateStruct;
  calendarMaxDate: NgbDateStruct;
  minEndDate: NgbDateStruct;

  disabledDatePicker = false;

  quotationPrice = '0';

  @Input() product;

  @Output() actionEvent = new EventEmitter<any>();

  private initialized = false;

  constructor(
    private calendar: NgbCalendar,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    ref: ChangeDetectorRef
  ) {
    super(ref);
  }

  ngOnInit() {
    this.calendarMinDate = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
    this.formGroup = this.createFormGroup();
    this.formGroup.valueChanges.pipe(untilDestroyed(this)).subscribe(
      () => {
        this.setCalendarMinMaxDate(this.formGroup);
        this.showQuotationPrice(this.formGroup, this.product.price);
      }
    );
    this.refreshData();
    this.sendDateIsInUrlAction(this.route);
    this.sendBookingIdIsInUrlAction(this.route);
    this.initialized = true;
  }

  setInitialData(fromDate: Date, toDate: Date, bookingId: string): void {
    const endDate = this.controlEndDate(toDate);
    this.setPlaceHoldersFromDate(fromDate, endDate);
    this.fillFormGroupWithDates(this.formGroup, fromDate, endDate);
    this.fillFormGroupWithBookingId(this.formGroup, bookingId);
  }

  setPlaceHoldersFromDate(fromDate: Date, toDate: Date) {
    this.fromDatePlaceholder = this.convertDateFormat(fromDate);
    this.toDatePlaceholder = this.convertDateFormat(toDate);
  }

  setCalendarMinMaxDate(formGroup: UntypedFormGroup) {
    const fromDate = formGroup.controls['fromDate'].value;
    if (!!fromDate) {
      this.minEndDate = this.calendar.getNext({
        day: fromDate.getDate(),
        month: fromDate.getMonth() + 1,
        year: fromDate.getFullYear()
      } as NgbDate, 'd', 1);
      this.calendarMaxDate = this.calendar.getNext({
        day: fromDate.getDate(),
        month: fromDate.getMonth() + 1,
        year: fromDate.getFullYear()
      } as NgbDate, 'd', 30);
    }
  }

  ngOnDestroy() {
  }

  createOrderObj() {
    return {
      order: {
        line_items_attributes: [
          {
            variant_id: this.product.master_variant,
            quantity: 1,
            start_date: this.convertDateFormat(this.formGroup.controls['fromDate'].value),
            expiration_date: this.convertDateFormat(this.formGroup.controls['toDate'].value),
            insurance_info_attributes: {
              booking_id: this.formGroup.controls['bookingId'].value
            }
          }
        ]
      }
    };
  }

  convertDateFormat(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (1 + date.getMonth()).toString().padStart(2, '0');
    const year = date.getFullYear();
    return day + '/' + month + '/' + year;
  }

  checkout() {
    const order = this.createOrderObj();
    this.sendCheckoutAction(order);
  }

  sendCheckoutAction(order: any) {
    const action = {
      action: 'checkout_product',
      payload: {
        product: this.product,
        order: order,
        router: 'checkout'
      }
    };
    this.emitActionEvent(action);
  }

  emitActionEvent(action: any) {
    this.actionEvent.next(action);
  }

  addDays(date: Date, days: number): Date {
    const dateMoment = moment(date).add(days, 'd');
    dateMoment.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    return new Date(dateMoment.format());
  }

  getDateFromUrlDateParam(dateString: string): Date {
    const newDate = new Date(dateString);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }

  controlTodayTodayDate(fromDate: Date): Date {
    const originalFromDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate(), 0, 0, 0, 0);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    if (originalFromDate.getTime() === todayDate.getTime()) {
      return this.addDays(originalFromDate, 1);
    }
    return originalFromDate;
  }

  controlEndDate(toDate: Date): Date {
    const originalToDate = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate(), 0, 0, 0, 0);
    return this.addDays(originalToDate, 1);
  }

  controlCoverageValidity(fromDate: Date, toDate: Date): boolean {
    const daysDifference = this.calculateDaysDifference(fromDate, toDate);
    return daysDifference <= 31 ? true : false;
  }

  controlDatesValidity(fromDate: Date, toDate: Date): boolean {
    return fromDate.getTime() < toDate.getTime();
  }

  controlPolicyStart(fromDate: Date, toDate: Date): boolean {
    return fromDate.getTime() >= this.addDays(new Date(), 1).setHours(0, 0, 0, 0) &&
      toDate.getTime() >= this.addDays(new Date(), 2).setHours(0, 0, 0, 0);
  }

  calculateDaysDifference(fromDate: Date, toDate: Date) {
    const starDate = moment(fromDate);
    const endDate = moment(toDate);
    const daysDifference = endDate.diff(starDate, 'd');
    return daysDifference;
  }

  createFormGroup(): UntypedFormGroup {
    const formGroup = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      bookingId: null
    });
    formGroup.setValidators(this.formGroupDatesValidator());
    return formGroup;
  }

  fillFormGroupWithDates(formGroup: UntypedFormGroup, fromDate: Date, toDate: Date): UntypedFormGroup {
    formGroup.controls['fromDate'].setValue(fromDate);
    formGroup.controls['toDate'].setValue(toDate);
    return formGroup;
  }

  fillFormGroupWithBookingId(formGroup: UntypedFormGroup, bookingId: string): UntypedFormGroup {
    formGroup.controls['bookingId'].setValue(bookingId);
    return formGroup;
  }

  isFormGroupValid(formGroup: UntypedFormGroup): boolean {
    const fromDate = formGroup.controls['fromDate'].value;
    const toDate = formGroup.controls['toDate'].value;
    if ((!!fromDate && !!toDate)) {
      return this.controlCoverageValidity(fromDate, toDate) && this.controlDatesValidity(fromDate, toDate);
    }
    return false;
  }

  formGroupDatesValidator(): ValidatorFn {
    return (group: UntypedFormGroup): ValidationErrors => {
      const fromDate = group.controls['fromDate'].value;
      const toDate = group.controls['toDate'].value;
      const fromDateControl = group.controls['fromDate'];
      fromDateControl.setErrors(null);
      if (!!fromDate && !!toDate) {
        if (!this.controlCoverageValidity(fromDate, toDate)) {
          const coverageExceeded = { coverage_exceeded: true };
          fromDateControl.setErrors({...fromDateControl.errors, ...coverageExceeded});
        }
        if (!this.controlDatesValidity(fromDate, toDate)) {
          const fromDateInvalid = { from_date_invalid: true };
          fromDateControl.setErrors({...fromDateControl.errors, ...fromDateInvalid});
        }
        if (!this.controlPolicyStart(fromDate, toDate)) {
          const policyStartDateInvalid = { policy_start_invalid: true };
          fromDateControl.setErrors({...fromDateControl.errors, ...policyStartDateInvalid});
        }
      }
      return;
    };
  }

  showQuotationPrice(formGroup: UntypedFormGroup, price: any) {
    const fromDate = formGroup.controls['fromDate'].value;
    const toDate = formGroup.controls['toDate'].value;
    if (!!fromDate && !!toDate) {
      this.quotationPrice = this.calculatePrice(formGroup, price);
    }
  }

  calculatePrice(formGroup: UntypedFormGroup, price: any): string {
    const fromDate = formGroup.controls['fromDate'].value;
    const toDate = formGroup.controls['toDate'].value;
    const days = this.calculateDaysDifference(fromDate, toDate);
    if (formGroup.invalid) {
      return '0';
    }
    return (price * days).toString();
  }

  updateDateControl(ngbDate: any, formControl: string) {
    const stringDate = ngbDate.year + '-' + ngbDate.month.toString().padStart(2, '0') + '-' + ngbDate.day.toString().padStart(2, '0');
    const dateFromEvent = this.getDateFromUrlDateParam(stringDate);
    this.formGroup.controls[formControl].setValue(dateFromEvent);
  }

  ngOnChanges() {
    if (this.initialized) {
      this.refreshData();
    }
  }

  private refreshData() {
    if (!this.formGroup) {
      return;
    }
    if (this.data) {
      this.setFormValuesFromSelectedValues();
    }
  }

  setFormValuesFromSelectedValues() {
    if (!!this.product && this.product.selected_values) {
      const values = this.product.selected_values;
      this.setValuesChanged(values);
    }
  }

  private setValuesChanged(values) {
    if (values.fromDate && values.toDate) {
      const endDate = this.controlEndDate(values.toDate);
      this.fillFormGroupWithDates(this.formGroup, values.fromDate, endDate);
      this.setPlaceHoldersFromDate(values.fromDate, endDate);
      if (this.product.selected_values.dates_from_url) {
        this.disabledDatePicker = true;
      }
    }
    if (values.booking_id) {
      this.fillFormGroupWithBookingId(this.formGroup, values.booking_id);
    }
  }

  setFormValuesFromUrl() {
    if (!!this.product &&
      this.product.selected_values &&
      (this.product.selected_values.dates_from_url || this.product.selected_values.booking_id_from_url)
    ) {
      const values = this.product.selected_values;
      this.setValuesChanged(values);
    }
  }

  selectedValuesChanged() {
    this.setFormValuesFromSelectedValues();
    this.setFormValuesFromUrl();
  }

  sendDateIsInUrlAction(route: ActivatedRoute) {
    if (route.snapshot && route.snapshot.queryParams) {
      const dateParams = route.snapshot.queryParams['date'];
      if (!!dateParams) {
        const dateInUrlAction = {
          action: 'date64Received',
          payload: {
            dateBase64: dateParams
          }
        };
        this.sendActionEvent(dateInUrlAction);
      }
    }
  }

  sendBookingIdIsInUrlAction(route: ActivatedRoute) {
    if (route.snapshot && route.snapshot.queryParams) {
      const bookingParams = route.snapshot.queryParams['prenotazione'];
      if (!!bookingParams) {
        const bookingIdInUrlAction = {
          action: 'bookingId64Received',
          payload: {
            bookingIdBase64: bookingParams
          }
        };
        this.sendActionEvent(bookingIdInUrlAction);
      }
    }
  }

}
