import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DataService } from '@services';
import { CookieService } from '../cookie.service';
import { digitalData } from './adobe-analytics-data.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';

export type CI360 = any;
export type CI360_EVENT = 'send' | 'attachIdentity';
declare var ci360: CI360;

@Injectable({
  providedIn: 'root'
})
export class AdobeAnalyticsDatalayerService {

  private renderer: Renderer2;

  private browserGlobals = {
    windowRef(): any {
      return window;
    },
    documentRef(): any {
      return document;
    }
  };

  constructor(
    private rendererFactory: RendererFactory2,
    private dataService: DataService,
    private cookieService: CookieService,
    public nypDataService: NypDataService,
    @Inject(DOCUMENT) private doc: Document
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    const cookieConfiguration = this.dataService.tenantInfo.cookieConfiguration;
    const cookieConfigurationEnabled = cookieConfiguration.enabled;
    if (cookieConfigurationEnabled) {
      this.loadCookiePreferences();
    }
  }

  public static ADOBE_LOG(payload: { [key: string]: any }, eventType: CI360_EVENT = 'send'): any {
    console.log('AdobeAnalyticsDatalayerService', JSON.stringify(payload), eventType);

    return ci360(eventType, payload);
  }

  loadCookiePreferences() {
    this.loadTimCookiesScript()
    this.cookieService.acceptNecessaryCookies();

    const form: any = {
      paymentmethod: '',
      mypet_pet_type: '',
      codice_sconto: 'no',
      sci_numassicurati: 0,
      sci_min14: 0,
      sci_polizza: '',
      button_name: ''
    }

    let digitalData: digitalData = this.setDigitalData({}, 1, '', {}, form, 'tim broker', '');
    window['digitalData'] = digitalData;
  }

  private loadTimCookiesScript() {
    const { source } = this.dataService.tenantInfo.cookieConfiguration.scripts
    const cookieScript = this.renderer.createElement('script') as HTMLScriptElement
    cookieScript.src = source
    cookieScript.async = true;
    cookieScript.charset = 'UTF-8'
    cookieScript.type = 'text/javascript'
    const optScript = this.renderer.createElement('script')
    optScript.type = 'text/javascript'
    optScript.text = 'function OptanonWrapper() { }'
    this.renderer.appendChild(this.doc.head, cookieScript)
    this.renderer.appendChild(this.doc.head, optScript)

  }

  public pushAdobeCustomTags(evt: any) {
    window['_satellite'].track("trackpage");
    const dataLayer = this.getDataLayer();
    dataLayer.push(evt);
    window['digitalData'] = evt;
    window['_satellite'].track("trackstep");
  }

  public adobeTrackClick() {
    window['_satellite'].track("track-click");
  }

  public getDataLayer(): any[] {
    const window = this.browserGlobals.windowRef();
    window['dataLayer'] = window['dataLayer'] || [];
    return window['dataLayer'];
  }

  public setDigitalData(product: any, quantity: number, cartId: string, error: any, frm: any, pageType: string, transactionID: string, priceIn: string = '') {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const productName = params.get('product');
    let currentProduct: any = { id: null};

    let data: digitalData = new digitalData();
    let price: string = '';
    if (priceIn !== undefined && priceIn !== '') {
      price = priceIn;
    } else if (this.dataService.getParams().total !== undefined && this.dataService.getParams().total > 0) {
      price = this.dataService.getParams().total;
    } else if (this.dataService.responseOrder !== undefined) {
      price = this.dataService.responseOrder.total + '';
    } else {
      if (product.order !== undefined && product.order.total !== undefined) {
        price = product.order.total;
      } else {
        price = product.price;
      }
    }

    const item = {
      price: price,
      productInfo: {
        productID: product.product_code !== undefined ? product.product_code : product.code,
        productName: product.name || productName
      },
      quantity: quantity
    };

    if(!product.product_code || !product.code){
      this.nypDataService.CurrentProduct$.subscribe((prod) => {
        if(prod){
          item.productInfo.productID = prod.id;
          item.productInfo.productName = prod.code;
        }
      })
    }

    const form = {
      paymentmethod: frm.paymentmethod,
      mypet_pet_type: frm.mypet_pet_type,
      codice_sconto: frm.codice_sconto,
      sci_numassicurati: frm.sci_numassicurati,
      sci_min14: frm.sci_min14,
      sci_polizza: frm.sci_polizza,
      button_name: frm.button_name
    };
    data.cart = { ID: cartId, attributes: { error: { ID: error.id, description: error.descr } }, item: [item], price: { cartTotal: price }, form: form };
    const page: any = {
      attributes: {
        siteArea: 'timbroker',
        webSite: window.location.host,
      },
      category: {
        pageType: pageType,
        primaryCategory: product.name || productName,
      },
      pageInfo: {
        pageName: window.location.pathname,
      },
    };
    data.page = page;
    data.transaction = { transactionID: transactionID };
    return data;
  }
}
