import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SecurityModule } from 'app/modules/security/security.module';
import { SharedModule } from 'app/shared/shared.module';
import { NypStripeModule } from '../../../nyp-stripe/nyp-stripe.module';
import { CheckoutOrchestratorComponent } from '../tim-protezione-viaggi-annuale/components/checkout-orchestrator/checkout-orchestrator.component';
import { TimProtezioneViaggiAnnualeCheckoutResolver } from './services/checkout.resolver';
import { TimProtezioneViaggiAnnualePreventivatoreResolver } from './services/preventivatore.resolver';
import { PreventivatoreComponent } from './components/preventivatore/preventivatore.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { InfoDetailsModalComponent } from './modal/info-details-modal/info-details-modal.component';
import { InsuranceInfoDetailsModalComponent } from './modal/insurance-info-details-modal/insurance-info-details-modal.component';
import { MoreDetailsModalComponent } from './modal/more-details-modal/more-details-modal.component';
import { TimProtezioneViaggiAnnualeServiceModule } from './tim-protezione-viaggi-annuale.service-module';
import { CheckoutStepInsuranceInfoComponent } from './components/checkout-step-insurance-info/checkout-step-insurance-info.component';
import { CheckoutStepLoginComponent } from './components/checkout-step-login/checkout-step-login.component';
import { CheckoutStepAddressComponent } from './components/checkout-step-address/checkout-step-address.component';
import { CheckoutStepSurveyComponent } from './components/checkout-step-survey/checkout-step-survey.component';
import { CheckoutStepConsensusesComponent } from './components/checkout-step-consensuses/checkout-step-consensuses.component';
import { CheckoutThankYouComponent } from './components/checkout-thank-you/checkout-thank-you.component';
import { PolicyDetailBasicViaggiComponent } from './components/policy-detail-basic-tim-protezione-viaggi/policy-detail-basic-tim-viaggi.component';
import { InfoLuggageModalComponent } from './modal/info-luggage-modal/info-luggage-modal.component';
import { CheckoutDeactivateGuard } from "app/modules/nyp-checkout/services/checkout-deactivate-guard.service";
import { CheckoutExistingPolicyComponent } from './components/checkout-existing-policy/checkout-existing-policy.component';
import { SellerCodeModule } from '../../../nyp-stripe/components/seller-code/configuration/seller-code.module';
import { SharedDirectivesModule } from 'app/shared/directive/shared-directives.module';
import { AfterStripeGuard } from 'app/modules/nyp-checkout/services/after-stripe.guard';

const routes: Routes = [
  {
    path: '', resolve: { input: TimProtezioneViaggiAnnualePreventivatoreResolver }, children: [
      { path: 'preventivatore', component: PreventivatoreComponent, },
      {

        path: '', component: CheckoutOrchestratorComponent, resolve: { input: TimProtezioneViaggiAnnualeCheckoutResolver }, children: [
                    { path: "login-register", canDeactivate: [CheckoutDeactivateGuard] },
                    {
                      path: "user-control",
                      component: CheckoutExistingPolicyComponent,
                      canDeactivate: [CheckoutDeactivateGuard],
                    },
                    { path: "address", canDeactivate: [CheckoutDeactivateGuard] },
                    { path: "insurance-info", canDeactivate: [CheckoutDeactivateGuard] },
                    { path: "survey", canDeactivate: [CheckoutDeactivateGuard] },
                    { path: "payment", canDeactivate: [CheckoutDeactivateGuard] },
                    { path: "consensuses", canDeactivate: [CheckoutDeactivateGuard] },
                    { path: "success", canActivate: [AfterStripeGuard], component: CheckoutThankYouComponent },
                    { path: "fail" },
                    { path: "thank-you" },
        ]
      },
    ]
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
    PolicyDetailBasicViaggiComponent,
    CheckoutExistingPolicyComponent,
    InfoDetailsModalComponent,
    InsuranceInfoDetailsModalComponent,
    InfoDetailsModalComponent,
    InsuranceInfoDetailsModalComponent,
    MoreDetailsModalComponent,
    InfoLuggageModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    SecurityModule,
    NgbModule,
    NypStripeModule,
    TimProtezioneViaggiAnnualeServiceModule,
    SellerCodeModule,
    SharedDirectivesModule
  ],
    providers: [CheckoutDeactivateGuard],
})
export class TimProtezioneViaggiAnnualeModule { }
