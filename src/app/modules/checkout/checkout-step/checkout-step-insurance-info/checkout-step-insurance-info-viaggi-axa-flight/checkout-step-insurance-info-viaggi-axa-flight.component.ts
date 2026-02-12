import {Component, OnInit, ViewChild} from '@angular/core';
import {CheckoutStepInsuranceInfoDynamicComponent} from '../checkout-step-insurance-info-dynamic-component';
import {CheckoutInsuredSubject, CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';
import {CheckoutCardPeriodComponent} from '../../../checkout-card/checkout-card-period/checkout-card-period.component';
import {AuthService, DataService} from '@services';
import {CheckoutPeriod, CheckoutProductCostItemType} from '../../../checkout.model';
import {Observable} from 'rxjs';
import {of} from 'rxjs/internal/observable/of';
import {CheckoutStepService} from '../../../services/checkout-step.service';
import * as moment from 'moment';
import {CheckoutCardInsuredSubjectsInfoComponent} from '../../../checkout-card/checkout-card-insured-subjects-info/checkout-card-insured-subjects-info.component';
import { CheckoutStepInsuranceInfoHelper } from '../checkout-step-insurance-info.helper';

@Component({
  selector: 'app-checkout-step-insurance-info-viaggi-axa-flight',
  templateUrl: './checkout-step-insurance-info-viaggi-axa-flight.component.html',
  styleUrls: ['./checkout-step-insurance-info-viaggi-axa-flight.component.scss']
})
export class CheckoutStepInsuranceInfoViaggiAxaFlightComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  product: CheckoutStepInsuranceInfoProduct;
  maxBirthDate: string;
  minBirthDate: string;

  @ViewChild('periodCard', { static: true }) periodCard: CheckoutCardPeriodComponent;
  @ViewChild('insuredSubjectsCard', { static: true }) insuredSubjectsCard: CheckoutCardInsuredSubjectsInfoComponent;


  constructor(private dataService: DataService,
              private checkoutStepService: CheckoutStepService,
              private authService: AuthService
              ) {
    super();
  }

  ngOnInit() {
    this.adjustSubjectIsContractor();
    this.checkoutStepService.potentialPriceChange({
      current:this.checkoutStepService.recalculateCostItems(this.product.costItems, false, true),
      previous:0,
      costItems: this.product.costItems,
      reason: ''
    })
    this.maxBirthDate = moment(this.product.endDate).subtract(this.product.originalProduct.holder_maximum_age, 'years').subtract(1, 'day').format('DD/MM/YYYY');
    this.minBirthDate = moment().subtract(this.product.originalProduct.holder_minimum_age, 'years').format('DD/MM/YYYY');
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
  
  isFormValid(): boolean {
    return (
      this.periodCard.form.valid &&
      this.insuredSubjectsCard.form.valid
    );
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
    const destination = this.dataService.getResponseOrder().line_items[0].insurance_info.destination.id;
    const instant = this.dataService.getResponseOrder().line_items[0].instant;
    return Object.assign(this.product, period, {insuredIsContractor, insuredSubjects, destination, instant});
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

}
