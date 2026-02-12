import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "../../../../shared/shared.module";
import { SecurityModule } from "../../../security/security.module";
import { NypStripeModule } from "../nyp-stripe/nyp-stripe.module";
import { CheckoutOrchestratorComponent } from "../net-cyber-consumer/components/checkout-orchestrator/checkout-orchestrator.component";
import { CheckoutStepAddressComponent } from "../net-cyber-consumer/components/checkout-step-address/checkout-step-address.component";
import { CheckoutStepConsensusesComponent } from "../net-cyber-consumer/components/checkout-step-consensuses/checkout-step-consensuses.component";
import { CheckoutStepInsuranceInfoComponent } from "../net-cyber-consumer/components/checkout-step-insurance-info/checkout-step-insurance-info.component";
import { CheckoutStepLoginComponent } from "../net-cyber-consumer/components/checkout-step-login/checkout-step-login.component";
import { CheckoutThankYouComponent } from "../net-cyber-consumer/components/checkout-thank-you/checkout-thank-you.component";
import { CheckoutStepSurveyComponent } from "../net-cyber-consumer/components/checkout-step-survey/checkout-step-survey.component";
import { ShoppingCartComponent } from "../net-cyber-consumer/components/shopping-cart/shopping-cart.component";
import { InsuranceInfoDetailsModalComponent } from "./modal/insurance-info-details-modal/insurance-info-details-modal.component";
import { TimCyberConsumerServiceModule } from "./tim-cyber-consumer.service-module";
import { CheckoutDeactivateGuard } from "../../services/checkout-deactivate-guard.service";
import { SellerCodeModule } from "../nyp-stripe/components/seller-code/configuration/seller-code.module";
import { SharedDirectivesModule } from "app/shared/directive/shared-directives.module";
import { AfterStripeGuard } from "../../services/after-stripe.guard";
import { TimCyberConsumerCheckoutResolver } from "./services/checkout.resolver";
import { TimProductsStepperModule } from "app/modules/checkout/tim-products-stepper/tim-products-stepper.module";
import { PolicyDetailBasicTimCyberConsumerComponent } from "./components/policy-detail-basic-tim-cyber-consumer/policy-detail-basic-tim-cyber-consumer.component";

const routes: Routes = [
  {
    path: "",
    component: CheckoutOrchestratorComponent,
    resolve: { input: TimCyberConsumerCheckoutResolver },
    children: [
      { path: "login-register", canDeactivate: [CheckoutDeactivateGuard]},
      { path: "insurance-info", canDeactivate: [CheckoutDeactivateGuard] },
      { path: "address", canDeactivate: [CheckoutDeactivateGuard] },
      { path: "survey", canDeactivate: [CheckoutDeactivateGuard] },
      { path: "payment", canDeactivate: [CheckoutDeactivateGuard] },
      { path: "consensuses", canDeactivate: [CheckoutDeactivateGuard] },
      { path: "success" , canActivate: [AfterStripeGuard], component: CheckoutThankYouComponent },
      { path: "fail" },
      { path: "thank-you" },
    ],
  },
];

@NgModule({
  declarations: [
    CheckoutOrchestratorComponent,
    ShoppingCartComponent,
    CheckoutStepInsuranceInfoComponent,
    CheckoutStepLoginComponent,
    CheckoutStepAddressComponent,
    CheckoutStepSurveyComponent,
    CheckoutStepConsensusesComponent,
    CheckoutThankYouComponent,
    PolicyDetailBasicTimCyberConsumerComponent,
    InsuranceInfoDetailsModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    SecurityModule,
    NgbModule,
    TimCyberConsumerServiceModule,
    NypStripeModule,
    SellerCodeModule,
    SharedDirectivesModule,
    TimProductsStepperModule
  ],
  exports: [],
  providers: [CheckoutDeactivateGuard],
})
export class TimCyberConsumerModule {}
