import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GET_GUEST_TOKEN, GET_TOKEN, parseJwt } from '../models/token-interceptor.model';
import { DataService } from '@services';

@Injectable()
export class SessionIdInterceptor implements HttpInterceptor {
  constructor(private dataService: DataService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = req.headers;
    const token: string = GET_TOKEN() || GET_GUEST_TOKEN();

    if (!headers.has('Session-Id') || headers.get('Session-Id') === '') {
      try {
        if (token) {
          const decodedToken: any = parseJwt(token);
          if (decodedToken && decodedToken.jti) {
            this.dataService.setJti(decodedToken.jti);
          } else {
            console.warn('Decoded token has no jti field.');
          }
        } else {
          console.warn('No token found when setting Session-Id.');
        }
      } catch (error) {
        console.error('Error decoding token in SessionIdInterceptor:', error);
      }
    }

    return next.handle(req);
  }
}
