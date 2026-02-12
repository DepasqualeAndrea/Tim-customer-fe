export interface Document {
  count?: number;
  policy_number?: number;
  product_name: string;
  related_documents?: RelatedDocuments[];
  status?: string;
}

export interface RelatedDocuments {
  /* Data inside table after selecting a pill */
  upload_date: string;
  file_name: string;
  category: string;
  description: string;
  uniq_category_name: string;
  extension: string;
  link: string;
}

export enum PolicyStatus {
  ACTIVE = 'active',
  VERIFIED = 'verified',
  UNVERIFIED = 'unverified',
  EXPIRED = 'expired',
  CANCELED = 'canceled',
  SUSPENDED = 'suspended'
}
