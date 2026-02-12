import { FieldsToRecover, NypCheckoutService } from '@NYP/ngx-multitenant-core';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TIM_CYBER_CONSUMER_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { BehaviorSubject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { TimCyberConsumerServiceModule } from '../tim-cyber-consumer.service-module';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import {AdobeAnalyticsDatalayerService} from '../../../../../core/services/adobe_analytics/adobe-init-datalayer.service';
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

@Injectable({ providedIn: TimCyberConsumerServiceModule })
export class TimCyberConsumerCheckoutService extends FieldToRecover {
  public get InsuranceInfoState$(): BehaviorSubject<InsuranceInfoStates> { return TimCyberConsumerCheckoutService.InsuranceInfoState$; };
  public static readonly InsuranceInfoState$ = new BehaviorSubject<InsuranceInfoStates>('choicePacket');

  public get ChosenPackets$(): BehaviorSubject<IPacketNWarranties | undefined> { return TimCyberConsumerCheckoutService.ChosenPackets$; };
  public static readonly ChosenPackets$ = new BehaviorSubject<IPacketNWarranties | undefined>(undefined);

  public get SelectedPackets(): IPacketChoose { return TimCyberConsumerCheckoutService.SelectedPackets; };
  public static SelectedPackets: IPacketChoose = {
    silverPrice: 1.50,  goldPrice: 4.00, platinumPrice: 7.00
  };

  constructor(private router: Router, private nypDataService: NypDataService, private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService, private kenticoTranslateService: KenticoTranslateService,) {
    super();

    this.nypDataService.CurrentState$
      .pipe(filter(e => !!e))
      .subscribe(state => {
        console.log(TIM_CYBER_CONSUMER_PRODUCT_NAME, state);

        this.kenticoTranslateService.getItem<any>('checkout_cyber_consumer').pipe(take(1)).subscribe(item => {
          if(state == 'insurance-info'){
            const productName = item?.system?.name;
            const stepName = "tim-cyber-consumer scelta pacchetto";
            let digitalData: digitalData = window["digitalData"];
            digitalData.page.category.primaryCategory = productName;
            digitalData.page.pageInfo.pageName = stepName;
            this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
          }
          if(state == 'address'){
            const productName = item?.system?.name;
            const stepName = "tim-cyber-consumer dati anagrafici";
            let digitalData: digitalData = window["digitalData"];
            digitalData.page.category.primaryCategory = productName;
            digitalData.page.pageInfo.pageName = stepName;
            this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
          }
          if(state == 'user-control'){
            const stepName = "tim-cyber-consumer user control";
            let digitalData = window["digitalData"];
            digitalData.page.pageInfo.pageName = stepName;
            this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
          }
          if(state == 'survey'){
            const productName = item?.system?.name;
            const stepName = "tim-cyber-consumer questionario di coerenza";
            let digitalData: digitalData = window["digitalData"];
            digitalData.page.category.primaryCategory = productName;
            digitalData.page.pageInfo.pageName = stepName;
            this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
          }
          if(state == 'consensuses'){
            const productName = item?.system?.name;
            const stepName = "tim-cyber-consumer consensi";
            let digitalData: digitalData = window["digitalData"];
            digitalData.page.category.primaryCategory = productName;
            digitalData.page.pageInfo.pageName = stepName;
            this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
          }
          if(state == 'payment'){
            const stepName = "tim-cyber-consumer pagamento";
            let digitalData = window["digitalData"];
            digitalData.page.pageInfo.pageName = stepName;
            this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
          }
        });
        if (state == 'login-register') {
          const dataOrder = {
            data: {
              order: {
                "line_items_attributes":
                {
                  "0":
                  {
                    "id": this.nypDataService.Order$.value.orderItem[0].id,
                    "insured_is_contractor": false,
                    "cyber-consumer_attributes": this.nypDataService.Order$.value.orderItem[0].insured_item,
                    "variant_id": this.nypDataService.Order$.value.orderItem[0].packetId,
                  }
                }
              },
              state: 'insurance_info',
              version: 'v2',
              fieldToRecover: FieldToRecover.fieldsToRecover,
              productCode: this.nypDataService.CurrentProduct$.value?.code,
            },
            orderNumber: this.nypDataService.Order$.value.orderCode,
          };
          console.log(TIM_CYBER_CONSUMER_PRODUCT_NAME, 'YIN PAYLOAD', JSON.stringify(dataOrder));
          window.parent.postMessage(dataOrder, '*');
          const stepName = "tim-cyber-consumer loginPage";
          let digitalData = window["digitalData"];
          digitalData.page.pageInfo.pageName = stepName;
          this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
        }
        if (state == 'thank-you') {
          let digitalData: digitalData = window['digitalData'];
          digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value;
          digitalData.page.pageInfo.pageName = 'tim-cyber-consumer thankyou';
          this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
        }
        if (window.location.pathname.includes(`/nyp-checkout/${TIM_CYBER_CONSUMER_PRODUCT_NAME}`))
          this.router.navigateByUrl(`/nyp-checkout/${TIM_CYBER_CONSUMER_PRODUCT_NAME}/${state}`);
      });
  }
}

export type PacketsName = PacketsNameEnum.Silver | PacketsNameEnum.Gold | PacketsNameEnum.Platinum;

export enum PacketsNameEnum {
  Silver = 'Silver',
  Gold = 'Gold',
  Platinum = 'Platinum',

}
export type InsuranceInfoStates ='choicePacket'; 
export interface IPacketNWarranties {
  warranties?: { code: number, label: string }[];
  price: number;
  packetCombo?: string;
  packet?: any;
};

export interface IPacketChoose {
  silverPrice: number;
  goldPrice: number;
  platinumPrice: number;
}
