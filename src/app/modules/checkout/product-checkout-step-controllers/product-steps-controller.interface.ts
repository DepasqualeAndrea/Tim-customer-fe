import { CheckoutStep } from '../checkout-step/checkout-step.model';

export interface ProductStepsController {
    computeSteps(steps: CheckoutStep[]): CheckoutStep[];
}