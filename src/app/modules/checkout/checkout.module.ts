import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { SharedModule } from '../../shared/shared.module';
import { SecurityModule } from '../security/security.module';
import { PaymentManagementModule } from '../payment-management/payment-management.module';
import { CustomPipeModule } from 'app/shared/pipe/CustomPipes.module';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';
import { CheckoutGuard } from './checkout-guard';

import { LoginRegisterComponent } from './login-register/login-register.component';

import { LoginRegisterTimCustomersComponent } from './login-register/tim-customers/login-register-tim-customers/login-register-tim-customers.component';
import { LoginRegisterTimCustomersCheckoutComponent } from './login-register/tim-customers/login-register-tim-customers-checkout/login-register-tim-customers-checkout.component';
import { CheckoutLoginRegisterStepComponent } from './login-register/checkout-login-register-step/checkout-login-register-step.component';

import { RedirectCheckoutComponent } from './redirect-checkout/redirect-checkout.component';

import { ModalScreenProtectionPromoCodeComponent } from './modal-screen-protection/modal-screen-protection-promo-code/modal-screen-protection-promo-code.component';
import { ScreenProtectionAskWithdrawalModalComponent } from './modal-screen-protection/screen-protection-ask-withdrawal-modal/screen-protection-ask-withdrawal-modal.component';

import { StickyTriggerResetDirective } from './directives/target-trigger/sticky/sticky-trigger-reset.directive';
import { StickyTriggerControlDirective } from './directives/target-trigger/sticky/sticky-trigger-control.directive';
import { StickyTargetDirective } from './directives/target-trigger/sticky/sticky-target.directive';

import { CostLineGeneratorService } from './services/cost-line-generators/cost-line-generator.service';

@NgModule({
  declarations: [
    CheckoutComponent,
    LoginRegisterComponent,

    LoginRegisterTimCustomersComponent,
    LoginRegisterTimCustomersCheckoutComponent,
    CheckoutLoginRegisterStepComponent,
    RedirectCheckoutComponent,
    ModalScreenProtectionPromoCodeComponent,
    ScreenProtectionAskWithdrawalModalComponent,
    StickyTriggerResetDirective,
    StickyTriggerControlDirective,
    StickyTargetDirective
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    ReactiveFormsModule,
    PaymentManagementModule,
    FormsModule,
    SharedModule,
    SecurityModule,
    NgbModule,
    ScrollToModule,
    CustomPipeModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule
  ],
  providers: [
    NgbActiveModal, CheckoutGuard, CostLineGeneratorService
  ]
})
export class CheckoutModule { }
