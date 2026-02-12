import { Injectable } from '@angular/core';
import { SSOContractService } from './sso-contract.service';

import { NypUserService } from '@NYP/ngx-multitenant-core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '@model';
import { AuthService, CheckoutService, UserService } from '@services';
import { CONSTANTS } from 'app/app.constants';
import { SET_TOKEN } from 'app/core/models/token-interceptor.model';
import { Stack } from 'app/shared/data-structures/stack.model';
import { RouterService } from '../router.service';

interface SSOStrategy {
  call(): void;
}

class Response200 implements SSOStrategy {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private routerService: RouterService,
    private sso: SSOCseService,
    private router: Router) {
  }

  call(): void {
    throw new Error("call")
  }


}

class Response422 implements SSOStrategy {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private routerService: RouterService,
    private sso: SSOCseService,
    private router: Router) {
  }

  call(): void {
    throw new Error("call")

  }
}


@Injectable({ providedIn: 'root' })
export class SSOCseService extends SSOContractService {
  dataStack: Stack<any> = new Stack<any>();
  private ssoStrategy: SSOStrategy;
  private isTesting = false;					// Set to true for mocked calls

  constructor(
    protected authService: AuthService,
    protected router: Router,
    protected routerService: RouterService,
    protected userService: UserService,
    protected nypUserService: NypUserService,
    private http: HttpClient,
    protected checkoutService: CheckoutService
  ) {
    super(authService, router, routerService, userService, nypUserService, checkoutService);
  }

  public confirmUser(user: User): void {
    throw new Error("confirmUser")
  }

  protected getUserByCode(code: string) {
    if (this.isTesting) {
      this.ssoStrategy = new Response422(this.http, this.authService, this.routerService, this, this.router);
      this.ssoStrategy.call();
    } else {
      // this.printDecodedCode(code);
      this.auth(code);
    }
  }

  private printDecodedCode(code: string) {
    this.dataStack.push(code);
    this.router.navigate(['/cse/jwt-code']);
  }

  private auth(code: string) {
    this.nypUserService.ssoAuth(code).subscribe((res) => {
      this.handleAuthRes(res);
    }, (err) => {
      if (err.status === 403) {
        this.router.navigate(['/not-confirmed']);

      }
      else {
        console.log(err);
        const queryParams = {};
        queryParams[CONSTANTS.SSO_UNEXPECTED_ERROR_PARAM] = true;
        this.router.navigate(['/not-confirmed'], { queryParams });
      }
    });
  }

  private handleAuthRes(res: any) {
    SET_TOKEN(res.token);
    this.nypUserService.getUserDetails(res.id).subscribe(
      data => {
        delete res.token;
        this.authService.currentUser = res;
        this.authService.loggedUser = data;
        this.authService.loggedIn = data && !!data.email;
        localStorage.setItem('user', JSON.stringify(res));
        this.authService.userTokenVerified = true;
        this.authService.userChangedSource.next(data);
        this.redirectAfterSSOLogin();
      });
  }
}
