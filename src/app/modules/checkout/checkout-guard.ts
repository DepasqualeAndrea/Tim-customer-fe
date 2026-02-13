import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, ActivatedRoute } from '@angular/router';
import { AuthService } from '@services';
import { Observable } from 'rxjs';

@Injectable()
export class CheckoutGuard  {
    constructor(private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService) {

        }

     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
          if (this.authService.loggedIn) {
              return true;
       }
       const basePathCheckout = state.url.toString().startsWith('/checkout') ?
        'checkout' : 'apertura';
       this.router.navigate([basePathCheckout + '/login-register']);
     }
  }
