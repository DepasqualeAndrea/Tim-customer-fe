import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataService } from '@services';
import { CheckoutLinearStepperBaseComponent } from '../checkout-linear-stepper-base/checkout-linear-stepper-base.component';

@Component({
  selector: 'app-checkout-header',
  templateUrl: './checkout-header.component.html',
  styleUrls: ['./checkout-header.component.scss']
})
export class CheckoutHeaderComponent extends CheckoutLinearStepperBaseComponent implements OnInit {
  public static PRODUCT_NAME: string;

  constructor(ref: ChangeDetectorRef,
    public dataService: DataService
  ) {
    super(ref);
  }

  ngOnInit() {
  }

}
