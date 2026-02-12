import { Injectable } from '@angular/core';
import { ProductLoginRegisterStepController } from '../product-login-register-step-controller.interface';
import { RequestOrder, ResponseOrder } from 'app/core/models/order.model';
import { CheckoutService } from '@services';
import { CheckoutModule } from '../../checkout.module';
import { ProductInfoStepController } from '../product-info-step-controller.interface';
import { ActivatedRoute } from '@angular/router';
import { CheckoutRouteInput } from '../../checkout-routing.model';
import { CheckoutStepInsuranceInfoComponent } from '../../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.component';

@Injectable({
    providedIn: 'root'
  })
export class ProductInfoStepBaseController implements ProductInfoStepController {
    constructor() { }

    getOngoingRequestOrder(checkoutRouteInput: CheckoutRouteInput): RequestOrder {
        const resolverData = checkoutRouteInput;
        const ongoingRequestOrder = (resolverData || {} as any).ongoingRequestOrder;
        return ongoingRequestOrder;
    }
    checkProductInitialization(infoComponent: CheckoutStepInsuranceInfoComponent) {
    }
}
