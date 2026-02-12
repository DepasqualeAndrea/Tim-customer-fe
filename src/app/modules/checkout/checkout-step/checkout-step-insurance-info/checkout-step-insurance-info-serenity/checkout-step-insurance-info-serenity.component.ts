import { Component, OnInit, ViewChild } from '@angular/core';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { CheckoutStepInsuranceInfoProduct, CheckoutInsuredSubject } from '../checkout-step-insurance-info.model';
import { CheckoutCardInsuredSubjectsComponent } from 'app/modules/checkout/checkout-card/checkout-card-insured-subjects/checkout-card-insured-subjects.component';
import * as moment from 'moment';
import { Observable, of } from 'rxjs';
import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';

@Component({
  selector: 'app-checkout-step-insurance-info-serenity',
  templateUrl: './checkout-step-insurance-info-serenity.component.html',
  styleUrls: ['./checkout-step-insurance-info-serenity.component.scss']
})
export class CheckoutStepInsuranceInfoSerenityComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  product: CheckoutStepInsuranceInfoProduct;
  minAgeBirthDate = moment().subtract(65, 'year').format('DD/MM/YYYY');
  minBirth = moment().subtract(100, 'year').format('DD/MM/YYYY');

  @ViewChild('insuredSubjectsCard', { static: true }) insuredSubjectsCard: CheckoutCardInsuredSubjectsComponent;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const insuredSubjects: CheckoutInsuredSubject[] = this.insuredSubjectsCard.computeModel();
    const insuredIsContractor: boolean = this.insuredSubjectsCard.contractorIsInsured();
    return Object.assign({}, this.product, {insuredIsContractor, insuredSubjects});
  }

  isFormValid(): boolean {
    return this.insuredSubjectsCard.form.valid;
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }
}
