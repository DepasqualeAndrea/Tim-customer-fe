import { Injectable } from '@angular/core';
import { CheckoutModule } from '../../checkout.module';
import { ProductStepsController } from '../product-steps-controller.interface';
import { CheckoutStep } from '../../checkout-step/checkout-step.model';
import { DataService, AuthService } from '@services';
@Injectable({
    providedIn: 'root'
})
export class IntesaPetStepsController implements ProductStepsController {
    constructor(private authService: AuthService
        , private dataService: DataService) {

    }
    computeSteps(steps: CheckoutStep[]): CheckoutStep[] {
        //---TODO: check when bill_adress is created
        //----check why getSteps is 
        // const isAddressBillCompleted = this.isAddressBillCompleted();
        // if (isAddressBillCompleted) {
        //     return this.getStepsWithoutInsuranceHolderStep(steps);
        // }
        return this.getSteps(steps);

    }
    private getSteps(steps: CheckoutStep[]): CheckoutStep[] {
        const newSteps = steps.map(item => Object.assign({}, item));
        newSteps.forEach((value, index, array) => {
            value.previous = array[index - 1];
        });
        return newSteps;
    }
    private isAddressBillCompleted(): boolean {
        return false;
        // const order = this.dataService.getResponseOrder();
        // const user = this.authService.loggedUser;
        // const result = !!user
        // && !!user.address
        // && !!user.address.taxcode
        // && !!user.address.birth_city
        // && !!user.address.country
        // && !!user.address.city
        // && !!user.address.state
        // && !!user.address.zipcode
        // && !!user.address.phone
        // && !!order.bill_address
        // && !!order.bill_address.id
        // && !!order.bill_address.taxcode
        // && !!order.bill_address.city
        // && !!order.bill_address.state
        // && !!order.bill_address.zipcode;
        // return result;
    }
    getStepsWithoutInsuranceHolderStep(steps: CheckoutStep[]): CheckoutStep[] {
        let stepNumber = 1;
        const newSteps = steps.filter(item => item.name !== 'address').map(item => Object.assign({}, item));
        newSteps.forEach((value, index, array) => {
            value.previous = array[index - 1];
            value.stepnum = stepNumber;
            stepNumber = stepNumber + 1;
        });
        return newSteps;
    }
}