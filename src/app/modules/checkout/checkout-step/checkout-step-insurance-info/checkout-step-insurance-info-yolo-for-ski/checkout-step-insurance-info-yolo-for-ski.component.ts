import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LineFirstItem } from '@model';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { CheckoutCardDateTimeComponent } from 'app/modules/checkout/checkout-card/checkout-card-date-time/checkout-card-date-time.component';
import { CheckoutCardInsuredSubjectsInfoComponent } from 'app/modules/checkout/checkout-card/checkout-card-insured-subjects-info/checkout-card-insured-subjects-info.component';
import { CheckoutPeriod } from 'app/modules/checkout/checkout.model';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import moment from 'moment';
import { Observable, of } from 'rxjs';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { CheckoutInsuredSubject, CheckoutStepInsuranceInfoProduct } from '../checkout-step-insurance-info.model';
import { TimeHelper } from 'app/shared/helpers/time.helper';

@Component({
  selector: 'app-checkout-step-insurance-info-yolo-for-ski',
  templateUrl: './checkout-step-insurance-info-yolo-for-ski.component.html',
  styleUrls: ['./checkout-step-insurance-info-yolo-for-ski.component.scss']
})
export class CheckoutStepInsuranceInfoYoloForSkiComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  @ViewChild('periodCard') periodCard: CheckoutCardDateTimeComponent;
  @ViewChild('insuredSubjectsCard') insuredSubjectsCard: CheckoutCardInsuredSubjectsInfoComponent;
  product: CheckoutStepInsuranceInfoProduct;
  periodOptions: { minDate: Date, maxDate: Date };
  minBirthDate: string;
  maxBirthDate: string;
  hideDailyOption = false;
  minInsurableDate: any;
  maxInsurableDate: any;
  seasonalDisclaimer: string;
  daysNumber: number;
  isAfterMinInsurableDate = false;
  content;

  constructor(private kenticoTranslateService: KenticoTranslateService,
    private calendar: NgbCalendar,
    public formBuilder: FormBuilder,
  ) { super(); }

  ngOnInit(): void {
    this.isSeasonal();
    this.setInsurableDates();
    this.product.startDate = this.product.order.line_items[0].start_date;
    this.product.endDate = this.product.order.line_items[0].expiration_date;
    this.product.insuredIsContractor = true;
    this.minBirthDate = moment().subtract(this.product.originalProduct.holder_minimum_age, 'year').format('DD/MM/YYYY');
    this.maxBirthDate = moment().subtract(this.product.originalProduct.holder_maximum_age, 'year').format('DD/MM/YYYY');
    this.periodOptions = { minDate: this.minInsurableDate, maxDate: this.maxInsurableDate };
    this.getContent();
    this.setSeasonalDisclaimer();
  }
  getContent() {
    this.kenticoTranslateService.getItem<any>('checkout_yolo_for_ski').pipe().subscribe(item => {
      this.content = item;
    });
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const period: CheckoutPeriod = this.periodCard.computeModel();
    const insuredSubjects: CheckoutInsuredSubject[] = this.insuredSubjectsCard.computeModel();
    const insuredIsContractor: boolean = this.insuredSubjectsCard.contractorIsInsured();
    return Object.assign({}, this.product, period, { insuredIsContractor, insuredSubjects, instant: period.instant });
  }
  setInsurableDates() {
    this.minInsurableDate = new Date(this.dateFormatter(this.product.originalProduct.properties.find(item =>
      item.name === 'season_start_date').value, 'MM/DD/YYYY', '/'));
    this.maxInsurableDate = new Date(this.dateFormatter(this.product.originalProduct.properties.find(item =>
      item.name === 'season_end_date').value, 'MM/DD/YYYY', '/'));
    let today = new Date(moment().format('MM/DD/YYYY'));
    const tomorrow = new Date((moment().add(1, 'day')).format('MM/DD/YYYY'));
    if (!(this.hideDailyOption) && formatDate(today, 'yyyy-MM-dd', 'it_IT') > formatDate(this.minInsurableDate, 'yyyy-MM-dd', 'it_IT')) {
      this.minInsurableDate = new Date(today);
    }
    this.daysNumber = this.product.order.line_items[0].days_number;
  }

  setSeasonalDisclaimer() {
    const preSeasonStartDate = this.product.originalProduct.properties.find((property) => property.name === 'pre_season_start_date').value;
    const preSeasonStartDateFormatted = TimeHelper.inverPositionDayMonth(preSeasonStartDate, 'MM/DD/YYYY', '/');
    if (this.hideDailyOption) {
      let minDateToBuy = new Date(moment(preSeasonStartDateFormatted).format('MM/DD/YYYY'));
      let today = new Date(moment().format('MM/DD/YYYY'));
      if ((formatDate(today, 'yyyy-MM-dd', 'it_IT') < formatDate(minDateToBuy, 'yyyy-MM-dd', 'it_IT')) &&
        (formatDate(today, 'yyyy-MM-dd', 'it_IT') > formatDate(this.maxInsurableDate, 'yyyy-MM-dd', 'it_IT'))) {
        this.seasonalDisclaimer = this.content.card_list.banner_yolo_for_ski.after_seasonal.value;
        this.isAfterMinInsurableDate = false;
      } else if ((formatDate(today, 'yyyy-MM-dd', 'it_IT') >= formatDate(minDateToBuy, 'yyyy-MM-dd', 'it_IT')) &&
        (formatDate(this.minInsurableDate, 'yyyy-MM-dd', 'it_IT') > formatDate(today, 'yyyy-MM-dd', 'it_IT'))) {
        this.seasonalDisclaimer = this.content.card_list.banner_yolo_for_ski.before_seasonal.value;
        this.isAfterMinInsurableDate = false;
      } else if ((formatDate(today, 'yyyy-MM-dd', 'it_IT') > formatDate(minDateToBuy, 'yyyy-MM-dd', 'it_IT')) &&
        (formatDate(this.minInsurableDate, 'yyyy-MM-dd', 'it_IT') <= formatDate(today, 'yyyy-MM-dd', 'it_IT'))) {
        this.seasonalDisclaimer = this.content.card_list.banner_yolo_for_ski.inside_seasonal.value;
        this.minInsurableDate = today;
        this.isAfterMinInsurableDate = true;
      }
    } else {
      this.seasonalDisclaimer = this.content.card_list.banner_yolo_for_ski.instant_default.value;
    }
  }

  isSeasonal() {
    if (this.product.order.line_items[0].variant.name === 'Seasonal') {
      this.hideDailyOption = true;
    } else {
      this.hideDailyOption = false;
    }
  }

  public isFormValid(): boolean {
    return (this.product.order.line_items[0].variant.name === 'Seasonal' ?
      this.insuredSubjectsCard.form.valid : (this.periodCard.form.valid &&
        this.insuredSubjectsCard.form.valid)
    );
  }

  public onBeforeNextStep(): Observable<any> {
    return of(null);
  }

  public fillLineItem(lineItem: LineFirstItem): void {
    lineItem.insurance_info_attributes = { extra: null };
    delete lineItem.expiration_date;
    if (this.product.order.line_items[0].variant.name === 'Seasonal') {
      delete lineItem.start_date;
      delete lineItem.instant;
    }
  }

  private dateFormatter(date, format, delimiter) {
    const dateItems = date.split(delimiter);
    const formatItems = format.toLowerCase().split(delimiter);
    const day = formatItems.indexOf('dd');
    const month = formatItems.indexOf('mm');
    const year = formatItems.indexOf('yyyy');

    const formattedDate = ([dateItems[day], dateItems[month], dateItems[year]]).join(delimiter);
    return formattedDate;
  }

}
