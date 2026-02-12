import { Injectable } from '@angular/core';
import { FieldsToRecover, NypCheckoutService } from '@NYP/ngx-multitenant-core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import {AdobeAnalyticsDatalayerService} from '../../../../../core/services/adobe_analytics/adobe-init-datalayer.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { filter, take } from 'rxjs/operators';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import { NET_CYBER_BUSINESS_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';


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
      static: [], 
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

    if (destroy) localStorage.removeItem('fieldToRecover');

    return fieldsToRecover;
  }

  public static hasFieldToRecover() {
    return !!localStorage.getItem('fieldToRecover');
  }
}

@Injectable({
  providedIn: 'root'
})
export class NetCyberBusinessCheckoutService extends FieldToRecover {

  public get InsuranceInfoState$(): BehaviorSubject<InsuranceInfoStates> { return NetCyberBusinessCheckoutService.InsuranceInfoState$; };
  public static readonly InsuranceInfoState$ = new BehaviorSubject<InsuranceInfoStates>('choicePacket');   
  
  public get ChosenConf$(): BehaviorSubject<any | undefined> { return NetCyberBusinessCheckoutService.ChosenConf$; };
    public static readonly ChosenConf$ = new BehaviorSubject<any | undefined>(undefined);
  
  public get ChosenPackets$(): BehaviorSubject<IPacketNWarranties | undefined> { return NetCyberBusinessCheckoutService.ChosenPackets$; };
    public static readonly ChosenPackets$ = new BehaviorSubject<IPacketNWarranties | undefined>(undefined);

  constructor(private router: Router, private nypDataService: NypDataService, private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService, private kenticoTranslateService: KenticoTranslateService,) { 
    super()

        this.nypDataService.CurrentState$
          .pipe(filter(e => !!e))
          .subscribe(state => {
   
            // WIP, insert right codename from kentico
            this.kenticoTranslateService.getItem<any>('customers_tim_pet').pipe(take(1)).subscribe(item => {
              if(state == 'insurance-info'){
                const productName = item?.system?.name;
                const stepName = item?.proposal_choice_label?.value;
                let digitalData: digitalData = window["digitalData"];
                digitalData.page.category.primaryCategory = productName;
                digitalData.page.pageInfo.pageName = stepName;
                this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
              }
              if(state == 'address'){
                const productName = item?.system?.name;
                const stepName = item?.address_title_mp?.value;
                let digitalData: digitalData = window["digitalData"];
                digitalData.page.category.primaryCategory = productName;
                digitalData.page.pageInfo.pageName = stepName;
                this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
              }
            });
            // WIP -> align data
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
                        "pet_attributes": this.nypDataService.Order$.value.orderItem[0].insured_item,
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
              window.parent.postMessage(dataOrder, '*');
            }
            if (state == 'thank-you') {
              let digitalData: digitalData = window['digitalData'];
              digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value;
              digitalData.page.pageInfo.pageName = this.nypDataService.CurrentState$.value;
              this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
            }
            if (window.location.pathname.includes(`/nyp-checkout/${NET_CYBER_BUSINESS_PRODUCT_NAME}`))
              this.router.navigate([`/nyp-checkout/${NET_CYBER_BUSINESS_PRODUCT_NAME}/${state}`]);
          });
  }

}


export type InsuranceInfoStates = 'choicePacket' | 'paymentSplitSelection';
export interface IPacketNWarranties {
  warranties: { code: number, label: string }[];
  price: number;
  packetCombo: string;
  packet?: any;
};