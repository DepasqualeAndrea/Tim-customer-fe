import { ProductLoginRegisterStepController } from '../product-login-register-step-controller.interface';
import { Injectable } from '@angular/core';
import { RequestOrder, ResponseOrder } from 'app/core/models/order.model';
import { CheckoutService, AuthService } from '@services';
import { CheckoutStepInsuranceInfoHelper } from '../../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.helper';
import { CheckoutModule } from '../../checkout.module';
import { GeBikeStepControllerHelper } from './ge-bike-step-controller-helper';

@Injectable({
    providedIn: 'root'
})
export class GeBikeLoginStepController implements ProductLoginRegisterStepController {
    constructor(private checkoutService: CheckoutService,
        private authService: AuthService) { }

    getOngoingRequestOrder(): RequestOrder {
        const checkoutData = this.checkoutService.getOngoingCheckoutData(false);
        if (!checkoutData) {
            return null;
        }
        return this.adjustInsuranceHolders(checkoutData.requestOrder, checkoutData.responseOrder);
    }
    private adjustInsuranceHolders(requestOrder: RequestOrder, responseOrder: ResponseOrder): RequestOrder {
        if (!requestOrder.order.line_items_attributes['0'].insured_is_contractor) {
            return requestOrder;
        }
        return this.addLoggedUserToInsuranceSubject(requestOrder, responseOrder);
    }
    private addLoggedUserToInsuranceSubject(requestOrder: RequestOrder, responseOrder: ResponseOrder): RequestOrder {
        const currentQuantity = responseOrder.line_items[0].quantity;
        const insuranceSubjects = CheckoutStepInsuranceInfoHelper.fromRequestInsuranceHoldersToCheckoutSubjects(requestOrder.order.line_items_attributes['0'].insurance_holders_attributes);
        if (insuranceSubjects.length !== currentQuantity) {
            return requestOrder;
         }
         return GeBikeStepControllerHelper.addUserToInsuranceSubject(requestOrder, responseOrder, this.authService.loggedUser);
    }
}
