import { FieldsToRecover, NypCheckoutService } from '@NYP/ngx-multitenant-core';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RouteHash } from 'app/modules/checkout/login-register/tim-customers/login-register-tim-customers/route-hashes.enum';
import { TIM_BILL_PROTECTOR_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { BehaviorSubject } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { TimBillProtectorServiceModule } from '../tim-bill-protector.service-module';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import {AdobeAnalyticsDatalayerService} from '../../../../../core/services/adobe_analytics/adobe-init-datalayer.service';

class FieldToRecover {
  public static fieldsToRecoverKeys = {
    nonStatic: [],
    static: [],
  };

  public static get fieldsToRecover(): FieldsToRecover { return JSON.parse(localStorage.getItem('fieldToRecover')); }
  public static set fieldsToRecover(fields: FieldsToRecover) { localStorage.setItem('fieldToRecover', JSON.stringify(fields || { nonStatic: [], static: [] })); }

  public static persistFieldToRecover(): FieldsToRecover {
    const fieldsToRecover = {
      nonStatic: FieldToRecover.fieldsToRecoverKeys.nonStatic.map(attribute => {
        const value = attribute.includes('$') ? this[attribute].value : this[attribute]
        return [attribute, value];
      }),
      static: [], //this.fieldsToRecoverKeys.static.map(attribute => [attribute, DataService[attribute]]),
    };

    FieldToRecover.fieldsToRecover = fieldsToRecover;
    NypCheckoutService.FIELD_TO_RECOVER = fieldsToRecover;
    return fieldsToRecover;
  }
  public static loadFieldToRecover(destroy: boolean = true): FieldsToRecover {
    if (!this.hasFieldToRecover()) return;

    const fieldsToRecover = FieldToRecover.fieldsToRecover;
    NypCheckoutService.FIELD_TO_RECOVER = fieldsToRecover;

    (fieldsToRecover.nonStatic || [])?.forEach(([k, v]) => {
      if (k?.includes('$'))
        this[k]?.next(v);
      else
        this[k] = v;
    });
    //(fieldsToRecover.static || [])?.forEach(([k, v]) => DataService[k] = v);

    if (destroy) localStorage.removeItem('fieldToRecover');

    return fieldsToRecover;
  }

  public static hasFieldToRecover() {
    return !!localStorage.getItem('fieldToRecover');
  }
}

@Injectable({ providedIn: TimBillProtectorServiceModule })
export class TimBillProtectorCheckoutService extends FieldToRecover {
  public get InsuranceInfoState$(): BehaviorSubject<InsuranceInfoStates> { return TimBillProtectorCheckoutService.InsuranceInfoState$; };
  public static readonly InsuranceInfoState$ = new BehaviorSubject<InsuranceInfoStates>('packet-selection');

  public get ChosenPackets$(): BehaviorSubject<IPacketNWarranties | undefined> { return TimBillProtectorCheckoutService.ChosenPackets$; };
  public static readonly ChosenPackets$ = new BehaviorSubject<IPacketNWarranties | undefined>({packet: {}, warranties: [], price: null});

  public get ChosenPacketsName(): string[] { return TimBillProtectorCheckoutService.ChosenPacketsName; };
  public set ChosenPacketsName(value: string[]) { TimBillProtectorCheckoutService.ChosenPacketsName = value; };
  public static ChosenPacketsName: string[] = [];

  constructor(private router: Router, private nypDataService: NypDataService, private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService) {
    super();

    this.nypDataService.CurrentState$
      .pipe(filter(e => !!e))
      .subscribe(state => {
        console.log(TIM_BILL_PROTECTOR_PRODUCT_NAME, state);
        const fragment = [];

        if (state == 'login-register') {
          fragment.push({ fragment: RouteHash['LOGIN'] });
          const dataOrder = {
            data: {
              order: this.nypDataService.Order$.value,
              state: 'insurance_info',
              fieldToRecover: FieldToRecover.fieldsToRecover,
              productCode: this.nypDataService.CurrentProduct$.value?.code,
            },
            orderNumber: this.nypDataService.Order$.value.orderCode,
          };
          console.log(TIM_BILL_PROTECTOR_PRODUCT_NAME, 'YIN PAYLOAD', JSON.stringify(dataOrder));
          window.parent.postMessage(dataOrder, '*');
        }
        if (state == 'thank-you') {
          let digitalData: digitalData = window['digitalData'];
          digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value;
          digitalData.page.pageInfo.pageName = this.nypDataService.CurrentState$.value;
          this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
        }
        // Prevent navigation when the current location is outside the current module
        if (window.location.pathname.includes(`/nyp-checkout/${TIM_BILL_PROTECTOR_PRODUCT_NAME}`))
          this.router.navigate([`/nyp-checkout/${TIM_BILL_PROTECTOR_PRODUCT_NAME}/${state}`], ...fragment);
      });
  }
}

export type InsuranceInfoStates = 'insured-documents' | 'insurance-destination' | 'packet-selection';
export interface IPacketNWarranties {
  packet: any;
  warranties: any;
  price: number;
}
