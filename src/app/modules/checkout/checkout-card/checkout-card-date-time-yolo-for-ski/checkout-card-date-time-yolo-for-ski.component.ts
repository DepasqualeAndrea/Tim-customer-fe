import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbDateStruct, NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import { ContentItem } from 'kentico-cloud-delivery';
import moment from 'moment';
import { CheckoutPeriod } from '../../checkout.model';
import { CheckoutStepService } from '../../services/checkout-step.service';
import DurationConstructor = moment.unitOfTime.DurationConstructor;

@Component({
  selector: 'app-checkout-card-date-time-yolo-for-ski',
  templateUrl: './checkout-card-date-time-yolo-for-ski.component.html',
  styleUrls: ['./checkout-card-date-time-yolo-for-ski.component.scss']
})
export class CheckoutCardDateTimeYoloForSkiComponent implements OnInit {

  @Input() daysNumber: number;
  @Input() durationUnit: DurationConstructor;
  @Input() hideDailyOption = false;
  @Input() instantRoundMinutes = 15;
  @Input() seasonalDisclaimer: string;
  @Input() isAfterMinInsurableDate: boolean;
  @Input() productInfo;
  form: FormGroup;
  isCircle = false;
  endDate: Date;
  pickerOptions: { opened: boolean, maxDate: NgbDate, minDate: NgbDate } = (
    { opened: false, minDate: null, maxDate: null }
  );
  content;
  get isSeasonal() {
    return this.productInfo.order.line_items[0].variant.name === 'Seasonal';
  }

  constructor(private formBuilder: FormBuilder,
    public calendar: NgbCalendar, public dataService: DataService,
    private componentFeaturesService: ComponentFeaturesService,
    public kenticoTranslateService: KenticoTranslateService,
    private checkoutStepService: CheckoutStepService) {
    this.pickerOptions.minDate = calendar.getNext(this.calendar.getToday(), 'd', 1);
  }

  @Input() disableDateCondition: (date: NgbDate) => boolean = d => false;

  ngOnInit() {
    this.form = this.formBuilder.group(this.fromModelToView(this.productInfo));
    this.form.controls.startDate.setValidators(Validators.required);
    this.getEndDateForViewing();
    this.verifyCheckboxRadioButtonLayout();
    this.verifyIsBeforeMinInsurableDate();
    this.getContent();
    this.form.controls.startDate.valueChanges.subscribe((date: NgbDate) => {
      const newEndDate = this.calendar.getNext(date, 'd', (this.daysNumber - 1));
      this.form.controls.endDate.setValue(newEndDate);
      this.updateReducerPolicyDates(
        [{
          property: 'cost_item.policy_startDate',
          value: moment(TimeHelper.fromNgbDateToDate(date)).format('DD/MM/yyyy')
        },
        {
          property: 'cost_item.policy_endDate',
          value: moment(TimeHelper.fromNgbDateToDate(newEndDate)).format('DD/MM/yyyy')
        }
        ])
    });
    this.updateStartDate()
  }

  private updateReducerPolicyDates(props: { property: string, value: string }[]): void {
    props.forEach(prop =>
      this.checkoutStepService.setReducerProperty(prop)
    )
  }

  getEndDateForViewing() {
    this.endDate = new Date(moment(this.pickerOptions.minDate).add(this.daysNumber, 'day').format('MM/DD/YYYY'));
  }
  getContent() {
    this.kenticoTranslateService.getItem<ContentItem>('checkout_yolo_for_ski').pipe().subscribe(item => {
      this.content = item;
    });
  }
  verifyIsBeforeMinInsurableDate() {
    if (this.isAfterMinInsurableDate === true) {
      this.form.controls.instant.setValue(true);
    }
  }
  verifyCheckboxRadioButtonLayout() {
    this.componentFeaturesService.useComponent('card-date-time');
    this.componentFeaturesService.useRule('has-circle-checkbox');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const productsEnabled = this.componentFeaturesService.getConstraints();
      if (productsEnabled.size !== 0) {
        productsEnabled.forEach((k, v) => {
          if (v === this.dataService.product.product_code) {
            this.isCircle = true;
          }
        });
      }
    }
  }
  computeModel(): CheckoutPeriod {
    return this.fromViewToModel(this.form);
  }
  fromModelToView(product): { [key: string]: any } {
    return {
      instant: !!product && !!product.instant,
      startDate: !!product && this.pickerOptions.minDate,
      endDate: product && (this.calendar.getNext(this.pickerOptions.minDate, 'd', (this.daysNumber - 1))),
    };
  }
  fromViewToModel(form: FormGroup): CheckoutPeriod {
    return {
      instant: !!form.controls.instant.value,
      startDate: moment(TimeHelper.fromNgbDateToDate(form.controls.startDate.value))
        .set('hours', (form.controls.instant.value ? moment().get('hours') : 0))
        .set('minutes', (form.controls.instant.value ? moment().get('minutes') : 0)).toDate(),
    };
  }
  fromDateToNgbDateStruct(d: Date): NgbDateStruct {
    return TimeHelper.fromDateToNgbDate(d);
  }

  updateStartDate() {
    if (this.form.get('instant').value === true) {
      const currentDate = moment();
      this.form.controls.startDate.setValue(this.fromDateToNgbDateStruct(currentDate.toDate()));
      this.form.controls.startDate.updateValueAndValidity();
    }
  }
}
