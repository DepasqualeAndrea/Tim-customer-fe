// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare var __karma__: any;
declare var require: any;

// Prevent Karma from running prematurely.
__karma__.loaded = function () {};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false }
}
);
// Then we find all the tests.

const context = require.context('./', true, /.pandemic-pmi\.spec\.ts$/);
context.keys().map(context);
const context1 = require.context('./', true, /.check-user-type\.das\.spec\.ts$/);
context1.keys().map(context1);
const context2 = require.context('./', true, /.enabled-product-links\.spec\.ts$/);
context2.keys().map(context2);
const context3 = require.context('./', true, /.filter-user-flags-by-tag\.spec\.ts$/);
context3.keys().map(context3);
const context4 = require.context('./', true, /.activate-component\.spec\.ts$/);
context4.keys().map(context4);
const context5 = require.context('./', true, /.cost-line-generators\.spec\.ts$/);
context5.keys().map(context5);
const context6 = require.context('./', true, /.sports-spain\.component\.spec$/);
context6.keys().map(context6);
const context7 = require.context('./', true, /.bussines-form\.component\.das\.spec$/);
context7.keys().map(context7);
const context8 = require.context('./', true, /.bank-transfer\.spec$/);
context8.keys().map(context8);
const context9 = require.context('./', true, /.preventivatore-dynamic\.component\.spec\.ts$/);
context9.keys().map(context9);
const context11 = require.context('./', true, /.checkout-linear-stepper-reducer\.spec$/);
context11.keys().map(context11);
const context12 = require.context('./', true, /.upload-excel\.component\.spec$/);
context12.keys().map(context12);
const context13 = require.context('./', true, /.legal-protection\.das\.spec\.ts$/);
context13.keys().map(context13);
const context14 = require.context('./', true, /.quotator-leasys\.component\.spec$/);
context14.keys().map(context14);
const context15 = require.context('./', true, /.discount-code-service\.spec$/);
context15.keys().map(context15);
const context16 = require.context('./', true, /.checkout-step-insurance-info\.spec$/);
context16.keys().map(context16);
const context17 = require.context('./', true, /.activate\.component\.spec\.ts$/);
context17.keys().map(context17);
const context18 = require.context('./', true, /payment-services\.spec\.ts$/);
context18.keys().map(context18);
const context19 = require.context('./', true, /braintree-3d-secure-parameters\.factory\.spec\.ts$/);
context19.keys().map(context19);
const context20 = require.context('./', true, /checkout-step-payment\.component\.spec\.ts$/);
context20.keys().map(context20);
const context21 = require.context('./', true, /policy-detail\.component\.spec\.ts$/);
context21.keys().map(context21);
const context22 = require.context('./', true, /policy-detail-resolver\.spec\.ts$/);
context22.keys().map(context22);
const context23 = require.context('./', true, /support-tim\.component\.spec\.ts$/);
context23.keys().map(context23);
const context24 = require.context('./', true, /quotator-rc-fca\.component\.spec\.ts$/);
context24.keys().map(context24);
const context25 = require.context('./', true, /checkout-step-payment-documents-acceptance\.component\.spec\.ts$/);
context25.keys().map(context25);
const context26 = require.context('./', true, /.sso-contact-service\.spec\.ts$/);
context26.keys().map(context26);

// Finally, start Karma to run the tests.
__karma__.start();
