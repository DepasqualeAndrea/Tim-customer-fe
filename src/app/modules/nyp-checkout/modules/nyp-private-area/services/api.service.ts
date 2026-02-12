import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IOrderResponse, RecursivePartial, ViaggiRoamingInsuredItems } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrivateAreaApiService {
  private readonly PATHS = {
    GET_ORDER_ID: '/api/latest/orderId/',
    CREATE_EXTERNAL_CLAIM: '/api/v1/claims/external/create'
  }

  constructor(
    private httpClient: HttpClient,
    private nypDataService: NypDataService,
  ) { }

  public getOrderById(idOrder: number): Observable<RecursivePartial<IOrderResponse<ViaggiRoamingInsuredItems>>> {
    return this.httpClient.get<{ data: RecursivePartial<IOrderResponse<ViaggiRoamingInsuredItems>> }>(this.PATHS.GET_ORDER_ID + idOrder)
      .pipe(
        map(response => response.data),
        tap(response => this.nypDataService.Order$.next(response)),
      );
  }

  public createExternalClaim(policy, templateName): Observable<{ nome_file: string; file: string; }> {
    const d = new Date();

    const claimCreationRequest = {
      "policyId": policy.id,
      "date": `${d.getFullYear()}-${d.getMonth() + 1}-`+`${d.getDate()}`.padStart(2,'0'), //"2024-12-01",//SE PRESENTE DA FIGMA
      "message": "",//SE PRESENTE DA FIGMA
      "templateName": templateName
    }
    return this.httpClient.post<any>(this.PATHS.CREATE_EXTERNAL_CLAIM, claimCreationRequest);
  }
}
