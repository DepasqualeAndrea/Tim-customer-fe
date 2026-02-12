import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { CheckoutStepInsuranceInfoProduct } from '../checkout-step-insurance-info.model';

@Component({
  selector: 'app-checkout-step-insurance-info-covid',
  templateUrl: './checkout-step-insurance-info-covid.component.html',
  styleUrls: ['./checkout-step-insurance-info-covid.component.scss']
})
export class CheckoutStepInsuranceInfoCovidComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {
  
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
