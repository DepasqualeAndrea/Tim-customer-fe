import { ChangeDetectorRef } from '@angular/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { OptionValue, Variant } from '@model';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import * as _ from 'lodash';
import * as moment from 'moment';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

const DEFAULT_VARIANT_SKU = 'BL-LT7';
const LIMITED_ELEGIBILITY_VARIANT_SKU = 'BL-LT3';
const LOCAL_TIME_FORMAT = 'LL';
@Component({
  selector: 'app-quotator-baggage-loss-lt',
  templateUrl: './quotator-baggage-loss-lt.component.html',
  styleUrls: ['./quotator-baggage-loss-lt.component.scss', '../preventivatore-basic.component.scss']
})
export class QuotatorBaggageLossLongTermComponent extends PreventivatoreAbstractComponent implements OnInit {

  @Input() product;

  @Output() actionEvent = new EventEmitter<any>();

  formGroup: FormGroup;

  calendarMinDate: NgbDateStruct;

  variants = [];
  price = '0';

  constructor(
    private calendar: NgbCalendar,
    private formBuilder: FormBuilder,
    ref: ChangeDetectorRef) {
    super(ref);
  }

  ngOnInit() {
    this.calendarMinDate = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
    this.formGroup = this.createFormGroup();
    this.setVariants(this.product.variants);
  }

  private createFormGroup(): FormGroup {
    const formGroup = this.formBuilder.group({
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
    });
    return formGroup;
  }

  updateDateControl(ngbDate: NgbDate, formControl: string) {
    const date = this.formatDateBeginningOfDay(TimeHelper.fromNgbDateToDate(ngbDate));
    this.formGroup.controls[formControl].setValue(date);
    this.setVariantsElegibility();
    this.price = this.calculatePrice();
  }

  private formatDateBeginningOfDay(date: Date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private formatDateToDateString(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (1 + date.getMonth()).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private formatDateTimeToLocalDate(date: Date): string {
    moment.locale('it');
    const localDate = moment(date).format(LOCAL_TIME_FORMAT);
    return localDate;
  }

  private setVariants(variants: Variant[]) {
    _.each(variants, (variant) => {
      _.each(this.transformOptionValues(variant.option_values), (option) => {
        this.variants.push({
          'id': variant.id,
          'sku': variant.sku,
          'name': option.presentation,
          'duration': option.duration,
          'price': variant.price,
          'active': false,
          'elegible': true
        });
      });
    });
  }

  // selectDefaultVariant is called only the first time fromDate has a value and not everytime its value is updated
  selectDefaultVariant() {
    const defaultVariant = this.variants.find(v => v.sku === DEFAULT_VARIANT_SKU);
    this.setActiveVariant(defaultVariant);
  }

  private setVariantsElegibility() {
    const fromDate: Date = this.formGroup.controls['fromDate'].value;
    // WEEKEND variant is elegible only on Fridays
    this.variants = this.variants
      .map(v => v.sku === LIMITED_ELEGIBILITY_VARIANT_SKU && moment(fromDate).isoWeekday() !== 5
        ? { ...v, elegible: false }
        : { ...v, elegible: true }
      );
  }

  setActiveVariant(variant: Variant) {
    this.variants = this.variants
      .map(v => v.id === variant.id ? { ...v, active: true } : { ...v, active: false });
    this.setFormToDate();
    this.price = this.calculatePrice();
  }

  private getActiveVariant() {
    return this.variants.find(v => v.active);
  }

  transformOptionValues(optionValues: OptionValue[]) {
    const ov = [];
    optionValues.forEach(option => (ov.push({...option, duration: parseInt(option.name.split(/\s/)[0], 10)})));
    return ov;
  }

  getEndDateToDisplay(variant): string {
    const date = this.getToDate(variant.duration);
    return date && variant.elegible ? this.formatDateTimeToLocalDate(date) : '-';
  }

  private getToDate(duration: number): Date {
    const fromDate = this.formGroup.controls['fromDate'].value;
    if (!!fromDate) {
      const toDate = this.addDays(fromDate, duration);
      return toDate;
    }
    return;
  }

  private addDays(date: Date, days: number): Date {
    const dateMoment = moment(date).add(days, 'd');
    dateMoment.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    return new Date(dateMoment.format());
  }

  private setFormToDate() {
    const active = this.getActiveVariant();
    const ngbDate = TimeHelper.fromDateToNgbDate(this.getToDate(active.duration));
    if (!!ngbDate) {
      this.updateDateControl(ngbDate, 'toDate');
    }
  }

  private calculatePrice(): string {
    const fromDate = this.formGroup.controls['fromDate'].value;
    const active = this.getActiveVariant();
    if (!!fromDate && !!active) {
      return active.price.toString();
    }
    return '0';
  }

  checkout() {
    const order = this.createOrderObj();
    this.sendCheckoutAction(order);
  }

  private createOrderObj() {
    return {
      order: {
        line_items_attributes: [
          {
            variant_id: this.getActiveVariant().id,
            quantity: 1,
            start_date: this.formatDateToDateString(this.formGroup.controls['fromDate'].value),
            expiration_date: this.formatDateToDateString(this.formGroup.controls['toDate'].value),
          }
        ]
      }
    };
  }

  private sendCheckoutAction(order: any) {
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

  private emitActionEvent(action: any) {
    this.actionEvent.next(action);
  }

}
