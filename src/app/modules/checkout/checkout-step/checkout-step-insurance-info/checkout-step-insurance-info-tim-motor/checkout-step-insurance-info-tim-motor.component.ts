import { Component, OnInit } from '@angular/core';
import { LineFirstItem } from '@model';
import { Observable, of } from 'rxjs';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { CheckoutStepInsuranceInfoProduct } from '../checkout-step-insurance-info.model';

@Component({
  selector: 'app-checkout-step-insurance-info-tim-motor',
  templateUrl: './checkout-step-insurance-info-tim-motor.component.html',
  styleUrls: ['./checkout-step-insurance-info-tim-motor.component.scss']
})
export class CheckoutStepInsuranceInfoTimMotorComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  constructor() { super() }

  ngOnInit() {
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    return this.product
  }

  fillLineItem(lineItem: LineFirstItem): void {
    delete lineItem.expiration_date;
    delete lineItem.start_date;
    delete lineItem.insured_is_contractor;
  }

  isFormValid(): boolean {
    return
  }

}
