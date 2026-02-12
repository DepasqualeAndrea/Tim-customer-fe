import { Injectable } from '@angular/core';
import { CheckoutModule } from '../../checkout.module';
import { ProductStepsController } from '../product-steps-controller.interface';
import { CheckoutStep } from '../../checkout-step/checkout-step.model';
@Injectable({
    providedIn: 'root'
})
export class ProductStepsBaseController implements ProductStepsController {
    computeSteps(steps: CheckoutStep[]): CheckoutStep[] {
        const newSteps = steps.map(item => Object.assign({}, item));
        newSteps.forEach((value, index, array) => {
            value.previous = array[index - 1];
        });
        return newSteps;
    }
}