import { BgSingleSliderQuoteWLayoutService } from './../../preventivatore/preventivatore-dynamic/services/product-components/bg-single-slider-quote-w-layout.service';
import { ComponentFactory, ComponentFactoryResolver, NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
import { PREVENTIVATORE_HEADER_PLACEHOLDER } from 'app/modules/preventivatore/header/preventivatore-header/preventivatore-header.component';
import { HeaderThemaCBComponent } from './themaCB/themaCB.component';
import { ComponentMapper } from 'app/modules/tenants/component-loader/component-mapper.service';
import { ComponentLoaderModule } from '../component-loader/component-loader.module';
import { PolicyDetailModalClaimCbFormComponent } from 'app/modules/private-area/components/policy-detail/policy-detail-modal-claim-cb-form/policy-detail-modal-claim-cb-form.component';
import { KenticoConfigurator } from 'app/modules/kentico/kentico-configurator.service';
import { PrivateAreaModule } from 'app/modules/private-area/private-area.module';
import { RegisterFormComponent } from 'app/modules/security/components/register-form/register-form.component';
import { AddressFormComponent } from 'app/modules/checkout/checkout-step/checkout-step-address/components/address-form/address-form.component';
import { UserDetailsComponent } from 'app/modules/private-area/components/user-details/user-details.component';
import { NotConfirmedCBComponent } from 'app/modules/security/components/not-confirmed-cb/not-confirmed-cb.component';
import { DataService } from '@services';
import { TheteamComponent } from 'app/components/public/theteam/default/theteam.component';
import { ContattiComponent } from 'app/components/public/contatti/yolo/contatti.component';
import { CbGtmService } from './services/cb-gtm.service';
import { SharedModule } from '../../../shared/shared.module';
import { KenticoTranslateService } from '../../kentico/data-layer/kentico-translate.service';
import { MyPoliciesComponent } from 'app/modules/private-area/components/my-policies/my-policies.component';
import { PreventivatoreDynamicComponent } from '../../preventivatore/preventivatore-dynamic/preventivatore-dynamic.component';
import { PreventivatoreGeSkiInstantContentProviderService } from '../../preventivatore/preventivatore-dynamic/services/content/preventivatore-ge-ski-instant-content-provider.service';
import { PreventivatoreGeSkiSeasonalContentProviderService } from '../../preventivatore/preventivatore-dynamic/services/content/preventivatore-ge-ski-seasonal-content-provider.service';
import { PreventivatoreProductMapperService } from '../../preventivatore/services/preventivatore-product-mapper.service';
import { PreventivatoreContentProviderService } from '../../preventivatore/preventivatore-dynamic/services/content/preventivatore-content-provider-service';
import { PreventivatoreComponentsProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/preventivatore-components-provider.service';
import { GoldenTriangleLayoutComponentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/gt-layout-component-provider.service';
import { PreventivatoreGeBikeProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-ge-bike-content-provider.service';
import { PreventivatoreGeHolidayHouseContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-ge-holiday-house-content-provider.service';
import { PreventivatoreGeSportContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-ge-sport-content-provider.service';
import { PreventivatoreGeTravelContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-ge-travel-content-provider.service';
import { PreventivatoreGeMotorContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-ge-motor-content-provider.service';
import { TypeResolver } from 'kentico-cloud-delivery';
import { PageLayout } from 'app/modules/kentico/models/page-layout.model';
import { BgNoSliderDoubleQuoteWLayoutService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/bg-single-slider-double-quote-w-layout.service';
import { CookiesPreferencesChoiseComponent } from '../../../components/public/cookies-preferences/cookies-preferences-choise/cookies-preferences-choise.component';
import { CookiesPreferencesComponent } from '../../../components/public/cookies-preferences/cookies-preferences.component';
import { PreventivatoreHomeCheBancaContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-home-chebanca-content-provider.service';
import { CheckoutLinearStepperReducerProvider } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-reducer-provider';
import { CheckoutContentProviderService } from 'app/modules/checkout/checkout-linear-stepper/services/content/checkout-content-provider.service';
import { CheckoutChebancaHomeContentService } from 'app/modules/checkout/checkout-linear-stepper/services/content/checkout-chebanca-home-content-provider.service';
import { CheckoutLinearStepperChebancaHomeReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-chebanca-home-reducer';
import { InsuranceInfoModalAutoProposalComponent } from 'app/modules/checkout/checkout-card/checkout-card-insurance-info-auto-proposal/insurance-info-modal-auto-proposal/insurance-info-modal-auto-proposal.component';
import { CheckoutInsuranceInfoPetModalOptionalWarrantiesComponent } from 'app/modules/checkout/checkout-card/checkout-card-insured-pet/checkout-insurance-info-pet-modal-optional-warranties/checkout-insurance-info-pet-modal-optional-warranties.component';
import { CheckoutInsuranceInfoMotorModalDetailsWarrantiesComponent } from 'app/modules/checkout/checkout-card/checkout-card-insurance-info-motor-optional-warranties/checkout-insurance-info-motor-modal-details-warranties/checkout-insurance-info-motor-modal-details-warranties.component';
import { CheckoutCardInsuranceInfoHomeOptionalWarrantiesModalComponent } from 'app/modules/checkout/checkout-card/checkout-card-insurance-info-home-optional-warranties/checkout-card-insurance-info-home-optional-warranties-modal/checkout-card-insurance-info-home-optional-warranties-modal.component';
import { MyQuotesComponent } from 'app/modules/private-area/components/my-quotes/my-quotes.component';
import { PolicyDetailReplacementModalComponent } from 'app/modules/private-area/components/policy-detail/policy-detail-full/policy-detail-replacement-modal/policy-detail-replacement-modal.component';
import { PolicyDetailReplacementSuccessHomeAnimalsModalComponent } from '../../private-area/components/policy-detail/policy-detail-full/policy-detail-replacement-success-home-animals-modal/policy-detail-replacement-success-home-animals-modal.component';
import {
  PreventivatoreGeHouseContentProviderService
} from '../../preventivatore/preventivatore-dynamic/services/content/preventivatore-ge-house-content-provider.service';
import {
  PreventivatoreGeHomeVetrinaService
} from '../../preventivatore/preventivatore-dynamic/services/product-components/preventivatore-ge-home-vetrina.service';
import { PolicyDetailReplacementSuccessNotInterestedModalComponent } from '../../private-area/components/policy-detail/policy-detail-full/policy-detail-replacement-success-not-interested-modal/policy-detail-replacement-success-not-interested-modal.component';
import { TenantDefault } from '../default/tenant-default.module';

@NgModule({
  declarations: [
    HeaderThemaCBComponent
  ],
  imports: [
    CommonModule,
    PrivateAreaModule,
    ComponentLoaderModule,
    SharedModule
  ]
})
export class CbModule {

  private readonly KENTICO_API: string = TenantDefault.KENTICO_API;

  constructor(
    // private router: Router,
    private resolver: ComponentFactoryResolver,
    private componentMapper: ComponentMapper,
    private kenticoConfigurator: KenticoConfigurator,
    private kenticoTranslateService: KenticoTranslateService,
    private dataService: DataService,
    private cbGtm: CbGtmService,
    private preventivatoreMapper: PreventivatoreProductMapperService,
    private checkoutLinearStepperReducerProvider: CheckoutLinearStepperReducerProvider,
    private preventivatoreContentProviderService: PreventivatoreContentProviderService,
    private preventivatoreComponentsLayoutProviderService: PreventivatoreComponentsProviderService,
    private checkoutContentProviderService: CheckoutContentProviderService
  ) {
    this.registerComponents();
    this.mapProducts();
    this.cbGtm.setupGtm();
    this.setupKentico();
    // set CB countries endpoint
    this.dataService.countriesEndpoint = '/genertel/travel/countries';
  }


  private setupKentico(): void {
    this.kenticoConfigurator.register('checkout_step_1_sci', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout', this.KENTICO_API, this.createTypeResolvers());
    this.kenticoConfigurator.register('private_area', this.KENTICO_API);
    this.kenticoConfigurator.register('guaranteescard', this.KENTICO_API);
    this.kenticoConfigurator.register('products_page', this.KENTICO_API);
    this.kenticoConfigurator.register('support', this.KENTICO_API);
    this.kenticoConfigurator.register('landing_page_chebanca', this.KENTICO_API);
    this.kenticoConfigurator.register('cookies_chebanca', this.KENTICO_API);
    this.kenticoConfigurator.register('clarity_page', this.KENTICO_API);
    this.kenticoConfigurator.register('footer_chebanca', this.KENTICO_API);
    this.kenticoConfigurator.register('page_not_confirmed', this.KENTICO_API);
    this.kenticoConfigurator.register('page_not_found', this.KENTICO_API);
    this.kenticoConfigurator.register('navbar_items', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_ski_instant', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_ski_seasonal', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_bike', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_holiday_house', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_sport', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_motor', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_travel', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_home', this.KENTICO_API);
    this.kenticoConfigurator.register('cookies_preferences_modal', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_home_genertel', this.KENTICO_API);
    this.kenticoConfigurator.register('thank_you_page_screen_protection', this.KENTICO_API);
    this.kenticoConfigurator.register('links_external_open_claim', this.KENTICO_API);
    this.kenticoConfigurator.register('home_modal_replacement', this.KENTICO_API);
    this.kenticoTranslateService.resolveAll();
  }

  private createTypeResolvers(): TypeResolver[] {
    return [null];
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
    this.componentMapper.setComponentFor('policyModalClaim', this.getFactoryFor(PolicyDetailModalClaimCbFormComponent));
    this.componentMapper.setComponentFor(PREVENTIVATORE_HEADER_PLACEHOLDER, this.getFactoryFor(HeaderThemaCBComponent));
    this.componentMapper.setComponentFor('checkoutLoginRegisterForm', this.getFactoryFor(RegisterFormComponent));
    this.componentMapper.setComponentFor('checkoutAddressForm', this.getFactoryFor(AddressFormComponent));
    this.componentMapper.setComponentFor('privateAreaUserDetails', this.getFactoryFor(UserDetailsComponent));
    this.componentMapper.setComponentFor('privateAreaMyPolicies', this.getFactoryFor(MyPoliciesComponent));
    this.componentMapper.setComponentFor('privateAreaMyQuotes', this.getFactoryFor(MyQuotesComponent));
    this.componentMapper.setComponentFor('not-confirmed', this.getFactoryFor(NotConfirmedCBComponent));
    // this.componentMapper.setComponentFor('landing-page', this.getFactoryFor(LandingPageCBComponent));
    this.componentMapper.setComponentFor('chi-siamo', this.getFactoryFor(TheteamComponent));
    this.componentMapper.setComponentFor('contatti', this.getFactoryFor(ContattiComponent));
    this.componentMapper.setComponentFor('CookiesModal', this.getFactoryFor(CookiesPreferencesComponent));
    this.componentMapper.setComponentFor('CookiesModalChoise', this.getFactoryFor(CookiesPreferencesChoiseComponent));
    this.componentMapper.setComponentFor('ModalAutoProposal', this.getFactoryFor(InsuranceInfoModalAutoProposalComponent));
    this.componentMapper.setComponentFor('ModalPetOptionalWarranties', this.getFactoryFor(CheckoutInsuranceInfoPetModalOptionalWarrantiesComponent));
    this.componentMapper.setComponentFor('ModalDetailsWarrantiesComponent', this.getFactoryFor(CheckoutInsuranceInfoMotorModalDetailsWarrantiesComponent));
    this.componentMapper.setComponentFor('ModalInfoComponent', this.getFactoryFor(CheckoutCardInsuranceInfoHomeOptionalWarrantiesModalComponent));
    this.componentMapper.setComponentFor('PolicyDetailReplacementModal', this.getFactoryFor(PolicyDetailReplacementModalComponent));
    this.componentMapper.setComponentFor('PolicyDetailReplacementSuccessHomeAnimalsModal', this.getFactoryFor(PolicyDetailReplacementSuccessHomeAnimalsModalComponent));
    this.componentMapper.setComponentFor('PolicyDetailReplacementSuccessNotInterestedModal', this.getFactoryFor(PolicyDetailReplacementSuccessNotInterestedModalComponent));

  }

  private mapProducts() {
    this.preventivatoreMapper.register(/ge-ski/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/ge-bike/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/ge-holiday-house/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/ge-sport/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/ge-travel/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/ge-home/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/ge-home-NON-DISPONIBILE/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/ge-motor/, PreventivatoreDynamicComponent);
    this.preventivatoreComponentsLayoutProviderService.setProvider
      (['ge-ski-plus', 'ge-ski-premium',
        'ge-ski-seasonal-plus', 'ge-ski-seasonal-premium',
        'ge-bike-plus', 'ge-bike-premium',
        'ge-holiday-house-plus', 'ge-holiday-house-premium',
        'ge-sport-plus', 'ge-sport-premium',
        'ge-travel-plus', 'ge-travel-premium'],
        GoldenTriangleLayoutComponentProviderService
      );
    this.preventivatoreComponentsLayoutProviderService.setProvider(['ge-motor'], BgSingleSliderQuoteWLayoutService);
    this.preventivatoreComponentsLayoutProviderService.setProvider(['ge-home'], BgNoSliderDoubleQuoteWLayoutService);
    this.preventivatoreComponentsLayoutProviderService.setProvider(['ge-home-NON-DISPONIBILE'], PreventivatoreGeHomeVetrinaService);
    this.preventivatoreContentProviderService.setProvider(['ge-ski-plus', 'ge-ski-premium'], PreventivatoreGeSkiInstantContentProviderService);
    this.preventivatoreContentProviderService.setProvider(['ge-ski-seasonal-plus', 'ge-ski-seasonal-premium'], PreventivatoreGeSkiSeasonalContentProviderService);
    this.preventivatoreContentProviderService.setProvider(['ge-bike-plus', 'ge-bike-premium'], PreventivatoreGeBikeProviderService);
    this.preventivatoreContentProviderService.setProvider(['ge-holiday-house-plus', 'ge-holiday-house-premium'], PreventivatoreGeHolidayHouseContentProviderService);
    this.preventivatoreContentProviderService.setProvider(['ge-sport-plus', 'ge-sport-premium'], PreventivatoreGeSportContentProviderService);
    this.preventivatoreContentProviderService.setProvider(['ge-travel-plus', 'ge-travel-premium'], PreventivatoreGeTravelContentProviderService);
    this.preventivatoreContentProviderService.setProvider(['ge-motor'], PreventivatoreGeMotorContentProviderService);
    this.preventivatoreContentProviderService.setProvider(['ge-home'], PreventivatoreHomeCheBancaContentProviderService);
    this.preventivatoreContentProviderService.setProvider(['ge-home-NON-DISPONIBILE'], PreventivatoreGeHouseContentProviderService);

    // checkout content service
    this.checkoutContentProviderService.setProvider(['ge-home'], CheckoutChebancaHomeContentService);


    // checkout reducer
    this.checkoutLinearStepperReducerProvider.setReducer('ge-home', () => new CheckoutLinearStepperChebancaHomeReducer());
  }

  /**
   * Get factory for componentType
   * @param componentType to get the factory for
   */
  private getFactoryFor(componentType: Type<any>): ComponentFactory<any> {
    return this.resolver.resolveComponentFactory(componentType);
  }
}
