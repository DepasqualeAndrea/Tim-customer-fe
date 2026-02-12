import {ExternalClaimUser} from './external-claim-user.model';

export class ExternalClaimData {
  claim_type: string = "casualty";
  insured: ExternalClaimUser = new ExternalClaimUser();
}
