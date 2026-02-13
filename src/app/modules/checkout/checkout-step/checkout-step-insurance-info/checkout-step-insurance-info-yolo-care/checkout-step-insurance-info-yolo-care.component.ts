import { Observable, of } from 'rxjs';
import { CheckoutInsuredSubject } from 'app/modules/checkout/checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.model';
import { CheckoutCardInsuredSubjectsComponent } from 'app/modules/checkout/checkout-card/checkout-card-insured-subjects/checkout-card-insured-subjects.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { CheckoutStepInsuranceInfoProduct } from '../checkout-step-insurance-info.model';
import * as moment from 'moment';
import { ConsentFormComponent } from 'app/shared/consent-form/consent-form.component';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { take } from 'rxjs/operators';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Component({
    selector: 'app-checkout-step-insurance-info-yolo-care',
    templateUrl: './checkout-step-insurance-info-yolo-care.component.html',
    styleUrls: ['./checkout-step-insurance-info-yolo-care.component.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoYoloCareComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  product: CheckoutStepInsuranceInfoProduct;
  maxBirthDate: string;
  minBirthDate: string;

  showConsent = false;
  @ViewChild('consent') consent: ConsentFormComponent;
  @ViewChild('insuredSubjectsCard', { static: true }) insuredSubjectsCard: CheckoutCardInsuredSubjectsComponent;

  constructor(
    private componentFeaturesService: ComponentFeaturesService,
    protected nypInsuranceService: NypInsurancesService
  ) {
    super();
  }

  ngOnInit() {
    this.maxBirthDate = moment().subtract(this.product.originalProduct.holder_maximum_age, 'years').format('DD/MM/YYYY');
    this.minBirthDate = moment().subtract(this.product.originalProduct.holder_minimum_age, 'years').format('DD/MM/YYYY');
    this.setShowConsent();
  }

  setShowConsent() {
    this.componentFeaturesService.useComponent('checkout-step-insurance-info');
    this.componentFeaturesService.useRule('show-consent');
    if (this.componentFeaturesService.isRuleEnabled()) {
      this.nypInsuranceService.getInsurances().pipe(take(1)).subscribe(res => {
        this.showConsent = res.insurances.length === 0;
      });
    } else {
      this.showConsent = false;
    }
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    const insuredSubjects: CheckoutInsuredSubject[] = this.insuredSubjectsCard.computeModel();
    const insuredIsContractor: boolean = this.insuredSubjectsCard.contractorIsInsured();
    return Object.assign({}, this.product, { insuredIsContractor, insuredSubjects });
  }

  isFormValid(): boolean {
    if (this.showConsent) {
      return (this.consent.consentForm.valid &&
        this.insuredSubjectsCard.form.valid);
    } else {
      return this.insuredSubjectsCard.form.valid;
    }
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

}
