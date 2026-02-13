import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { DataService } from '@services';
import { CheckoutLinearStepperBaseComponent } from '../../checkout-linear-stepper-base/checkout-linear-stepper-base.component';

@Component({
    selector: 'app-insurance-survey-completed',
    templateUrl: './insurance-survey-completed.component.html',
    styleUrls: ['../insurance-completed-steps.component.scss'],
    standalone: false
})
export class InsuranceSurveyCompletedComponent extends CheckoutLinearStepperBaseComponent implements OnInit {

  @Output() handleStepChanged: EventEmitter<boolean> = new EventEmitter();

  constructor(ref: ChangeDetectorRef,
              private dataService: DataService) {
    super(ref)
  }

  public emitHandleStepChanged(): void {
    this.handleStepChanged.emit(true);
  }

  ngOnInit() {
  }


}
