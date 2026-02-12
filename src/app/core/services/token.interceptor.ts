import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { KenticoTranslateService } from '../../modules/kentico/data-layer/kentico-translate.service';
import {GET_GUEST_TOKEN, GET_TOKEN} from '../models/token-interceptor.model';
import { AuthService } from './auth.service';
import { DataService } from './data.service';

const EXPIRED_TOKEN_ERROR_MESSAGE = 'Il token è scaduto';


@Injectable({ providedIn: 'root' })
export class TokenInterceptor implements HttpInterceptor {
  private allowedHeaders: string[] = ['X-Product'];
  private readonly genertelQuoteError: RegExp = /genertel_quote/;

  constructor(@Inject(Injector) private injector: Injector, private dataService: DataService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = GET_TOKEN() || GET_GUEST_TOKEN();
    let jti: any;
    this.dataService.getJti().subscribe((data) => {
      jti = data;
    });

    const headers = {
      ['Accept']: 'application/json, text/plain',
      ['Cache-Control']: 'no-cache',
      ['Session-Id']: jti
    };

    if (token)
      headers['Authorization'] = 'Bearer ' + token;

    this.allowedHeaders.forEach(headerName => {
      const headerValue: string = request.headers.get(headerName);
      if (!!headerValue) {
        Object.assign(headers, { [headerName]: headerValue });
      }
    });
    request = request.clone({ setHeaders: headers });
    return next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse) {
        /*
            Logout will be called if 403 and token is expired or when 401 has been received and a logout is required for that
         */
        if (error.status == 401 && request.url !== "/api/v1/auth/login") {
          this.injector.get(AuthService).logout();
          this.injector.get(KenticoTranslateService).getItem<any>('toasts.not_authorized').subscribe(message => {
            this.injector.get(ToastrService).error(message.value);
          });
        }
        /* if (error.status === 422 && this.isErrorGenertelQuote(error.error.provider_error)) {
          this.injector.get(KenticoTranslateService).getItem<any>('genertel_quote').subscribe(message => {
            this.injector.get(ToastrService).error(message.text.value, null, { disableTimeOut: true });
          });
        } */
      }
      return Observable.throwError(error);
    }));
  }

  private isErrorGenertelQuote(message: string): boolean {
    return this.genertelQuoteError.test(message);
  }
}
