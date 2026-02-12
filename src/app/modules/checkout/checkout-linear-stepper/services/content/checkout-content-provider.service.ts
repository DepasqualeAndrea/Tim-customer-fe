import {CheckoutYoloPetContentService} from './checkout-yolo-pet-content.service';
import {CheckoutBaggageLossContentService} from './checkout-baggage-loss-content.service';
import {CheckoutYoloCareContentService} from './checkout-yolo-care-content.service';
import {Inject, Injectable, Injector} from '@angular/core';
import {CheckoutModule} from 'app/modules/checkout/checkout.module';
import {CheckoutContentProvider} from './checkout-content-provider.interface';
import {CheckoutPetContentService} from './checkout-pet-content.service';
import {CheckoutSerenetaContentService} from './checkout-sereneta-content.service';
import {CheckoutSmartphoneContentService} from './checkout-smartphone-content.service';
import {CheckoutPaiContentService} from './checkout-pai-content.service';
import {CheckoutCouponTiresContentService} from './checkout-mopar-content.service';
import {CheckoutMoparCovidContentService} from './checkout-mopar-covid-content.service';
import {CheckoutBikeContentService} from './checkout-bike-content.service';
import {CheckoutSciContentService} from './checkout-sci-content.service';
import {CheckoutMoparCovidStdContentService} from './checkout-mopar-covid-std-content.service';
import {CheckoutTiresStandardPlusContentService} from './checkout-tires-std-plus-content.service';
import {CheckoutTimCustomersContentService} from './checkout-tim-customers-content.service';
import {CheckoutTravelContentService} from './checkout-travel-content.service';
import {CheckoutFcaRcAutoContentService} from './checkout-fca-rc-auto-content.service';
import {CheckoutPetCivibankContentService} from './checkout-pet-civibank-content.service';
import {CheckoutSportContentService} from './checkout-sport-content.service';
import {CheckoutYoloTutelaLegaleContentService} from './checkout-yolo-tutela-legale-content.service';
import {CheckoutGeBikeContentService} from './checkout-ge-bike-content.service';
import {CheckoutGeSportContentService} from './checkout-ge-sport-content.service';
import {CheckoutGeSkiContentService} from './checkout-ge-ski-content.service';
import {CheckoutGeTravelContentService} from './checkout-ge-travel-content.service';
import {CheckoutGeHolidayHouseContentService} from './checkout-ge-holiday-house-content.service';
import {CheckoutYoloCyberContentService} from './checkout-yolo-cyber-content.service';
import {CheckoutGeSkiSeasonalContentService} from './checkout-ge-ski-seasonal-content.service';
import {CheckoutGeMotorContentService} from './checkout-ge-motor-content.service';
import {CheckoutGeHomeContentService} from './checkout-ge-home-content.service';
import {CheckoutTimCustomersEhealthStdContentService} from './checkout-tim-customers-ehealth-std-content.service';
import {CheckoutTimMyHomeContentService} from './checkout-tim-my-home-content.service';
import {CheckoutCustomersTimPetContentService} from './checkout-customers-tim-pet-content.service';
import {CheckoutYoloForPetContentService} from './checkout-yolo-for-pet-content.service';
import {CheckoutScooterBikeContentService} from './checkout-scooter-bike-content.service';
import { CheckoutIntesaSciContentService } from './checkout-intesa-sci-content.service';
import { CheckoutGenertelSciContentService } from './checkout-genertel-sci-content.service';
import { CheckoutTimMySciContentService } from './checkout-tim-my-sci-content.service';
import { CheckoutAxaAnnullamentoViaggioContentService } from './checkout-axa-annullamento-viaggio-content.service';
import { CheckoutAxaViaggioContentService } from './checkout-axa-viaggio-content.service';
import { CheckoutTelemedicinaContentService } from './checkout-telemedicina-content.service';
import { CheckoutYoloMultiriskContentService } from './checkout-yolo-multirisk-content.service';
import { CheckoutYoloForSkiContentService } from './checkout-yolo-for-ski-content.service';
import { CheckoutWinterSportContentService } from './checkout-winter-sport-content.service';
import { CheckoutTimForSkiContentService } from './checkout-tim-for-ski-content.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutContentProviderService {
  constructor(
    private petContentService: CheckoutPetContentService,
    private serenetaContentService: CheckoutSerenetaContentService,
    private smartphoneContentServie: CheckoutSmartphoneContentService,
    private paiContentService: CheckoutPaiContentService,
    private careContentService: CheckoutYoloCareContentService,
    private checkoutCouponTiresContentService: CheckoutCouponTiresContentService,
    private bikeContentService: CheckoutBikeContentService,
    private sciContentService: CheckoutSciContentService,
    private covidContentService: CheckoutMoparCovidContentService,
    private covidStdContenService: CheckoutMoparCovidStdContentService,
    private tiresStdPlusContentService: CheckoutTiresStandardPlusContentService,
    private checkoutEhealthContentService: CheckoutTimCustomersContentService,
    private checkoutEhealthStandardContentService: CheckoutTimCustomersEhealthStdContentService,
    private civibankTravelContentService: CheckoutTravelContentService,
    private baggageLossContentService: CheckoutBaggageLossContentService,
    private rcaFCAContentService: CheckoutFcaRcAutoContentService,
    private yoloPetContentService: CheckoutYoloPetContentService,
    private yoloSportContentService: CheckoutSportContentService,
    private civibankPetContentService: CheckoutPetCivibankContentService,
    private yoloTutelaLegaleContentService: CheckoutYoloTutelaLegaleContentService,
    private geBikeContentService: CheckoutGeBikeContentService,
    private geSportContentService: CheckoutGeSportContentService,
    private geSkiContentService: CheckoutGeSkiContentService,
    private geSkiSeasonalContentService: CheckoutGeSkiSeasonalContentService,
    private geTravelContentService: CheckoutGeTravelContentService,
    private geHolidayHouseContentService: CheckoutGeHolidayHouseContentService,
    private yoloCyberContentService: CheckoutYoloCyberContentService,
    private geMotorContentService: CheckoutGeMotorContentService,
    private geHomeContentService: CheckoutGeHomeContentService,
    private timMyHomeContentService: CheckoutTimMyHomeContentService,
    private timMySciContentService: CheckoutTimMySciContentService,
    private customersTimPetContentService: CheckoutCustomersTimPetContentService,
    private yoloForPetContentService: CheckoutYoloForPetContentService,
    private scooterBikeContentService: CheckoutScooterBikeContentService,
    private intesaSciContentService: CheckoutIntesaSciContentService,
    private genertelSciContentService: CheckoutGenertelSciContentService,
    private yoloAnnullamentoViaggioContentService: CheckoutAxaAnnullamentoViaggioContentService,
    private yoloViaggioContentService: CheckoutAxaViaggioContentService,
    private yoloMultiriskContentService: CheckoutYoloMultiriskContentService,
    private winterSportContentService: CheckoutWinterSportContentService,

    private telemedicinaContentService: CheckoutTelemedicinaContentService,
    private yoloForSkiContentService: CheckoutYoloForSkiContentService,
    private timForSkiContentService: CheckoutTimForSkiContentService,
    @Inject(Injector) private injector: Injector
  ) {
  }

  private productContentProviderMap: Map<string, any> = new Map<string, any>();

  setProvider(productCodes: string[], providerContentFunction: any) {
    productCodes.map(pc => this.productContentProviderMap.set(pc, providerContentFunction));
  }

  getContentProvider(productCode: string): CheckoutContentProvider {
    const contentProvider = this.productContentProviderMap.get(productCode);
    if (!!contentProvider) {
      return this.injector.get(contentProvider);
    }
    return this.petProvider(productCode) ||
      this.serenetaProvider(productCode) ||
      this.smartphoneProvider(productCode) ||
      this.smartphoneYoloProvider(productCode) ||
      this.paiProvider(productCode) ||
      this.careProvider(productCode) ||
      this.moparProvider(productCode) ||
      this.bikeProvider(productCode) ||
      this.sciProvider(productCode) ||
      this.moparCovidProvider(productCode) ||
      this.moparStdCovidProvider(productCode) ||
      this.moparTiresStdPlusProvider(productCode) ||
      this.timCustomersEhealthProvider(productCode) ||
      this.timCustomersStdEhealthProvider(productCode) ||
      this.civibankTravelProvider(productCode) ||
      this.baggageLossProvider(productCode) ||
      this.rcaFCAProvider(productCode) ||
      this.yoloPetProvider(productCode) ||
      this.civibankPetProvider(productCode) ||
      this.yoloSportProvider(productCode) ||
      this.yoloTutelaLegaleProvider(productCode) ||
      this.yoloGeBikeProvider(productCode) ||
      this.yoloGeSportProvider(productCode) ||
      this.yoloGeSkiProvider(productCode) ||
      this.yoloGeSkiSeasonalProvider(productCode) ||
      this.yoloGeTravelProvider(productCode) ||
      this.yoloGeHolidayHouseProvider(productCode) ||
      this.yoloCyberProvider(productCode) ||
      this.yoloGeMotorProvider(productCode) ||
      this.yoloGeHomeProvider(productCode) ||
      this.timMyHomeProvider(productCode) ||
      this.timMySciProvider(productCode) ||
      this.customersTimPetProvider(productCode) ||
      this.yoloForPetProvider(productCode) ||
      this.scooterBikeProvider(productCode) ||
      this.intesaSciProvider(productCode) ||
      this.genertelSciProvider(productCode) ||
      this.annullamentoViaggioProvider(productCode) ||
      this.yoloViaggioProvider(productCode) ||
      this.telemedicinaProvider(productCode) ||
      this.yoloMultiriskProvider(productCode) ||
      this.yoloForSkiProvider(productCode) ||
      this.yoloWinterSportProvider(productCode) ||
      this.timForSkiProvider(productCode);
  }

  private petProvider(code: string): CheckoutContentProvider {
    const productCodes = ['net-pet-silver', 'net-pet-gold', 'net-mefio'];
    if (productCodes.some(item => code === item)) {
      return this.petContentService;
    }
    return null;
  }

  private serenetaProvider(code: string): CheckoutContentProvider {
    const productCodes = ['sara-sereneta'];
    if (productCodes.some(item => code === item)) {
      return this.serenetaContentService;
    }
    return null;
  }

  private smartphoneProvider(code: string): CheckoutContentProvider {
    const productCode = ['chubb-devices'];
    if (productCode.some(item => code === item)) {
      return this.smartphoneContentServie;
    }
    return null;
  }

  private smartphoneYoloProvider(code: string): CheckoutContentProvider {
    const productCode = ['cc-devices'];
    if (productCode.some(item => code === item)) {
      return this.smartphoneContentServie;
    }
    return null;
  }

  private paiProvider(code: string): CheckoutContentProvider {
    const productCode = ['pai-personal-accident', 'pai-personal-accident-extra'];
    if (productCode.some(item => code === item)) {
      return this.paiContentService;
    }
    return null;
  }

  private careProvider(code: string): CheckoutContentProvider {
    const productCode = ['rbm-pandemic'];
    if (productCode.some(item => code === item)) {
      return this.careContentService;
    }
    return null;
  }

  private moparProvider(code: string): CheckoutContentProvider {
    const productCode = ['covea-tires-covered-homage'];
    if (productCode.some(item => code === item)) {
      return this.checkoutCouponTiresContentService;
    }
    return null;
  }

  private moparTiresStdPlusProvider(code: string): CheckoutContentProvider {
    const productCode = ['covea-tires-covered-standard', 'covea-tires-covered-plus'];
    if (productCode.some(item => code === item)) {
      return this.tiresStdPlusContentService;
    }
    return null;
  }


  private bikeProvider(code: string): CheckoutContentProvider {
    const productCodes = ['ea-bike-easy', 'ea-bike-top'];
    if (productCodes.some(item => code === item)) {
      return this.bikeContentService;
    }
    return null;
  }

  private sciProvider(code: string): CheckoutContentProvider {
    const productCode = ['erv-mountain-gold', 'erv-mountain-silver'];
    if (productCode.some(item => code === item)) {
      return this.sciContentService;
    }
  }

  private yoloForSkiProvider(code: string): CheckoutContentProvider {
    const productCode = ['yolo-for-ski-gold', 'yolo-for-ski-platinum'];
    if (productCode.some(item => code === item)) {
      return this.yoloForSkiContentService;
    }
  }

  private moparCovidProvider(code: string): CheckoutContentProvider {
    const productCode = ['nobis-covid-homage'];
    if (productCode.some(item => code === item)) {
      return this.covidContentService;
    }
    return null;
  }

  private moparStdCovidProvider(code: string): CheckoutContentProvider {
    const productCode = ['nobis-covid-standard'];
    if (productCode.some(item => code === item)) {
      return this.covidStdContenService;
    }
    return null;
  }

  private timCustomersEhealthProvider(code: string): CheckoutContentProvider {
    const productCode = ['ehealth-quixa-homage'];
    if (productCode.some(item => code === item)) {
      return this.checkoutEhealthContentService;
    }
  }

  private timCustomersStdEhealthProvider(code: string): CheckoutContentProvider {
    const productCode = ['ehealth-quixa-standard'];
    if (productCode.some(item => code === item)) {
      return this.checkoutEhealthStandardContentService;
    }
  }

  private civibankTravelProvider(code: string): CheckoutContentProvider {
    const productCode = ['htrv-premium', 'htrv-basic'];
    if (productCode.some(item => code === item)) {
      return this.civibankTravelContentService;
    }
    return null;
  }

  private civibankPetProvider(code: string): CheckoutContentProvider {
    const productCodes = ['hpet-basic', 'hpet-prestige', 'hpet-vip'];
    if (productCodes.some(item => code === item)) {
      return this.civibankPetContentService;
    }
    return null;
  }

  private baggageLossProvider(code: string): CheckoutContentProvider {
    const productCode = ['covea-baggage-loss'];
    if (productCode.some(item => code === item)) {
      return this.baggageLossContentService;
    }
    return null;
  }

  private rcaFCAProvider(code: string): CheckoutContentProvider {
    const productCode = ['genertel-rca'];
    if (productCode.some(item => code === item)) {
      return this.rcaFCAContentService;
    }
    return null;
  }

  private yoloPetProvider(code: string): CheckoutContentProvider {
    const productCode = ['net-pet'];
    if (productCode.some(item => code === item)) {
      return this.yoloPetContentService;
    }
    return null;
  }

  private yoloSportProvider(code: string): CheckoutContentProvider {
    const productCode = ['chubb-sport', 'chubb-sport-rec'];
    if (productCode.some(item => code === item)) {
      return this.yoloSportContentService;
    }
    return null;
  }

  private yoloTutelaLegaleProvider(code: string): CheckoutContentProvider {
    const productCode = ['das-legalprotection'];
    if (productCode.some(item => code === item)) {
      return this.yoloTutelaLegaleContentService;
    }
    return null;
  }

  private yoloGeBikeProvider(code: string): CheckoutContentProvider {
    const productCode = ['ge-bike-premium', 'ge-bike-plus'];
    if (productCode.some(item => code === item)) {
      return this.geBikeContentService;
    }
    return null;
  }

  private yoloGeSportProvider(code: string): CheckoutContentProvider {
    const productCode = ['ge-sport-premium', 'ge-sport-plus'];
    if (productCode.some(item => code === item)) {
      return this.geSportContentService;
    }
    return null;
  }

  private yoloGeSkiProvider(code: string): CheckoutContentProvider {
    const productCode = ['ge-ski-plus', 'ge-ski-premium'];
    if (productCode.some(item => code === item)) {
      return this.geSkiContentService;
    }
    return null;
  }

  private yoloWinterSportProvider(code: string): CheckoutContentProvider {
    const productCode = ['winter-sport-plus', 'winter-sport-premium'];
    if (productCode.some(item => code === item)) {
      return this.winterSportContentService;
    }
    return null;
  }

  private yoloGeSkiSeasonalProvider(code: string): CheckoutContentProvider {
    const productCode = ['ge-ski-seasonal-plus', 'ge-ski-seasonal-premium'];
    if (productCode.some(item => code === item)) {
      return this.geSkiSeasonalContentService;
    }
    return null;
  }

  private yoloGeTravelProvider(code: string): CheckoutContentProvider {
    const productCode = ['ge-travel-premium', 'ge-travel-plus'];
    if (productCode.some(item => code === item)) {
      return this.geTravelContentService;
    }
    return null;
  }

  private yoloGeHolidayHouseProvider(code: string): CheckoutContentProvider {
    const productCode = ['ge-holiday-house-premium', 'ge-holiday-house-plus'];
    if (productCode.some(item => code === item)) {
      return this.geHolidayHouseContentService;
    }
    return null;
  }

  private yoloCyberProvider(code: string): CheckoutContentProvider {
    const productCode = ['net-cyber-gold', 'net-cyber-platinum'];
    if (productCode.some(item => code === item)) {
      return this.yoloCyberContentService;
    }
    return null;
  }

  private yoloGeMotorProvider(code: string): CheckoutContentProvider {
    const productCode = ['ge-motor-car', 'ge-motor-van'];
    if (productCode.some(item => code === item)) {
      return this.geMotorContentService;
    }
    return null;
  }

  private yoloGeHomeProvider(code: string): CheckoutContentProvider {
    const productCode = ['ge-home'];
    if (productCode.some(item => code === item)) {
      return this.geHomeContentService;
    }
    return null;
  }

  private timMyHomeProvider(code: string): CheckoutContentProvider {
    const productCode = ['tim-my-home'];
    if (productCode.some(item => code === item)) {
      return this.timMyHomeContentService;
    }
    return null;
  }

  private timMySciProvider(code: string): CheckoutContentProvider {
    const productCode = ['tim-my-sci'];
    if (productCode.some(item => code === item)) {
      return this.timMySciContentService;
    }
    return null;
  }

  private customersTimPetProvider(code: string): CheckoutContentProvider {
    const productCode = ['customers-tim-pet'];
    if (productCode.some(item => code === item)) {
      return this.customersTimPetContentService;
    }
    return null;
  }

  private yoloForPetProvider(code: string): CheckoutContentProvider {
    const productCode = ['yolo-for-pet'];
    if (productCode.some(item => code === item)) {
      return this.yoloForPetContentService;
    }
    return null;
  }

  private scooterBikeProvider(code: string): CheckoutContentProvider {
    const productCode = ['rc-scooter-bike'];
    if (productCode.some(item => code === item)) {
      return this.scooterBikeContentService;
    }
    return null;
  }

  private intesaSciProvider(code: string): CheckoutContentProvider {
    const productCode = ['ergo-mountain-gold', 'ergo-mountain-silver'];
    if (productCode.some(item => code === item)) {
      return this.intesaSciContentService;
    }
  }

  private genertelSciProvider(code: string): CheckoutContentProvider {
    const productCode = ['genertel-ski', 'genertel-ski-plus'];
    if (productCode.some(item => code === item)) {
      return this.genertelSciContentService;
    }
  }

  private annullamentoViaggioProvider(code: string): CheckoutContentProvider {
    const productCode = ['axa-annullament'];
    if (productCode.some(item => code === item)) {
      return this.yoloAnnullamentoViaggioContentService;
    }
    return null;
  }

  private yoloViaggioProvider(code: string): CheckoutContentProvider {
    const productCode = ['axa-assistance-silver', 'axa-assistance-gold'];
    if (productCode.some(item => code === item)) {
      return this.yoloViaggioContentService;
    }
    return null;
  }

  private telemedicinaProvider(code: string): CheckoutContentProvider {
    const productCodes = ['virtualhospital-monthly', 'virtualhospital-annual'];
    if (productCodes.some(item => code === item)) {
      return this.telemedicinaContentService;
    }
    return null;
  }

  private yoloMultiriskProvider(code: string): CheckoutContentProvider {
    const productCode = ['net-multirisk-craft', 'net-multirisk-commerce'];
    if (productCode.some(item => code === item)) {
      return this.yoloMultiriskContentService;
    }
    return null;
  }

  private timForSkiProvider(code: string): CheckoutContentProvider {
    const productCode = ['tim-for-ski-silver', 'tim-for-ski-gold', 'tim-for-ski-platinum'];
    if (productCode.some(item => code === item)) {
      return this.timForSkiContentService;
    }
  }

}
