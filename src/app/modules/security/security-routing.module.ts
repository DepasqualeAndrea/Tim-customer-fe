import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ActivateComponent } from './components/activate/activate.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { NotConfirmedComponent } from './components/not-confirmed/not-confirmed.component';
import { SsoCallbackComponent } from './components/sso-callback/sso-callback.component';
import { LoadPolicyComponent } from './components/load-policy/load-policy.component';
import { AuthGuardLoginTimCustomers } from 'app/core/services/auth-guard-login-tim-customers.service';

import { LoginRegisterTimCustomersComponent } from '../checkout/login-register/tim-customers/login-register-tim-customers/login-register-tim-customers.component';


const routes: Routes = [
  { path: 'not-confirmed', component: NotConfirmedComponent },
  { path: 'registrazione', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'load-private-area', component: LoadPolicyComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'activate-account', component: ActivateComponent },
  { path: 'dashboard/user/spree_user/confirmation', component: ActivateComponent }, // TODO: Delete mappa il vecchio url in attesa che cambino i link nelle mail
  { path: 'reset-password', component: ForgotPasswordComponent },

  { path: 'user-access', component: LoginRegisterTimCustomersComponent },
  {
    path: 'users/auth', children: [
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
