import {Component, OnInit, ViewChild} from '@angular/core';
import {CheckoutStepInsuranceInfoDynamicComponent} from '../checkout-step-insurance-info-dynamic-component';
import {CheckoutInsuredSubject, CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';
import {of} from 'rxjs/internal/observable/of';
import {Observable} from 'rxjs';
import {CheckoutCardInsuredSubjectsComponent} from 'app/modules/checkout/checkout-card/checkout-card-insured-subjects/checkout-card-insured-subjects.component';
import * as moment from 'moment';
import {CheckoutProductCostItemType} from '../../../checkout.model';

@Component({
    selector: 'app-checkout-step-insurance-info-travel-pack',
    templateUrl: './checkout-step-insurance-info-travel-pack.component.html',
    standalone: false
})
export class CheckoutStepInsuranceInfoTravelPackComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  product: CheckoutStepInsuranceInfoProduct;

  minAgeBirthDate = moment().subtract(10, 'year').format('DD/MM/YYYY');

  periodOptions: { maxDate: Date };

  @ViewChild('insuredSubjectsCard', { static: true }) insuredSubjectsCard: CheckoutCardInsuredSubjectsComponent;

  constructor() {
    super();
  }

  ngOnInit() {
    this.product.costItems.filter(item => item.type === CheckoutProductCostItemType.regular && item.multiplicator > 1).forEach(item => {
      item.amount /= item.multiplicator;
    });
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const insuredSubjects: CheckoutInsuredSubject[] = this.insuredSubjectsCard.computeModel();
    const insuredIsContractor: boolean = this.insuredSubjectsCard.contractorIsInsured();
    return Object.assign(this.product, {insuredIsContractor, insuredSubjects});
  }

  isFormValid(): boolean {
    return this.insuredSubjectsCard.form.valid;
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

}
