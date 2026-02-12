import { Injectable } from '@angular/core';
import { AuthGuardLogin } from './auth-guard-login.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { SSOService } from './sso/sso.service';
import { SSOCseService } from './sso/sso-cse.service';


@Injectable()
export class AuthGuardLoginCse extends AuthGuardLogin {

    constructor(
        private ssoCse: SSOCseService,
        public authService: AuthService,
        protected router: Router,
        protected dataService: DataService,
        protected ssoService: SSOService,
        ) {
        super(authService, router, dataService, ssoService);
    }
   
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.ssoService.setService(this.ssoCse);
        return super.canActivate(route, state);
    }
}