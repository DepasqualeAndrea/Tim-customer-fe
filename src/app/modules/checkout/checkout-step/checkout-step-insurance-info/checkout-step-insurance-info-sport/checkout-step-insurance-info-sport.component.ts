import { Component, OnInit, ViewChild } from '@angular/core';
import { BikeQuotationResponse, LineFirstItem, OrderAttributes } from '@model';
import { AuthService, DataService, InsurancesService, Tenants } from '@services';
import { CheckoutCardDateTimeComponent } from 'app/modules/checkout/checkout-card/checkout-card-date-time/checkout-card-date-time.component';
import { CheckoutCardInsuredSubjectsAgeComponent } from 'app/modules/checkout/checkout-card/checkout-card-insured-subjects-age/checkout-card-insured-subjects-age.component';
import { CheckoutPeriod } from 'app/modules/checkout/checkout.model';
import { CheckoutStepService } from 'app/modules/checkout/services/checkout-step.service';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import moment from 'moment';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { CheckoutStepInsuranceInfoHelper } from '../checkout-step-insurance-info.helper';
import { CheckoutInsuredSubject, CheckoutStepInsuranceInfoProduct } from '../checkout-step-insurance-info.model';

@Component({
  selector: 'app-checkout-step-insurance-info-sport',
  templateUrl: './checkout-step-insurance-info-sport.component.html',
  styleUrls: ['./checkout-step-insurance-info-sport.component.scss']
})
export class CheckoutStepInsuranceInfoSportComponent extends CheckoutStepInsuranceInfoDynamicComponent  implements OnInit {

  product: CheckoutStepInsuranceInfoProduct;
  minAgeBirthDate = moment().subtract(4, 'year').format('DD/MM/YYYY');
  periodOptions: { minDate: Date,  maxDate: Date };
  isMockUserPushed: boolean = false;

  @ViewChild('periodCard') 
  periodCard: CheckoutCardDateTimeComponent;

  @ViewChild('insuredSubjectsCard') 
  insuredSubjectsCard: CheckoutCardInsuredSubjectsAgeComponent;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private insuranceService: InsurancesService,
    private checkoutStepService: CheckoutStepService
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

  public computeProduct(): CheckoutStepInsuranceInfoProduct {
    const period: CheckoutPeriod = this.periodCard.computeModel();
    const insuredSubjects: CheckoutInsuredSubject[] = this.insuredSubjectsCard.computeModel();
    const insuredIsContractor: boolean = this.insuredSubjectsCard.contractorIsInsured();
    if (insuredIsContractor) {
      if(((this.dataService.isTenant(Tenants.YOLO) || this.dataService.isTenant(Tenants.YOLO_EN) || this.dataService.isTenant(Tenants.YOLO_ES)) && !this.authService.loggedIn) && !this.isMockUserPushed) {
        insuredSubjects.push({
          id: null,
          familyRelationship: "other",
          firstName: "YoloSportMockFirstName",
          lastName: "YoloSportMockLastName",
          birthDate: new Date('1980-01-01')
        });
        this.isMockUserPushed = true;
      }
      const address = Object.assign({}, this.authService.loggedUser.address);
      const id = CheckoutStepInsuranceInfoHelper.findUserIdInInsuredSubjects(address, this.product.insuredSubjects);
      const insuredSubj: CheckoutInsuredSubject = CheckoutStepInsuranceInfoHelper.fromAddressToInsuredSubject(id, address);
      if (!!insuredSubj && !!insuredSubj.firstName && !!insuredSubj.lastName) {
        insuredSubjects.push(insuredSubj);
      }
    }
    return Object.assign({}, this.product, period, {insuredIsContractor, insuredSubjects, instant: period.instant});
  }

  public isFormValid(): boolean {
    return (
      this.periodCard.form.valid &&
      this.insuredSubjectsCard.form.valid
    );
  }

  public onBeforeNextStep(): Observable<any> {
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

  
  private hasZeroInsured(orderAttributes: OrderAttributes): boolean {
    let zeroInsured = true;
    Object.values(orderAttributes).forEach(value => zeroInsured = zeroInsured && (value + '') === '0');
    return zeroInsured;
  }

  public fillLineItem(lineItem: LineFirstItem): void {
    return;
  }

}
