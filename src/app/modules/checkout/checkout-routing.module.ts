import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './checkout.component';
import { CheckoutStepInsuranceInfoComponent } from './checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.component';
import { CheckoutStepAddressComponent } from './checkout-step/checkout-step-address/checkout-step-address.component';
import { CheckoutStepSurveyComponent } from './checkout-step/checkout-step-survey/checkout-step-survey.component';
import { CheckoutStepPaymentComponent } from './checkout-step/checkout-step-payment/checkout-step-payment.component';
import { CheckoutResolver } from './services/checkout.resolver';
import { CheckoutStepConfirmComponent } from './checkout-step/checkout-step-confirm/checkout-step-confirm.component';
import { CheckoutStepCompleteComponent } from './checkout-step/checkout-step-complete/checkout-step-complete.component';
import { LoginRegisterComponent } from 'app/modules/checkout/login-register/login-register.component';
import { CheckoutGuard } from './checkout-guard';
import { CheckoutLinearStepperComponent } from './checkout-linear-stepper/checkout-linear-stepper.component';
import { CheckoutPaymentCallbackDoneComponent } from './checkout-payment-callback-done/checkout-payment-callback-done.component';
import { CheckoutPaymentCallbackFailComponent } from './checkout-payment-callback-fail/checkout-payment-callback-fail.component';
import { RedirectCheckoutComponent } from './redirect-checkout/redirect-checkout.component';
import { CheckoutFailPaymentGupComponent } from './checkout-fail-payment-gup/checkout-fail-payment-gup.component';
import { CheckoutSuccessPaymentGupComponent } from './checkout-success-payment-gup/checkout-success-payment-gup.component';
import { EstimateRedirectCheckoutComponent } from './estimate-redirect-checkout/estimate-redirect-checkout.component';
import { CheckoutStepOutsideSourceComponent } from './checkout-step/checkout-step-outside-source/checkout-step-outside-source/checkout-step-outside-source.component';
import { AfterStripeGuard } from 'app/modules/nyp-checkout/services/after-stripe.guard';

const routes: Routes = [
  {
    path: 'apertura', component: CheckoutComponent, resolve: { input: CheckoutResolver }, children: [
      { path: 'insurance-info', component: CheckoutStepInsuranceInfoComponent },
      { path: 'login-register', component: LoginRegisterComponent },
      { path: 'address', component: CheckoutStepAddressComponent, canActivate: [CheckoutGuard] },
      { path: 'survey', component: CheckoutStepSurveyComponent },
      { path: 'payment', component: CheckoutStepPaymentComponent },
      { path: 'confirm', component: CheckoutStepConfirmComponent },
      { path: 'complete', component: CheckoutStepCompleteComponent },
    ]
  },
  {
    path: 'checkout', component: CheckoutLinearStepperComponent, resolve: { input: CheckoutResolver }, children: [
      { path: 'insurance-info', component: CheckoutStepInsuranceInfoComponent },
      { path: 'login-register', component: LoginRegisterComponent },
      { path: 'address', component: CheckoutStepAddressComponent, canActivate: [CheckoutGuard] },
      { path: 'survey', component: CheckoutStepSurveyComponent },
      { path: 'payment', component: CheckoutStepPaymentComponent },
      { path: 'confirm', component: CheckoutStepConfirmComponent },
      { path: 'complete', component: CheckoutStepCompleteComponent },
      { path: 'outside-source', component: CheckoutStepOutsideSourceComponent },
    ]
  },
  // {path: 'error', component: CheckoutErrorPageBancaSellaComponent, canActivate: [CheckoutGuard]},
  { path: 'payment-callback-done', component: CheckoutPaymentCallbackDoneComponent },
  { path: 'payment-callback-fail', component: CheckoutPaymentCallbackFailComponent },
  { path: 'redirect-payment', component: RedirectCheckoutComponent },
  { path: 'estimate-redirect-checkout', component: EstimateRedirectCheckoutComponent },
  { path: 'success', canActivate: [AfterStripeGuard], component: CheckoutSuccessPaymentGupComponent },
  { path: 'fail', canActivate: [AfterStripeGuard], component: CheckoutFailPaymentGupComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CheckoutResolver]
})
export class CheckoutRoutingModule {
}

