import {CheckoutCardInsuredSubjectsComponent} from 'app/modules/checkout/checkout-card/checkout-card-insured-subjects/checkout-card-insured-subjects.component';
import {CheckoutInsuredSubject, CheckoutStepInsuranceInfoProduct} from './../checkout-step-insurance-info.model';
import {Component, OnInit, ViewChild} from '@angular/core';
import {CheckoutStepInsuranceInfoDynamicComponent} from '../checkout-step-insurance-info-dynamic-component';
import {Observable, of} from 'rxjs';
import {InsuranceInfoAttributes, LineFirstItem} from '@model';
import * as moment from 'moment';

@Component({
  selector: 'app-checkout-step-insurance-info-sport-pack',
  templateUrl: './checkout-step-insurance-info-sport-pack.component.html'
})
export class CheckoutStepInsuranceInfoSportPackComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  product: CheckoutStepInsuranceInfoProduct;

  minBirth: string;
  minAgeBirthDate = moment().subtract(1, 'day').format('DD/MM/YYYY');

  @ViewChild('insuredSubjectsCard', { static: true }) insuredSubjectsCard: CheckoutCardInsuredSubjectsComponent;

  constructor() {
    super();
  }

  ngOnInit() {
    this.minBirth = moment().subtract(this.product.originalProduct.holder_maximum_age, 'years').format('DD/MM/YYYY');
  }

  isFormValid(): boolean {
    return this.insuredSubjectsCard.form.valid;
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const insuredSubjects: CheckoutInsuredSubject[] = this.insuredSubjectsCard.computeModel();
    const insuredIsContractor: boolean = this.insuredSubjectsCard.contractorIsInsured();
    return Object.assign({}, this.product, {insuredIsContractor, insuredSubjects});
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

  fillLineItem(lineItem: LineFirstItem): void {
    lineItem.insurance_info_attributes = new InsuranceInfoAttributes();
  }
}
