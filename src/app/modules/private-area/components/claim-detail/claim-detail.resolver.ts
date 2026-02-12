import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {InsurancesService} from '@services';
import {map} from 'rxjs/operators';
import {Claims} from '@model';
import {Claim} from '../../private-area.model';
import * as moment from 'moment';

@Injectable()
export class ClaimDetailResolver implements Resolve<Observable<Claim>> {

  constructor(private insurancesService: InsurancesService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Observable<Claim>> | Promise<Observable<Claim>> | Observable<Claim> {
    const id = route.paramMap.get('id');
    const claim = this.insurancesService.getClaimsById(parseInt(id, 10));
    return claim.pipe(
      map(response => this.convertClaim(response))
    );
  }

  convertClaim(claim: Claims): Claim {
    const claimOpenDate = moment(claim.created_at).format('DD/MM/YYYY');
    const claimDate = moment(claim.date).format('DD/MM/YYYY');
    return {
      id: claim.id,
      product: claim.insurance.name,
      claim_date: claimDate,
      claim_open_date: claimOpenDate,
      message: claim.message,
      claim_number: claim.claim_number,
      note: claim.note,
      policy_number: claim.insurance.policy_number,
      docs: claim.attachments
    };
  }
}
