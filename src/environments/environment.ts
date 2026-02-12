// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { IIENV } from '@model';

export const environment: IIENV = {
  production: true,
  callPublicArea: false,
  showVersion: true,
  publicAreaBasePath: 'homepage/',
  VERSION: require('../../package.json').version,
  GATEWAY_URL: '/api/v1',
  KENTICO_API_KEY: '/kentico-api-key/',
  API_URL: '/old-wl/api/v1',
  LEGACY_API_URL: '/old-wl/api/legacy',
  mockTenant: false,
  mockAll: false,

  username: null,
  password: null,
  //Setted to null to permit setting of guest_token in sessionStorage
  // username: 'MNPLGU95A31F839C',
  // password: 'Test1234!',

  timProtezioneCasaCountry: 110,
  timProtezioneCasaProvince: 3675,
  timProtezioneCasaCity: 'Napoli',
  timProtezioneCasaPostalCode: 80126,
  timProtezioneCasaAddress: 'Via via',
  timProtezioneCasaCivicNumber: '91',
  timProtezioneCasaOwnerType: 'Inquilino',
  timProtezioneCasaBuildingType: 'Abitazione principale',
  timBillProtectionTypeDocument: 'Carta d’identità',
  timBillProtectionNumberDocument: 'CA30609AA',
  timBillProtectionDocumentIssueDate: '2020-12-31',
  timBillProtectionDocumentIssuingEntity: 'Comune',
  timBillProtectionStateIssuingDocument: '3664',
  timBillProtectionMunicipalityIssuingDocument: '9995',
  timBillProtectionPoliticallyExposed: 'si',
  timBillProtectorTypeDocument: 'Carta d’identità',
  timBillProtectorNumberDocument: 'CA30609AA',
  timBillProtectorDocumentIssueDate: '2020-12-31',
  timBillProtectorDocumentIssuingEntity: 'Comune',
  timBillProtectorStateIssuingDocument: '3664',
  timBillProtectorMunicipalityIssuingDocument: '9995',
  timBillProtectorPoliticallyExposed: 'si',
  timBillProtectorOccupationType: null,
  timBillProtectorOccupationTime: null
};
