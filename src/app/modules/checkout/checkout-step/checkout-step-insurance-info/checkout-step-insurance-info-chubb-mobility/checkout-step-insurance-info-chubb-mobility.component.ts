import {Component, OnInit, ViewChild} from '@angular/core';
import {CheckoutStepInsuranceInfoDynamicComponent} from '../checkout-step-insurance-info-dynamic-component';
import {CheckoutCardPeriodComponent} from '../../../checkout-card/checkout-card-period/checkout-card-period.component';
import {CheckoutCardInsuredSubjectsComponent} from '../../../checkout-card/checkout-card-insured-subjects/checkout-card-insured-subjects.component';
import {CheckoutCardTransportComponent} from '../../../checkout-card/checkout-card-transport/checkout-card-transport.component';
import {CheckoutInsuredSubject, CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';
import {NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {TimeHelper} from '../../../../../shared/helpers/time.helper';
import {CheckoutPeriod} from '../../../checkout.model';
import {Observable} from 'rxjs';
import {of} from 'rxjs/internal/observable/of';
import {InsuranceInfoAttributes, LineFirstItem} from '@model';
import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';

@Component({
    selector: 'app-checkout-step-insurance-info-chubb-mobility',
    templateUrl: './checkout-step-insurance-info-chubb-mobility.component.html',
    styleUrls: ['./checkout-step-insurance-info-chubb-mobility.component.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoChubbMobilityComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  product: CheckoutStepInsuranceInfoProduct;

  @ViewChild('periodCard', { static: true }) periodCard: CheckoutCardPeriodComponent;
  @ViewChild('transportCard', { static: true }) transportCard: CheckoutCardTransportComponent;
  @ViewChild('insuredSubjectsCard', { static: true }) insuredSubjectsCard: CheckoutCardInsuredSubjectsComponent;

  constructor(private calendar: NgbCalendar, ) {
    super();
  }

  ngOnInit() {
    if (!this.product.startDate) {
      this.product.startDate = TimeHelper.fromNgbDateToDate(this.calendar.getNext(this.calendar.getToday(), 'd', 1));
      this.product.endDate = TimeHelper.fromNgbDateToDate(this.calendar.getNext(this.calendar.getToday(), 'd', 1 + this.product.duration));
    }
  }

  isFormValid(): boolean {
    return (
      this.periodCard.form.valid &&
      this.transportCard.form.valid &&
      this.insuredSubjectsCard.form.valid
    );
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const period: CheckoutPeriod = this.periodCard.computeModel();
    const insuredSubjects: CheckoutInsuredSubject[] = this.insuredSubjectsCard.computeModel();
    const insuredIsContractor: boolean = this.insuredSubjectsCard.contractorIsInsured();
    const extraSelected: string = this.transportCard.computeModel();
    return Object.assign({}, this.product, period,
      {insuredIsContractor, insuredSubjects, extraSelected});
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
