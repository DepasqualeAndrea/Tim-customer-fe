import { Injectable } from '@angular/core';
import { RequestOrder } from 'app/core/models/order.model';
import { ProductInfoStepController } from '../product-info-step-controller.interface';
import { CheckoutRouteInput } from '../../checkout-routing.model';
import { CheckoutStepInsuranceInfoComponent } from '../../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.component';
import { ActivatedRoute } from '@angular/router';
import { UPSELLING_QUERY_PARAM } from 'app/shared/shared-queryparam-keys';

@Injectable({
    providedIn: 'root'
  })
export class TimMyHomeInfoStepController implements ProductInfoStepController {
    constructor(
      private route: ActivatedRoute
    ) { }
    getOngoingRequestOrder(checkoutRouteInput: CheckoutRouteInput): RequestOrder {
      const queryParamMap = this.route.snapshot.queryParamMap;
      const isUpSelling = queryParamMap.has(UPSELLING_QUERY_PARAM);
      if (!isUpSelling) {
        const resolverData = checkoutRouteInput;
        const ongoingRequestOrder = (resolverData || {} as any).ongoingRequestOrder;
        return ongoingRequestOrder;
      }
    }

    checkProductInitialization(infoComponent: CheckoutStepInsuranceInfoComponent): void {}
}