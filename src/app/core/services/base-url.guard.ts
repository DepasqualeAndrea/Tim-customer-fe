import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, RouteConfigLoadEnd, NavigationEnd } from '@angular/router';
import { DataService } from './data.service';
import { RouterService } from './router.service';

@Injectable()
export class BaseUrlGuard implements CanActivate {

  constructor(
    private dataService: DataService,
    private routerService: RouterService,
  ) {}


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.dataService.tenantInfo.baseUrl && state.url.split('?')[0] === '/') {
      this.routerService.navigateBaseUrl();
    }
    return true;
  }

}
