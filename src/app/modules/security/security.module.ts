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
import { LoginSocialComponent } from './components/login-social/login-social.component';
import { FacebookLoginProvider, SocialAuthService } from 'angularx-social-login';
import { RegisterModalCompleteComponent } from './components/register/register-modal-complete/register-modal-complete.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { LoginService } from './services/login.service';
import { BusinessRegistrationFormComponent } from './components/business-registration-form/business-registration-form.component';
import { NotConfirmedComponent } from './components/not-confirmed/not-confirmed.component';
import { ComponentLoaderModule } from '../tenants/component-loader/component-loader.module';
import { SsoCallbackComponent } from './components/sso-callback/sso-callback.component';
import { PasswordRevealerDirective } from './directives/password-revealer/password-revealer.directive';
import { LoadPolicyComponent } from './components/load-policy/load-policy.component';
import { ModalFtthTimHomeComponent } from './components/login/modal-ftth-tim-home/modal-ftth-tim-home.component';


import { LoginCustomersComponent } from './components/login/login-customers/login-customers.component';
import { ForgotPasswordNdgModalComponent } from './components/login/forgot-password-ndg-modal/forgot-password-ndg-modal.component';
import { RegisterCustomersComponent } from './components/register/register-customers/register-customers.component';


const socialAuthConfigFactory = (dataService: DataService) => {
    const fbAuth = dataService.tenantInfo.facebookAuth || {};
    return new SocialAuthService(
        { providers: [{ id: FacebookLoginProvider.PROVIDER_ID, provider: new FacebookLoginProvider(fbAuth.appId) }] }
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
        SsoCallbackComponent,
        PasswordRevealerDirective,
        LoadPolicyComponent,
        ForgotPasswordNdgModalComponent,
        LoginCustomersComponent,
        RegisterCustomersComponent,
        ModalFtthTimHomeComponent,
    ],
    exports: [
        LoginFormComponent,
        RegisterFormComponent,
        BusinessRegistrationFormComponent,
        LoadPolicyComponent,
        LoginCustomersComponent,
        RegisterCustomersComponent,
        ModalFtthTimHomeComponent,
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
