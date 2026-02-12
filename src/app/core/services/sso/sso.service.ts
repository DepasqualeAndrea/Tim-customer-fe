import { SSOProvider } from './sso-provider.interface';
import { SSOContractService } from './sso-contract.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { SSODefaultService } from './sso-default.service';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { RouterService } from '../router.service';
import { UserService } from '../user.service';



@Injectable({providedIn: 'root'})
export class SSOService implements SSOProvider {
    private ssoService: SSOContractService;
    
    constructor (
        private ssoDefaultService: SSODefaultService
      ) {}

    handle(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if(!this.ssoService)
            this.ssoService = this.ssoDefaultService;
        
        this.ssoService.handle(route, state);
    }

    public setService(service: SSOContractService) {
        this.ssoService = service;
    }

}