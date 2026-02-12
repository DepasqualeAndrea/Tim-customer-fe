import { Injectable } from '@angular/core';
import { DataService } from '@services';
import { GTMModelTemplate } from '../../models/gtm/gtm-template.model';
import { gtm_settings, GTMTrigger, GTMSettings, EcommerceType } from 'app/core/models/gtm/gtm-settings.model';

@Injectable({
  providedIn: 'root'
})
export class GtmInitDataLayerService {
  /* Configuration */
  private developmentMode = false;
  private GTM_TEST = 'GTM-NMWCRCH';
  private resetDLBeforePush = true;

  /* Data */
  private gtmCode: string = null;
  private isLoaded = false;
  initialTemplate: GTMModelTemplate;

  private browserGlobals = {
    windowRef(): any {
      return window;
    },
    documentRef(): any {
      return document;
    }
  };

  constructor(private dataService: DataService) {
  }


  public initGtm() {
    const tenant = this.dataService.getTenantInfo();

    if (this.developmentMode) {
      // Force using gtm development tag manager
      this.gtmCode = this.GTM_TEST;
    } else if (!!tenant && !!tenant.gtm) {
      // set GTM code from DB
      this.gtmCode = tenant.gtm.gtmCode;
    }

    // Load initial template from DB if it exists.
    if (!!tenant && !!tenant.gtm && !!tenant.gtm.template) {
      this.initialTemplate = Object.assign({}, tenant.gtm.template);
    }

    if (!!tenant && !!tenant.gtm && !!tenant.gtm.triggers) {
      const routingFlag: boolean = tenant.gtm.triggers.routing;
      const eventsFlag: boolean = tenant.gtm.triggers.events;
      const serviceFlag: boolean = tenant.gtm.triggers.service;

      gtm_settings.triggers.set(GTMTrigger.Routing, routingFlag);
      gtm_settings.triggers.set(GTMTrigger.Events, eventsFlag);
      gtm_settings.triggers.set(GTMTrigger.Service, serviceFlag);
    }

    if (!!tenant && !!tenant.gtm && !tenant.gtm.resetDLBeforePush) {
      this.resetDLBeforePush = tenant.gtm.resetDLBeforePush;
    }

    if (!!tenant && !!tenant.gtm && !!tenant.gtm.ecommerceType && Object.values(EcommerceType).includes(tenant.gtm.ecommerceType)) {
      gtm_settings.type = tenant.gtm.ecommerceType;
    }

    // Add needed nodes and scripts to the page
    this.addGtmToDom();

  }


  public getDataLayer(): any[] {
    const window = this.browserGlobals.windowRef();
    window['dataLayer'] = window['dataLayer'] || [];
    return window['dataLayer'];
  }

  public addGtmToDom() {
    if (!this.gtmCode) {
      return;
    }

    const doc = this.browserGlobals.documentRef();
    this.pushOnDataLayer({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });

    const gtmScript = doc.createElement('script');
    gtmScript.id = 'GTMscript';
    gtmScript.async = true;
    gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=' + this.gtmCode;
    doc.head.insertBefore(gtmScript, doc.head.firstChild);

    const ifrm = doc.createElement('iframe');
    ifrm.setAttribute('src', 'https://www.googletagmanager.com/ns.html?id=' + this.gtmCode);
    ifrm.style.width = '0';
    ifrm.style.height = '0';
    ifrm.style.display = 'none';
    ifrm.style.visibility = 'hidden';

    const noscript = doc.createElement('noscript');
    noscript.id = 'GTMiframe';
    noscript.appendChild(ifrm);

    doc.body.insertBefore(noscript, doc.body.firstChild);
    this.isLoaded = true;
  }

  public setAdStorageConsent(enabled: boolean, update: boolean = false) {
    this.getDataLayer().push('consent', update ? 'update' : 'default', {
      'ad_storage': enabled ? 'granted' : 'denied'
    });
  }

  public setAnalyticsStorageConsent(enabled: boolean, update: boolean = false) {
    this.getDataLayer().push('consent', update ? 'update' : 'default', {
      'analytics_storage': enabled ? 'granted' : 'denied'
    });
  }

  public pushTag(item: object) {
    if (!this.isLoaded) {
      this.addGtmToDom();
    }
    if (this.isLoaded) {
      this.pushOnDataLayer(item);
    }
  }

  public preventivatoreCustomTags(evt: {vpv: string, vpvt: string}) {
    if (this.isLoaded) {
      const dataLayer = this.getDataLayer();
      const {vpv, vpvt} = evt;
      const pushableEvent = {
        event: 'virtualPageView',
        vpv,
        vpvt,
        prevName: 'Preventivatore-sci'
      };
      dataLayer.push(pushableEvent);
    }
  }

  private pushOnDataLayer(obj: object) {
    const dataLayer = this.getDataLayer();
    if (this.resetDLBeforePush) {
      dataLayer.splice(0, dataLayer.length);
    }
    dataLayer.push(obj);
  }
}
