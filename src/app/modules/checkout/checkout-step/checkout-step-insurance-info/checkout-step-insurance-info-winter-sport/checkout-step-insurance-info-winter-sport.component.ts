import { NgbDateHelper } from 'app/shared/ngb-date-helper';
import {Component, OnInit, ViewChild} from '@angular/core';
import {CheckoutStepInsuranceInfoDynamicComponent} from '../checkout-step-insurance-info-dynamic-component';
import {CheckoutInsuredSubject, CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';
import {CheckoutCardInsuredSubjectsComponent} from '../../../checkout-card/checkout-card-insured-subjects/checkout-card-insured-subjects.component';
import {AuthService, DataService, InsurancesService} from '@services';
import {CheckoutStepService} from '../../../services/checkout-step.service';
import {CheckoutPeriod} from '../../../checkout.model';
import {CheckoutStepInsuranceInfoHelper} from '../checkout-step-insurance-info.helper';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import {BikeQuotationResponse, InsuranceInfoAttributes, LineFirstItem, OrderAttributes} from '@model';
import {tap} from 'rxjs/operators';
import {CheckoutCardDateTimeComponent} from '../../../checkout-card/checkout-card-date-time/checkout-card-date-time.component';
import {KenticoTranslateService} from '../../../../kentico/data-layer/kentico-translate.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-checkout-step-insurance-info-winter-sport',
  templateUrl: './checkout-step-insurance-info-winter-sport.component.html',
  styleUrls: ['./checkout-step-insurance-info-winter-sport.component.scss']
})
export class CheckoutStepInsuranceInfoWinterSportComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  product: CheckoutStepInsuranceInfoProduct;
  minAgeBirthDate = moment().subtract(4, 'year').format('DD/MM/YYYY');
  endDate: Date;
  startDate: Date;
  periodOptions: { opened: boolean, maxDate: Date, minDate: Date };
  isSeasonal = false;
  destinationName: string;
  message: string;
  date: Date;
  isBeforeSeasonalPeriod: boolean;
  isBeforeSeasonalPeriodNotSeasonal: boolean;
  icons: {icon_calendar: string, icon_hours: string} = {icon_calendar: null, icon_hours: null};
  @ViewChild('periodCard', { static: true }) periodCard: CheckoutCardDateTimeComponent;
  @ViewChild('insuredSubjectsCard', { static: true }) insuredSubjectsCard: CheckoutCardInsuredSubjectsComponent;

  constructor(private dataService: DataService,
              private checkoutStepService: CheckoutStepService,
              private authService: AuthService,
              private insuranceService: InsurancesService,
              private kenticoTranslateService: KenticoTranslateService
  ) {
    super();
  }

  ngOnInit() {
    this.product.destination = this.dataService.getResponseOrder().line_items[0].insurance_info.travel_destination;
    this.instant();
    this.getSeasonalDates();
    this.setPeriodOptions();
    this.getIcons();
  }

  instant(): void {
    if (this.product.duration === 30) {
      this.isSeasonal = true;
    }
  }

  private getSeasonalDates(): void {
    const currentDate: Date = new Date();
    this.startDate = new Date(moment(this.product.originalProduct.attributes.season_start_date).format('MM/DD/YYYY'));
    this.endDate = new Date(moment(this.product.originalProduct.attributes.season_end_date).format('MM/DD/YYYY'));
    if (this.isSeasonal) {
      if (formatDate(currentDate, 'MM/dd/YYYY', 'it-IT') >= formatDate(this.startDate, 'MM/dd/YYYY', 'it-IT')) {
        this.startDate = currentDate;
        this.isBeforeSeasonalPeriod = false;
        this.product.startDate = currentDate;
      } else {
        this.product.startDate = this.startDate;
        this.isBeforeSeasonalPeriod = true;
      }
    } else {
      if (formatDate(currentDate, 'MM/dd/YYYY', 'it-IT') >= formatDate(this.startDate, 'MM/dd/YYYY', 'it-IT')) {
        this.isBeforeSeasonalPeriodNotSeasonal = false;
        this.startDate = moment(currentDate).add(1, 'day').startOf('day').toDate();
        this.product.startDate = moment(currentDate).add(1, 'day').startOf('day').toDate();
      } else {
        this.product.startDate = this.startDate;
        this.isBeforeSeasonalPeriodNotSeasonal = true;
      }
    }
  }

  setPeriodOptions(): void {
    this.periodOptions = {opened: true, minDate: this.startDate, maxDate: this.endDate};
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const period: CheckoutPeriod = this.periodCard.computeModel();
    const insuredSubjects: CheckoutInsuredSubject[] = this.insuredSubjectsCard.computeModel();
    const insuredIsContractor: boolean = this.insuredSubjectsCard.contractorIsInsured();
    if (insuredIsContractor) {
      const address = Object.assign({}, this.authService.loggedUser.address);
      const id = CheckoutStepInsuranceInfoHelper.findUserIdInInsuredSubjects(address, this.product.insuredSubjects);
      insuredSubjects.push(CheckoutStepInsuranceInfoHelper.fromAddressToInsuredSubject(id, address));
    }
    return Object.assign({}, this.product, period, {insuredIsContractor, insuredSubjects, instant: period.instant});
  }

  isFormValid(): boolean {
    return (
      this.periodCard.form.valid &&
      this.insuredSubjectsCard.form.valid
    );
  }

  onBeforeNextStep(): Observable<any> {
    return this.recalculatePrice();
  }

  recalculatePrice(): Observable<BikeQuotationResponse> {
    const product = this.computeProduct();
    const quotationRequest = this.computeQuotationRequest(product);
    const total = this.dataService.getResponseOrder().item_total;
    const oaDifference = CheckoutStepInsuranceInfoHelper.diffOrderAttributes(this.dataService.getOrderAttributes(), quotationRequest);
    const agesChanged = CheckoutStepInsuranceInfoHelper.quantity(oaDifference);
    return this.insuranceService.submitCbSportQuotation(quotationRequest).pipe(tap((quotationResponse: any) => {
      if (agesChanged > 0 || total !== quotationResponse.total) {
        const reason = CheckoutStepInsuranceInfoHelper.computePriceChangeReason(agesChanged, total, quotationResponse);
        this.checkoutStepService.potentialPriceChange({current: quotationResponse.total, previous: total, reason});
      }
    }));
  }


  private hasZeroInsured(orderAttributes: OrderAttributes): boolean {
    let zeroInsured = true;
    Object.entries(orderAttributes).map(item => item[1]).forEach(value => zeroInsured = zeroInsured && (value + '') === '0');
    return zeroInsured;
  }

  computeQuotationRequest(product: CheckoutStepInsuranceInfoProduct) {
    const orderAttributes: OrderAttributes = CheckoutStepInsuranceInfoHelper.convertInsuredSubjectsToOrderAttributes(product.insuredSubjects);
    if (this.hasZeroInsured(orderAttributes)) {
      Object.assign(orderAttributes, this.dataService.getResponseOrder().data);
    }
    return Object.assign({
      variant_id: this.product.variantId,
      start_date: moment(product.startDate).format('YYYY-MM-DD'),
      duration: product.duration,
      quantity: product.quantity,
      addons: (this.dataService.getResponseOrder().line_items[0].addons || []).map(addon => addon.code),
    }, orderAttributes);
  }

  fillLineItem(lineItem: LineFirstItem): void {
    const product = this.computeProduct();
    const insuranceInfoAttributes = lineItem.insurance_info_attributes || new InsuranceInfoAttributes();
    insuranceInfoAttributes.travel_destination = product.destination;
    lineItem.insurance_info_attributes = insuranceInfoAttributes;
  }

  getIcons(): void {
    this.kenticoTranslateService.getItem<any>('checkout_sci_genertel').subscribe(item => {
      this.icons.icon_calendar = item.step_insurance_info.value.find(content => content.system.codename === 'icon_calendar').image.value[0].url;
      this.icons.icon_hours = item.step_insurance_info.value.find(content => content.system.codename === 'icon_hours').image.value[0].url;
    });
  }


}
