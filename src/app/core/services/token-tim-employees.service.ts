import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { TOKEN_QUERY_LOCAL_STORAGE_KEY } from '../models/token-interceptor-tim.model';
import { Injectable } from "@angular/core";


@Injectable()
export class TokenTimEmployeesService {
  
  isUserAuthorizedToSeeThisPage(): Observable<boolean> {
    const savedTokeAfterSSO = localStorage.getItem(TOKEN_QUERY_LOCAL_STORAGE_KEY);
    return of(!!savedTokeAfterSSO);
  }

  
  
}
