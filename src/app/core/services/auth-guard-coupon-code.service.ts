import { CanActivate } from '@angular/router/src/utils/preactivation';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export class AuthGuardCouponCodeService implements CanActivate {
    path: ActivatedRouteSnapshot[];
    route: ActivatedRouteSnapshot;
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
      ) {
        return true;
      }

}