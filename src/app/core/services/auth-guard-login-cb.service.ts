import { Injectable } from '@angular/core';
import { AuthGuardLogin } from './auth-guard-login.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { SSOService } from './sso/sso.service';
import { SSODefaultService } from './sso/sso-default.service';


@Injectable()
export class AuthGuardLoginCB extends AuthGuardLogin {

    constructor(
        private ssoCB: SSODefaultService,
        public authService: AuthService,
        protected router: Router,
        protected dataService: DataService,
        protected ssoService: SSOService,
        ) {
        super(authService, router, dataService, ssoService);
    }
   
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.ssoCB.urlAfterTokenRedirect.push(this.dataService.tenantInfo.baseUrl);
        this.ssoService.setService(this.ssoCB);
        return super.canActivate(route, state);
    }
}