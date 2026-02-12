import { NypIadDocumentaryService } from '@NYP/ngx-multitenant-core';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CheckoutStates } from 'app/modules/nyp-checkout/models/api.model';
import { BehaviorSubject, Observable, concat } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { IPacketNWarranties, TimProtezioneCasaCheckoutService } from '../../services/checkout.service';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { digitalData } from 'app/core/services/adobe_analytics/adobe-analytics-data.model';
import {AdobeAnalyticsDatalayerService} from '../../../../../../core/services/adobe_analytics/adobe-init-datalayer.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: [
    './shopping-cart.component.scss',
    '../../../../styles/shopping-cart.scss',
    '../../../../styles/size.scss',
    '../../../../styles/colors.scss',
    '../../../../styles/text.scss',
    '../../../../styles/common.scss'
  ]
})
export class ShoppingCartComponent implements OnInit {
  public ChosenPackets$: Observable<IPacketNWarranties>;
  public Order$ = this.nypDataService.Order$;
  public isStickyCartOpen = true;
  public isSticky: boolean = false;
  public showStates: CheckoutStates[] = ['insurance-info', 'address', 'survey', 'payment', 'consensuses', 'thank-you'];
  private documentsToDownload: string[] = [];
  public selectedWarranties$: BehaviorSubject<ISelectedWarranties[]> = new BehaviorSubject<ISelectedWarranties[]>([]);
  private packetAndWarranties = new Map<string, ISelectedWarranties>();
  @Input('state') public state: CheckoutStates;
  @Input('isTablet') set _(isTablet: boolean) { this.isSticky = isTablet; this.isStickyCartOpen = !isTablet; }
  @ViewChild('innerhide') public HIDE;

  constructor(
    public checkoutService: TimProtezioneCasaCheckoutService,
    private nypIadDocumentaryService: NypIadDocumentaryService,
    public nypDataService: NypDataService,
    private adobeAnalyticsDataLayerService: AdobeAnalyticsDatalayerService,
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  ngOnInit(): void {
    this.nypDataService.CurrentProduct$.pipe(take(1)).subscribe(product => {
      this.documentsToDownload = product?.packets?.map(packet => packet?.configuration?.packetDoc)?.filter(doc => !!doc);

      product
        .packets
        ?.forEach(p => {
          switch (p?.sku) {
            case 'tim-protezione-casa-light': {
              this.packetAndWarranties.set('light', { packet: 'tim_protezione_casa.insurance_info_light_title', warranties: p.warranties?.map(w => w.translationCode) });
            }; break;
            case 'tim-protezione-casa-smart': {
              this.packetAndWarranties.set('smart', { packet: 'tim_protezione_casa.insurance_info_smart_title', warranties: p.warranties?.map(w => w.translationCode) });
            }; break;
            case 'tim-protezione-casa-smart-ii': {
              this.packetAndWarranties.set('smart-ii', { packet: 'tim_protezione_casa.insurance_info_smart_title', warranties: p.warranties?.map(w => w.translationCode) });
            }; break;
            case 'tim-protezione-casa-deluxe': {
              this.packetAndWarranties.set('deluxe', { packet: 'tim_protezione_casa.insurance_info_deluxe_title', warranties: p.warranties?.map(w => w.translationCode) });
            }; break;
            case 'tim-protezione-casa-deluxe-ii': {
              this.packetAndWarranties.set('deluxe-ii', { packet: 'tim_protezione_casa.insurance_info_deluxe_title', warranties: p.warranties?.map(w => w.translationCode) });
            }; break;
            case 'tim-protezione-casa-photovoltaic': {
              this.packetAndWarranties.set('photovoltaic', { packet: 'tim_protezione_casa.insurance_info_photovoltaic_title', warranties: p.warranties?.map(w => w.translationCode) });
            }; break;
          }
        });

      this.ChosenPackets$ = this.checkoutService.ChosenPackets$.pipe(
        tap(cp => {
          switch (cp?.packetCombo) {
            case 'tim-protezione-casa-light': this.selectedWarranties$.next([this.packetAndWarranties.get('light')]); break;
            case 'tim-protezione-casa-smart': this.selectedWarranties$.next([this.packetAndWarranties.get('smart')]); break;
            case 'tim-protezione-casa-smart-ii': this.selectedWarranties$.next([this.packetAndWarranties.get('smart-ii')]); break;
            case 'tim-protezione-casa-smart-photovoltaic': this.selectedWarranties$.next([this.packetAndWarranties.get('smart'), this.packetAndWarranties.get('photovoltaic')]); break;
            case 'tim-protezione-casa-deluxe': this.selectedWarranties$.next([this.packetAndWarranties.get('deluxe')]); break;
            case 'tim-protezione-casa-deluxe-ii': this.selectedWarranties$.next([this.packetAndWarranties.get('deluxe-ii')]); break;
            case 'tim-protezione-casa-deluxe-photovoltaic': this.selectedWarranties$.next([this.packetAndWarranties.get('deluxe'), this.packetAndWarranties.get('photovoltaic')]); break;
            default: this.selectedWarranties$.next([]);
          }
        }),
      );

      this.ChosenPackets$.pipe(filter(cp => !!cp?.packetCombo)).subscribe(cp =>
        this.documentsToDownload = [this.nypDataService.CurrentProduct$.value?.packets?.find(p => p.sku == cp.packetCombo)?.configuration?.packetDoc]
      );
    });

    this.checkoutService.ChosenPackets$.subscribe( () => {});
  }

  toHomeDataEntry() {
    let digitalData: digitalData = window['digitalData'];
    digitalData.cart.form.button_name = this.nypDataService.CurrentState$.value + '_' + document.getElementById('continue').textContent.toLowerCase().replace(/\s/g, '');
    // digitalData.page.pageInfo.pageName = this.nypDataService.CurrentState$.value;
    // this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    this.kenticoTranslateService.getItem<any>('tim_protezione_casa').pipe(take(1)).subscribe(item => {
      let digitalData: digitalData = window["digitalData"];
      let stepName = item?.insurance_info_estate_data_title?.value;
      digitalData.page.pageInfo.pageName = stepName;
      this.adobeAnalyticsDataLayerService.pushAdobeCustomTags(digitalData);
    });
    this.checkoutService.InsuranceInfoState$.next('home-data-entry');
  }

  toggleStickyCart() {
    this.isStickyCartOpen = !this.isStickyCartOpen;
  }

  downloadProductDocuments() {
    concat(
      ...this.documentsToDownload.map(doc =>
        this.nypIadDocumentaryService.downloadFileFromUrl({ filename: doc?.split('/')?.pop(), remoteUrl: doc }).pipe(
          map(r => ({ content: r, filename: doc?.split('/')?.pop(), }))
        )
      )
    ).subscribe(b => saveAs(b.content, b.filename));
  }
}

export interface ISelectedWarranties {
  packet: string;
  warranties: string[];
}
