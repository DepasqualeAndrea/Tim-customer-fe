import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SecurityModule } from "app/modules/security/security.module";
import { SharedModule } from "app/shared/shared.module";
import { NypStripeModule } from "../../../nyp-stripe/nyp-stripe.module";
import { CheckoutOrchestratorComponent } from "./components/checkout-orchestrator/checkout-orchestrator.component";
import { TimProtezioneViaggiRoamingPreventivatoreResolver } from "./services/preventivatore.resolver";
import { PreventivatoreComponent } from "./components/preventivatore/preventivatore.component";
import { InfoDetailsModalComponent } from "./modal/info-details-modal/info-details-modal.component";
import { MoreDetailsModalComponent } from "./modal/more-details-modal/more-details-modal.component";
import { InsuranceInfoDetailsModalComponent } from "./modal/insurance-info-details-modal/insurance-info-details-modal.component";
import { ShoppingCartComponent } from "./components/shopping-cart/shopping-cart.component";
import { TimProtezioneViaggiRoamingCheckoutResolver } from "./services/checkout.resolver";
import { TimProtezioneViaggiRoamingServiceModule } from "./tim-protezione-viaggi-roaming.service-module";
import { CheckoutStepInsuranceInfoComponent } from "./components/checkout-step-insurance-info/checkout-step-insurance-info.component";
import { CheckoutStepLoginComponent } from "./components/checkout-step-login/checkout-step-login.component";
import { CheckoutStepAddressComponent } from "./components/checkout-step-address/checkout-step-address.component";
import { CheckoutStepSurveyComponent } from "./components/checkout-step-survey/checkout-step-survey.component";
import { CheckoutStepConsensusesComponent } from "./components/checkout-step-consensuses/checkout-step-consensuses.component";
import { CheckoutThankYouComponent } from "./components/checkout-thank-you/checkout-thank-you.component";
import { PolicyDetailBasicViaggiComponent } from "./components/policy-detail-basic-tim-protezione-viaggi/policy-detail-basic-tim-viaggi.component";
import { FormsModule } from "@angular/forms";
import { CheckoutDeactivateGuard } from "app/modules/nyp-checkout/services/checkout-deactivate-guard.service";
import { CheckoutExistingPolicyComponent } from "./components/checkout-existing-policy/checkout-existing-policy.component";
import { SellerCodeModule } from "../../../nyp-stripe/components/seller-code/configuration/seller-code.module";
import { SharedDirectivesModule } from "app/shared/directive/shared-directives.module";
import { AfterStripeGuard } from "app/modules/nyp-checkout/services/after-stripe.guard";

const routes: Routes = [
  {
    path: "",
    resolve: { input: TimProtezioneViaggiRoamingPreventivatoreResolver },
    children: [
      { path: "preventivatore", component: PreventivatoreComponent },
      {
        path: "",
        component: CheckoutOrchestratorComponent,
        resolve: { input: TimProtezioneViaggiRoamingCheckoutResolver },
        children: [
          {
            path: "login-register",
            component: CheckoutStepLoginComponent,
            canDeactivate: [CheckoutDeactivateGuard]

          },
          {
            path: "user-control",
            component: CheckoutExistingPolicyComponent,
            canDeactivate: [CheckoutDeactivateGuard]
          },
          {
            path: "address",
            component: CheckoutStepAddressComponent,
            canDeactivate: [CheckoutDeactivateGuard]
          },
          {
            path: "insurance-info",
            component: CheckoutStepInsuranceInfoComponent,
            canDeactivate: [CheckoutDeactivateGuard]
          },
          {
            path: "survey",
            component: CheckoutStepSurveyComponent,
            canDeactivate: [CheckoutDeactivateGuard]
          },
          {
            path: "payment",
            canDeactivate: [CheckoutDeactivateGuard]
          },
          {
            path: "consensuses",
            component: CheckoutStepConsensusesComponent,
            canDeactivate: [CheckoutDeactivateGuard]
          },
          { path: "success" , canActivate: [AfterStripeGuard], component: CheckoutThankYouComponent },
          { path: "fail" },
          { path: "thank-you" },
        ],
      },
    ],
  },
];

@NgModule({
  declarations: [
    ShoppingCartComponent,
    PreventivatoreComponent,
    CheckoutOrchestratorComponent,
    CheckoutStepLoginComponent,
    CheckoutStepAddressComponent,
    CheckoutStepInsuranceInfoComponent,
    CheckoutStepSurveyComponent,
    CheckoutStepConsensusesComponent,
    CheckoutThankYouComponent,
    CheckoutExistingPolicyComponent,
    PolicyDetailBasicViaggiComponent,
    InfoDetailsModalComponent,
    InsuranceInfoDetailsModalComponent,
    MoreDetailsModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    SecurityModule,
    NgbModule,
    FormsModule,
    NypStripeModule,
    TimProtezioneViaggiRoamingServiceModule,
    SellerCodeModule,
    SharedDirectivesModule
  ],
  providers: [
    CheckoutDeactivateGuard
  ]
})
export class TimProtezioneViaggiRoamingModule {}
