// token.service.ts
import { Injectable } from '@angular/core';
import { NypUserService } from '@NYP/ngx-multitenant-core';
import { DataService } from './data.service';
import jwtDecode from "jwt-decode";
import { Observable, throwError } from 'rxjs';
import { mergeMap, tap, catchError, map } from 'rxjs/operators';
import { parseJwt } from '../models/token-interceptor.model';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly KENTICO_TOKEN_KEY = 'kentico_token';
  private readonly TOKEN_KEY = 'token';
  private readonly DEFAULT_USER = { username: 'tchusr29c23d122s', password: 'Password1!' };

  constructor(
    private nypUserService: NypUserService,
    private dataService: DataService
  ) {}

  ensureValidToken(): Promise<boolean> {
    if (this.hasValidTokens()) {
      return Promise.resolve(true);
    }
    return this.refreshToken().toPromise();
  }

  refreshToken(): Observable<boolean> {    
    return this.dataService.getProperties().pipe(
      tap((properties) => {
        this.setKenticoToken(properties?.data?.token);
        localStorage.setItem('guest-login', properties?.data?.token);
        const decodedToken: any = parseJwt(properties?.data?.token);
        this.dataService.setJti(decodedToken.jti)
      }),
      catchError((error) => {
        if (error.status === 401) {
          this.removeTokens();
        }
        return throwError(() => error);
      })
    );
  }

  getKenticoToken(): string | null {
    return localStorage.getItem(this.KENTICO_TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setKenticoToken(token: string): void {
    localStorage.setItem(this.KENTICO_TOKEN_KEY, token);
  }

  isJwtExpired(token: string): boolean {
    try {
      if (!token || token == null || token == undefined) return true;
  
      const decoded = jwtDecode(token);
      if (!decoded.exp) return true;
      const currentTime = Math.floor(Date.now() / 1000);

      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  removeTokens(): void {
    localStorage.removeItem(this.KENTICO_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  hasValidTokens(): boolean {
    return !this.isJwtExpired(this.getKenticoToken()) || !!this.getToken();
  }
}