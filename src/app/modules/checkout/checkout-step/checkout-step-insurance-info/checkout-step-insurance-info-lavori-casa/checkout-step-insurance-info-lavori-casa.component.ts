import {Component, OnInit, ViewChild} from '@angular/core';
import {CheckoutStepInsuranceInfoDynamicComponent} from '../checkout-step-insurance-info-dynamic-component';
import {CheckoutInsuredSubject, CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';
import {Observable} from 'rxjs';
import {of} from 'rxjs/internal/observable/of';
import {CheckoutCardPeriodComponent} from '../../../checkout-card/checkout-card-period/checkout-card-period.component';
import {CheckoutCardInsuredSubjectsComponent} from '../../../checkout-card/checkout-card-insured-subjects/checkout-card-insured-subjects.component';
import {CheckoutCardWorkPerformanceComponent} from '../../../checkout-card/checkout-card-work-performance/checkout-card-work-performance.component';
import {CheckoutPeriod} from '../../../checkout.model';
import {InsuranceInfoAttributes, LineFirstItem} from '@model';
import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';

@Component({
  selector: 'app-checkout-step-insurance-info-lavori-casa',
  templateUrl: './checkout-step-insurance-info-lavori-casa.component.html',
  styleUrls: ['./checkout-step-insurance-info-lavori-casa.component.scss']
})
export class CheckoutStepInsuranceInfoLavoriCasaComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  @ViewChild('periodCard', { static: true }) periodCard: CheckoutCardPeriodComponent;
  @ViewChild('workPerformanceCard', { static: true }) workPerformanceCard: CheckoutCardWorkPerformanceComponent;
  @ViewChild('insuredSubjectsCard', { static: true }) insuredSubjectsCard: CheckoutCardInsuredSubjectsComponent;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const period: CheckoutPeriod = this.periodCard.computeModel();
    const insuredSubjects: CheckoutInsuredSubject[] = this.insuredSubjectsCard.computeModel();
    const insuredIsContractor: boolean = this.insuredSubjectsCard.contractorIsInsured();
    const extraSelected: string = this.workPerformanceCard.computeModel();
    return Object.assign({}, this.product, period,
      {insuredIsContractor, insuredSubjects, extraSelected});
  }

  isFormValid(): boolean {
    return (
      this.periodCard.form.valid &&
      this.workPerformanceCard.form.valid &&
      this.insuredSubjectsCard.form.valid
    );
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

  fillLineItem(lineItem: LineFirstItem): void {
    const product = this.computeProduct();
    const insuranceInfoAttributes = lineItem.insurance_info_attributes || new InsuranceInfoAttributes();
    insuranceInfoAttributes.extra = product.extraSelected;
    lineItem.insurance_info_attributes = insuranceInfoAttributes;
  }
}
