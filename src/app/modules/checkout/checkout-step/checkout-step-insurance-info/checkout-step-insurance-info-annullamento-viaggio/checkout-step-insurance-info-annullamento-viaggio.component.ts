import {Component, OnInit, ViewChild} from '@angular/core';
import {CheckoutStepInsuranceInfoDynamicComponent} from '../checkout-step-insurance-info-dynamic-component';
import {CheckoutCardDateTimeComponent} from '../../../checkout-card/checkout-card-date-time/checkout-card-date-time.component';
import {CheckoutCardInsuredSubjectsComponent} from '../../../checkout-card/checkout-card-insured-subjects/checkout-card-insured-subjects.component';
import {CheckoutInsuredSubject, CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';
import {CheckoutPeriod} from '../../../checkout.model';
import {Observable} from 'rxjs';
import {of} from 'rxjs/internal/observable/of';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {TimeHelper} from '../../../../../shared/helpers/time.helper';
import {InsuranceInfoAttributes, LineFirstItem} from '@model';
import {CheckoutStepInsuranceInfoAnnullamentoViaggioProduct} from './checkout-step-insurance-info-annullamento-viaggio.model';
import {
  CheckoutCardInsuredSubjectsInfoComponent
} from "../../../checkout-card/checkout-card-insured-subjects-info/checkout-card-insured-subjects-info.component";
import {CheckoutStepService} from "../../../services/checkout-step.service";
import { AuthService } from '@services';
import { CheckoutStepInsuranceInfoHelper } from '../checkout-step-insurance-info.helper';

@Component({
  selector: 'app-checkout-step-insurance-info-annullamento-viaggio',
  templateUrl: './checkout-step-insurance-info-annullamento-viaggio.component.html',
  styleUrls: ['./checkout-step-insurance-info-annullamento-viaggio.component.scss']
})
export class CheckoutStepInsuranceInfoAnnullamentoViaggioComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  form: FormGroup;

  @ViewChild('periodCard', { static: true }) periodCard: CheckoutCardDateTimeComponent;

  @ViewChild('insuredSubjectsCard', { static: true }) insuredSubjectsCard: CheckoutCardInsuredSubjectsInfoComponent;

  today;
  yesterday;
  constructor(private formBuilder: FormBuilder,
              private checkoutStepService: CheckoutStepService,
              private authService: AuthService 
  ) {
    super();
  }

  ngOnInit() {
    this.adjustSubjectIsContractor();
    const product: CheckoutStepInsuranceInfoAnnullamentoViaggioProduct =  Object.assign(this.product);
    this.today = TimeHelper.fromDateToNgbDate(moment().toDate());
    this.yesterday = TimeHelper.fromDateToNgbDate(moment().subtract(1, 'd').toDate());
    this.form = this.formBuilder.group({
      reservationDate: new FormControl(TimeHelper.fromDateToNgbDate(product.bookingDate), [Validators.required])
    });
    this.product.costItems[0].amount = product.order.line_items[0].total;
  }

  adjustSubjectIsContractor() {
    if (this.authService.loggedIn) {
      const address = Object.assign({}, this.authService.loggedUser.address);
      const user = CheckoutStepInsuranceInfoHelper.findUserInInsuredSubjectsByNameAndBirthDate(address, this.product.insuredSubjects);
      if (user) {
        user.isContractor = true;
      }
    }
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const userInfo = this.authService.loggedUser.address;
    const period: CheckoutPeriod = this.periodCard.computeModel();
    const insuredSubjects: CheckoutInsuredSubject[] = this.insuredSubjectsCard.computeModel();
    const insuredIsContractor: boolean = this.insuredSubjectsCard.contractorIsInsured();
    if (insuredIsContractor && this.authService.loggedIn) {
      const address = Object.assign({}, userInfo);
      const user = CheckoutStepInsuranceInfoHelper.findUserInInsuredSubjectsByNameAndBirthDate(address, this.product.insuredSubjects);
      const id = !!user ? user.id : null;
      insuredSubjects.push(CheckoutStepInsuranceInfoHelper.fromAddressToInsuredSubject(id, address));
    }
    const bookingDate = TimeHelper.fromNgbDateToDate(this.form.controls.reservationDate.value);
    return Object.assign({}, this.product, period, {insuredIsContractor, insuredSubjects, instant: period.instant, bookingDate});
  }

  isFormValid(): boolean {
    return (
      this.periodCard.form.valid &&
      this.insuredSubjectsCard.form.valid &&
        this.form.valid
    );
  }

  onBeforeNextStep(): Observable<any> {
    this.checkoutStepService.setReducerProperty({
      property: 'completed_steps.insurance_info.display_data[3].value',
      value: TimeHelper.fromNgbDateStrucutreToStringLocale(this.periodCard.form.value.startDate)
    });
      this.checkoutStepService.setReducerProperty({
        property: 'completed_steps.insurance_info.display_data[4].value',
        value: TimeHelper.fromNgbDateStrucutreToStringLocale(this.periodCard.form.value.endDate)
      });
    this.checkoutStepService.setReducerProperty({
      property: 'cost_item.policy_startDate',
      value: TimeHelper.fromNgbDateStrucutreToStringLocale(this.periodCard.form.value.startDate)
    });
    this.checkoutStepService.setReducerProperty({
      property: 'cost_item.policy_endDate',
      value: TimeHelper.fromNgbDateStrucutreToStringLocale(this.periodCard.form.value.endDate)
    });
    return of(null);
  }

  public fillLineItem(lineItem: LineFirstItem): void {
    const product = this.computeProduct();
    const insuranceInfoAttributes = lineItem.insurance_info_attributes || new InsuranceInfoAttributes();
    insuranceInfoAttributes['travel_date'] = moment(product.startDate).format('YYYY-MM-DD');
    insuranceInfoAttributes['travel_end_date'] = moment(product.endDate).format('YYYY-MM-DD');
    insuranceInfoAttributes['booking_date'] = moment(product['bookingDate']).format('YYYY-MM-DD');
    insuranceInfoAttributes['price'] = product.order.line_items[0].insurance_info.price;
    lineItem.insurance_info_attributes = insuranceInfoAttributes;
  }


}
