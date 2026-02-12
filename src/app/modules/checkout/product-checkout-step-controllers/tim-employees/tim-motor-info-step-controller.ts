import { ProductInfoStepController } from '../product-info-step-controller.interface';
import { RequestOrder, User } from '@model';
import { Injectable } from '@angular/core';
import { CheckoutModule } from '../../checkout.module';
import { CheckoutRouteInput } from '../../checkout-routing.model';
import { CheckoutStepInsuranceInfoComponent } from '../../checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.component';
import { LoginRedirectKeys } from '../login-redirect-keys.enum';
import { Router } from '@angular/router';
import { LoginService } from 'app/modules/security/services/login.service';
import { AuthService } from '@services';
import { UserTypes } from 'app/components/public/products-container/products-tim-employees/user-types.enum';
import { CheckoutStepService } from '../../services/checkout-step.service';

@Injectable({
    providedIn: 'root'
})
export class TimMotorInfoStepController implements ProductInfoStepController {

    constructor(
      private authService: AuthService,
      private loginService: LoginService,
      private router: Router,
      private checkoutStepService: CheckoutStepService
    ) {}

    getOngoingRequestOrder(checkoutRouteInput: CheckoutRouteInput): RequestOrder {
      const resolverData = checkoutRouteInput;
      const ongoingRequestOrder = (resolverData || {} as any).ongoingRequestOrder;
      return ongoingRequestOrder;
  }

  checkProductInitialization(infoComponent: CheckoutStepInsuranceInfoComponent) {

    this.checkoutStepService.setCurrentStep('payment');

    if (this.authService.userTokenVerified
      && this.hasNoPersonalInfo(this.authService.currentUser)
      && this.authService.currentUser.data.user_type === UserTypes.EMPLOYEE) {
      this.loginService.setupRedirectFromController(true);
      this.loginService.setupRedirectAfterLogin(LoginRedirectKeys.IFRAME_COMPONENT);
      this.router.navigate(['checkout/login-register']);
    } else {
      this.router.navigate(['checkout/outside-source']);
    }
  }

  private hasNoPersonalInfo(user: User): boolean {
    return !user.firstname && !user.lastname && !user.birth_date && !user.email;
  }
}
