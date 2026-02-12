import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CheckoutLinearStepperBaseComponent } from '../checkout-linear-stepper-base/checkout-linear-stepper-base.component';

@Component({
  selector: 'app-insurance-uncompleted-steps',
  templateUrl: './insurance-uncompleted-steps.component.html',
  styleUrls: ['./insurance-uncompleted-steps.component.scss']
})
export class InsuranceUncompletedStepsComponent extends CheckoutLinearStepperBaseComponent {

  constructor(ref: ChangeDetectorRef) {
    super(ref);
  }

}
