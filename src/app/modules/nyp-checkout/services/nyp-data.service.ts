import { NypUserService } from '@NYP/ngx-multitenant-core';
import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { AuthService } from '@services';
import { AdobeAnalyticsDatalayerService } from 'app/core/services/adobe_analytics/adobe-init-datalayer.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { BillProtectionInsuredItems, CheckoutStates, EhealthInsuredItems, ForSkiInsuredItems, ICheckExistingPolicy, IOrderResponse, IProduct, IQuote, MyPetInsuredItems, NatCatnsuredItems, NetCyberBusinessInsuredItems, ProtezioneCasaInsuredItems, RecursivePartial, Translation, TranslationModule, ViaggiAnnualeInsuredItems, ViaggiBreveInsuredItems, ViaggiRoamingInsuredItems } from '../models/api.model';
import { KenticoPipe } from 'app/shared/pipe/kentico.pipe';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NypDataService {
    public readonly Quote$ = new BehaviorSubject<RecursivePartial<IQuote> | undefined>(undefined);
    public readonly CheckExistingPolicy$ = new BehaviorSubject<ICheckExistingPolicy | undefined>(undefined);
    public readonly Products$ = new BehaviorSubject<RecursivePartial<IProduct[]> | undefined>(undefined);
    public readonly CurrentProduct$ = new BehaviorSubject<RecursivePartial<IProduct> | undefined>(undefined);
    public readonly Order$ = new BehaviorSubject<RecursivePartial<IOrderResponse<ProtezioneCasaInsuredItems | BillProtectionInsuredItems | MyPetInsuredItems | ForSkiInsuredItems | EhealthInsuredItems | ViaggiRoamingInsuredItems | ViaggiBreveInsuredItems | ViaggiAnnualeInsuredItems | NatCatnsuredItems | NetCyberBusinessInsuredItems>> | undefined>(undefined);
    public readonly CurrentState$ = new BehaviorSubject<CheckoutStates | undefined>(undefined);
    private static StateAfterRedirect: CheckoutStates;
    public get StateAfterRedirect(): CheckoutStates {
        let state = NypDataService.StateAfterRedirect;
        if (!!state) NypDataService.StateAfterRedirect = undefined;
        return state;
    }
    public isSeasonal: boolean = false;
    public daysOfCoverage: number;
    public daysNumber: number;
    public quantity: number;
    public insuredItem: any;
    public totalPriceSeasonal: number;
    public firstDay: Date;
    public lastDay: Date;

    public set StateAfterRedirect(value: CheckoutStates) { NypDataService.StateAfterRedirect = value; }

    public static Translations: Translation;

    public set OrderCode(order: string) { localStorage.setItem('id_order', order); }
    public get OrderCode(): string { return localStorage.getItem('id_order') ?? this.Yin?.orderNumber; }

    public get Yin(): { orderNumber: string, product: string, tenant: string } | undefined {
        const path = this.location.path();
        if (!path.includes('yin')) return undefined;

        return path
            .substr(this.location.path().indexOf('?') + 1) // taking only the arguments
            .split("%3D").join("=") // replacing with '='
            .split("%3F").join("&") // replacing with '&'
            .split('&') // taking list of key=value
            .reduce((prev, curr) => {
                const [k, v] = curr.split('=');
                prev[k] = v;
                return prev;
            }, {}) as any;
    }

    constructor(private location: Location, private kenticoTranslateService: KenticoTranslateService, private authService: AuthService, private kenticoPipe: KenticoPipe, private router: Router) {
        this.Order$
            .pipe(filter(e => !!e), take(1),)
            .subscribe(order => this.OrderCode = order.orderCode);

        this.CurrentState$
            .pipe(
                map(state => {
                    const apiEventKey: { [key: string]: string } = {
                        'address': 'custom-insurance-info',
                        'survey': 'custom-survey',
                        'payment': 'custom-checkout',
                        'thank-you': 'custom-purchase',
                    };

                    return apiEventKey[state];
                }),
                filter(apiEventKey => !!apiEventKey),
                tap(apiEventKey => {
                    const createDetails = (details: [string, any][]): string =>
                        details
                            .filter(([key, value]) => !!value)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join('\n;')
                        ;

                    const productTitle: { [key: string]: string } = {
                        'tim-protezione-casa': this.kenticoPipe.transform('nyp_products_data.product_name'),
                        'tim-bill-protection': this.kenticoPipe.transform('nyp_products_data.product_name_bp'),
                        'tim-my-pet': this.kenticoPipe.transform('nyp_products_data.product_name_mp'),
                    };

                    AdobeAnalyticsDatalayerService.ADOBE_LOG({
                        "eventName": "custom",
                        "apiEventKey": apiEventKey,
                        "ci360_productId": this.Order$.value.orderItem?.[0]?.product_id,
                        "ci360_productName": productTitle[this.Order$.value.packet?.data?.product?.code],
                        "ci360_productDetails": createDetails([
                            ['Product_name', this.Order$.value.packet?.data?.sku,],
                            ['isLoggedIn', this.authService.loggedIn ? 'Logged in' : 'notLogged In'],
                            ['productId', this.Order$.value.orderItem?.[0]?.product_id],
                            ['Pacchetto', this.Order$.value.packet?.data?.name],
                            ['Provincia ubicazione immobile', NypUserService.states?.find(s => s.id == (this.Order$.value.orderItem?.[0]?.insured_item as ProtezioneCasaInsuredItems)?.state_id)?.name],
                            ['Comune ubicazione immobile', (this.Order$.value.orderItem?.[0]?.insured_item as ProtezioneCasaInsuredItems)?.city],
                            ['CAP ubicazione immobile', (this.Order$.value.orderItem?.[0]?.insured_item as ProtezioneCasaInsuredItems)?.zipcode],
                            //['Tipologia di Costruzione', this.Order$.value.orderItem?.[0]?.insured_item?.[0]?.building_type],
                            ['Proprietario o inquilino', (this.Order$.value.orderItem?.[0]?.insured_item as ProtezioneCasaInsuredItems)?.owner_type],
                            ['Prezzo Totale', this.Order$.value.insurancePremium],
                            ['Inzio copertura', this.Order$.value.orderItem?.[0]?.start_date],

                        ]),
                    }, 'send');
                }),
            )
            .subscribe();

    }

    public downloadKenticoContent(moduleName: string, moduleSlug: string): Observable<any> {
        return this.kenticoTranslateService.getItem<any>(moduleSlug).pipe(
            take(1),
            map(response => this.elaborateKentico(response)),
            tap(kentico => {
                const newModule = {};
                newModule[moduleName] = kentico;
                NypDataService.Translations = Object.assign({}, NypDataService.Translations, newModule);
            }),
        );
    }

    private elaborateKentico(kenticoBody: IKenticoResponse): TranslationModule {
        const response: TranslationModule = {};

        Object.entries(kenticoBody)
            .filter(([k, v]) => !!k && !!v?.type)
            .forEach(([k, v]) => {
                // Create the inner structure on the first time
                // finally provide a value to the key
                switch (v.type) {
                    case 'text': response[k] = v.value; break;
                    case 'asset': response[k] = v.images?.[0]?.url; break;
                }
            });
        return response;
    }

    public redirectIfUndefinedProduct(): void {
        const currentProducts = this.Products$.value;
        if(!currentProducts){
            this.redirectToSessionOldPath();
          }
    }

    public redirectToSessionOldPath(){
        const productPath = sessionStorage.getItem('old_path');
        if(productPath){
          this.router.navigateByUrl(productPath);
        }
    }

    public reset(): void {
      this.Quote$.next(undefined);
      this.CheckExistingPolicy$.next(undefined);
      this.CurrentProduct$.next(undefined);
      this.Order$.next(undefined);
      this.CurrentState$.next(undefined);


      const currentProducts = this.Products$.value;
      this.Products$.next(undefined);
      setTimeout(() => {
            this.Products$.next(currentProducts);
      }, 0);

      this.isSeasonal = false;
      this.daysOfCoverage = undefined;
      this.daysNumber = undefined;
      this.quantity = undefined;
      this.insuredItem = undefined;
      this.totalPriceSeasonal = undefined;
      this.firstDay = undefined;
      this.lastDay = undefined;


      localStorage.removeItem('id_order');
      this.OrderCode = null;
  }

}

type IKenticoResponse = {
    [key: string]: {
        type: string,
        name: string,
        images: { url: string }[],
        value: string,
    }
};
