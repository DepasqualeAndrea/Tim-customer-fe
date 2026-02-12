import { RequestOrder, ResponseOrder, User } from '@model';
import { CheckoutStepInsuranceInfoHelper } from '../../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.helper';

export class SportsStepControllerHelper {
    public static addUserToInsuranceSubject(requestOrder: RequestOrder, responseOrder: ResponseOrder, user: User): RequestOrder {
        const address = Object.assign({}, user.address);
        const insuranceSubjects = CheckoutStepInsuranceInfoHelper.fromRequestInsuranceHoldersToCheckoutSubjects(requestOrder.order.line_items_attributes['0'].insurance_holders_attributes);
        const newInsuranceSubject = CheckoutStepInsuranceInfoHelper.fromAddressToInsuredSubject(null, address);
        insuranceSubjects.push(newInsuranceSubject);
        const insuranceHolderAttributes = CheckoutStepInsuranceInfoHelper.fromCheckoutSubjectsToInsuranceHoldersAttribute(insuranceSubjects);
        const orderAttributes = CheckoutStepInsuranceInfoHelper.convertInsuredSubjectsToOrderAttributes(insuranceSubjects);
        const quantity = CheckoutStepInsuranceInfoHelper.quantity(orderAttributes);
        requestOrder.order.line_items_attributes['0'].insurance_holders_attributes = insuranceHolderAttributes;
        return requestOrder;
    }
}
