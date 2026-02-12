import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const REDIRECT_AFTER_LOGIN_LOCAL_STORAGE_KEY = 'redirectAfterLogin';
const REDIRECT_FROM_CONTROLLER_LOCAL_STORAGE_KEY = 'redirectFromController'

@Injectable()
export class LoginService {

  constructor(private router: Router) {}

  /**
   * @returns true if user was redirected, false otherwise
   */
  redirectFromLocalStorage(): boolean {
    const redirectUrl = localStorage.getItem(REDIRECT_AFTER_LOGIN_LOCAL_STORAGE_KEY);
    if (redirectUrl) {
      localStorage.removeItem(REDIRECT_AFTER_LOGIN_LOCAL_STORAGE_KEY);
      this.router.navigate([redirectUrl]);
      return true;
    }
    return false;
  }

  setupRedirectAfterLogin(url: string) {
    localStorage.setItem(REDIRECT_AFTER_LOGIN_LOCAL_STORAGE_KEY, url);
  }

  cancelRedirectAfterLogin() {
    localStorage.removeItem(REDIRECT_AFTER_LOGIN_LOCAL_STORAGE_KEY);
  }

  setupRedirectFromController(value: boolean) {
    localStorage.setItem(REDIRECT_FROM_CONTROLLER_LOCAL_STORAGE_KEY, JSON.stringify(value));
  }

  cancelRedirectFromController() {
    localStorage.removeItem(REDIRECT_FROM_CONTROLLER_LOCAL_STORAGE_KEY);
  }
}

