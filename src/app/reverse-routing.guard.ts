import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import {Observable} from 'rxjs';
import {DataService} from '@services';

@Injectable({
  providedIn: 'root'
})
export class ReverseRoutingGuard  {

  constructor(private dataService: DataService,
    private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const preventedTenantss = (route.data.preventedTenants || []) as Array<string>;
    const preventedTenants = !!preventedTenantss.find((t) => t === this.dataService.tenantInfo.tenant);
    return preventedTenants ? this.router.navigate(['notfound']) : true;
  }

}
