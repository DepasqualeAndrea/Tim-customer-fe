import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { SharedService } from '../../shared/shared.service';
import { DataService } from '@services';

import { SecurityRoutingModule } from './security-routing.module';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ActivateComponent } from './components/activate/activate.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordModalComponent } from './components/login/forgot-password-modal/forgot-password-modal.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ForgotConfirmModalComponent } from './components/login/forgot-confirm-modal/forgot-confirm-modal.component';
import { ChangePasswordModalComponent } from './components/forgot-password/change-password-modal/change-password-modal.component';
import { ActivateModalComponent } from './components/activate/activate-modal/activate-modal.component';
import { NotConfirmedCBComponent } from './components/not-confirmed-cb/not-confirmed-cb.component';
import { LoginSocialComponent } from './components/login-social/login-social.component';
import { SocialAuthService, FacebookLoginProvider, SocialLoginModule } from 'angularx-social-login';
import { RegisterModalCompleteComponent } from './components/register/register-modal-complete/register-modal-complete.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { LoginService } from './services/login.service';
import { BusinessRegistrationFormComponent } from './components/business-registration-form/business-registration-form.component';
import { NotConfirmedIntesaComponent } from './components/not-confirmed-intesa/not-confirmed-intesa.component';
import { NotConfirmedComponent } from './components/not-confirmed/not-confirmed.component';
import { ComponentLoaderModule } from '../tenants/component-loader/component-loader.module';
import { SsoCallbackComponent } from './components/sso-callback/sso-callback.component';
import { PasswordRevealerDirective } from './directives/password-revealer/password-revealer.directive';
import { NotConfirmedFcaComponent } from './components/not-confirmed-fca/not-confirmed-fca.component';
import { LoadPolicyComponent } from './components/load-policy/load-policy.component';
import { NotConfirmedTimEmployeesComponent } from './components/not-confirmed-tim-employees/not-confirmed-tim-employees.component';
import { LoginFormNdgComponent } from './components/login-form/tim-retirees/login-form-ndg/login-form-ndg.component';
import { RegisterFormTimRetireesComponent } from './components/register-form/tim-retirees/register-form-tim-retirees/register-form-tim-retirees.component';

import { LoginCustomersComponent } from './components/login/login-customers/login-customers.component';
import { ForgotPasswordNdgModalComponent } from './components/login/forgot-password-ndg-modal/forgot-password-ndg-modal.component';
import { RegisterCustomersComponent } from './components/register/register-customers/register-customers.component';
import { MigrationFormNdgComponent } from './components/login-form/tim-retirees/migration-form-ndg/migration-form-ndg.component';
import { NotConfirmedImaginComponent } from './components/not-confirmed-imagin/not-confirmed-imagin.component';
import { ModalFtthTimHomeComponent } from './components/login/modal-ftth-tim-home/modal-ftth-tim-home.component';

const socialAuthConfigFactory = (dataService: DataService) => {
  const fbAuth = dataService.tenantInfo.facebookAuth || {};
  return new SocialAuthService(
    {providers: [{ id: FacebookLoginProvider.PROVIDER_ID, provider: new FacebookLoginProvider(fbAuth.appId) }]}
  );
};

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        SecurityRoutingModule,
        NgbModule,
        ComponentLoaderModule
    ],
    declarations: [
        NotConfirmedComponent,
        RegisterComponent,
        LoginComponent,
        LogoutComponent,
        ActivateComponent,
        ForgotPasswordModalComponent,
        ForgotPasswordComponent,
        ForgotConfirmModalComponent,
        ChangePasswordModalComponent,
        ActivateModalComponent,
        LoginSocialComponent,
        RegisterModalCompleteComponent,
        LoginFormComponent,
        RegisterFormComponent,
        BusinessRegistrationFormComponent,
        NotConfirmedCBComponent,
        NotConfirmedIntesaComponent,
        SsoCallbackComponent,
        PasswordRevealerDirective,
        NotConfirmedFcaComponent,
        LoadPolicyComponent,
        NotConfirmedTimEmployeesComponent,
        LoginFormNdgComponent,
        RegisterFormTimRetireesComponent,
        ForgotPasswordNdgModalComponent,
        LoginCustomersComponent,
        RegisterCustomersComponent,
        MigrationFormNdgComponent,
        NotConfirmedImaginComponent,
        ModalFtthTimHomeComponent
    ],
    exports: [
        LoginFormComponent,
        RegisterFormComponent,
        BusinessRegistrationFormComponent,
        LoadPolicyComponent,
        LoginFormNdgComponent,
        RegisterFormTimRetireesComponent,
        LoginCustomersComponent,
        RegisterCustomersComponent,
        MigrationFormNdgComponent,
    ],
    providers: [
        LoginService,
        SharedService,
        {
            provide: SocialAuthService,
            useFactory: socialAuthConfigFactory,
            deps: [DataService]
        }
    ]
})
export class SecurityModule {
}
