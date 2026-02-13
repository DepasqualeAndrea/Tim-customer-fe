import { Component, Output, Input, EventEmitter, OnInit, ChangeDetectorRef, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import * as _ from 'lodash';
import { UntypedFormGroup, Validators, UntypedFormBuilder, ValidatorFn, ValidationErrors } from '@angular/forms';
import { InsuredDrivers } from './insured-drivers.enum';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { NgbDateStruct, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';


@Component({
    selector: 'app-quotator-leasys',
    templateUrl: './quotator-leasys.component.html',
    styleUrls: ['./quotator-leasys.component.scss', '../preventivatore-basic.component.scss'],
    standalone: false
})
export class QuotatorLeasysComponent extends PreventivatoreAbstractComponent implements OnInit, OnChanges {

  public selectedProduct: any;

  public formGroup: UntypedFormGroup;

  public singleInsured: InsuredDrivers = InsuredDrivers.singleInsured;
  public multipleInsureds: InsuredDrivers = InsuredDrivers.multipleInsureds;

  public quotationPrice = '0';
  public fromDatePlaceholder = '';
  public toDatePlaceholder = '';

  public disabledDatePicker = false;
  private clickOnDriver = false;
  calendarMaxDate: NgbDateStruct;
  calendarMinDate: NgbDateStruct;
  minEndDate: NgbDateStruct;

  urlHasDates = false;

  @Output() actionEvent = new EventEmitter<any>();
  public internalData;
  @Output() swipeEvent = new EventEmitter<string>();

  constructor(
    private calendar: NgbCalendar,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    ref: ChangeDetectorRef
  ) {
    super(ref);
  }

  private initialized = false;
  ngOnInit() {
    this.calendarMinDate = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
    this.formGroup = this.createFormGroup();


    this.formGroup.valueChanges.pipe(untilDestroyed(this)).subscribe(
      () => {
        this.setCalendarMinMaxDate(this.formGroup);
        this.showQuotationPrice(this.formGroup, this.selectedProduct.price);
        if (this.selectedProduct.selected_values) {
          this.sendQuotationChanged(this.formGroup, this.selectedProduct.product_code, this.selectedProduct.selected_values.focus);
        }
        if (this.clickOnDriver) {
          this.sendSelectedDriver();
        }
      }
    );
    this.refreshData();
    this.sendDateIsInUrlAction(this.route);
    this.initialized = true;
  }

  setInitialDates(fromDate: Date, toDate: Date): void {
    this.setPlaceHoldersFromDate(fromDate, toDate);
    this.fillFormGroupWithDates(this.formGroup, fromDate, toDate);
  }

  setPlaceHoldersFromDate(fromDate: Date, toDate: Date) {
    this.fromDatePlaceholder = this.convertDateFormat(fromDate);
    this.toDatePlaceholder = this.convertDateFormat(toDate);
  }
  public setCalendarMinMaxDate(formGroup: UntypedFormGroup) {
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

  createOrderObj(variant) {
    return {
      order: {
        line_items_attributes: [
          {
            variant_id: variant,
            expiration_date: this.convertDateFormat(this.formGroup.controls['toDate'].value),
            start_date: this.convertDateFormat(this.formGroup.controls['fromDate'].value),
            quantity: this.formGroup.controls['insuredDrivers'].value
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
    const order = this.createOrderObj(this.selectedProduct.master_variant);
    this.sendCheckoutAction(order);
  }

  sendCheckoutAction(order: any) {
    const action = {
      action: 'checkout_product'
      , payload: {
        product: this.selectedProduct
        , order: order
        , router: 'checkout'
      }
    };
    this.emitActionEvent(action);
  }
  emitActionEvent(action: any) {
    this.actionEvent.next(action);
  }

  onSwipe(event) {
    const direction = Math.abs(event.deltaX) > 40 ? (event.deltaX > 0 ? 'right' : 'left') : '';
    this.swipeEvent.next(direction);
  }

  addDays(date: Date, days: number): Date {
    const dateMoment = moment(date).add(days, 'd');
    dateMoment.set({hour: 0, minute: 0, second: 0, millisecond: 0});
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

  controlCoverageValidity(fromDate: Date, toDate: Date): boolean {
    const daysDifference = this.calculateDaysDifference(fromDate, toDate);
    return daysDifference <= 30 ? true : false;
  }

  calculateDaysDifference(fromDate: Date, toDate: Date) {
    const starDate = moment(fromDate);
    const endDate = moment(toDate);
    const daysDifference = endDate.diff(starDate, 'd');
    return daysDifference;
  }

  controlDatesValidity(fromDate: Date, toDate: Date): boolean {
    return fromDate.getTime() < toDate.getTime();
  }

  controlPolicyStart(fromDate: Date, toDate: Date): boolean {
    return fromDate.getTime() >= this.addDays(new Date(), 1).setHours(0, 0, 0, 0) &&
           toDate.getTime() >= this.addDays(new Date(), 2).setHours(0, 0, 0, 0);
  }

  createFormGroup(): UntypedFormGroup {
    const formGroup = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      insuredDrivers: [this.singleInsured, Validators.required]
    });
    formGroup.setValidators(this.formGroupDatesValidator());
    return formGroup;
  }

  fillFormGroupWithDates(formGroup: UntypedFormGroup, fromDate: Date, toDate: Date): UntypedFormGroup {
    formGroup.controls['fromDate'].setValue(fromDate);
    formGroup.controls['toDate'].setValue(toDate);
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
          fromDateControl.setErrors({ coverage_exceeded: true });
        }
        if (!this.controlDatesValidity(fromDate, toDate)) {
          fromDateControl.setErrors({ from_date_invalid: true });
        }
        if (!this.controlPolicyStart(fromDate, toDate)) {
          fromDateControl.setErrors({ policy_start_invalid: true });
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
    const driversNumber = formGroup.controls['insuredDrivers'].value;
    if (!formGroup.valid) {
      return '0';
    }
    return (price * driversNumber * days).toString();
  }

  selectProduct(code: string) {
    this.selectedProduct = this.internalData.products.find(product =>
      product.product_code === code
    );
    this.showQuotationPrice(this.formGroup, this.selectedProduct.price);
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
    if (!this.internalData && this.data) {
      const selectedcode = this.data.product_code;
      this.internalData = {
        products: [this.data]
      };
      this.selectProduct(selectedcode);
      this.setFormValuesFromSelectedValues();
    }
  }

  sendQuotationChanged(formGroup: UntypedFormGroup, product_code: string, focus: boolean) {
    if (formGroup.valid && focus) {
      const fromDate = formGroup.controls['fromDate'].value;
      const toDate = formGroup.controls['toDate'].value;
      const driversCount = formGroup.controls['insuredDrivers'].value;
      const selectedQuotation = {
        action: 'quotationChanged',
        payload: {
          product_code: product_code,
          fromDate: fromDate,
          toDate: toDate,
          driversCount: driversCount
        }
      };
      this.sendActionEvent(selectedQuotation);
    }
  }
  setFormValuesFromSelectedValues() {
    if (!!this.selectedProduct
      && this.selectedProduct.selected_values) {
      const values = this.selectedProduct.selected_values;
      this.setValuesChanged(values);
    }
  }
  private setValuesChanged(values) {
    if (values.fromDate && values.toDate) {
      this.fillFormGroupWithDates(this.formGroup, values.fromDate, values.toDate);
      this.setPlaceHoldersFromDate(values.fromDate, values.toDate);
      const drivers = values.selected_drivers ? values.selected_drivers : values.driversCount;
      if (drivers) {
        const selectedDriver = drivers === 1 ? this.singleInsured : this.multipleInsureds;
        this.formGroup.controls['insuredDrivers'].setValue(selectedDriver);
      }
      if (this.selectedProduct.selected_values.dates_from_url) {
        this.disabledDatePicker = true;

      }
    }
  }
  setFormValuesFromUrlDates() {
    if (!!this.selectedProduct
      && this.selectedProduct.selected_values
      && this.selectedProduct.selected_values.dates_from_url) {
      const values = this.selectedProduct.selected_values;
      this.setValuesChanged(values);
    }
  }


  selectedValuesChanged() {
    this.setFormValuesFromSelectedValues();
    this.setFormValuesFromUrlDates();
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
  sendSelectedDriver() {
    this.clickOnDriver = false;
    const driver = this.formGroup.controls['insuredDrivers'].value;
    const dateInUrlAction = {
      action: 'selectedDriverChanged',
      payload: {
        selectedDriver: driver
      }
    };
    this.sendActionEvent(dateInUrlAction);
  }
  onSelectedDriverClick() {
    this.clickOnDriver = true;
  }
}
