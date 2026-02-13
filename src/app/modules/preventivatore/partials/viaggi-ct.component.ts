import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

import * as _ from 'lodash';
import {ViaggiComponent} from './viaggi.component';
import {RequestCheckout, RequestOrder} from '../../../core/models/order.model';
import { PreventivatoreConstants } from '../PreventivatoreConstants';
import { finalize } from 'rxjs/operators';
import {ExternalPlatformRequestOrder} from '../../../core/models/externalCheckout/external-platform-request-order.model';
import {Variant} from '@model';

@Component({
    selector: 'app-viaggi-ct',
    templateUrl: './viaggi-ct.component.html',
    styleUrls: ['../preventivatoreCT.component.scss'],
    standalone: false
})
export class ViaggiCtComponent extends ViaggiComponent implements OnInit, OnDestroy  {

  @Input() product;

  areas = null;
  openStartPicker = false;
  openEndPicker = false;
  stringFromDate: string;
  stringToDate: string;
  hoveredDate: NgbDateStruct;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  maxDate: any;
  tomorrow: NgbDateStruct;
  peopleQuantity = 1;
  price = 0;
  area = null;
  startDateError = false;
  endDateError = false;
  startDate ;
  endDate;

  private adformtag: any = {
    placeholderId: 'tenant_adform_id_code',
    customerCode: null,
    valuePage: 'conte_viaggio',
    headScriptOne: {
      // tslint:disable-next-line: max-line-length
      code: 'window._adftrack = Array.isArray(window._adftrack) ? window._adftrack : (window._adftrack ? [window._adftrack] : []);\r\n    window._adftrack.push({\r\n        pm: tenant_adform_id_code,\r\n        divider: encodeURIComponent(\'|\'),\r\n        pagename: encodeURIComponent(\'conte_viaggio\')\r\n    });\r\n    (function () { var s = document.createElement(\'script\'); s.type = \'text\/javascript\'; s.async = true; s.src = \'https:\/\/track.adform.net\/serving\/scripts\/trackpoint\/async\/\'; var x = document.getElementsByTagName(\'script\')[0]; x.parentNode.insertBefore(s, x); })();\r\n',
      id: null
    },
    headScriptTwo: {
      code: '<p style="margin:0;padding:0;border:0;">\r\n        <img src="https:\/\/track.adform.net\/Serving\/TrackPoint\/?pm=tenant_adform_id_code&ADFPageName=conte_viaggio&ADFdivider=|" width="1" height="1" alt="" \/>\r\n    <\/p>',
      id: null
    }
  };



  ngOnInit() {
    this.tomorrow = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
    this.startDate = this.tomorrow;
    this.utm_source_prev = this.route.snapshot.queryParamMap.get('utm_source');
    this.telemarketer = parseInt(this.route.snapshot.queryParamMap.get('telemarketer'), 10);
    this.getArea();
    this.loadAdFormScripts();
  }

  ngOnDestroy() {

    this.removeAdFormScrips();

  }

  removeAdFormScrips() {
    if (document.getElementById(this.adformtag.headScriptOne.id)) {
      this.removeElementById(this.adformtag.headScriptOne.id);
      this.checkScript(this.adformtag.headScriptOne.id);
    }

    if (document.getElementById(this.adformtag.headScriptTwo.id)) {
      this.removeElementById(this.adformtag.headScriptTwo.id);
      this.checkScript(this.adformtag.headScriptTwo.id);
    }

    const scripts = document.querySelectorAll('script[src*="adform"][src*="' + this.adformtag.customerCode + '"]');
    /*
      is not possible use forEach because gives errors in IE.
      use for loop
    */
    for (let i = 0; i < scripts.length; i++) {
      console.log(`Ready for remove external adform script with src ${scripts[i]}`);
      this.removeElementByElem(scripts[i]);
    }

    const iframes = document.querySelectorAll('iframe[src*="adform"][src*="' + this.adformtag.customerCode + '"]');
    for (let i = 0; i < iframes.length; i++) {
      console.log(`Ready for remove external iframe with src ${iframes[i]}`);
      this.removeElementByElem(iframes[i]);
    }


  }

  htmlToElement(html) {
    const template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}



  removeElementById(id) {
    const elem = document.getElementById(id);
    return elem.parentNode.removeChild(elem);
  }

  removeElementByElem(elem) {
    return elem.parentNode.removeChild(elem);
  }

  loadAdFormScripts() {
 // manage ADFORM
     const adform =  this.dataService.tenantInfo.adform;


    if (adform && adform.id) {
      this.adformtag.customerCode = adform.id;
      this.adformtag.headScriptOne.id = `script_${adform.id}_${this.adformtag.valuePage}`;
      this.adformtag.headScriptTwo.id = `noscript_${adform.id}_${this.adformtag.valuePage}`;

      if (!document.getElementById(this.adformtag.headScriptOne.id) && !document.getElementById(this.adformtag.headScriptTwo.id)) {
        const headScriptOne = this.adformtag.headScriptOne.code.replace(this.adformtag.placeholderId, adform.id);
        const headScriptTwo = this.adformtag.headScriptTwo.code.replace(this.adformtag.placeholderId, adform.id);


        const scriptHOne = document.createElement('script');
        scriptHOne.innerHTML  = headScriptOne;
        scriptHOne.id = this.adformtag.headScriptOne.id;
        document.head.appendChild(scriptHOne);

        this.checkScript(scriptHOne.id);

        const scriptHTwo = document.createElement('noscript');
        // scriptHTwo.innerHTML  = headScriptTwo;
        scriptHTwo.appendChild(this.htmlToElement(headScriptTwo));
        scriptHTwo.id = this.adformtag.headScriptTwo.id;
        document.head.appendChild(scriptHTwo);

        this.checkScript(scriptHTwo.id);
      }

    }

  }

  checkScript(id) {

    if (document.getElementById(id)) {
      console.log(`adform script loaded`);
    } else {
      console.log(`adform script removed`);
    }
  }

  get insurablesArray() {
    return Array.apply(null, {length: this.product.maximum_insurable}).map(Number.call, Number);
  }

  setMaxDate() {
    this.maxDate = {
      year: +moment(this.stringFromDate, 'DD/MM/YYYY').add(29, 'days').format('YYYY'),
      month: +moment(this.stringFromDate, 'DD/MM/YYYY').add(29, 'days').format('MM'),
      day: +moment(this.stringFromDate, 'DD/MM/YYYY').add(29, 'days').format('DD')
    };
  }

  checkoutCt() {
    const variant: Variant = this.findVariantType();
    const order: RequestOrder = this.createOrderObj(variant);
    const orderWithUtm = this.checkoutService.addUtmSource(order, this.utm_source_prev, this.telemarketer);

    this.checkoutService.redirectExternalCheckout(orderWithUtm, this.product);
  }

  onStartDateSelection() {
    this.startDate = this.datepicker;
    this.stringFromDate = moment(`${this.datepicker.month}/${this.datepicker.day}/${this.datepicker.year}`, 'MM/DD/YYYY').format('DD/MM/YYYY');
    this.openStartPicker = false;
    this.setPrice();
  }

  onEndDateSelection() {
    this.endDate = this.datepicker;
    this.stringToDate =  moment(`${this.datepicker.month}/${this.datepicker.day}/${this.datepicker.year}`, 'MM/DD/YYYY').format('DD/MM/YYYY');
    this.openEndPicker = false;
    this.setPrice();
  }

  // Find the variant type by checking the area selected and the number of days selected;
  findVariantType() {
    const format = 'DD/MM/YYYY';
    const datesDiff = moment(this.stringToDate, format).diff(moment(this.stringFromDate, format), 'days');
    return this.product.variants
      .filter(v => v.option_values.some(o => o.name === this.area.area))
      .filter(d => d.option_values.find(v => v.option_type_name === 'day').duration > datesDiff)
      .reduce((prev, cur) => {
        const prevDays = (prev.option_values || []).find(v => v.option_type_name === 'day') || {};
        const curDays = cur.option_values.find(v => v.option_type_name === 'day');
        return prevDays.duration < curDays.duration ? prev : cur;
      }, {});
  }

  createOrderObj(variant): RequestOrder {
    return {
      order: {
        line_items_attributes: {
          '0': {
            variant_id: variant.id,
            quantity: this.peopleQuantity,
            start_date: this.stringFromDate.split('/').reverse().join('-'),
            display_expiration_date: this.stringToDate.split('/').reverse().join('-'),
            expiration_date: moment(this.stringToDate, 'DD/MM/YYYY').add(1, 'days').format('YYYY-MM-DD'),
            insurance_info_attributes: {
              axa_destination: parseInt(this.area.country_id, 10)
            }
          }
        }
      }
    }
  };

  toggleSingleDatePicker(toToggle, toClose) {
    this[toClose] = false;
    this[toToggle] = !this[toToggle];
  }
}
