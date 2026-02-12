import { IEnv } from "@NYP/ngx-multitenant-core/lib/environment";

export interface IIENV extends IEnv {
    username?: string;
    password?: string

    timProtezioneCasaCountry?: number;
    timProtezioneCasaProvince?: number;
    timProtezioneCasaCity?: string;
    timProtezioneCasaPostalCode?: number;
    timProtezioneCasaAddress?: string;
    timProtezioneCasaCivicNumber?: string;
    timProtezioneCasaOwnerType?: string;
    timProtezioneCasaBuildingType?: string;

    timBillProtectionTypeDocument?: string,
    timBillProtectionNumberDocument?: string,
    timBillProtectionDocumentIssueDate?: string,
    timBillProtectionDocumentIssuingEntity?: string,
    timBillProtectionStateIssuingDocument?: string,
    timBillProtectionMunicipalityIssuingDocument?: string,
    timBillProtectionPoliticallyExposed?: 'si' | 'no',

    timBillProtectorTypeDocument?: string,
    timBillProtectorNumberDocument?: string,
    timBillProtectorDocumentIssueDate?: string,
    timBillProtectorDocumentIssuingEntity?: string,
    timBillProtectorStateIssuingDocument?: string,
    timBillProtectorMunicipalityIssuingDocument?: string,
    timBillProtectorPoliticallyExposed?: 'si' | 'no',
    timBillProtectorOccupationType?: string,
    timBillProtectorOccupationTime?: string
}