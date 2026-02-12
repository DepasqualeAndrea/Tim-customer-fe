import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';
import {DataService} from './data.service';
import { map } from 'rxjs/operators';
import { SSODefaultService } from './sso/sso-default.service';

@Injectable()
export class AuthGuardPrivateArea implements CanActivate {

  constructor(
    public authService: AuthService,
    private router: Router,
    private dataService: DataService,
    private ssoService: SSODefaultService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const ssoRequired = (this.dataService.tenantInfo || {}).sso.required;

    return this.authService.userChangedSource.pipe(map(() => {

      if (this.authService.userTokenVerified || this.authService.loggedIn) {
        return true;
      } else if (ssoRequired) {
        this.ssoService.handle(route, state);
      } else if (!this.authService.loggedIn) {
        this.router.navigate(['/login'], {queryParams: route.queryParams});
      }
    }));
  }
}
