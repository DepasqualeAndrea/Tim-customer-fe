import { Component, OnInit, ViewChild } from '@angular/core';
import { CheckoutInsuredSubject, CheckoutStepInsuranceInfoProduct } from '../checkout-step-insurance-info.model';
import * as moment from 'moment';
import { CheckoutCardDateTimeComponent } from '../../../checkout-card/checkout-card-date-time/checkout-card-date-time.component';
import { CheckoutCardInsuredSubjectsComponent } from '../../../checkout-card/checkout-card-insured-subjects/checkout-card-insured-subjects.component';
import { AuthService, DataService, InsurancesService } from '@services';
import { CheckoutPeriod } from '../../../checkout.model';
import { Observable } from 'rxjs';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { LineFirstItem, Country, User, BikeQuotationResponse, BikeQuotationRequest } from '@model';
import { CheckoutStepInsuranceInfoHelper } from '../checkout-step-insurance-info.helper';
import { CheckoutCardHouseAddressComponent } from 'app/modules/checkout/checkout-card/checkout-card-house-address/checkout-card-house-address.component';
import { CheckoutStepService } from 'app/modules/checkout/services/checkout-step.service';
import {tap} from 'rxjs/operators';



@Component({
    selector: 'app-checkout-step-insurance-info-holiday-home',
    templateUrl: './checkout-step-insurance-info-holiday-home.component.html',
    styleUrls: ['./checkout-step-insurance-info-holiday-home.component.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoHolidayHomeComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {
  product: CheckoutStepInsuranceInfoProduct;

  minAgeBirthDate = moment().subtract(4, 'year').format('DD/MM/YYYY');

  periodOptions: { maxDate: Date };

  selectedDestination: Country;

  user: User;

  extraMessage = 'La data di inizio della copertura deve coincidere con la data di decorrenza del contratto della casa vacanza affittata.';

  @ViewChild('periodCard', { static: true }) periodCard: CheckoutCardDateTimeComponent;

  @ViewChild('insuredSubjectsCard', { static: true }) insuredSubjectsCard: CheckoutCardInsuredSubjectsComponent;

  @ViewChild('rentalAddressCard', { static: true }) rentalAddressCard: CheckoutCardHouseAddressComponent;

  @ViewChild('residentialAddressCard', { static: true }) residentialAddressCard: CheckoutCardHouseAddressComponent;

  constructor(private authService: AuthService,
    private dataService: DataService,
    private checkoutStepService: CheckoutStepService,
    private insuranceService: InsurancesService,
    ) {
    super();
  }

  ngOnInit() {
    this.product.duration = this.product.duration || moment(this.product.endDate).diff(this.product.startDate, 'days');
    this.product.durationUnit = this.product.durationUnit || 'days';
    // this.periodOptions = { maxDate: moment().add(1, 'years').toDate() };
    this.periodOptions = { maxDate: moment().add(1, 'year').toDate() };
    this.selectedDestination = this.product.originalProduct.destination;
    this.user = this.authService.loggedUser;
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const period: CheckoutPeriod = this.periodCard.computeModel();
    const insuredSubjects: CheckoutInsuredSubject[] = this.insuredSubjectsCard.computeModel();
    const insuredIsContractor = true;
    const address = Object.assign({}, this.authService.loggedUser.address);
    const id = CheckoutStepInsuranceInfoHelper.findUserIdInInsuredSubjects(address, this.product.insuredSubjects);
    insuredSubjects.push(CheckoutStepInsuranceInfoHelper.fromAddressToInsuredSubject(id, address));
    return Object.assign({}, this.product, period, { insuredIsContractor, insuredSubjects, instant: period.instant });
  }

  isFormValid(): boolean {
    return (
      this.periodCard.form.valid &&
      this.insuredSubjectsCard.form.valid &&
      this.rentalAddressCard.form.valid &&
      this.residentialAddressCard.form.valid
    );
  }

  onBeforeNextStep(): Observable<any> {
    if (this.residentialAddressCard.userHasBeenUpdated()) { this.residentialAddressCard.updateUser(); }
    return this.recalculatePrice();
  }


  fillLineItem(lineItem: LineFirstItem): void {
    lineItem.quantity = this.product.quantity;
    lineItem.houses_attributes = {
      '0': this.residentialAddressCard.computeAddress(),
      '1': this.rentalAddressCard.computeAddress()
    };
  }

  recalculatePrice(): Observable<BikeQuotationResponse> {
    const product = this.computeProduct();
    const quotationRequest = this.computeQuotationRequest(product);
    const total = this.dataService.getResponseOrder().item_total;
    const oaDifference = CheckoutStepInsuranceInfoHelper.diffOrderAttributes(this.dataService.getOrderAttributes(), quotationRequest);
    const agesChanged = CheckoutStepInsuranceInfoHelper.quantity(oaDifference);
    return this.insuranceService.submitCbHolidayHouseQuotation(quotationRequest).pipe(tap((quotationResponse: any) => {
      if (agesChanged > 0 || total !== quotationResponse.total) {
        const reason = CheckoutStepInsuranceInfoHelper.computePriceChangeReason(agesChanged, total, quotationResponse);
        this.checkoutStepService.potentialPriceChange({ current: quotationResponse.total, previous: total, reason });
      }
    }));
  }

  computeQuotationRequest(product: CheckoutStepInsuranceInfoProduct): BikeQuotationRequest {
    const duration = moment(product.endDate).diff(moment(product.startDate), 'days');
    return Object.assign({
      variant_id: this.product.variantId,
      addons: (this.dataService.getResponseOrder().line_items[0].addons || []).map(addon => addon.code),
      start_date: moment(product.startDate).format('YYYY-MM-DD'),
      duration: duration,
      quantity: product.quantity,
    }, CheckoutStepInsuranceInfoHelper.convertInsuredSubjectsToOrderAttributes(product.insuredSubjects));
  }


}
