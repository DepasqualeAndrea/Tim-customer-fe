import {Component, Input, OnChanges, OnInit, SimpleChanges, Inject, LOCALE_ID} from '@angular/core';
import {NgbCalendar, NgbDate, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {TimeHelper} from '../../../../shared/helpers/time.helper';
import {CheckoutPeriod} from '../../checkout.model';
import DurationConstructor = moment.unitOfTime.DurationConstructor;
import {DataService} from '@services';
import { KenticoUnknownPipeMap } from 'app/shared/pipe/services/kentico-unknown-pipe-map.service';
import { KenticoEmptyPipeMap } from 'app/shared/pipe/services/kentico-empty-pipe-map.service';


@Component({
    selector: 'app-checkout-card-period',
    templateUrl: './checkout-card-period.component.html',
    styleUrls: ['./checkout-card-period.component.scss'],
    standalone: false
})
export class CheckoutCardPeriodComponent implements OnInit, OnChanges {

  @Input() duration: number;

  @Input() durationUnit: DurationConstructor;

  @Input() period: CheckoutPeriod;

  @Input() endDateEnabled: boolean;

  @Input() startDateEnabled: boolean;

  @Input() instantEnabled: boolean;

  @Input() instantLabel: string;

  @Input() allowSameDate = true;

  @Input() expirationDateBefore = false;

  form: UntypedFormGroup;

  pickerOptions: { opened: boolean, maxDate: NgbDateStruct, minDate: NgbDateStruct } = (
    {opened: false, minDate: null, maxDate: null}
  );

  constructor(
    private formBuilder: UntypedFormBuilder,
    public calendar: NgbCalendar,
    public dataService: DataService,
    public kenticoPipeMapService: KenticoEmptyPipeMap
  ) {
    this.pickerOptions.minDate = calendar.getNext(this.calendar.getToday(), 'd', 1);
  }

  ngOnInit() {
    this.form = this.formBuilder.group(this.fromModelToView(this.period));
    this.form.controls.startDate.setValidators(Validators.required);
    this.form.controls.endDate.setValidators(Validators.required);
    this.computeEnabled(this.form.controls.startDate, this.startDateEnabled);
    this.computeEnabled(this.form.controls.endDate, this.endDateEnabled);
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.period && !changes.period.firstChange) {
      this.form.patchValue(this.fromModelToView(this.period));
    }
    if (changes.endDateEnabled && !changes.endDateEnabled.firstChange) {
      this.computeEnabled(this.form.controls.endDate, this.endDateEnabled);
    }
    if (changes.startDateEnabled && !changes.startDateEnabled.firstChange) {
      this.computeEnabled(this.form.controls.startDate, this.startDateEnabled);
    }
  }

  computeModel(): CheckoutPeriod {
    return this.fromViewToModel(this.form);
  }

  fromModelToView(period: CheckoutPeriod): { [key: string]: any } {
    const endDate = this.expirationDateBefore ?
      moment(period.endDate).subtract(1, 'd').toDate() :
      period.endDate;
    return {
      instant: period && period.instant,
      startDate: period && TimeHelper.fromDateToNgbDate(period.startDate),
      endDate: period && TimeHelper.fromDateToNgbDate(endDate),
    };
  }

  fromViewToModel(form: UntypedFormGroup): CheckoutPeriod {
    const formEndDate = TimeHelper.fromNgbDateToDate(form.controls.endDate.value);
    const endDate = this.expirationDateBefore ?
      moment(formEndDate).add(1, 'd').toDate() :
      formEndDate;
    return {
      instant: !!form.controls.instant.value,
      startDate: TimeHelper.fromNgbDateToDate(form.controls.startDate.value),
      endDate
    };
  }

  computeEnabled(control: AbstractControl, enabled: boolean): void {
    return enabled ? control.enable() : control.disable();
  }


  onEndDateSelection() {
    if (this.duration) {
      const period: CheckoutPeriod = this.fromViewToModel(this.form);
      const startDate = moment(period.endDate).add(-this.duration, this.durationUnit || 'days').toDate();
      this.form.patchValue(this.fromModelToView({startDate, endDate: period.endDate, instant: this.form.controls.instant.value}));
    }
  }

  onStartDateSelection() {
    if (this.duration) {
      const period: CheckoutPeriod = this.fromViewToModel(this.form);
      const endDate = moment(period.startDate).add(this.duration, this.durationUnit || 'days').toDate();
      this.form.patchValue(this.fromModelToView({startDate: period.startDate, endDate, instant: this.form.controls.instant.value}));
    }
  }

  handleInstant() {
    if (this.form.controls.instant.value === true) {
      this.form.controls.startDate.patchValue(TimeHelper.fromDateToNgbDate(moment().toDate()));
      this.computeEnabled(this.form.controls.startDate, false);
      this.computeEnabled(this.form.controls.endDate, false);
      this.onStartDateSelection();
    } else {
      this.computeEnabled(this.form.controls.startDate, this.startDateEnabled);
      this.computeEnabled(this.form.controls.endDate, this.endDateEnabled);
    }
  }
  computeEndDateMin() {
    const val: NgbDate = this.form.get('startDate').value;
    return this.allowSameDate || !val ? val : this.calendar.getNext(val, 'd', 1);
  }
}
