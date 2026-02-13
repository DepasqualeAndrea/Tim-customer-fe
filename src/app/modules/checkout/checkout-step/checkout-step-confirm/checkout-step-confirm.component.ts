import { Component, OnInit } from '@angular/core';
import { CheckoutStepComponent } from '../checkout-step.component';
import { CheckoutStepService } from '../../services/checkout-step.service';
import { LineFirstItem, RequestOrder } from '@model';
import { CheckoutStepPaymentProduct } from '../checkout-step-payment/checkout-step-payment.model';
import { DataService } from '@services';

@Component({
    selector: 'app-checkout-step-confirm',
    templateUrl: './checkout-step-confirm.component.html',
    styleUrls: ['./checkout-step-confirm.component.scss'],
    standalone: false
})
export class CheckoutStepConfirmComponent extends CheckoutStepComponent implements OnInit {

  constructor(checkoutStepService: CheckoutStepService
    , private dataService: DataService) {
    super(checkoutStepService, null);
  }

  ngOnInit() {
    this.handleNextStep();
  }

  orderIsCompleted(): boolean {
    const order = this.dataService.getResponseOrder();
    return order.completed_at && order.state === 'confirm';
  }

  createRequestOrder(): RequestOrder {
    if (this.orderIsCompleted) {
      return null;
    }
    const product: CheckoutStepPaymentProduct = <CheckoutStepPaymentProduct>this.currentStep.previous.product;

    const ro = { state: null, order: { line_items_attributes: { '0': {} } } };
    const lineItem: LineFirstItem = ro.order.line_items_attributes['0'];
    lineItem.id = product.lineItemId;
    lineItem.papery_docs = product.documentsAcceptance.paperCopyRequest;
    console.log('CheckoutStepConfirmComponent', product)
    return ro;
  }

  protected isConfirm() {
    return true;
  }

}
