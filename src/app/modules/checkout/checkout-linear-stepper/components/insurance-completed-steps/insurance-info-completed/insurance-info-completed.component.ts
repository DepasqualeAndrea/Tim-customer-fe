import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CheckoutLinearStepperBaseComponent } from '../../checkout-linear-stepper-base/checkout-linear-stepper-base.component';

@Component({
    selector: 'app-insurance-info-completed',
    templateUrl: './insurance-info-completed.component.html',
    styleUrls: ['../insurance-completed-steps.component.scss'],
    standalone: false
})
export class InsuranceInfoCompletedComponent
  extends CheckoutLinearStepperBaseComponent implements OnInit {

  @Output() handleStepChanged: EventEmitter<boolean> = new EventEmitter();

  constructor(ref: ChangeDetectorRef) {
    super(ref);
  }

  ngOnInit() {
  }

  public emitHandleStepChanged(): void {
    this.handleStepChanged.emit(true);
  }

}
