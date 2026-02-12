import { FieldsToRecover, NypCheckoutService } from '@NYP/ngx-multitenant-core';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RouteHash } from 'app/modules/checkout/login-register/tim-customers/login-register-tim-customers/route-hashes.enum';
import { Packet, RecursivePartial } from 'app/modules/nyp-checkout/models/api.model';
import { TIM_PROTEZIONE_VIAGGI_ROAMING_MODULE_NAME, TIM_PROTEZIONE_VIAGGI_ROAMING_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { BehaviorSubject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { TimProtezioneViaggiRoamingServiceModule } from '../tim-protezione-viaggi-roaming.service-module';
import { DataService } from '@services';
import { AdobeAnalyticsDatalayerService } from 'app/core/services/adobe_analytics/adobe-init-datalayer.service';
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

@Injectable({ providedIn: TimProtezioneViaggiRoamingServiceModule })
export class TimProtezioneViaggiRoamingCheckoutService extends FieldToRecover {
  public get InsuranceInfoState$(): BehaviorSubject<InsuranceInfoStates> { return TimProtezioneViaggiRoamingCheckoutService.InsuranceInfoState$; };
  public static readonly InsuranceInfoState$ = new BehaviorSubject<InsuranceInfoStates>('choicePet');

  public get ChosenPackets$(): BehaviorSubject<IPacketNWarranties | undefined> { return TimProtezioneViaggiRoamingCheckoutService.ChosenPackets$; };
  public static readonly ChosenPackets$ = new BehaviorSubject<IPacketNWarranties | undefined>(undefined);

  public get ChosenPacketsName(): string[] { return TimProtezioneViaggiRoamingCheckoutService.ChosenPacketsName; };
  public set ChosenPacketsName(value: string[]) { TimProtezioneViaggiRoamingCheckoutService.ChosenPacketsName = value; };
  public static ChosenPacketsName: string[] = [];

  public get SelectedPackets(): IPacketChoose { return TimProtezioneViaggiRoamingCheckoutService.SelectedPackets; };
  public set SelectedPackets(value: IPacketChoose) { TimProtezioneViaggiRoamingCheckoutService.SelectedPackets = value; };
  public static SelectedPackets: IPacketChoose = {
    smart: false, smartPlus: false, deluxe: false, smartWarranties: [], deluxeWarranties: [], smartPlusWarranties: [], smartPrice: 4.90, deluxePrice: 24.40, smartPlusPrice: 19.90,
    currentPacket: undefined
  };

  constructor(
    private router: Router, 
    private nypDataService: NypDataService, 
    private dataService: DataService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService, 
    private kenticoTranslateService: KenticoTranslateService
  ) {
    super();

    this.nypDataService.CurrentState$
      .pipe(filter(e => !!e))
      .subscribe(state => {
        console.log(TIM_PROTEZIONE_VIAGGI_ROAMING_PRODUCT_NAME, state);
        const fragment = [];
        const fields2recover = TimProtezioneViaggiRoamingCheckoutService.persistFieldToRecover();
        fields2recover.nonStatic.push(
          ['dataService.firstDay', this.dataService.firstDay],
          ['dataService.lastDay', this.dataService.lastDay],
        );

        this.kenticoTranslateService.getItem<any>('tim_protezione_viaggi').pipe(take(1)).subscribe(item => {
          if(state == 'insurance-info'){
            const productName = item?.system?.name;
            const stepName = "tim-protezione-roaming scelta pacchetto";
            let digitalData = window["digitalData"];
            digitalData.page.category.primaryCategory = productName;
            digitalData.page.pageInfo.pageName = stepName;
            this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
          }
          if(state == 'address'){
            const productName = item?.system?.name;
            const stepName = "tim-protezione-roaming dati anagrafici";
            let digitalData: any = window["digitalData"];
            digitalData.page.category.primaryCategory = productName;
            digitalData.page.pageInfo.pageName = stepName;
            this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
          }
          if(state == 'user-control'){
            const stepName = "tim-protezione-roaming user control";
            let digitalData = window["digitalData"];
            digitalData.page.pageInfo.pageName = stepName;
            this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
          }
          if(state == 'survey'){
            const productName = item?.system?.name;
            const stepName = "tim-protezione-roaming questionario di coerenza";
            let digitalData = window["digitalData"];
            digitalData.page.category.primaryCategory = productName;
            digitalData.page.pageInfo.pageName = stepName;
            this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
          }
          if(state == 'consensuses'){
            const productName = item?.system?.name;
            const stepName = "tim-protezione-roaming consensi";
            let digitalData = window["digitalData"];
            digitalData.page.category.primaryCategory = productName;
            digitalData.page.pageInfo.pageName = stepName;
            this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
          }
          if(state == 'payment'){
            const stepName = "tim-protezione-roaming pagamento";
            let digitalData = window["digitalData"];
            digitalData.page.pageInfo.pageName = stepName;
            this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
          }
        });

        if (state == 'login-register') {
          const dataOrder = {
            data: {
              "order": {
                "line_items_attributes": {
                  "0": this.nypDataService.Order$.value.orderItem[0].insured_item
                }
              },
              state: 'insurance_info',
              version: 'v2',
              fieldToRecover: fields2recover,
              productCode: this.nypDataService.CurrentProduct$.value?.code,
            },
            orderNumber: this.nypDataService.Order$.value.orderCode,
          };
          console.log(TIM_PROTEZIONE_VIAGGI_ROAMING_PRODUCT_NAME, 'YIN PAYLOAD', JSON.stringify(dataOrder));
          window.parent.postMessage(dataOrder, '*');

          fragment.push({ fragment: RouteHash['LOGIN'], skipLocationChange: true });
          const stepName = "tim-protezione-roaming loginPage";
          let digitalData = window["digitalData"];
          digitalData.page.pageInfo.pageName = stepName;
          this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
        }
        if (state == 'thank-you') {
          let digitalData: any = window['digitalData'];
          digitalData.page.pageInfo.pageName = `tim-protezione-roaming - thank-you`;
          this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
        }
        // Prevent navigation when the current location is outside the current module
        if (window.location.pathname.includes(`/nyp-checkout/${TIM_PROTEZIONE_VIAGGI_ROAMING_MODULE_NAME}`))
          this.router.navigate([`/nyp-checkout/${TIM_PROTEZIONE_VIAGGI_ROAMING_MODULE_NAME}/${state}`], ...fragment);
      });
  }
}

export type PacketsName = PacketsNameEnum.Smart | PacketsNameEnum.SmartPlus | PacketsNameEnum.Deluxe;

export enum PacketsNameEnum {
  Smart = 'Smart',
  SmartPlus = 'SmartPlus',
  Deluxe = 'Deluxe',

}
export type InsuranceInfoStates = 'choicePet' | 'choicePacket';
export interface IPacketNWarranties {
  warranties: { code: number, label: string }[];
  price: number;
  packetCombo: string;
  packet?: any;
};

export interface IPacketChoose {
  smart: boolean;
  smartPlus: boolean;
  deluxe: boolean;
  smartWarranties: { code: number, label: string, checked: boolean, price: number }[];
  smartPlusWarranties: { code: number, label: string, checked: boolean, price: number }[];
  deluxeWarranties: { code: number, label: string, checked: boolean, price: number }[];
  smartPrice: number;
  deluxePrice: number;
  smartPlusPrice: number;
  // currentPacketConfiguration: { 'Smart': { 'basic': RecursivePartial<Packet>, 'ii': RecursivePartial<Packet>, 'photovoltaic': RecursivePartial<Packet> }, 'Deluxe': { 'basic': RecursivePartial<Packet>, 'ii': RecursivePartial<Packet>, 'photovoltaic': RecursivePartial<Packet> }, 'Photovoltaic': { 'basic': RecursivePartial<Packet> } }
  currentPacket: RecursivePartial<Packet>;
}
