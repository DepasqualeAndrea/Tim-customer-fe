import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CheckoutPeriod} from '../../checkout.model';
import {AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {NgbCalendar, NgbDate, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {TimeHelper} from '../../../../shared/helpers/time.helper';
import * as moment from 'moment';
import {DataService} from '@services';
import DurationConstructor = moment.unitOfTime.DurationConstructor;

@Component({
    selector: 'app-checkout-card-date-time',
    templateUrl: './checkout-card-date-time.component.html',
    styleUrls: ['./checkout-card-date-time.component.scss'],
    standalone: false
})
export class CheckoutCardDateTimeComponent implements OnInit, OnChanges {

  @Input() duration: number;
  @Input() durationUnit: DurationConstructor;
  @Input() period: CheckoutPeriod;
  @Input() hoursEnabled: boolean;
  @Input() minutesEnabled: boolean;
  @Input() hideInstantOption = false;
  @Input() extraInfoMessage: string;
  @Input() dateOptions: { opened: boolean, maxDate: Date, minDate: Date };
  @Input() timeDropdown = false;
  @Input() instantTimeMinutes = 30;
  @Input() instantRoundMinutes = 15;
  @Input() timeEnabled: boolean;
  @Input() isBeforeSeasonalPeriod: boolean;
  @Input() isBeforeSeasonalPeriodNotSeasonal: boolean;
  @Input() icons: {icon_calendar: string, icon_hours: string};
  show = false;
  visible = true;
  form: UntypedFormGroup;
  formImagin: UntypedFormGroup;
  product: string;
  startDateDisclaimerSeasonal: string;
  endDateDisclaimerSeasonal: string;
  pickerOptions: { opened: boolean, maxDate: NgbDateStruct, minDate: NgbDateStruct } = (
    {opened: false, minDate: null, maxDate: null}
  );

  constructor(private formBuilder: UntypedFormBuilder, public calendar: NgbCalendar, public dataService: DataService) {
    this.pickerOptions.minDate = calendar.getNext(this.calendar.getToday(), 'd', 1);
  }

  @Input() disableDateCondition: (date: NgbDate) => boolean = d => false;

  ngOnInit() {
    this.product = this.period.code;
    this.form = this.formBuilder.group(this.fromModelToView(this.period));
    this.formImagin = this.formBuilder.group(this.fromModelToViewImagin(this.period));
    this.form.controls.startDate.setValidators(Validators.required);
    this.form.controls.endDate.setValidators(Validators.required);
    this.computeEnabled(this.form.controls.startDate, !this.period.instant);
    this.computeEnabled(this.form.controls.hours, this.hoursEnabled);
    this.computeEnabled(this.form.controls.minutes, this.minutesEnabled);
    this.computeEnabled(this.formImagin.controls.time, this.timeEnabled);
    this.pickerOptions = Object.assign({}, this.pickerOptions, this.fromDateOptionsToPickerOptions(this.dateOptions || {}));
    this.getSeasonalDisclaimerDates();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.period && !changes.period.firstChange) {
      this.form.patchValue(this.fromModelToView(this.period));
    }
    if (changes.dateOptions && !changes.dateOptions.firstChange) {
      this.pickerOptions = Object.assign({opened: false, minDate: null, maxDate: null}, this.fromDateOptionsToPickerOptions(this.dateOptions || {}));
    }
  }

  computeModel(): CheckoutPeriod {
    return (this.dataService.isTenant('imagin-es-es_db')
    && (this.product === 'chubb-deporte' || this.product === 'chubb-deporte-rec' ))
    ? this.fromViewToModelImagin(this.form, this.formImagin) : this.fromViewToModel(this.form);
  }

  fromModelToView(period: CheckoutPeriod): { [key: string]: any } {
    const startDatePlusOne: Date = new Date();
    startDatePlusOne.setDate(period.startDate.getDate() + 1);
    const minEndDate: Date = (period.endDate.getTime() - period.startDate.getTime()) >= 0 ? period.endDate : startDatePlusOne;

    return {
      instant: !!period && !!period.instant,
      startDate: !!period && TimeHelper.fromDateToNgbDate(period.startDate),
      hours: period && period.startDate && moment(period.startDate).format('HH') || '00',
      minutes: period && period.startDate && moment(period.startDate).format('mm') || '00',
      endDate: period && TimeHelper.fromDateToNgbDate(minEndDate),
    };
  }
  fromModelToViewImagin(period: CheckoutPeriod) {
    const startDatePlusOne: Date = new Date();
    startDatePlusOne.setDate(period.startDate.getDate() + 1);
    const minEndDate: Date = (period.endDate.getTime() - period.startDate.getTime()) >= 0 ? period.endDate : startDatePlusOne;
    return {
      instant: false,
      startDate: period && TimeHelper.fromDateToNgbDate(period.startDate),
      time: period && period.startDate && moment(period.startDate).format('HH:mm') || '00:00',
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

  fromViewToModelImagin(form: UntypedFormGroup, formImagin: UntypedFormGroup) {
      return {
        instant: !!form.controls.instant.value,
        startDate: moment(TimeHelper.fromNgbDateToDate(form.controls.startDate.value))
          .set('hours', (formImagin.controls.time.value).substring(0, 2))
          .set('minutes', (formImagin.controls.time.value).substring(3)).toDate(),
        endDate: moment(TimeHelper.fromNgbDateToDate(form.controls.endDate.value))
          .set('hours', formImagin.controls.time.value)
          .set('minutes', formImagin.controls.time.value).toDate(),
      };
  }
  computeEnabled(control: AbstractControl, enabled: boolean): void {
    return enabled ? control.enable() : control.disable();
  }

  onStartDateSelection() {
    if (this.duration) {
      const period: CheckoutPeriod = (this.dataService.isTenant('imagin-es-es_db')
      && ( this.product === 'chubb-deporte' || this.product === 'chubb-deporte-rec')) ? this.fromViewToModelImagin(this.form, this.formImagin) : this.fromViewToModel(this.form) ;
      const endDate = moment(period.startDate).add(this.duration, this.durationUnit || 'days').toDate();
      const startDate = moment.max(moment(period.startDate), moment(this.dateOptions.minDate)).toDate();
      this.form.patchValue(this.fromModelToView({startDate: startDate, endDate, instant: period.instant}));
    }
  }

  onInstantChecked() {
    let newDate: Date = null;
    if (this.form.controls.instant.value === true) {
      newDate = TimeHelper.roundDate(moment().add(this.instantTimeMinutes, 'minutes').toDate(), this.instantRoundMinutes);
      this.computeEnabled(this.form.controls.startDate, false);
      this.computeEnabled(this.form.controls.hours, false);
      this.computeEnabled(this.form.controls.minutes, false);
      this.computeEnabled(this.formImagin.controls.time, false);
    } else {
      newDate = this.period.startDate;
      this.computeEnabled(this.form.controls.startDate, true);
      this.computeEnabled(this.form.controls.hours, this.hoursEnabled);
      this.computeEnabled(this.form.controls.minutes, this.minutesEnabled);
      this.computeEnabled(this.formImagin.controls.time, this.timeEnabled);
    }
    this.form.controls.startDate.patchValue(TimeHelper.fromDateToNgbDate(newDate));
    this.form.controls.hours.patchValue(moment(newDate).format('HH'));
    this.form.controls.minutes.patchValue(moment(newDate).format('mm'));
    this.onStartDateSelection();

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

  showText() {
    this.visible = !this.visible;
  }

  getSeasonalDisclaimerDates() {
    if (this.product === 'winter-sport-plus' || this.product === 'winter-sport-premium') {
      this.startDateDisclaimerSeasonal = moment(this.period.startDate).format('DD/MM/YYYY').toString();
      this.endDateDisclaimerSeasonal = moment(this.period.endDate).format('DD/MM/YYYY').toString();
    }
  }

}
