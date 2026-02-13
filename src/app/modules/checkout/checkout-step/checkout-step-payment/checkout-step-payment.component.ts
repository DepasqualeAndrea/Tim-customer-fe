import {Component, OnInit} from '@angular/core';
import {CheckoutStepService} from '../../services/checkout-step.service';
import {CheckoutStepComponent} from '../checkout-step.component';
import {RequestOrder} from '@model';
import {ComponentFeaturesService} from 'app/core/services/componentFeatures.service';
import {DataService} from '@services';

@Component({
    selector: 'app-checkout-step-payment',
    templateUrl: './checkout-step-payment.component.html',
    styleUrls: ['./checkout-step-payment.component.scss'],
    standalone: false
})

export class CheckoutStepPaymentComponent extends CheckoutStepComponent implements OnInit {

  paymentStepper: string;

  constructor(
    checkoutStepService: CheckoutStepService,
    componentFeaturesService: ComponentFeaturesService,
    private dataService: DataService
  ) {
    super(checkoutStepService, componentFeaturesService);
  }

  ngOnInit() {
    this.isBankAccount();
    this.isLinearStepper();
    this.isPaymentRedirect();
    this.isLinearStepperNoPayment();
    this.isGenertelPayment();
    this.isMultirisckPayment();
  }

  createRequestOrder(): RequestOrder {
    const ro: RequestOrder = {order: {}};
    return ro;
  }

  isBankAccount() {
    this.componentFeaturesService.useComponent('checkout');
    this.componentFeaturesService.useRule('bank-account');
    if (this.componentFeaturesService.isRuleEnabled()) {
      this.paymentStepper = 'bankAccount';
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      if (!!constraints) {
        this.paymentStepper = constraints.some((product) => this.currentStep.product.code.startsWith(product)) ? 'bankAccount' : null;
      }
    }
  }

  isLinearStepper() {
    this.componentFeaturesService.useComponent('checkout');
    this.componentFeaturesService.useRule('linear-stepper');
    if (this.componentFeaturesService.isRuleEnabled()) {
      this.paymentStepper = 'linearStepper';
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      if (!!constraints) {
        this.paymentStepper = constraints.some((product) => this.currentStep.product.code.startsWith(product)) ? 'linearStepper' : null;
      }
    }
  }

  isPaymentRedirect() {
    this.componentFeaturesService.useComponent('checkout');
    this.componentFeaturesService.useRule('payment-redirect');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      if (!!constraints) {
        const productConstraint = constraints.find((product) => this.currentStep.product.code.startsWith(product.productName));
        const productUsesNoPayment = Object.prototype.hasOwnProperty.call(productConstraint, 'usesNoPayment');
        if (productUsesNoPayment && this.hasOrderNoPrice()) {
          this.paymentStepper = 'linearStepperNoPayment';
          return;
        }
        const isConstrainsRules = constraints.some((product) => this.currentStep.product.code.startsWith(product.productName));
        if (isConstrainsRules) {
          this.paymentStepper = 'redirectStepper';
        }
      }
    }
  }

  private hasOrderNoPrice(): boolean {
    const order = this.dataService.getResponseOrder();
    return order.total === 0;
  }

  isLinearStepperNoPayment() {
    this.componentFeaturesService.useComponent('checkout');
    this.componentFeaturesService.useRule('linear-stepper-no-payment');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      if (!!constraints) {
        this.paymentStepper = constraints.some((product) => this.currentStep.product.code.startsWith(product)) ? 'linearStepperNoPayment' : 'linearStepper';
      }
    }
  }

  private isGenertelPayment() {
    this.componentFeaturesService.useComponent('checkout');
    this.componentFeaturesService.useRule('genertel-payment');
    if (this.componentFeaturesService.isRuleEnabled()) {
      this.paymentStepper = 'genertelPayment';
    }
  }

  private isMultirisckPayment(){ 
    this.componentFeaturesService.useComponent('checkout');
    this.componentFeaturesService.useRule('multirisk-payment');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      if (!!constraints) {
        if(constraints.some((product) => this.currentStep.product.code.startsWith(product))){
          this.paymentStepper = 'multiriskPayment';
        }        
      }
    }
  }

}
