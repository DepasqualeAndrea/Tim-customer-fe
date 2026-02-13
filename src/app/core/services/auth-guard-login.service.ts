import {Injectable} from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {AuthService} from './auth.service';
import {DataService} from './data.service';
import { map } from 'rxjs/operators';
import { SSOService } from './sso/sso.service';


@Injectable()
export class AuthGuardLogin  {

  constructor(
    public authService: AuthService,
    protected router: Router,
    protected dataService: DataService,
    protected ssoService: SSOService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const loginReq = (this.dataService.tenantInfo || {}).loginRequired;
    const ssoRequired = (this.dataService.tenantInfo || {}).sso.required;
    return this.authService.userChangedSource.pipe(map(() => {
      if (this.authService.userTokenVerified) {
        return true;
      } else if (ssoRequired) {
        this.ssoService.handle(route, state);
      } else if (this.authService.loggedIn || !this.authService.loggedIn && !loginReq) {
        return true;
      } else if (!this.authService.loggedIn && !!loginReq) {
        this.router.navigate(['/login'], {
          queryParams: {
            return: state.url
          }
        });
      } else if (this.router.url.includes('payment-callback-done')) {
        this.router.navigate(['/login'], {
          queryParams: {
            return: state.url
          }
        });
      }
    }));
  }
}
