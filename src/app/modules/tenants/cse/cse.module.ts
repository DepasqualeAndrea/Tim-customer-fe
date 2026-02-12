import { YoloDataLayerGA4PageFiller } from './../y/yolo-dl-ga4-page-filler.service';
import { DataService } from './../../../core/services/data.service';
import { ComponentFactory, ComponentFactoryResolver, Inject, NgModule, Type } from '@angular/core';
import { UserConfirmComponent } from './user-confirm/user-confirm.component';
import { CommonModule } from '@angular/common';
import { ComponentLoaderModule } from '../component-loader/component-loader.module';
import { PrivateAreaModule } from 'app/modules/private-area/private-area.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { SecurityModule } from 'app/modules/security/security.module';
import { SharedModule } from 'app/shared/shared.module';
import { JwtCodeComponent } from './jwt-code/jwt-code.component';
import { ComponentMapper } from '../component-loader/component-mapper.service';
import { KenticoConfigurator } from 'app/modules/kentico/kentico-configurator.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { PreventivatoreProductMapperService } from 'app/modules/preventivatore/services/preventivatore-product-mapper.service';
import { CheckoutLinearStepperReducerProvider } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-reducer-provider';
import { PreventivatoreDynamicComponent } from 'app/modules/preventivatore/preventivatore-dynamic/preventivatore-dynamic.component';
import { CheckoutLinearStepperCsePetReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-cse-pet-reducer';
import { ContattiComponent } from 'app/components/public/contatti/yolo/contatti.component';
import { EmptyComponent } from '../component-loader/empty/empty.component';
import { TypeResolver } from 'kentico-cloud-delivery';
import { Preventivatore } from '../../kentico/models/preventivatore.model';
import { AngularLink } from '../../kentico/models/angular-link.model';
import { Column, Row } from '../../kentico/models/row-col.model';
import { PageLayout } from '../../kentico/models/page-layout.model';
import { AccordionYolo } from '../../kentico/models/accordion.model';

import { PreventivatoreContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-content-provider-service';
import { PreventivatoreCsePetContentProvider } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-cse-pet-content-provider.service';
import { PreventivatoreCseSerenetaContentProvider } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-cse-sereneta-content-provider.service';
import { PreventivatoreCseSmartphoneContentProvider } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-cse-smartphone-content-provider.service';
import { CheckoutLinearStepperCseSerenetaReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-cse-sereneta-reducer';
import { UserDetailsComponent } from 'app/modules/private-area/components/user-details/user-details.component';
import { PolicyDetailModalClaimComponent } from 'app/modules/private-area/components/policy-detail/policy-detail-modal-claim/policy-detail-modal-claim.component';
import { MyPoliciesComponent } from 'app/modules/private-area/components/my-policies/my-policies.component';
import { CheckoutLinearStepperCseSmartphoneReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-cse-smartphone-reducer';
import { ContactsFormComponent } from 'app/shared/contact-form/contacts-form.component';
import { CheckoutLinearStepperYoloCareReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-yolo-care-reducer';
import { PreventivatoreCseBikeContentProvider } from '../../preventivatore/preventivatore-dynamic/services/content/preventivatore-cse-bike-content-provider.service';
import { CheckoutLinearStepperBikeReducer } from '../../checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-bike-reducer';
import { PreventivatoreSciContentProvider } from '../../preventivatore/preventivatore-dynamic/services/content/preventivatore-sci-content-provider.service';
import { CheckoutLinearStepperSciReducer } from '../../checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-sci-reducer';
import { GTMTrigger } from '../../../core/models/gtm/gtm-settings.model';
import { GtmHandlerService } from '../../../core/services/gtm/gtm-handler.service';
import { GtmYoloItPageFiller } from '../y/gtm-yolo-it-page-filler.service';
import { BgSlidersWLayoutService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/bg-sliders-w-layout.service';
import { PreventivatoreComponentsProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/preventivatore-components-provider.service';
import { PreventivatoreCareContentProvider } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-care-content-provider.service';
import { CookiesPreferencesComponent } from '../../../components/public/cookies-preferences/cookies-preferences.component';
import { CookiesPreferencesChoiseComponent } from '../../../components/public/cookies-preferences/cookies-preferences-choise/cookies-preferences-choise.component';
import { PolicyDetailModalClaimSciComponent } from 'app/modules/private-area/components/policy-detail/policy-detail-modal-claim-sci/policy-detail-modal-claim-sci.component';
import { PreventivatoreRcMonopattinoBiciContentProvider } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-rc-monopattino-bici-content-provider.service';
import { CheckoutLinearStepperScooterBikeReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-scooter-bike-reducer';
import { HowWorksLikeQuotatorMobileLayoutService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/how-works-like-quotator-mobile-layout.service';
import { ModalRcMonopattinoBiciCoveragesComponent } from 'app/modules/preventivatore/preventivatore-dynamic/components/quotator-rc-scooter-bike/modal-rc-monopattino-bici-coverages/modal-rc-monopattino-bici-coverages.component';
import { PolicyDetailModalClaimScooterBikeComponent } from 'app/modules/private-area/components/policy-detail/policy-detail-modal-claim-scooter-bike/policy-detail-modal-claim-scooter-bike.component';
import { GoldenTriangleLayoutComponentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/gt-layout-component-provider.service';
import { PreventivatoreGeYoloSportContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-ge-yolo-sport-content-provider.service';
import { CheckoutLinearStepperGeSportReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-ge-sport-reducer';

import { PreventivatoreYoloForPetContentProvider } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-yolo-for-pet-content-provider.service';
import { CheckoutLinearStepperYoloForPetReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-yolo-for-pet-reducer';
import { FAQableLayoutService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/faqable-layout.service';

import { PreventivatoreGeYoloTravelContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-ge-yolo-travel-content-provider.service';
import { CheckoutLinearStepperGeTravelReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-ge-travle-reducer';

import { PreventivatoreGeYoloHolidayHouseContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-ge-yolo-holiday-house-content-provider.service';
import { CheckoutLinearStepperGeHolidayHouseReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-ge-holiday-house-reducer';
import { TenantDefault } from '../default/tenant-default.module';

@NgModule({
  declarations: [
    UserConfirmComponent,
    JwtCodeComponent
  ],
  imports: [
    CommonModule,
    ComponentLoaderModule,
    PrivateAreaModule,
    NgbModule,
    ReactiveFormsModule,
    SecurityModule,
    SharedModule
  ],
  exports: [],
  providers: [],
  entryComponents: [
    EmptyComponent,
    ContattiComponent,
    UserDetailsComponent,
    MyPoliciesComponent,
    PolicyDetailModalClaimComponent,
    ContactsFormComponent,
    CookiesPreferencesComponent,
    CookiesPreferencesChoiseComponent,
    PolicyDetailModalClaimSciComponent
  ]
})
export class CseModule {

  constructor(
    private componentMapper: ComponentMapper,
    private resolver: ComponentFactoryResolver,
    private kenticoConfigurator: KenticoConfigurator,
    private kenticoTranslateService: KenticoTranslateService,
    private gtmHandlerService: GtmHandlerService,
    private gtmFiller: GtmYoloItPageFiller,
    private gtmFillerGA4: YoloDataLayerGA4PageFiller,
    private preventivatoreMapper: PreventivatoreProductMapperService,
    private checkoutLinearStepperReducerProvider: CheckoutLinearStepperReducerProvider,
    private preventivatoreContentProviderService: PreventivatoreContentProviderService,
    private preventivatoreComponentsLayoutProviderService: PreventivatoreComponentsProviderService,
    private dataService: DataService,
    @Inject('windowObject') private windowObject: Window
  ) {
    this.registerComponents();
    this.mapProducts();
    this.setupGtm();
    this.setupKentico();
  }
  private static readonly KENTICO_YOLO_API: string = 'e357718b-8b7d-014a-2ce0-75e5b05a3156';
  private readonly KENTICO_API: string = TenantDefault.KENTICO_API;

  private setupKentico(): void {
    this.kenticoConfigurator.register('products_page', this.KENTICO_API);
    this.kenticoConfigurator.register('assistance_contacts_page', this.KENTICO_API);
    this.kenticoConfigurator.register('buttons', this.KENTICO_API);
    this.kenticoConfigurator.register('private_area', this.KENTICO_API);
    this.kenticoConfigurator.register('navbar', this.KENTICO_API);
    this.kenticoConfigurator.register('access', this.KENTICO_API);
    this.kenticoConfigurator.register('footer', this.KENTICO_API);
    // this.kenticoConfigurator.register('preventivatore_pet', this.KENTICO_API);
    // this.kenticoConfigurator.register('preventivatore_sereneta', this.KENTICO_API);
    // this.kenticoConfigurator.register('preventivatore_smartphone', this.KENTICO_API);
    // this.kenticoConfigurator.register('preventivatore_yolo_care', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_rc_monopattino_e_bici', this.KENTICO_API);
    this.kenticoConfigurator.register('alt_documents_acceptance', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_sci', this.KENTICO_API);
    // this.kenticoConfigurator.register('checkout_pet', this.KENTICO_API, this.createTypeResolvers());
    // this.kenticoConfigurator.register('checkout_sereneta', this.KENTICO_API, this.createTypeResolvers());
    // this.kenticoConfigurator.register('checkout_smartphone', this.KENTICO_API, this.createTypeResolvers());
    // this.kenticoConfigurator.register('checkout_yolo_care', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_scooter_bike', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_sci', this.KENTICO_API);
    this.kenticoConfigurator.register('page_not_found', this.KENTICO_API);
    this.kenticoConfigurator.register('thank_you_page_precise_time', this.KENTICO_API);
    this.kenticoConfigurator.register('cookies_preferences_modal', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_sport_genertel', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_sport_genertel', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_yolo_for_pet', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_yolo_for_pet', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_travel_genertel', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_travel_genertel', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_holiday_house_genertel', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_holiday_house_genertel', this.KENTICO_API);
    this.kenticoConfigurator.setDefaultService(CseModule.KENTICO_YOLO_API);
    this.kenticoTranslateService.resolveAll();
  }


  private createTypeResolvers(): TypeResolver[] {
    return [
      new TypeResolver('preventivatore', () => new Preventivatore()),
      new TypeResolver('angular_link_b527c22', () => new AngularLink()),
      new TypeResolver('row', () => new Row()),
      new TypeResolver('column', () => new Column()),
      new TypeResolver('page_layout', () => new PageLayout()),
      new TypeResolver('accordionyolo', () => new AccordionYolo()),
    ];
  }

  /**
   * Allows dynamic component to be used using ComponentLoaderModule through ContainerComponent.
   * Map component using ComponentMapper
   * @see ComponentLoaderModule
   * @see ContainerComponent
   * @see ComponentMapper
   */
  private registerComponents() {
    // Please insert here all components that should be loaded ONLY by this tenant
    // Remember to add the correspondenting component type into entryComponents array.
    // Example: this.componentMapper.setComponentFor('landing-page', this.getFactoryFor(LandingPagePiacenzaComponent));
    this.componentMapper.setComponentFor('contatti', this.getFactoryFor(ContattiComponent));
    this.componentMapper.setComponentFor('contactsForm', this.getFactoryFor(ContactsFormComponent));
    this.componentMapper.setComponentFor('privateAreaUserDetails', this.getFactoryFor(UserDetailsComponent));
    this.componentMapper.setComponentFor('privateAreaMyPolicies', this.getFactoryFor(MyPoliciesComponent));
    this.componentMapper.setComponentFor('policyModalClaim', this.getFactoryFor(PolicyDetailModalClaimComponent));
    // this.componentMapper.setComponentFor('support', this.getFactoryFor(SupportPiacenzaComponent));
    this.componentMapper.setComponentFor('CookiesModal', this.getFactoryFor(CookiesPreferencesComponent));
    this.componentMapper.setComponentFor('CookiesModalChoise', this.getFactoryFor(CookiesPreferencesChoiseComponent));
    this.componentMapper.setComponentFor('policyModalClaimSci', this.getFactoryFor(PolicyDetailModalClaimSciComponent));
    this.componentMapper.setComponentFor('ModalRcMonopattinoBiciCoverages', this.getFactoryFor(ModalRcMonopattinoBiciCoveragesComponent));
    this.componentMapper.setComponentFor('PolicyDetailModalDoubleClaimScooterBike', this.getFactoryFor(PolicyDetailModalClaimScooterBikeComponent));
  }

  private mapProducts() {
    // this.preventivatoreMapper.register(/net-pet/, PreventivatoreDynamicComponent);
    // this.preventivatoreMapper.register(/sara-sereneta/, PreventivatoreDynamicComponent);
    // this.preventivatoreMapper.register(/chubb-devices/, PreventivatoreDynamicComponent);
    // this.preventivatoreMapper.register(/rbm-pandemic/, PreventivatoreDynamicComponent);
    // this.preventivatoreMapper.register(/ea-bike/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/erv-mountain/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/rc-scooter-bike/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/ge-sport/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/yolo-for-pet/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/ge-travel/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/ge-holiday-house/, PreventivatoreDynamicComponent);
    this.preventivatoreComponentsLayoutProviderService.setProvider([
      'rbm-pandemic',
      'erv-mountain-gold', 'erv-mountain-silver'
    ], BgSlidersWLayoutService);
    this.preventivatoreComponentsLayoutProviderService.setProvider([
      'ge-sport-plus',
      'ge-sport-premium'
    ], GoldenTriangleLayoutComponentProviderService);
    this.preventivatoreComponentsLayoutProviderService.setProvider(['rc-scooter-bike'], HowWorksLikeQuotatorMobileLayoutService);
    this.preventivatoreComponentsLayoutProviderService.setProvider(['yolo-for-pet'], FAQableLayoutService);
    this.preventivatoreComponentsLayoutProviderService.setProvider(['ge-travel-plus', 'ge-travel-premium', 'ge-holiday-house-plus', 'ge-holiday-house-premium'], GoldenTriangleLayoutComponentProviderService);
    // this.preventivatoreContentProviderService.setProvider(['net-pet-gold', 'net-pet-silver'], PreventivatoreCsePetContentProvider);
    // this.preventivatoreContentProviderService.setProvider(['sara-sereneta'], PreventivatoreCseSerenetaContentProvider);
    // this.preventivatoreContentProviderService.setProvider(['chubb-devices'], PreventivatoreCseSmartphoneContentProvider);
    // this.preventivatoreContentProviderService.setProvider(['rbm-pandemic'], PreventivatoreCareContentProvider);
    // this.preventivatoreContentProviderService.setProvider(['ea-bike-easy', 'ea-bike-top'], PreventivatoreCseBikeContentProvider);
    this.preventivatoreContentProviderService.setProvider(['erv-mountain-gold', 'erv-mountain-silver'], PreventivatoreSciContentProvider);
    this.preventivatoreContentProviderService.setProvider(['ge-sport-plus', 'ge-sport-premium'], PreventivatoreGeYoloSportContentProviderService);
    this.preventivatoreContentProviderService.setProvider(['rc-scooter-bike'], PreventivatoreRcMonopattinoBiciContentProvider);
    this.preventivatoreContentProviderService.setProvider(['yolo-for-pet'], PreventivatoreYoloForPetContentProvider);
    this.preventivatoreContentProviderService.setProvider(['ge-travel-plus', 'ge-travel-premium'], PreventivatoreGeYoloTravelContentProviderService);
    this.preventivatoreContentProviderService.setProvider(['ge-holiday-house-plus', 'ge-holiday-house-premium'], PreventivatoreGeYoloHolidayHouseContentProviderService);
    // this.checkoutLinearStepperReducerProvider.setReducer('sara-sereneta', () => new CheckoutLinearStepperCseSerenetaReducer());
    // this.checkoutLinearStepperReducerProvider.setReducer('chubb-devices', () => new CheckoutLinearStepperCseSmartphoneReducer());
    // this.checkoutLinearStepperReducerProvider.setReducer('net-pet-silver', () => new CheckoutLinearStepperCsePetReducer(this.windowObject));
    // this.checkoutLinearStepperReducerProvider.setReducer('net-pet-gold', () => new CheckoutLinearStepperCsePetReducer(this.windowObject));
    // this.checkoutLinearStepperReducerProvider.setReducer('rbm-pandemic', () => new CheckoutLinearStepperYoloCareReducer());
    // this.checkoutLinearStepperReducerProvider.setReducer('ea-bike-easy', () => new CheckoutLinearStepperBikeReducer());
    // this.checkoutLinearStepperReducerProvider.setReducer('ea-bike-top', () => new CheckoutLinearStepperBikeReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('erv-mountain-gold', () => new CheckoutLinearStepperSciReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('erv-mountain-silver', () => new CheckoutLinearStepperSciReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('rc-scooter-bike', () => new CheckoutLinearStepperScooterBikeReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('ge-sport-plus', () => new CheckoutLinearStepperGeSportReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('ge-sport-premium', () => new CheckoutLinearStepperGeSportReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('yolo-for-pet', () => new CheckoutLinearStepperYoloForPetReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('ge-travel-plus', () => new CheckoutLinearStepperGeTravelReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('ge-travel-premium', () => new CheckoutLinearStepperGeTravelReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('ge-holiday-house-plus', () => new CheckoutLinearStepperGeHolidayHouseReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('ge-holiday-house-premium', () => new CheckoutLinearStepperGeHolidayHouseReducer());
  }

  /**
   * Get factory for componentType
   * @param componentType to get the factory for
   */
  private getFactoryFor(componentType: Type<any>): ComponentFactory<any> {
    return this.resolver.resolveComponentFactory(componentType);
  }

  private setupGtm() {
    this.gtmHandlerService.setCurrentTenant('yolo-it-it');
    // TEMP
    const type = this.dataService.tenantInfo.gtm.ecommerceType;
    const filler = type === 'GA4' ? this.gtmFillerGA4 : this.gtmFiller;
    this.gtmHandlerService.setPageInfoStrategy(filler);
    // this.gtmHandlerService.setPageInfoStrategy(this.gtmFiller);
    this.gtmHandlerService.setNavigationEndCallbackFn(this.gtmHandlerService.setPageInfoIntoDataLayer);
    this.gtmHandlerService.addException(GTMTrigger.Routing, /preventivatore/);
    this.gtmHandlerService.addException(GTMTrigger.Routing, /apertura/);
    this.gtmHandlerService.addException(GTMTrigger.Routing, /checkout/);
  }

}
