import {Component, OnInit, ViewChild} from '@angular/core';
import {CheckoutStepInsuranceInfoDynamicComponent} from '../checkout-step-insurance-info-dynamic-component';
import {CheckoutInsuredSubject, CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';
import * as moment from 'moment';
import {CheckoutCardDateTimeComponent} from '../../../checkout-card/checkout-card-date-time/checkout-card-date-time.component';
import {CheckoutCardInsuredSubjectsComponent} from '../../../checkout-card/checkout-card-insured-subjects/checkout-card-insured-subjects.component';
import {AuthService, DataService, InsurancesService} from '@services';
import {CheckoutStepService} from '../../../services/checkout-step.service';
import {CheckoutPeriod} from '../../../checkout.model';
import {CheckoutStepInsuranceInfoHelper} from '../checkout-step-insurance-info.helper';
import {Observable} from 'rxjs';
import {BikeQuotationResponse, LineFirstItem, OrderAttributes} from '@model';
import {tap} from 'rxjs/operators';
import { TimeHelper } from 'app/shared/helpers/time.helper';

@Component({
    selector: 'app-checkout-step-insurance-info-chubb-sport',
    templateUrl: './checkout-step-insurance-info-chubb-sport.component.html',
    styleUrls: ['./checkout-step-insurance-info-chubb-sport.component.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoChubbSportComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  product: CheckoutStepInsuranceInfoProduct;

  minAgeBirthDate = moment().subtract(4, 'year').format('DD/MM/YYYY');

  periodOptions: { minDate: Date,  maxDate: Date };

  @ViewChild('periodCard', { static: true }) periodCard: CheckoutCardDateTimeComponent;

  @ViewChild('insuredSubjectsCard', { static: true }) insuredSubjectsCard: CheckoutCardInsuredSubjectsComponent;


  constructor(private dataService: DataService,
      private checkoutStepService: CheckoutStepService,
      private authService: AuthService,
      private insuranceService: InsurancesService,
    ) {
    super();
  }

  ngOnInit() {
    this.product.extra = Object.assign({label: 'Sport prevalente', values: []}, this.product.extra);
    this.product.extraSelected = this.dataService.getResponseOrder().line_items[0].insurance_info.extra;
    this.product.duration = this.product.duration || moment(this.product.endDate).diff(this.product.startDate, 'days');
    this.product.durationUnit = this.product.durationUnit || 'days';
    this.periodOptions = {
      minDate: TimeHelper.roundDate(moment().add(2, 'hours').toDate(), 15),
      maxDate: moment().add(1, 'year').toDate()
    };
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const period: CheckoutPeriod = this.periodCard.computeModel();
    const insuredSubjects: CheckoutInsuredSubject[] = this.insuredSubjectsCard.computeModel();
    const insuredIsContractor: boolean = this.insuredSubjectsCard.contractorIsInsured();
    if (insuredIsContractor) {
      const address = Object.assign({}, this.authService.loggedUser.address);
      const id = CheckoutStepInsuranceInfoHelper.findUserIdInInsuredSubjects(address, this.product.insuredSubjects);
      const insuredSubj: CheckoutInsuredSubject = CheckoutStepInsuranceInfoHelper.fromAddressToInsuredSubject(id, address);
      if (!!insuredSubj && !!insuredSubj.firstName && !!insuredSubj.lastName) {
        insuredSubjects.push(insuredSubj);
      }

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
    return this.insuranceService.submitSportQuotation(quotationRequest).pipe(tap((quotationResponse: any) => {
      if (agesChanged > 0 || total !== quotationResponse.total_price) {
        const reason = CheckoutStepInsuranceInfoHelper.computePriceChangeReason(agesChanged, total, quotationResponse);
        this.checkoutStepService.potentialPriceChange({current: quotationResponse.total_price, previous: total, reason});
      }
    }));
  }


  private hasZeroInsured(orderAttributes: OrderAttributes): boolean {
    let zeroInsured = true;
    Object.entries(orderAttributes).map(item => item[1]).forEach(value => zeroInsured = zeroInsured && (value + '') === '0');
    return zeroInsured;
  }
  computeQuotationRequest(product: CheckoutStepInsuranceInfoProduct): any {
    const orderAttributes: OrderAttributes = CheckoutStepInsuranceInfoHelper.convertInsuredSubjectsToOrderAttributes(product.insuredSubjects);
    if (this.hasZeroInsured(orderAttributes)) {
      Object.assign(orderAttributes, this.dataService.getResponseOrder().data);
    }
    const request = Object.assign({
      variant_id: this.product.variantId,
      addons: (this.dataService.getResponseOrder().line_items[0].addons || []).map(addon => addon.code),
      start_date: moment(product.startDate).format('YYYY-MM-DD'),
      sport: this.product.originalProduct.extras[this.product.extraSelected],
      quantity: product.quantity,
    }, orderAttributes);

    return request;
  }

  fillLineItem(lineItem: LineFirstItem): void {
    const product = this.computeProduct();
  }

}
