import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CheckoutLinearStepperBaseComponent } from '../checkout-linear-stepper-base/checkout-linear-stepper-base.component';

@Component({
  selector: 'app-checkout-collaboration-section',
  templateUrl: './checkout-collaboration-section.component.html',
  styleUrls: ['./checkout-collaboration-section.component.scss']
})
export class CheckoutCollaborationSectionComponent extends CheckoutLinearStepperBaseComponent implements OnInit {

  constructor(ref: ChangeDetectorRef) {
    super(ref);
  }

  ngOnInit() {
  }

}
