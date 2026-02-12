import { ProductAddressStepController } from '../product-address-step-controller.interface';
import { ResponseOrder, RequestOrder } from '@model';
import { Injectable } from '@angular/core';
import { CheckoutModule } from '../../checkout.module';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductAddressStepBaseController implements ProductAddressStepController {
  private addressFieldsToDisable = new ReplaySubject<string[]>(1);
  public addressFieldsToDisable$ = this.addressFieldsToDisable.asObservable();
  responseOrderChanged(): void {
  }
  getRequest(requestOrder: RequestOrder): RequestOrder {
    return requestOrder;
  }
}
