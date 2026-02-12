import * as Insurance from './insurance.model';

export class ClaimsWrapper {
    claims?: Claims[];
    count?: number;
    current_page?: number;
    pages?: number;
    per_page?: number;
    total_count?: number;
  }

export class Claims {
  id?: number;
  date?: string;
  created_at?: string;
  message?: any;
  claim_number?: string;
  status?: string;
  note?: string;
  policy_number?: string | number;
  insurance?: Insurance.Insurance;
  attachments?: Attachment[];
  data?: any;
}

export class Attachment {
  attachments: string;
}

export class TimClaims {
  claims?: Claims[];
  claim_number?: string;
  claim_date?: string;
  claim_type?: string;
  attachments?: Attachment[];
  }
