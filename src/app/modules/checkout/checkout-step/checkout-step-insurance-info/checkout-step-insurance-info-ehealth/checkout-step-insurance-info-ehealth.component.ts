import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { CheckoutStepInsuranceInfoProduct } from '../checkout-step-insurance-info.model';

@Component({
    selector: 'app-checkout-step-insurance-info-ehealth',
    templateUrl: './checkout-step-insurance-info-ehealth.component.html',
    styleUrls: ['./checkout-step-insurance-info-ehealth.component.scss'],
    standalone: false
})
export class CheckoutStepInsuranceInfoEhealthComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  isFormValid(): boolean {
    return null;
  }
  computeProduct(): CheckoutStepInsuranceInfoProduct {
    return Object.assign({}, this.product, {insuredIsContractor: true});
}
  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

  constructor() {
    super();
   }

  ngOnInit() {
  }

}
