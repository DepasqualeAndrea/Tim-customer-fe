import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export interface SSOProvider {
    handle(route: ActivatedRouteSnapshot, state: RouterStateSnapshot);
}