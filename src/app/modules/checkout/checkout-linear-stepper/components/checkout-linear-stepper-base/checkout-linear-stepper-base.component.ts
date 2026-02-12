import { Component, OnInit, OnChanges, Input, EventEmitter, ChangeDetectorRef, Output } from '@angular/core';
import { CheckoutHeaderComponent } from '../checkout-header/checkout-header.component';

@Component({
  selector: 'app-checkout-linear-stepper-base',
  templateUrl: './checkout-linear-stepper-base.component.html',
  styleUrls: ['./checkout-linear-stepper-base.component.scss']
})
export class CheckoutLinearStepperBaseComponent implements OnChanges {
  private _data: any = null;
  @Input()
  set data(data: any) {
    const detectChanges = !!data && !(data === this.data);
    this._data = data;
    if (detectChanges) {
      this.ngOnChanges();
      this.ref.detectChanges();
    }

    if (data?.product_name) CheckoutHeaderComponent.PRODUCT_NAME = data.product_name;
  }
  get data(): any { return this._data; }
  @Output() actionEvent = new EventEmitter<any>();

  constructor(private ref: ChangeDetectorRef) {

  }
  sendActionEvent(action: any) {
    this.actionEvent.next(action);
  }

  ngOnChanges() {

  }
}
