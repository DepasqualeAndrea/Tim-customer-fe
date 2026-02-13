import {Component, OnInit, ViewChild} from '@angular/core';
import {CheckoutStepInsuranceInfoDynamicComponent} from '../checkout-step-insurance-info-dynamic-component';
import * as moment from 'moment';
import {CheckoutInsuredSubject, CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';
import {CheckoutPeriod} from '../../../checkout.model';
import {Observable} from 'rxjs';
import {CheckoutCardDateTimeComponent} from '../../../checkout-card/checkout-card-date-time/checkout-card-date-time.component';
import {CheckoutCardInsuredSubjectsComponent} from '../../../checkout-card/checkout-card-insured-subjects/checkout-card-insured-subjects.component';
import {of} from 'rxjs/internal/observable/of';
import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';

@Component({
    selector: 'app-checkout-step-insurance-info-viaggi-europa',
    templateUrl: './checkout-step-insurance-info-viaggi-europa.component.html',
    styleUrls: ['./checkout-step-insurance-info-viaggi-europa.component.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoViaggiEuropaComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  periodOptions: { minDate: Date };

  @ViewChild('periodCard', { static: true }) periodCard: CheckoutCardDateTimeComponent;

  @ViewChild('insuredSubjectsCard', { static: true }) insuredSubjectsCard: CheckoutCardInsuredSubjectsComponent;

  constructor() {
    super();
  }


  ngOnInit() {
    this.product.duration = this.product.duration || moment(this.product.endDate).diff(this.product.startDate, 'days');
    this.product.durationUnit = this.product.durationUnit || 'days';
    this.periodOptions = {minDate: moment().add(1, 'days').toDate()};
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const period: CheckoutPeriod = this.periodCard.computeModel();
    const insuredSubjects: CheckoutInsuredSubject[] = this.insuredSubjectsCard.computeModel();
    const insuredIsContractor: boolean = this.insuredSubjectsCard.contractorIsInsured();
    return Object.assign({}, this.product, period, {insuredIsContractor, insuredSubjects, instant: period.instant});
  }

  isFormValid(): boolean {
    return (
      this.periodCard.form.valid &&
      this.insuredSubjectsCard.form.valid
    );
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

}
