import { Component, OnInit } from '@angular/core';
import { LineFirstItem } from '@model';
import { of } from 'rxjs';
import { CheckoutStepInsuranceInfoDynamicComponent } from '../checkout-step-insurance-info-dynamic-component';
import { CheckoutStepInsuranceInfoProduct } from '../checkout-step-insurance-info.model';

@Component({
  selector: 'app-checkout-step-insurance-info-screen-protection',
  templateUrl: './checkout-step-insurance-info-screen-protection.component.html',
  styleUrls: ['./checkout-step-insurance-info-screen-protection.component.scss']
})
export class CheckoutStepInsuranceInfoScreenProtectionComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {
  

  constructor() {
    super(); 
  }

  ngOnInit() {
  }

  onBeforeNextStep(){
    return of(null);
  }
  isFormValid(): boolean {
    return false;
  }
  computeProduct(): CheckoutStepInsuranceInfoProduct {
    return this.product;
  }

  public fillLineItem(lineItem: LineFirstItem): void {
    delete lineItem.expiration_date;
    delete lineItem.start_date;
  }
}
