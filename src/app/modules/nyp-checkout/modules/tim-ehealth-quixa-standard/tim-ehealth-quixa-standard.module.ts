import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "../../../../shared/shared.module";
import { SecurityModule } from "../../../security/security.module";
import { NypStripeModule } from "../nyp-stripe/nyp-stripe.module";
import { CheckoutOrchestratorComponent } from "./components/checkout-orchestrator/checkout-orchestrator.component";
import { CheckoutStepAddressComponent } from "./components/checkout-step-address/checkout-step-address.component";
import { CheckoutStepConsensusesComponent } from "./components/checkout-step-consensuses/checkout-step-consensuses.component";
import { CheckoutStepLoginComponent } from "./components/checkout-step-login/checkout-step-login.component";
import { CheckoutThankYouComponent } from "./components/checkout-thank-you/checkout-thank-you.component";
import { PolicyDetailBasicTimEhealthQuixaStandardComponent } from "./components/policy-detail-basic-tim-ehealth-quixa-standard/policy-detail-basic-tim-ehealth-quixa-standard.component";
import { ShoppingCartComponent } from "./components/shopping-cart/shopping-cart.component";
import { TimEhealthQuixaStandardCheckoutResolver } from "./services/checkout.resolver";
import { TimEhealthQuixaStandardServiceModule } from "./tim-ehealth-quixa-standard.service-module";
import { CheckoutDeactivateGuard } from "../../services/checkout-deactivate-guard.service";
import { CheckoutStepInsuranceInfoComponent } from "./components/checkout-step-insurance-info/checkout-step-insurance-info.component";
import { SellerCodeModule } from "../nyp-stripe/components/seller-code/configuration/seller-code.module";
import { SharedDirectivesModule } from "app/shared/directive/shared-directives.module";
import { AfterStripeGuard } from "../../services/after-stripe.guard";

const routes: Routes = [
  {
    path: "",
    component: CheckoutOrchestratorComponent,
    resolve: { input: TimEhealthQuixaStandardCheckoutResolver },
    children: [
      {
        path: "insurance-info",
        canDeactivate: [CheckoutDeactivateGuard],
      },
      { path: "login-register", canDeactivate: [CheckoutDeactivateGuard] },
      { path: "address", canDeactivate: [CheckoutDeactivateGuard] },
      { path: "payment", canDeactivate: [CheckoutDeactivateGuard] },
      { path: "consensuses", canDeactivate: [CheckoutDeactivateGuard] },
      { path: "success",  canActivate: [AfterStripeGuard], component: CheckoutThankYouComponent },
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
    CheckoutStepConsensusesComponent,
    CheckoutThankYouComponent,
    PolicyDetailBasicTimEhealthQuixaStandardComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    SecurityModule,
    NgbModule,
    TimEhealthQuixaStandardServiceModule,
    NypStripeModule,
    SellerCodeModule,
    SharedDirectivesModule
  ],
  exports: [],
  providers: [CheckoutDeactivateGuard],
})
export class TimEhealthQuixaStandardModule { }
