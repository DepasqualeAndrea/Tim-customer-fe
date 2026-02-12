import { FieldsToRecover, NypCheckoutService } from '@NYP/ngx-multitenant-core';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RouteHash } from 'app/modules/checkout/login-register/tim-customers/login-register-tim-customers/route-hashes.enum';
import { TIM_PROTEZIONE_CASA_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { BehaviorSubject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { IPacketChoose } from '../components/checkout-step-insurance-info/checkout-step-insurance-info.component';
import { TimProtezioneCasaServiceModule } from '../tim-protezione-casa.service-module';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import {AdobeAnalyticsDatalayerService} from '../../../../../core/services/adobe_analytics/adobe-init-datalayer.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';

class FieldToRecover {
  public static fieldsToRecoverKeys = {
    nonStatic: [],
    static: [/* 'CurrentState$', */ 'InsuranceInfoState$', /* 'Order$', 'Products$', 'CurrentProduct$', */ 'ChosenPackets$', 'ChosenPacketsName', 'SelectedPackets',],
  };

  public static get fieldsToRecover(): FieldsToRecover { return JSON.parse(localStorage.getItem('fieldToRecover')); }
  public static set fieldsToRecover(fields: FieldsToRecover) { localStorage.setItem('fieldToRecover', JSON.stringify(fields || { nonStatic: [], static: [] })); }

  public static persistFieldToRecover(): FieldsToRecover {
    const fieldsToRecover = {
      nonStatic: this.fieldsToRecoverKeys.nonStatic.map(attribute => {
        const value = attribute.includes('$') ? this[attribute].value : this[attribute]
        return [attribute, value];
      }),
      static: this.fieldsToRecoverKeys.static.map(attribute => {
        const value = attribute.includes('$') ? TimProtezioneCasaCheckoutService[attribute].value : TimProtezioneCasaCheckoutService[attribute]
        return [attribute, value];
      }),
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
    (fieldsToRecover.static || [])?.forEach(([k, v]) => {
      if (k?.includes('$'))
        TimProtezioneCasaCheckoutService[k]?.next(v);
      else
        TimProtezioneCasaCheckoutService[k] = v;
    });

    if (destroy) localStorage.removeItem('fieldToRecover');

    return fieldsToRecover;
  }

  public static hasFieldToRecover() {
    return !!localStorage.getItem('fieldToRecover');
  }
}

@Injectable({ providedIn: TimProtezioneCasaServiceModule })
export class TimProtezioneCasaCheckoutService extends FieldToRecover {
  public get InsuranceInfoState$(): BehaviorSubject<InsuranceInfoStates> { return TimProtezioneCasaCheckoutService.InsuranceInfoState$; };
  public static readonly InsuranceInfoState$ = new BehaviorSubject<InsuranceInfoStates>('packet-selector');

  public get ChosenPackets$(): BehaviorSubject<IPacketNWarranties | undefined> { return TimProtezioneCasaCheckoutService.ChosenPackets$; };
  public static readonly ChosenPackets$ = new BehaviorSubject<IPacketNWarranties | undefined>(undefined);

  public get ChosenPacketsName(): string[] { return TimProtezioneCasaCheckoutService.ChosenPacketsName; };
  public set ChosenPacketsName(value: string[]) { TimProtezioneCasaCheckoutService.ChosenPacketsName = value; };
  public static ChosenPacketsName: string[] = [];

  public get SelectedPackets(): IPacketChoose { return TimProtezioneCasaCheckoutService.SelectedPackets; };
  public set SelectedPackets(value: IPacketChoose) { TimProtezioneCasaCheckoutService.SelectedPackets = value; };
  public static SelectedPackets: IPacketChoose = {
    mutualExclusive: undefined, photovoltaic: false, smartII: true, deluxeII: true, lightWarranties: [], smartWarranties: [], deluxeWarranties: [], photovoltaicWarranties: [], lightPrice: 0, smartPrice: 0, deluxePrice: 0, photovoltaicPrice: 0, currentPacketConfiguration: {
      'Light': { 'basic': undefined },
      'Smart': { 'basic': undefined, 'ii': undefined, 'photovoltaic': undefined },
      'Deluxe': { 'basic': undefined, 'ii': undefined, 'photovoltaic': undefined },
      'Photovoltaic': { 'basic': undefined },
    },
    currentPacket: undefined,
  };

  constructor(private router: Router, private nypDataService: NypDataService, private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService, private kenticoTranslateService: KenticoTranslateService) {
    super();

    this.nypDataService.CurrentState$
      .pipe(filter(e => !!e))
      .subscribe(state => {
        console.log(TIM_PROTEZIONE_CASA_PRODUCT_NAME, state);
        const fragment = [];

        this.kenticoTranslateService.getItem<any>('tim_protezione_casa').pipe(take(1)).subscribe(item => {
          if(state == 'insurance-info'){
            const productName = item?.system?.name;
            const stepName = "tim-protezione-casa scelta pacchetto";
            let digitalData: digitalData = window["digitalData"];
            digitalData.page.category.primaryCategory = productName;
            digitalData.page.pageInfo.pageName = stepName;
            this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
          }
          if(state == 'address'){
            const productName = item?.system?.name;
            const stepName = "tim-protezione-casa dati anagrafici";
            let digitalData: digitalData = window["digitalData"];
            digitalData.page.category.primaryCategory = productName;
            digitalData.page.pageInfo.pageName = stepName;
            this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
          }
          if(state == 'user-control'){
            const stepName = "tim-protezione-casa user control";
            let digitalData = window["digitalData"];
            digitalData.page.pageInfo.pageName = stepName;
            this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
          }
          if(state == 'survey'){
            const productName = item?.system?.name;
            const stepName = "tim-protezione-casa questionario di coerenza";
            let digitalData: digitalData = window["digitalData"];
            digitalData.page.category.primaryCategory = productName;
            digitalData.page.pageInfo.pageName = stepName;
            this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
          }
          if(state == 'consensuses'){
            const productName = item?.system?.name;
            const stepName = "tim-protezione-casa consensi";
            let digitalData: digitalData = window["digitalData"];
            digitalData.page.category.primaryCategory = productName;
            digitalData.page.pageInfo.pageName = stepName;
            this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
          }
          if(state == 'payment'){
            const stepName = "tim-protezione-casa pagamento";
            let digitalData = window["digitalData"];
            digitalData.page.pageInfo.pageName = stepName;
            this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
          }
        });

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
          console.log(TIM_PROTEZIONE_CASA_PRODUCT_NAME, 'YIN PAYLOAD', JSON.stringify(dataOrder));
          window.parent.postMessage(dataOrder, '*');

          fragment.push({ fragment: RouteHash['LOGIN'] });
          const stepName = "tim-protezione-breve loginPage";
          let digitalData = window["digitalData"];
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
        if (window.location.pathname.includes(`/nyp-checkout/${TIM_PROTEZIONE_CASA_PRODUCT_NAME}`))
          this.router.navigate([`/nyp-checkout/${TIM_PROTEZIONE_CASA_PRODUCT_NAME}/${state}`], ...fragment);
      });
  }
}

export type PacketsName = PacketsNameEnum.Light | PacketsNameEnum.Smart | PacketsNameEnum.Deluxe | PacketsNameEnum.Photovoltaic;
export enum PacketsNameEnum {
  Light = 'Light',

  Smart = 'Smart',
  SmartII = 'Smart II',
  Deluxe = 'Deluxe',
  DeluxeII = 'Deluxe II',
  Photovoltaic = 'Photovoltaic',
}
export type InsuranceInfoStates = 'packet-selector' | 'home-data-entry';
export interface IPacketNWarranties {
  packet: number | string;
  warranties: { code: number, label: string }[];
  price: number;
  packetCombo: string;
};
