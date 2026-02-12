import {ExternalClaimResidentInfo} from './external-claim-resident-info.model';

export class ExternalClaimUser {
  name: string;
  fiscal_code: string;
  policy_number: string;
  email: string;
  phone: string;
  birth_place: string;
  birth_day: string;
  resident: ExternalClaimResidentInfo = new ExternalClaimResidentInfo();
}
