import { ProductInfoStepController } from '../product-info-step-controller.interface';
import { RequestOrder, ResponseOrder, User } from '@model';
import { Injectable } from '@angular/core';
import { CheckoutModule } from '../../checkout.module';
import { CheckoutRouteInput } from '../../checkout-routing.model';
import { CheckoutStepInsuranceInfoHelper } from '../../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.helper';
import { AuthService, DataService, CheckoutService } from '@services';
import { SportsStepControllerHelper } from './sports-step-controller-helper';
import { CheckoutStepInsuranceInfoComponent } from '../../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.component';

@Injectable({
    providedIn: 'root'
})
export class SportsInfoStepController implements ProductInfoStepController {
    constructor(private authService: AuthService,
        private dataService: DataService,
        private checkoutService: CheckoutService) {

    }

    getOngoingRequestOrder(checkoutRouteInput: CheckoutRouteInput): RequestOrder {
        const resolverData = checkoutRouteInput;
        const ongoingRequestOrder = (resolverData || {} as any).ongoingRequestOrder;
        const orderResponse = this.dataService.getResponseOrder();
        return this.adjustInsuranceHolders(ongoingRequestOrder, orderResponse);
    }
    private adjustInsuranceHolders(requestOrder: RequestOrder, responseOrder: ResponseOrder): RequestOrder {
        if (!requestOrder) {
            return requestOrder;
        }
         if (!requestOrder.order.line_items_attributes['0'].insured_is_contractor) {
            return requestOrder;
        }
        return this.addLoggedUserToInsuranceSubject(requestOrder, responseOrder);
    }
    private removeInsuredSubjectsFromRequestOrder(requestOrder: RequestOrder) {
        delete requestOrder.order.line_items_attributes['0'].insurance_holders_attributes;
        return requestOrder;
    }
    private addLoggedUserToInsuranceSubject(requestOrder: RequestOrder, responseOrder: ResponseOrder): RequestOrder {
         const currentQuantity = responseOrder.line_items[0].quantity;
         const responseOrderInsuredSubjects = CheckoutStepInsuranceInfoHelper.fromResponseInsuranceHoldersToCheckoutSubjects(responseOrder.line_items[0].insured_entities.insurance_holders);
        if (!!responseOrderInsuredSubjects && responseOrderInsuredSubjects.length === currentQuantity) {
            return this.removeInsuredSubjectsFromRequestOrder(requestOrder);
        }
        return SportsStepControllerHelper.addUserToInsuranceSubject(requestOrder, responseOrder, this.authService.loggedUser);
    }
    checkProductInitialization(infoComponent: CheckoutStepInsuranceInfoComponent) {
    }
}
