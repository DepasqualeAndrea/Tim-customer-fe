import {Component, OnInit, AfterViewInit} from '@angular/core';
import {CheckoutStepService} from '../../services/checkout-step.service';
import {CheckoutStepComponent} from '../checkout-step.component';
import {RequestOrder} from '@model';
import {ComponentFeaturesService} from 'app/core/services/componentFeatures.service';
import {DataService} from '@services';


@Component({
  selector: 'app-checkout-step-complete',
  templateUrl: './checkout-step-complete.component.html',
  styleUrls: ['./checkout-step-complete.component.scss']
})
export class CheckoutStepCompleteComponent extends CheckoutStepComponent implements OnInit {

  linearStepper = false;

  constructor(
    checkoutStepService: CheckoutStepService,
    public componentFeaturesService: ComponentFeaturesService,
    private dataService: DataService
  ) {
    super(checkoutStepService, componentFeaturesService);
  }

  ngOnInit() {
    this.componentFeaturesService.useComponent('checkout');
    this.componentFeaturesService.useRule('linear-stepper');
    if (this.componentFeaturesService.isRuleEnabled()) {
      this.linearStepper = true;
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      if (!!constraints) {
        this.linearStepper = constraints.some((product) => this.currentStep.product.code.startsWith(product));
      }
    }
    if (this.dataService.tenantInfo.tenant === 'banca-sella_db') {
      this.componentFeaturesService.useComponent('checkout');
      this.componentFeaturesService.useRule('bank-account');
      if (this.componentFeaturesService.isRuleEnabled()) {
        this.linearStepper = true;
        const constraints = this.componentFeaturesService.getConstraints().get('products');
        if (!!constraints) {
          this.linearStepper = constraints.some((product) => this.currentStep.product.code.startsWith(product));
        }
      }
    }
  }

  createRequestOrder(): RequestOrder {
    return undefined;
  }

}



