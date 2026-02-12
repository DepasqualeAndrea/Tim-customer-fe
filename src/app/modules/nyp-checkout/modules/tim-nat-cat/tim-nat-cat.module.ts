import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "../../../../shared/shared.module";
import { SecurityModule } from "../../../security/security.module";
import { NypStripeModule } from "../nyp-stripe/nyp-stripe.module";
import { CheckoutDeactivateGuard } from "../../services/checkout-deactivate-guard.service";
import { CheckoutOrchestratorComponent } from "../tim-nat-cat/components/checkout-orchestrator/checkout-orchestrator.component";
import { TimNatCatCheckoutResolver } from "./services/checkout.resolver";
import { CheckoutStepInsuranceInfoComponent } from "./components/checkout-step-insurance-info/checkout-step-insurance-info.component";
import { CheckoutStepInsuranceInfoRealEstateInformationComponent } from "./components/checkout-step-insurance-info/checkout-step-insurance-info-real-estate-information/checkout-step-insurance-info-real-estate-information/checkout-step-insurance-info-real-estate-information.component";
import { CheckoutStepInsuranceInfoPaymentSplitSelectionComponent } from './components/checkout-step-insurance-info/checkout-step-insurance-info-payment-split-selection/checkout-step-insurance-info-payment-split-selection.component';
import { CheckoutCardGaranteeConfiguratorComponent } from "app/modules/checkout/checkout-card/checkout-card-garantee-configurator/checkout-card-garantee-configurator.component";
import { InsuranceInfoDetailsModalComponent } from './modal/insurance-info-details-modal/insurance-info-details-modal.component';
import { InsuranceInfoCustomRequestModalComponent } from "./modal/insurance-info-custom-request-modal/insurance-info-custom-request-modal.component";
import { ModalWarrantyDetailComponent } from "./modal/modal-warranty-detail/modal-warranty-detail.component";
import { CheckoutStepInsuranceInfoInsuranceDataComponent } from './components/checkout-step-insurance-info/checkout-step-insurance-info-insurance-data/checkout-step-insurance-info-insurance-data.component';
import { CheckoutStepLoginComponent } from "./components/checkout-step-login/checkout-step-login.component";
import { CheckoutStepSurveyComponent } from './components/checkout-step-survey/checkout-step-survey.component';
import { CheckoutThankYouComponent } from './components/checkout-thank-you/checkout-thank-you.component';
import { CheckoutStepConsensusesComponent } from './components/checkout-step-consensuses/checkout-step-consensuses.component';
import { CheckoutStepAddressComponent } from "../tim-nat-cat/components/checkout-step-address/checkout-step-address.component";
import { ShoppingCartComponent } from "../tim-nat-cat/components/shopping-cart/shopping-cart.component";
import { TimProductsStepperModule } from "app/modules/checkout/tim-products-stepper/tim-products-stepper.module";

const routes: Routes = [
  {
    path: "",
    component: CheckoutOrchestratorComponent,
    resolve: { input: TimNatCatCheckoutResolver },
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
    CheckoutStepInsuranceInfoComponent,
    CheckoutStepInsuranceInfoRealEstateInformationComponent,
    CheckoutStepInsuranceInfoInsuranceDataComponent,
    CheckoutStepInsuranceInfoPaymentSplitSelectionComponent,
    CheckoutCardGaranteeConfiguratorComponent,
    InsuranceInfoDetailsModalComponent,
    InsuranceInfoCustomRequestModalComponent,
    ModalWarrantyDetailComponent,
    CheckoutStepInsuranceInfoInsuranceDataComponent,
    CheckoutStepLoginComponent,
    CheckoutStepSurveyComponent,
    CheckoutStepConsensusesComponent,
    CheckoutStepAddressComponent,
    CheckoutThankYouComponent,
    ShoppingCartComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    SecurityModule,
    NgbModule,
    NypStripeModule,
    TimProductsStepperModule
  ],
  exports: [],
  providers: [CheckoutDeactivateGuard],
})
export class TimNatCatModule {}
