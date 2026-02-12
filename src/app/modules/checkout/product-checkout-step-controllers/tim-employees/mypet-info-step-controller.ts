import { ProductInfoStepController } from '../product-info-step-controller.interface';
import { RequestOrder } from '@model';
import { Injectable } from '@angular/core';
import { CheckoutModule } from '../../checkout.module';
import { CheckoutRouteInput } from '../../checkout-routing.model';
import { CheckoutStepInsuranceInfoComponent } from '../../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.component';
import { LoginRedirectKeys } from '../login-redirect-keys.enum';
import { AuthService } from 'app/core/services/auth.service';
import { UserTypes } from 'app/components/public/products-container/products-tim-employees/user-types.enum';

@Injectable({
    providedIn: 'root'
})
export class MypetInfoStepController implements ProductInfoStepController {
 
    constructor(
      private authService: AuthService,
    ) {}

    getOngoingRequestOrder(checkoutRouteInput: CheckoutRouteInput): RequestOrder {
      const resolverData = checkoutRouteInput;
      const ongoingRequestOrder = (resolverData || {} as any).ongoingRequestOrder;
      return ongoingRequestOrder;
  }

  checkProductInitialization(infoComponent: CheckoutStepInsuranceInfoComponent) {
    if (this.authService.userTokenVerified 
        && !this.authService.currentUser.firstname
        && this.authService.loggedUser.data.user_type === UserTypes.RETIREE) {
      infoComponent.loginRedirect = LoginRedirectKeys.LDAP_LOGIN
    }
  }
}
