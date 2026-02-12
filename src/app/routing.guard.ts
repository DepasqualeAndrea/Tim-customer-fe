import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {DataService} from '@services';

@Injectable({
  providedIn: 'root'
})
export class RoutingGuard implements CanActivate {

  constructor(private dataService: DataService,
              private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const allowedTenants = (route.data.allowedTenants || []) as Array<string>;
    const allowedTenant = !!allowedTenants.find((t) => t === this.dataService.tenantInfo.tenant);
    if (allowedTenant) {
      return true;
    }
    this.router.navigate(['notfound']);
  }

}
