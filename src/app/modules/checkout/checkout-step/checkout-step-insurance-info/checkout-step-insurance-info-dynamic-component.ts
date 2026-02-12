import {CheckoutStepInsuranceInfoProduct} from './checkout-step-insurance-info.model';
import {Observable} from 'rxjs';
import {LineFirstItem} from '@model';

export abstract class CheckoutStepInsuranceInfoDynamicComponent {
  product: CheckoutStepInsuranceInfoProduct;

  constructor() {

  }

  abstract isFormValid(): boolean;

  abstract computeProduct(): CheckoutStepInsuranceInfoProduct;

  abstract onBeforeNextStep(): Observable<any>;

  public fillLineItem(lineItem: LineFirstItem): void {

  }
}
