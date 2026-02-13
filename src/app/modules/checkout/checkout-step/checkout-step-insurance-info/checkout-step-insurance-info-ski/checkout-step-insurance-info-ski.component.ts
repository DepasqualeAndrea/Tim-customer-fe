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

@Component({
    selector: 'app-checkout-step-insurance-info-ski',
    templateUrl: './checkout-step-insurance-info-ski.component.html',
    styleUrls: ['./checkout-step-insurance-info-ski.component.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoSkiComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  product: CheckoutStepInsuranceInfoProduct;
  minAgeBirthDate = moment().subtract(4, 'year').format('DD/MM/YYYY');
  endDateSeasonalPeriod = moment().year(new Date().getFullYear()).month(3).date(30);
  currentDate = moment().year(new Date().getFullYear()).month(new Date().getMonth());
  startDateSeasonalPeriod = moment().year(new Date().getFullYear()).month(10).date(1);
  periodOptions: any;
  istantselector: boolean;
  destinationName: string;
  message: string;
  date: Date;
  @ViewChild('periodCard', { static: true }) periodCard: CheckoutCardDateTimeComponent;
  @ViewChild('insuredSubjectsCard', { static: true }) insuredSubjectsCard: CheckoutCardInsuredSubjectsComponent;

  constructor(private dataService: DataService,
              private checkoutStepService: CheckoutStepService,
              private authService: AuthService,
              private insuranceService: InsurancesService,
              private kenticoTranslateService: KenticoTranslateService,
  ) {
    super();
  }

  ngOnInit() {
    this.product.destination = this.dataService.getResponseOrder().line_items[0].insurance_info.travel_destination;
    this.product.duration = this.product.duration || moment(this.product.endDate).diff(this.product.startDate, 'days');
    this.product.durationUnit = this.product.durationUnit || 'days';
    this.setSeasonalMinMaxDate();
    this.setPeriodOptions();
    this.instant();
  }

  setSeasonalMinMaxDate() {
    if ((this.currentDate) <= (moment().year(new Date().getFullYear()).month(3))) {
      this.startDateSeasonalPeriod.subtract(1, 'year');
    } else {
      this.endDateSeasonalPeriod.add(1, 'year');
    }
    if ((this.currentDate) > (this.startDateSeasonalPeriod)) {
      const now = moment();
      const tomorrow = moment().add(1, 'days').startOf('day');
      this.startDateSeasonalPeriod = moment().add(tomorrow.diff(now, 'seconds', true), 'seconds');
      this.product.startDate = this.startDateSeasonalPeriod.toDate();
    }
  }

  instant() {
    if (this.product.code.startsWith('ge-ski-seasonal')) {
      this.istantselector = true;
    } else {
      this.istantselector = false;
    }
  }


  setPeriodOptions() {
    if (this.product.code.startsWith('ge-ski-seasonal')) {
      this.periodOptions = {minDate: this.startDateSeasonalPeriod.toDate(), maxDate: this.endDateSeasonalPeriod.toDate()};
    } else {
      // this.periodOptions = { maxDate: moment().add(1, 'years').toDate() };
      this.periodOptions = {maxDate: moment().add(60, 'days').toDate()};
    }
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
    const duration = moment(product.endDate).diff(moment(product.startDate), 'days');
    return Object.assign({
      variant_id: this.product.variantId,
      start_date: moment(product.startDate).format('YYYY-MM-DD'),
      duration: duration,
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

  computeStatusLabel(): string {
    if (this.product.code === 'ge-ski-seasonal-plus' || this.product.code === 'ge-ski-seasonal-premium') {
      const text = this.kenticoTranslateService.getItem<any>('seasonal_extra_message.text');
      let extratext;
      text.subscribe(policyStatus => {
        extratext = policyStatus.value;
      });
      return extratext;
    }
  }

}
