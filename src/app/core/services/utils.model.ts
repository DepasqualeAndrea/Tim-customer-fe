import { HttpHeaders } from '@angular/common/http';

export interface BlobFileDownloadResponse {
  body: Blob
  headers: HttpHeaders
  ok: boolean
  status: number
  statusText: string
  type: number
  url: string
};

export interface ParsedDocument {
  data: any,
  name: string,
  type: string
};

export interface TaxcodeCalculationRequest {
  firstname: string,
  lastname: string,
  gender: Sex,
  birthdate: string,
  country_name?: string,
  city_name?: string,
  province_code?: string
};

export interface contractorIsAdultRequest {
  birthdate: string,
};

type Sex = 'M' | 'F';