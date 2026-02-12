import { FieldsToRecover, NypCheckoutService } from '@NYP/ngx-multitenant-core';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RouteHash } from 'app/modules/checkout/login-register/tim-customers/login-register-tim-customers/route-hashes.enum';
import { TIM_SPORT_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { BehaviorSubject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { TimSportServiceModule } from '../tim-sport.service-module';
import { AdobeAnalyticsDatalayerService } from 'app/core/services/adobe_analytics/adobe-init-datalayer.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';

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

@Injectable({ providedIn: TimSportServiceModule })
export class TimSportCheckoutService extends FieldToRecover {
  public get InsuranceInfoState$(): BehaviorSubject<InsuranceInfoStates> { return TimSportCheckoutService.InsuranceInfoState$; };
  public static readonly InsuranceInfoState$ = new BehaviorSubject<InsuranceInfoStates>('insured-documents');

  public get ChosenPackets$(): BehaviorSubject<IPacketNWarranties | undefined> { return TimSportCheckoutService.ChosenPackets$; };
  public static readonly ChosenPackets$ = new BehaviorSubject<IPacketNWarranties | undefined>(undefined);

  public get ChosenPacketsName(): string[] { return TimSportCheckoutService.ChosenPacketsName; };
  public set ChosenPacketsName(value: string[]) { TimSportCheckoutService.ChosenPacketsName = value; };
  public static ChosenPacketsName: string[] = [];

  constructor(
    private router: Router, 
    private nypDataService: NypDataService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private kenticoTranslateService: KenticoTranslateService,
  ) {
    super();

    this.nypDataService.CurrentState$
      .pipe(filter(e => !!e))
      .subscribe(state => {
        console.log(TIM_SPORT_PRODUCT_NAME, state);
        const fragment = [];

        this.kenticoTranslateService.getItem<any>('tim_sport').pipe(take(1)).subscribe(item => {
          if(state == 'insurance-info'){
            const productName = item?.system?.name;
            const stepName = "tim-sport scelta pacchetto";
            let digitalData: digitalData = window["digitalData"];
            digitalData.page.category.primaryCategory = productName;
            digitalData.page.pageInfo.pageName = stepName;
            this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
          }
          if(state == 'address'){
            const stepName = "tim-sport scelta dati anagrafici";
            let digitalData: digitalData = window["digitalData"];
            digitalData.page.pageInfo.pageName = stepName;
            this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
          }

          if(state == 'user-control'){
            const stepName = "tim-sport user control";
            let digitalData: digitalData = window["digitalData"];
            digitalData.page.pageInfo.pageName = stepName;
            this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
          }
        });

        if(state == 'survey'){
          const stepName = "tim-sport questionario di coerenza";
          let digitalData: digitalData = window["digitalData"];
          digitalData.page.pageInfo.pageName = stepName;
          this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
        }

        if(state == 'payment'){
          const stepName = "tim-sport pagamento";
          let digitalData: digitalData = window["digitalData"];
          digitalData.page.pageInfo.pageName = stepName;
          this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
        }
        
        if (state == 'login-register') {
          const dataOrder = {
            data: {
              order: this.nypDataService.Order$.value,
              state: 'insurance_info',
              fieldToRecover: FieldToRecover.fieldsToRecover,
              productCode: this.nypDataService.CurrentProduct$.value?.code,
            },
            orderNumber: this.nypDataService.Order$.value.orderCode,
          };
          console.log(TIM_SPORT_PRODUCT_NAME, 'YIN PAYLOAD', JSON.stringify(dataOrder));
          window.parent.postMessage(dataOrder, '*');
          const stepName = "tim-sport loginPage";
          let digitalData: digitalData = window["digitalData"];
          digitalData.page.pageInfo.pageName = stepName;
          this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
        }

        if (state == 'thank-you') {
          let digitalData: digitalData = window['digitalData'];
          digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value;
          digitalData.page.pageInfo.pageName = `${this.nypDataService.CurrentState$.value} - thank-you`;
          this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
        }
        // Prevent navigation when the current location is outside the current module
        if (window.location.pathname.includes(`/nyp-checkout/${TIM_SPORT_PRODUCT_NAME}`))
          this.router.navigate([`/nyp-checkout/${TIM_SPORT_PRODUCT_NAME}/${state}`]);
      });
  }
}

export type InsuranceInfoStates = 'insured-documents' | 'insurance-destination';
export interface IPacketNWarranties {
  warranties: { code: number, label: string }[];
  price: number;
  packetCombo: string;
};
