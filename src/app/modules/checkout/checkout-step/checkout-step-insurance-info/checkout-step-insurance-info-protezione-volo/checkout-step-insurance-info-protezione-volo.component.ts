import {Component, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {CheckoutInsuredSubject, CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';
import {CheckoutPeriod} from '../../../checkout.model';
import {Observable} from 'rxjs';
import {of} from 'rxjs/internal/observable/of';
import {CheckoutStepInsuranceInfoDynamicComponent} from '../checkout-step-insurance-info-dynamic-component';
import {CheckoutCardDateTimeComponent} from '../../../checkout-card/checkout-card-date-time/checkout-card-date-time.component';
import {CheckoutCardInsuredSubjectsComponent} from '../../../checkout-card/checkout-card-insured-subjects/checkout-card-insured-subjects.component';

@Component({
  selector: 'app-checkout-step-insurance-info-protezione-volo',
  templateUrl: './checkout-step-insurance-info-protezione-volo.component.html',
  styleUrls: ['./checkout-step-insurance-info-protezione-volo.component.scss']
})
export class CheckoutStepInsuranceInfoProtezioneVoloComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  @ViewChild('periodCard', { static: true }) periodCard: CheckoutCardDateTimeComponent;

  @ViewChild('insuredSubjectsCard', { static: true }) insuredSubjectsCard: CheckoutCardInsuredSubjectsComponent;

  minAgeBirthDate = moment().subtract(4, 'year').format('DD/MM/YYYY');

  ngOnInit() {
    this.product.duration = this.product.duration || moment(this.product.endDate).diff(this.product.startDate, 'days');
    this.product.durationUnit = this.product.durationUnit || 'days';
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
