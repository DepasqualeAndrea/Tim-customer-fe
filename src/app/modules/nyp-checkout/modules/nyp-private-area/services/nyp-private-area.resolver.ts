import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NypApiService } from 'app/modules/nyp-checkout/services/api.service';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NypPrivateAreaResolver  {

  constructor(private nypApiService: NypApiService, private nypDataService: NypDataService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (!this.nypDataService.Products$.value || this.nypDataService.Products$.value?.length == 0)
      return this.nypApiService.getProduct().map(() => true);

    return of(true);
  }
}
