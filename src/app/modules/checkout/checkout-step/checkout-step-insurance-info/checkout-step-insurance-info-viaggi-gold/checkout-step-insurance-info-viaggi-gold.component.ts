import {Component, OnInit, ViewChild} from '@angular/core';
import {CheckoutInsuredSubject, CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';
import {CheckoutStepInsuranceInfoDynamicComponent} from '../checkout-step-insurance-info-dynamic-component';
import {CheckoutCardPeriodComponent} from '../../../checkout-card/checkout-card-period/checkout-card-period.component';
import {CheckoutCardInsuredSubjectsComponent} from '../../../checkout-card/checkout-card-insured-subjects/checkout-card-insured-subjects.component';
import {CheckoutPeriod} from '../../../checkout.model';
import {AuthService, DataService, InsurancesService} from '@services';
import * as moment from 'moment';
import {InsuranceInfoAttributes, LineFirstItem, OrderAttributes, ViaggiQuotationRequest, ViaggiQuotationResponse} from '@model';
import {CheckoutStepService} from '../../../services/checkout-step.service';
import {CheckoutStepInsuranceInfoHelper} from '../checkout-step-insurance-info.helper';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';


@Component({
  selector: 'app-checkout-step-insurance-info-viaggi-gold',
  templateUrl: './checkout-step-insurance-info-viaggi-gold.component.html',
  styleUrls: ['./checkout-step-insurance-info-viaggi-gold.component.scss']
})
export class CheckoutStepInsuranceInfoViaggiGoldComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  product: CheckoutStepInsuranceInfoProduct;

  @ViewChild('periodCard', { static: true }) periodCard: CheckoutCardPeriodComponent;
  @ViewChild('insuredSubjectsCard', { static: true }) insuredSubjectsCard: CheckoutCardInsuredSubjectsComponent;


  constructor(private dataService: DataService,
              private authService: AuthService,
              private insuranceService: InsurancesService,
              private checkoutStepService: CheckoutStepService,
              ) {
    super();
  }

  ngOnInit() {
  }

  isFormValid(): boolean {
    return (
      this.periodCard.form.valid &&
      this.insuredSubjectsCard.form.valid
    );
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
    const destination = this.dataService.getResponseOrder().line_items[0].insurance_info.destination.id;
    const instant = this.dataService.getResponseOrder().line_items[0].instant;
    return Object.assign({}, this.product, period, {insuredIsContractor, insuredSubjects, destination, instant});
  }


  recalculatePrice(): Observable<ViaggiQuotationResponse> {
    const product = this.computeProduct();
    const quotationRequest = this.computeQuotationRequest(product);
    const total = this.dataService.getResponseOrder().item_total;
    const oaDifference = CheckoutStepInsuranceInfoHelper.diffOrderAttributes(this.dataService.getOrderAttributes(), quotationRequest);
    const agesChanged = CheckoutStepInsuranceInfoHelper.quantity(oaDifference);
    return this.insuranceService.submitViaggiQuotation(quotationRequest).pipe(tap((quotationResponse) => {
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
      addons: (this.dataService.getResponseOrder().line_items[0].addons || []).map(addon => addon.code),
      start_date: moment(product.startDate).format('YYYY-MM-DD'),
      duration: product.duration,
      destination_id: product.destination,
      quantity: product.quantity,
    }, orderAttributes);
  }

  onBeforeNextStep(): Observable<any> {
    return this.recalculatePrice();
  }

  fillLineItem(lineItem: LineFirstItem): void {
    const product = this.computeProduct();
    const insuranceInfoAttributes = lineItem.insurance_info_attributes || new InsuranceInfoAttributes();
    insuranceInfoAttributes.destination_id = product.destination;
    lineItem.insurance_info_attributes = insuranceInfoAttributes;
  }

}
