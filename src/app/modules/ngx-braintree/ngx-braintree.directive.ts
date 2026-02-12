import {Directive, OnInit, OnDestroy, Renderer2, Inject, Input} from '@angular/core';
import { DOCUMENT } from "@angular/common";

@Directive({
  selector: '[ngxBraintreeDirective]'
})
export class NgxBraintreeDirective implements OnInit, OnDestroy {

  @Input() ngxBraintreeDirective;
  script: any;
  scriptClient: any;
  scriptHostedField: any;
  scriptPayPalCheck: HTMLScriptElement;
  scriptPayPalCheckoutLibray: any;
  scriptDataCollector: any;
  script3DSecure: any;

  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: any) { }

  ngOnInit() {
    if (!this.document.getElementById('drop-min-js-script')) {
      this.script = this.renderer.createElement('script');
      this.script.type = 'text/javascript';
      this.script.src = 'https://js.braintreegateway.com/web/dropin/1.33.4/js/dropin.min.js';
      this.script.id = 'drop-min-js-script';
      this.renderer.appendChild(this.document.body, this.script);
    }

    if (!this.document.getElementById('script-client')) {
      this.scriptClient = this.renderer.createElement('script');
      this.scriptClient.type = 'text/javascript';
      this.scriptClient.id = 'script-client';
      this.scriptClient.src = 'https://js.braintreegateway.com/web/3.87.0/js/client.min.js';
      this.renderer.appendChild(this.document.body, this.scriptClient);
    }

    if (!this.document.getElementById('script-host-fields')) {
      this.scriptHostedField = this.renderer.createElement('script');
      this.scriptHostedField.type = 'text/javascript';
      this.scriptHostedField.id = 'script-host-fields';
      this.scriptHostedField.src = 'https://js.braintreegateway.com/web/3.87.0/js/hosted-fields.min.js';
      this.renderer.appendChild(this.document.body, this.scriptHostedField);
    }

    if (!this.document.getElementById('script-data-collector')) {
      this.scriptDataCollector = this.renderer.createElement('script');
      this.scriptDataCollector.type = 'text/javascript';
      this.scriptDataCollector.id = 'script-data-collector';
      this.scriptDataCollector.src = 'https://js.braintreegateway.com/web/3.87.0/js/data-collector.min.js';
      this.renderer.appendChild(this.document.body, this.scriptDataCollector);
    }

    if (!this.document.getElementById('script-3d-secure')) {
      this.script3DSecure = this.renderer.createElement('script');
      this.script3DSecure.type = 'text/javascript';
      this.script3DSecure.id = 'script-3d-secure';
      this.script3DSecure.src = 'https://js.braintreegateway.com/web/3.87.0/js/three-d-secure.min.js';
      this.renderer.appendChild(this.document.body, this.script3DSecure);
    }

    if (!this.document.getElementById('script-paypal-checkout') ) {
      this.scriptPayPalCheck = this.renderer.createElement('script');
      this.scriptPayPalCheck.type = 'text/javascript';
      this.scriptPayPalCheck.id = 'script-paypal-checkout';
      this.scriptPayPalCheck.src = 'https://js.braintreegateway.com/web/3.87.0/js/paypal-checkout.min.js';
      this.renderer.appendChild(this.document.body, this.scriptPayPalCheck);
    }

    // if (!this.document.getElementById('script-checkout') ) {
    //   this.scriptPayPalCheckoutLibray = this.renderer.createElement('script');
    //   this.scriptPayPalCheckoutLibray.type = 'text/javascript';
    //   this.scriptPayPalCheckoutLibray['log-level'] = 'warn';
    //   this.scriptPayPalCheckoutLibray.id = 'script-checkout';
    //   this.scriptPayPalCheckoutLibray['data-version-4'] = '';
    //   this.scriptPayPalCheckoutLibray.src = 'https://www.paypalobjects.com/api/checkout.js';
    //   this.renderer.appendChild(this.document.body, this.scriptPayPalCheckoutLibray);
    // }
  }

  ngOnDestroy() {
  }
}
