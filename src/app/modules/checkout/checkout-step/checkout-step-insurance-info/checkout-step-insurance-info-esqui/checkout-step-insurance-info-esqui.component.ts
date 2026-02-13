import {Component, OnInit, ViewChild} from '@angular/core';
import {CheckoutStepInsuranceInfoProduct, CheckoutInsuredSubject} from '../checkout-step-insurance-info.model';
import {CheckoutCardPeriodComponent} from 'app/modules/checkout/checkout-card/checkout-card-period/checkout-card-period.component';
import {CheckoutCardInsuredSubjectsComponent} from 'app/modules/checkout/checkout-card/checkout-card-insured-subjects/checkout-card-insured-subjects.component';
import {NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {TimeHelper} from 'app/shared/helpers/time.helper';
import {CheckoutPeriod} from 'app/modules/checkout/checkout.model';
import {Observable, of} from 'rxjs';
import {CheckoutStepInsuranceInfoDynamicComponent} from '../checkout-step-insurance-info-dynamic-component';
import {UserService} from '@services';
import {Router} from '@angular/router';
import * as moment from 'moment';

@Component({
    selector: 'app-checkout-step-insurance-info-esqui',
    templateUrl: './checkout-step-insurance-info-esqui.component.html',
    styleUrls: ['./checkout-step-insurance-info-esqui.component.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoEsquiComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  product: CheckoutStepInsuranceInfoProduct;
  maxAgeBirthDate = moment().subtract(150, 'year').add(1, 'day').format('DD/MM/YYYY');
  @ViewChild('periodCard', { static: true }) periodCard: CheckoutCardPeriodComponent;
  @ViewChild('insuredSubjectsCard', { static: true }) insuredSubjectsCard: CheckoutCardInsuredSubjectsComponent;

  constructor(
    private calendar: NgbCalendar,
    protected userService: UserService,
    protected router: Router
  ) {
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
      this.insuredSubjectsCard.form.valid
    );
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const period: CheckoutPeriod = this.periodCard.computeModel();
    const insuredSubjects: CheckoutInsuredSubject[] = this.insuredSubjectsCard.computeModel();
    const insuredIsContractor: boolean = this.insuredSubjectsCard.contractorIsInsured();
    return Object.assign({}, this.product, period, {insuredIsContractor, insuredSubjects});
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

}
