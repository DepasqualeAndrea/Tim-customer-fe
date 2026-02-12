import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MotionCloudResponse } from '../../models/claims/motion-cloud-response.model';
import { environment } from '../../../../environments/environment.prod-old';
import { ExternalClaim } from '../../models/claims/external-claim.model';
@Injectable({
  providedIn: 'root'
})
export class ExternalClaimService {
  constructor(
    private http: HttpClient
  ) { }


  getMotionCloudClaimUrl(insuranceId: Number | String, claimdata: ExternalClaim, productCode: string): Observable<MotionCloudResponse> {
    const headers: HttpHeaders = new HttpHeaders({ 'X-Product': productCode });
    return this.http.post<MotionCloudResponse>(environment.API_URL + '/claims/external/motioncloud/' + insuranceId, claimdata, { headers: headers });
  }


createExternalClaim(policy_id: Number | String, claimdata: ExternalClaim): Observable<MotionCloudResponse> {
  const claimCreationRequest = {
    policy_id: policy_id,
    claimdata
  }
  return this.http.post<MotionCloudResponse>(environment.API_URL + '/claims/external/create', claimCreationRequest);
}

}
