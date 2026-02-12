import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NetCyberBusinessCheckoutResolver } from './services/checkout.resolver';
import { CheckoutDeactivateGuard } from "../../services/checkout-deactivate-guard.service";
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { SecurityModule } from 'app/modules/security/security.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NypStripeModule } from '../nyp-stripe/nyp-stripe.module';
import { CheckoutStepInsuranceInfoComponent } from "./components/checkout-step-insurance-info/checkout-step-insurance-info.component";
import { CheckoutOrchestratorComponent } from './components/checkout-orchestrator/checkout-orchestrator.component';
import { CheckoutStepLoginComponent } from './components/checkout-step-login/checkout-step-login.component';
import { CheckoutStepSurveyComponent } from './components/checkout-step-survey/checkout-step-survey.component';
import { CheckoutThankYouComponent } from './components/checkout-thank-you/checkout-thank-you.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CheckoutStepInsuranceRadioOptionsComponent } from './components/checkout-step-insurance-info/checkout-step-insurance-radio-options/checkout-step-insurance-radio-options.component';
import { CheckoutStepInsuranceInfoProductInfoComponent } from './components/checkout-step-insurance-info/checkout-step-insurance-info-product-info/checkout-step-insurance-info-product-info.component';
import { CheckoutProductsStepperComponent } from './components/checkout-products-stepper/checkout-products-stepper.component';
import { CheckoutStepAddressComponent } from './components/checkout-step-address/checkout-step-address.component';
import { CheckoutStepConsensusesComponent } from './components/checkout-step-consensuses/checkout-step-consensuses.component';
import { CheckoutStepInsuranceInfoPaymentSplitSelectionComponent } from './components/checkout-step-insurance-info/checkout-step-insurance-info-payment-split-selection/checkout-step-insurance-info-payment-split-selection.component';
import { CheckoutStepInsuranceInfoInsuranceDataComponent } from './components/checkout-step-insurance-info/checkout-step-insurance-info-insurance-data/checkout-step-insurance-info-insurance-data.component';
import { InsuranceInfoCustomRequestModalComponent } from './modal/insurance-info-custom-request-modal/insurance-info-custom-request-modal.component';



const routes: Routes = [
  {
    path: "",
    component: CheckoutOrchestratorComponent,
    resolve: { input: NetCyberBusinessCheckoutResolver },
    children: [
      { path: "login-register", canDeactivate: [CheckoutDeactivateGuard]},
      { path: "insurance-info", canDeactivate: [CheckoutDeactivateGuard] },
      { path: "address", canDeactivate: [CheckoutDeactivateGuard] },
      { path: "survey", canDeactivate: [CheckoutDeactivateGuard] },
      { path: "payment", canDeactivate: [CheckoutDeactivateGuard] },
      { path: "consensuses", canDeactivate: [CheckoutDeactivateGuard] },
      { path: "success" },
      { path: "fail" },
      { path: "thank-you" },
    ],
  },
];

@NgModule({
  declarations: [
    CheckoutOrchestratorComponent,
    CheckoutStepLoginComponent,
    CheckoutStepSurveyComponent,
    CheckoutThankYouComponent,
    ShoppingCartComponent,
    CheckoutStepInsuranceInfoComponent,
    CheckoutStepInsuranceInfoProductInfoComponent,
    CheckoutStepInsuranceRadioOptionsComponent,
    CheckoutProductsStepperComponent,
    CheckoutStepAddressComponent,
    CheckoutStepConsensusesComponent,
    CheckoutStepInsuranceInfoPaymentSplitSelectionComponent,
    CheckoutStepInsuranceInfoInsuranceDataComponent,
    InsuranceInfoCustomRequestModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    SecurityModule,
    NgbModule,
    NypStripeModule
  ],
  exports: [],
  providers: [CheckoutDeactivateGuard],
})

export class NetCyberBusinessModule { }
