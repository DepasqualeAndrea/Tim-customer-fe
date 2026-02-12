import { FieldsToRecover, NypCheckoutService } from '@NYP/ngx-multitenant-core';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RouteHash } from 'app/modules/checkout/login-register/tim-customers/login-register-tim-customers/route-hashes.enum';
import { TIM_EHEALTH_QUIXA_STANDARD_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { BehaviorSubject } from 'rxjs';
import { filter, map, mergeMap, take } from 'rxjs/operators';
import { TimEhealthQuixaStandardServiceModule } from '../tim-ehealth-quixa-standard.service-module';
import { TimEhealthQuixaStandardApiService } from './api.service';
import { NypApiService } from 'app/modules/nyp-checkout/services/api.service';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { AdobeAnalyticsDatalayerService } from '../../../../../core/services/adobe_analytics/adobe-init-datalayer.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';

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

@Injectable({ providedIn: TimEhealthQuixaStandardServiceModule })
export class TimEhealthQuixaStandardCheckoutService extends FieldToRecover {
  public get InsuranceInfoState$(): BehaviorSubject<InsuranceInfoStates> { return TimEhealthQuixaStandardCheckoutService.InsuranceInfoState$; };
  public static readonly InsuranceInfoState$ = new BehaviorSubject<InsuranceInfoStates>('insured-documents');

  public get ChosenPackets$(): BehaviorSubject<IPacketNWarranties | undefined> { return TimEhealthQuixaStandardCheckoutService.ChosenPackets$; };
  public static readonly ChosenPackets$ = new BehaviorSubject<IPacketNWarranties | undefined>(undefined);

  public get ChosenPacketsName(): string[] { return TimEhealthQuixaStandardCheckoutService.ChosenPacketsName; };
  public set ChosenPacketsName(value: string[]) { TimEhealthQuixaStandardCheckoutService.ChosenPacketsName = value; };
  public static ChosenPacketsName: string[] = [];

  constructor(
    private router: Router,
    private nypDataService: NypDataService,
    private apiService: TimEhealthQuixaStandardApiService,
    private nypApiService: NypApiService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private kenticoTranslateService: KenticoTranslateService
  ) {
    super();

    this.nypDataService.CurrentState$
      .pipe(filter(e => !!e))
      .subscribe(state => {
        console.log(TIM_EHEALTH_QUIXA_STANDARD_PRODUCT_NAME, state);
        const fragment = [];

        this.kenticoTranslateService.getItem<any>('checkout_ehealth_quixa').pipe(take(1)).subscribe(item => {
          if(state == 'insurance-info'){
            const productName = item?.system?.name;
            const stepName = "La proposta";
            let digitalData: digitalData = window["digitalData"];
            digitalData.page.category.primaryCategory = productName;
            digitalData.page.pageInfo.pageName = stepName;
            this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
          }
          if(state == 'address'){
            const productName = item?.system?.name;
            const stepName = item?.step_address_title?.value;
            let digitalData: digitalData = window["digitalData"];
            digitalData.page.category.primaryCategory = productName;
            digitalData.page.pageInfo.pageName = stepName;
            this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
          }
        });

        if (state == 'login-register') {
          fragment.push({ fragment: RouteHash['LOGIN'] });
          const dataOrder = {
            data: {
              "order": {
                "line_items_attributes": {
                  "0": {
                    "variant_id": this.nypDataService.Order$.value.orderItem[0].packetId,
                    "quantity": 1,
                  }
                },
                "order_attributes": {
                  "product": this.nypDataService.CurrentProduct$.value?.code,
                }
              },
              state: 'insurance_info',
              version: 'v2',
              fieldToRecover: FieldToRecover.fieldsToRecover,
              productCode: this.nypDataService.CurrentProduct$.value?.code,
            },
            orderNumber: this.nypDataService.Order$.value.orderCode,
          };

          console.log(TIM_EHEALTH_QUIXA_STANDARD_PRODUCT_NAME, 'YIN PAYLOAD', JSON.stringify(dataOrder));
          window.parent.postMessage(dataOrder, '*');
        }
        if (state == 'thank-you') {
          let digitalData: digitalData = window['digitalData'];
          digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value;
          digitalData.page.pageInfo.pageName = this.nypDataService.CurrentState$.value;
          this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
        }
        // Prevent navigation when the current location is outside the current module
        if (window.location.pathname.includes(`/nyp-checkout/${TIM_EHEALTH_QUIXA_STANDARD_PRODUCT_NAME}`))
          this.router.navigate([`/nyp-checkout/${TIM_EHEALTH_QUIXA_STANDARD_PRODUCT_NAME}/${state}`], ...fragment);
      });
  }
}

export type InsuranceInfoStates = 'insured-documents' | 'insurance-destination';
export interface IPacketNWarranties {
  warranties: { code: number, label: string }[];
  price: number;
  packetCombo: string;
};
