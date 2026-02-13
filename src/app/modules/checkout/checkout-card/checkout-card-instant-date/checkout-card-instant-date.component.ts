import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import moment from 'moment';
import DurationConstructor = moment.unitOfTime.DurationConstructor;
import { CheckoutPeriod } from '../../checkout.model';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DataService } from '@services';
import { ValidatorsHelper } from 'app/shared/helpers/validators.helper';

@Component({
    selector: 'app-checkout-card-instant-date',
    templateUrl: './checkout-card-instant-date.component.html',
    styleUrls: ['./checkout-card-instant-date.component.scss'],
    standalone: false
})
export class CheckoutCardInstantDateComponent implements OnInit {

  @Input() duration: number;
  @Input() durationUnit: DurationConstructor;
  @Input() period: CheckoutPeriod;
  @Input() hideInstantOption = false;
  @Input() extraInfoMessage: string;
  @Input() dateOptions: { opened: boolean, maxDate: Date, minDate: Date };
  @Input() timeDropdown = false;
  @Input() instantTimeMinutes = 30;
  @Input() instantRoundMinutes = 15;
  @Input() timeEnabled: boolean;

  form: UntypedFormGroup;
  product: string;
  pickerOptions: { opened: boolean, maxDate: NgbDateStruct, minDate: NgbDateStruct } = (
    {opened: false, minDate: null, maxDate: null}
  );

  constructor(
    private formBuilder: UntypedFormBuilder, 
    public calendar: NgbCalendar, 
    public dataService: DataService
  ) {
    this.pickerOptions.minDate = calendar.getNext(this.calendar.getToday(), 'd', 1);
  }

  ngOnInit() {
    this.product = this.period.code;
    this.form = this.formBuilder.group(
      this.fromModelToView(this.period),
      { validator: ValidatorsHelper.NotNullValidator });
    this.form.controls.instant.valueChanges.subscribe(isInstant => this.toggleInstant(isInstant))
    this.pickerOptions = Object.assign({}, this.pickerOptions, this.fromDateOptionsToPickerOptions(this.dateOptions || {}));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.period && !changes.period.firstChange) {
      this.form.patchValue(this.fromModelToView(this.period));
    }
    if (changes.dateOptions && !changes.dateOptions.firstChange) {
      this.pickerOptions = Object.assign({opened: false, minDate: null, maxDate: null}, this.fromDateOptionsToPickerOptions(this.dateOptions || {}));
    }
  }

  private toggleInstant(isInstant: boolean): void  {
    if (!isInstant) {
      this.form.controls.startDate.setValidators(Validators.required);
      this.form.controls.endDate.setValidators(Validators.required);
    }
    if (isInstant) {
      this.form.controls.startDate.setValidators(Validators.nullValidator);
      this.form.controls.endDate.setValidators(Validators.nullValidator);
    }
  }

  computeModel(): CheckoutPeriod {
    return this.fromViewToModel(this.form);
  }

  fromModelToView(period: CheckoutPeriod): { [key: string]: any } {
    const startDatePlusOne: Date = new Date();
    startDatePlusOne.setDate(period.startDate.getDate() + 1);
    const minEndDate: Date = (period.endDate.getTime() - period.startDate.getTime()) >= 0 ? period.endDate : startDatePlusOne;

    return {
      instant: period && period.instant,
      startDate: period && TimeHelper.fromDateToNgbDate(period.startDate),
      hours: period && period.startDate && moment(period.startDate).format('HH') || '00',
      minutes: period && period.startDate && moment(period.startDate).format('mm') || '00',
      endDate: period && TimeHelper.fromDateToNgbDate(minEndDate),
    };
  }

  fromViewToModel(form: UntypedFormGroup): CheckoutPeriod {
      return {
        instant: !!form.controls.instant.value,
        startDate: moment(TimeHelper.fromNgbDateToDate(form.controls.startDate.value))
          .set('hours', this.form.controls.hours.value)
          .set('minutes', this.form.controls.minutes.value).toDate(),
        endDate: moment(TimeHelper.fromNgbDateToDate(form.controls.endDate.value))
          .set('hours', this.form.controls.hours.value)
          .set('minutes', this.form.controls.minutes.value).toDate(),
      };
  }

  onStartDateSelection() {
    if (this.duration) {
      const period: CheckoutPeriod = this.fromViewToModel(this.form) ;
      const endDate = moment(period.startDate).add(this.duration, this.durationUnit || 'days').toDate();
      const startDate = moment.max(moment(period.startDate), moment(this.dateOptions.minDate)).toDate();
      this.form.patchValue(this.fromModelToView({startDate: startDate, endDate, instant: period.instant}));
    }
  }

  fromDateOptionsToPickerOptions(dateOptions: { opened?: boolean, maxDate?: Date, minDate?: Date }): { opened?: boolean, maxDate?: NgbDateStruct, minDate?: NgbDateStruct } {
    const x: { opened?: boolean, maxDate?: NgbDateStruct, minDate?: NgbDateStruct } = {};
    if (dateOptions.opened !== undefined) {
      x.opened = dateOptions.opened;
    }
    if (dateOptions.minDate !== undefined) {
      x.minDate = this.fromDateToNgbDateStruct(dateOptions.minDate);
    }
    if (dateOptions.maxDate !== undefined) {
      x.maxDate = this.fromDateToNgbDateStruct(dateOptions.maxDate);
    }
    return x;
  }

  fromDateToNgbDateStruct(d: Date): NgbDateStruct {
    return TimeHelper.fromDateToNgbDate(d);
  }

  createRange(timeFormat: 'HH' | 'mm', endValue: number): Array<number> {
    const result: Array<number> = [];
    const isCurrentDay = moment().isSame(TimeHelper.fromNgbDateToDate(this.form.controls.startDate.value), 'day');
    const startValue = isCurrentDay ? +moment(this.dateOptions.minDate).format(timeFormat) : 0;

    for (let i = startValue; i <= endValue; i++) {
      result.push(i);
    }
    return result;
  }

  formatTimeNumber(n: number): string {
    let result: string = n.toString();
    if (result.length < 2) {
      result = '0' + result;
    }
    return result;
  }

  public getExpirationDate(): string {
    let newDate = moment(TimeHelper.fromNgbDateToDate(this.form.controls.startDate.value)).add(this.duration, this.durationUnit);
    let newDateS = newDate.format('DD/MM/YYYY').toString();
    return newDateS;
  }

  public getExpirationHour(): string {
    return this.form.controls.hours.value + ':' + this.form.controls.minutes.value
  }
}
