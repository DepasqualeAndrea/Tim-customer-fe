
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { REMOVE_TOKEN } from '../models/token-interceptor.model';
import { AuthGuardLogin } from './auth-guard-login.service';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { SSOSTimEmployeesService } from './sso/sso-tim-employees.service';
import { SSOService } from './sso/sso.service';

@Injectable()
export class AuthGuardLoginTimEmployees extends AuthGuardLogin {
    constructor(
        private ssoTimEmployees: SSOSTimEmployeesService,
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
        this.ssoService.setService(this.ssoTimEmployees);
        return super.canActivate(route, state);
    }
}