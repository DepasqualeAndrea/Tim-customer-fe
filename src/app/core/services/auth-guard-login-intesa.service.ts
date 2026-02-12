
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { REMOVE_TOKEN } from '../models/token-interceptor.model';
import { AuthGuardLogin } from './auth-guard-login.service';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { SSODefaultService } from './sso/sso-default.service';
import { SSOService } from './sso/sso.service';


@Injectable()
export class AuthGuardLoginIntesa extends AuthGuardLogin {

    constructor(
        private ssoIntesa: SSODefaultService,
        public authService: AuthService,
        protected router: Router,
        protected dataService: DataService,
        protected ssoService: SSOService,
    ) {
        super(authService, router, dataService, ssoService);
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        REMOVE_TOKEN();
        this.authService.userTokenVerified = false;
        this.ssoService.setService(this.ssoIntesa);

        return super.canActivate(route, state);
    }
}