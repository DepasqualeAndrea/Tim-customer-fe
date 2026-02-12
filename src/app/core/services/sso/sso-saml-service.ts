import { Injectable } from '@angular/core';
import { CONSTANTS } from 'app/app.constants';
import { SET_TOKEN } from 'app/core/models/token-interceptor.model';
import { SSOContractService } from './sso-contract.service';

@Injectable({ providedIn: 'root' })
export class SSOSamlService extends SSOContractService {

  protected getUserByCode(code: string) {
    {
      this.userService.ssoAuthSaml(code).subscribe((res) => {
        SET_TOKEN(res.token);
        this.nypUserService.getUserDetails(res.id).subscribe(data => {
          delete res.token;
          this.authService.currentUser = res;
          this.authService.loggedUser = data;
          this.authService.loggedIn = data && !!data.email;
          localStorage.setItem('user', JSON.stringify(res));
          this.authService.userTokenVerified = true;
          this.authService.userChangedSource.next(data);
          this.redirectAfterSSOLogin();
        });
      }, (err) => {
        if (err.status === 403) {
          this.router.navigate(['/not-confirmed']);
        } else {
          console.log(err);
          const queryParams = {};
          queryParams[CONSTANTS.SSO_UNEXPECTED_ERROR_PARAM] = true;
          this.router.navigate(['/not-confirmed'], { queryParams });
        }
      });
    }
  }

}
