import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutStepService } from 'app/modules/checkout/services/checkout-step.service';
import { CheckoutLinearStepperBaseComponent } from '../checkout-linear-stepper-base/checkout-linear-stepper-base.component';

type CheckoutEditableStep = 'insurance-info' | 'address' | 'survey';

@Component({
  selector: 'app-insurance-completed-steps',
  templateUrl: './insurance-completed-steps.component.html',
  styleUrls: ['./insurance-completed-steps.component.scss']
})
export class InsuranceCompletedStepsComponent
  extends CheckoutLinearStepperBaseComponent implements OnInit {

  constructor(ref: ChangeDetectorRef,
    private checkoutStepService: CheckoutStepService,
    private router: Router) {
    super(ref);
  }

  ngOnInit() {
  }

  public handleStepChanged(step: CheckoutEditableStep): void {
    this.checkoutStepService.setCurrentStep(step);
    this.removeCards(step);
    this.router.navigate(['checkout/' + step]);
  }

  private removeCards(step: CheckoutEditableStep): void {
    switch (step) {
      case 'survey':
        this.setProperties(['completed_steps.insurance_survey.visible']);
        break;
      case 'address': 
        this.setProperties(['completed_steps.insurance_survey.visible',
          'completed_steps.insurance_holder.visible']);
        break;
      case 'insurance-info':
        this.setProperties(['completed_steps.insurance_survey.visible',
          'completed_steps.insurance_holder.visible',
          'completed_steps.insurance_info.visible']);
        break;
      default:
        break;
    }
  }

  private setProperties(props: string[]): void {
    props.forEach(prop => {
      this.checkoutStepService.setReducerProperty({
        property: prop,
        value: false
      });
    })
  }

  goBack() {
  }
}
