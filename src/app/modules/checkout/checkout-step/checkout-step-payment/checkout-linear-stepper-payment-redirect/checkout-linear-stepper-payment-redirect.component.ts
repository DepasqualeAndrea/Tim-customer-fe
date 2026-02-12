import {Component, OnInit} from '@angular/core';
import {ComponentFeaturesService} from '../../../../../core/services/componentFeatures.service';
import {CheckoutStep} from '../../checkout-step.model';
import {CheckoutStepService} from '../../../services/checkout-step.service';

@Component({
  selector: 'app-checkout-linear-stepper-payment-redirect',
  templateUrl: './checkout-linear-stepper-payment-redirect.component.html',
  styleUrls: ['./checkout-linear-stepper-payment-redirect.component.scss']
})
export class CheckoutLinearStepperPaymentRedirectComponent implements OnInit {

  paymentName: string;

  constructor(private componentFeaturesService: ComponentFeaturesService,
              private checkoutStepService: CheckoutStepService) {
  }

  get currentStep(): CheckoutStep {
    return this.checkoutStepService.step;
  }

  ngOnInit() {
    this.getPaymentName();
  }

  private getPaymentName() {
    this.componentFeaturesService.useComponent('checkout');
    this.componentFeaturesService.useRule('payment-redirect');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      if (!!constraints) {
         constraints.find((product) => {
          if (this.currentStep.product.code === product.productName) {
            this.paymentName = product.paymentRedirectName;
          }
        });
      }
    }
  }
}
