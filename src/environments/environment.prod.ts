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
  mockAll: false
};