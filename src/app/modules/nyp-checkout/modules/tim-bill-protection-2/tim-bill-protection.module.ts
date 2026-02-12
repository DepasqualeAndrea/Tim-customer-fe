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
import { CheckoutStepInsuranceInfoComponent } from "./components/checkout-step-insurance-info/checkout-step-insurance-info.component";
import { CheckoutStepLoginComponent } from "./components/checkout-step-login/checkout-step-login.component";
import { CheckoutThankYouComponent } from "./components/checkout-thank-you/checkout-thank-you.component";
import { CheckoutStepSurveyComponent } from "./components/checkout-step-survey/checkout-step-survey.component";
import { PolicyDetailBasicTimBillProtectionComponent } from "./components/policy-detail-basic-tim-bill-protection/policy-detail-basic-tim-bill-protection.component";
import { ShoppingCartComponent } from "./components/shopping-cart/shopping-cart.component";
import { InfoDetailsModalComponent } from "./modal/info-details-modal/info-details-modal.component";
import { InsuranceInfoAlertModalComponent } from "./modal/insurance-info-alert-modal/insurance-info-alert-modal.component";
import { InsuranceInfoDetailsModalComponent } from "./modal/insurance-info-details-modal/insurance-info-details-modal.component";
import { TimBillProtectionCheckoutResolver } from "./services/checkout.resolver";
import { TimBillProtectionServiceModule } from "./tim-bill-protection.service-module";
import { CheckoutStepInsuranceInfoPacketsComponent } from "./components/checkout-step-insurance-info/checkout-step-insurance-info-packets/checkout-step-insurance-info-packets.component";
import { CheckoutDeactivateGuard } from "../../services/checkout-deactivate-guard.service";
import { SellerCodeModule } from "../nyp-stripe/components/seller-code/configuration/seller-code.module";
import { SharedDirectivesModule } from "app/shared/directive/shared-directives.module";

const routes: Routes = [
  {
    path: "",
    component: CheckoutOrchestratorComponent,
    resolve: { input: TimBillProtectionCheckoutResolver },
    children: [
      { path: "login-register",  canDeactivate: [CheckoutDeactivateGuard] },
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
    ShoppingCartComponent,
    CheckoutStepInsuranceInfoComponent,
    CheckoutStepLoginComponent,
    CheckoutStepAddressComponent,
    CheckoutStepSurveyComponent,
    CheckoutStepConsensusesComponent,
    InsuranceInfoDetailsModalComponent,
    CheckoutThankYouComponent,
    InsuranceInfoAlertModalComponent,
    PolicyDetailBasicTimBillProtectionComponent,
    InfoDetailsModalComponent,
    CheckoutStepInsuranceInfoPacketsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    SecurityModule,
    NgbModule,
    TimBillProtectionServiceModule,
    NypStripeModule,
    SellerCodeModule,
    SharedDirectivesModule
  ],
  exports: [],
  providers: [CheckoutDeactivateGuard],
})
export class TimBillProtectionModule {}
