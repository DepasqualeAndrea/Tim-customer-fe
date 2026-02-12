import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ActivateComponent } from './components/activate/activate.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { NotConfirmedComponent } from './components/not-confirmed/not-confirmed.component';
import { AuthGuardLoginIntesa } from 'app/core/services/auth-guard-login-intesa.service';
import { SsoCallbackComponent } from './components/sso-callback/sso-callback.component';
import { AuthGuardLoginCB } from 'app/core/services/auth-guard-login-cb.service';
import { AuthGuardLoginCse } from 'app/core/services/auth-guard-login-cse.service';
import { AuthGuardLoginFCA } from 'app/core/services/auth-guard-login-fca.service';
import { AuthGuardLoginFCAsaml } from 'app/core/services/auth-guard-login-fca-saml.service';
import { LoadPolicyComponent } from './components/load-policy/load-policy.component';
import { AuthGuardLoginTimEmployees } from 'app/core/services/auth-guard-login-tim-employees.service';
import { AuthGuardLoginTimCustomers } from 'app/core/services/auth-guard-login-tim-customers.service';
import { LoginRegisterTimRetireesComponent } from '../checkout/login-register/tim-retirees/login-register-tim-retirees/login-register-tim-retirees.component';
import { LoginRegisterTimCustomersComponent } from '../checkout/login-register/tim-customers/login-register-tim-customers/login-register-tim-customers.component';
import { AuthGuardLoginFCAGigya } from 'app/core/services/auth-guard-login-fca-gigya.srvice';

const routes: Routes = [
  { path: 'not-confirmed', component: NotConfirmedComponent },
  { path: 'registrazione', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'load-private-area', component: LoadPolicyComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'activate-account', component: ActivateComponent },
  { path: 'dashboard/user/spree_user/confirmation', component: ActivateComponent }, // TODO: Delete mappa il vecchio url in attesa che cambino i link nelle mail
  { path: 'reset-password', component: ForgotPasswordComponent },
  { path: 'pensioner-access', component: LoginRegisterTimRetireesComponent },
  { path: 'user-access', component: LoginRegisterTimCustomersComponent },
  {
    path: 'users/auth', children: [
      { path: 'intesa/callback', canActivate: [AuthGuardLoginIntesa], component: SsoCallbackComponent },
      { path: 'chebanca/callback', canActivate: [AuthGuardLoginCB], component: SsoCallbackComponent },
      { path: 'cse/callback', canActivate: [AuthGuardLoginCse], component: SsoCallbackComponent },
      { path: 'fca/callback', canActivate: [AuthGuardLoginFCA], component: SsoCallbackComponent },
      { path: 'fca/saml-callback', canActivate: [AuthGuardLoginFCAsaml], component: SsoCallbackComponent },
      { path: 'fca/sso-gigya/gigya_request', canActivate: [AuthGuardLoginFCAGigya], component: SsoCallbackComponent },
      { path: 'fca/sso-gigya/gigya_callback', canActivate: [AuthGuardLoginFCAGigya], component: SsoCallbackComponent },
      { path: 'tim/callback', canActivate: [AuthGuardLoginTimEmployees], component: SsoCallbackComponent },
      { path: 'tim_customers/callback', canActivate: [AuthGuardLoginTimCustomers], component: SsoCallbackComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityRoutingModule {
}
