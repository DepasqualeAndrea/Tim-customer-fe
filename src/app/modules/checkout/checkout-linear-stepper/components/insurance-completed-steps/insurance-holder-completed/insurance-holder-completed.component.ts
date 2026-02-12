import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CheckoutLinearStepperBaseComponent } from '../../checkout-linear-stepper-base/checkout-linear-stepper-base.component';
import { AuthService, DataService } from '@services';

@Component({
  selector: 'app-insurance-holder-completed',
  templateUrl: './insurance-holder-completed.component.html',
  styleUrls: ['../insurance-completed-steps.component.scss']
})
export class InsuranceHolderCompletedComponent
  extends CheckoutLinearStepperBaseComponent implements OnInit {

  @Output() handleStepChanged: EventEmitter<boolean> = new EventEmitter();

  constructor(ref: ChangeDetectorRef,public dataService: DataService,
  public auth: AuthService,) {
    super(ref)
  }

  public emitHandleStepChanged(): void {
    this.handleStepChanged.emit(true);
  }

  ngOnInit() {
  }

}
