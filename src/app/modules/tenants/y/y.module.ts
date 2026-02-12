import { ComponentFactory, ComponentFactoryResolver, Inject, NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InjectableProviderService } from 'app/core/services/injectable-provider.service';
import { ExternalProductsInsurancesService } from 'app/core/services/homefilx/external-products-insurances.service';
import { DataService, InsurancesService } from '@services';
import { ComponentMapper } from '../component-loader/component-mapper.service';
import { RegisterFormComponent } from 'app/modules/security/components/register-form/register-form.component';
import { AddressFormComponent } from 'app/modules/checkout/checkout-step/checkout-step-address/components/address-form/address-form.component';
import { UserDetailsComponent } from 'app/modules/private-area/components/user-details/user-details.component';
import { ComponentLoaderModule } from '../component-loader/component-loader.module';
import { PolicyDetailModalClaimComponent } from 'app/modules/private-area/components/policy-detail/policy-detail-modal-claim/policy-detail-modal-claim.component';
import { KenticoConfigurator } from 'app/modules/kentico/kentico-configurator.service';
import { ContactsFormComponent } from 'app/shared/contact-form/contacts-form.component';
import { EmptyComponent } from '../component-loader/empty/empty.component';
import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';
import { GTMTrigger } from 'app/core/models/gtm/gtm-settings.model';
import { TheteamComponent } from 'app/components/public/theteam/default/theteam.component';
import { ContattiComponent } from 'app/components/public/contatti/yolo/contatti.component';
import { GtmYoloItPageFiller } from './gtm-yolo-it-page-filler.service';
import { PolicyDetailModalClaimPetFormComponent } from 'app/modules/private-area/components/policy-detail/policy-detail-modal-claim-pet-form/policy-detail-modal-claim-pet-form/policy-detail-modal-claim-pet-form.component';
import { KenticoTranslateService } from '../../kentico/data-layer/kentico-translate.service';
import { PreventivatoreProductMapperService } from 'app/modules/preventivatore/services/preventivatore-product-mapper.service';
import { PreventivatoreDynamicComponent } from 'app/modules/preventivatore/preventivatore-dynamic/preventivatore-dynamic.component';
import { CheckoutLinearStepperReducerProvider } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-reducer-provider';
import { CheckoutLinearStepperYoloPetReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-yolo-pet-reducer';
import { PreventivatoreYoloCareContentProvider } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-yolo-care-content-provider.service';
import { PreventivatoreContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-content-provider-service';
import { MyPoliciesComponent } from 'app/modules/private-area/components/my-policies/my-policies.component';
import { CheckoutLinearStepperYoloCareReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-yolo-care-reducer';
import { CheckoutLinearStepperSciReducer } from '../../checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-sci-reducer';
import { SunnyPolicyDetailModalClaimComponent } from 'app/modules/private-area/components/policy-detail/sunny-policy-detail-modal-claim/sunny-policy-detail-modal-claim.component';
import { PreventivatoreComponentsProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/preventivatore-components-provider.service';
import { HeroSlidersWLayoutService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/hero-sliders-w-layout.service';
import { PreventivatoreYoloPetContentProvider } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-yolo-pet-content-provider.service';
import { PreventivatoreYoloSciContentProvider } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-yolo-sci-content-provider.service';
import { FAQableLayoutService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/faqable-layout.service';
import { FAQableVariantsLayoutService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/faqable-variants-layout.service';
import { PreventivatoreYoloSmartphoneContentProvider } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-yolo-smartphone-content-provider.service';
import { CheckoutLinearStepperCseSmartphoneReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-cse-smartphone-reducer';
import { PreventivatorePetContentProvider } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-pet-content-provider.service';
import { CheckoutLinearStepperSportReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-sport-reducer';
import { PreventivatoreSportContentProvider } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-sport-content-provider.service';
import { BgNoSliderLayoutService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/bg-no-slider-layout.service';
import { BgNoSliderYoloLayoutService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/bg-no-slider-yolo-layout.service';
import { GoldenTriangleLayoutComponentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/gt-layout-component-provider.service';
import { PreventivatoreGeBikeProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-ge-bike-content-provider.service';
import { PreventivatoreGeYoloTravelContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-ge-yolo-travel-content-provider.service';
import { PreventivatoreGeYoloSportContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-ge-yolo-sport-content-provider.service';
import { PreventivatoreGeYoloHolidayHouseContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-ge-yolo-holiday-house-content-provider.service';
import { PreventivatoreGeYoloSkiInstantContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-ge-yolo-ski-instant-content-provider.service';
import { PreventivatoreGeYoloSkiSeasonalContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-ge-yolo-ski-seasonal-content-provider.service';
import { CheckoutLinearStepperGeBikeReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-ge-bike-reducer';
import { CheckoutLinearStepperGeSportReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-ge-sport-reducer';
import { PreventivatoreGeYoloMotorContentProviderService } from '../../preventivatore/preventivatore-dynamic/services/content/preventivatore-ge-yolo-motor-content-provider.service';
import { MotorLayoutComponentProviderService } from '../../preventivatore/preventivatore-dynamic/services/product-components/motor-layout-component-provider.service';
import { CheckoutLinearStepperGeSkiReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-ge-ski-reducer';
import { CheckoutLinearStepperGeTravelReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-ge-travle-reducer';
import { CheckoutLinearStepperGeHolidayHouseReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-ge-holiday-house-reducer';
import { CheckoutLinearStepperGeSkiSeasonalReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-ge-ski-seasonal-reducer';
import { CheckoutLinearStepperGeMotorReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-ge-motor-reducer';
import { YoloDataLayerGA4PageFiller } from './yolo-dl-ga4-page-filler.service';
import { InsuranceInfoModalAutoProposalComponent } from 'app/modules/checkout/checkout-card/checkout-card-insurance-info-auto-proposal/insurance-info-modal-auto-proposal/insurance-info-modal-auto-proposal.component';
import { CheckoutInsuranceInfoMotorModalOptionalWarrantiesComponent } from 'app/modules/checkout/checkout-card/checkout-card-insurance-info-motor-optional-warranties/checkout-insurance-info-motor-modal-optional-warranties/checkout-insurance-info-motor-modal-optional-warranties.component';
import { CheckoutLinearStepperGeHomeReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-ge-home-reducer';
import { CheckoutInsuranceInfoMotorModalDetailsWarrantiesComponent } from 'app/modules/checkout/checkout-card/checkout-card-insurance-info-motor-optional-warranties/checkout-insurance-info-motor-modal-details-warranties/checkout-insurance-info-motor-modal-details-warranties.component';
import { HomeLayoutComponentProviderService } from '../../preventivatore/preventivatore-dynamic/services/product-components/home-layout-component-provider.service';
import { PreventivatoreGeYoloHomeContentProviderService } from '../../preventivatore/preventivatore-dynamic/services/content/preventivatore-ge-yolo-home-content-provider.service';
import { CheckoutInsuranceInfoPetModalOptionalWarrantiesComponent } from 'app/modules/checkout/checkout-card/checkout-card-insured-pet/checkout-insurance-info-pet-modal-optional-warranties/checkout-insurance-info-pet-modal-optional-warranties.component';
import { MyQuotesComponent } from '../../private-area/components/my-quotes/my-quotes.component';
import { PolicyDetailReplacementModalComponent } from 'app/modules/private-area/components/policy-detail/policy-detail-full/policy-detail-replacement-modal/policy-detail-replacement-modal.component';
import { ModalOwnerAdressFormComponent } from 'app/modules/checkout/checkout-step/checkout-step-address/components/address-form-ge-motor/modal-owner-adress-form/modal-owner-adress-form.component';
import { PolicyDetailReplacementSuccessHomeAnimalsModalComponent } from 'app/modules/private-area/components/policy-detail/policy-detail-full/policy-detail-replacement-success-home-animals-modal/policy-detail-replacement-success-home-animals-modal.component';
import { PolicyDetailReplacementSuccessNotInterestedModalComponent } from 'app/modules/private-area/components/policy-detail/policy-detail-full/policy-detail-replacement-success-not-interested-modal/policy-detail-replacement-success-not-interested-modal.component';
import { PreventivatoreYoloForPetContentProvider } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-yolo-for-pet-content-provider.service';
import { CheckoutLinearStepperYoloForPetReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-yolo-for-pet-reducer';
import { PreventivatoreRcMonopattinoBiciContentProvider } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-rc-monopattino-bici-content-provider.service';
import { HowWorksLikeQuotatorMobileLayoutService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/how-works-like-quotator-mobile-layout.service';
import { CheckoutCardInsuranceInfoHomeOptionalWarrantiesModalComponent } from 'app/modules/checkout/checkout-card/checkout-card-insurance-info-home-optional-warranties/checkout-card-insurance-info-home-optional-warranties-modal/checkout-card-insurance-info-home-optional-warranties-modal.component';
import { ModalRcMonopattinoBiciCoveragesComponent } from 'app/modules/preventivatore/preventivatore-dynamic/components/quotator-rc-scooter-bike/modal-rc-monopattino-bici-coverages/modal-rc-monopattino-bici-coverages.component';
import { CheckoutLinearStepperScooterBikeReducer } from '../../checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-scooter-bike-reducer';
import { PolicyDetailModalClaimScooterBikeComponent } from 'app/modules/private-area/components/policy-detail/policy-detail-modal-claim-scooter-bike/policy-detail-modal-claim-scooter-bike.component';
import { HeroCardsFaqLayoutService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/hero-cards-faq-layout.service';

import { PromoModalSciComponent } from 'app/modules/preventivatore/promo-modal-sci/promo-modal-sci.component';
import { CookiesPreferencesComponent } from '../../../components/public/cookies-preferences/cookies-preferences.component';
import { CookiesPreferencesChoiseComponent } from '../../../components/public/cookies-preferences/cookies-preferences-choise/cookies-preferences-choise.component';
import { PolicyDetailModalClaimEsComponent } from 'app/modules/private-area/components/policy-detail/policy-detail-modal-claim-es/policy-detail-modal-claim-es.component';
import { PolicyDetailModalClaimSciComponent } from 'app/modules/private-area/components/policy-detail/policy-detail-modal-claim-sci/policy-detail-modal-claim-sci.component';
import { HomepageYoloComponent } from 'app/components/public/homepage/homepage-yolo/homepage-yolo.component';
import { ModalTerminiCondizioniInvestorComponent } from 'app/components/public/investor-governance/modal-termini-condizioni-investor/modal-termini-condizioni-investor.component';
import { CheckoutLinearStepperPetReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-pet-reducer';
import { PreventivatoreMefioContentProvider } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-mefio-content-provider.service';
import { FiveTabsLayoutService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/five-tabs-layout.service';
import { YoloSportLayoutComponentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/yolo-sport-layout-component-provider.service';
import { PreventivatoreYoloSportContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-yolo-sport-content-provider.service';
import { CheckoutLinearStepperSportNewReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkoutlinear-stepper-sport-new-reducer';
import { PreventivatoreYoloViaggioContentProvider } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-yolo-viaggio-content-provider.service';
import { AxaFlightLayoutService } from '../../preventivatore/preventivatore-dynamic/services/product-components/axa-flight-layout.service';
import { AxaAnnulmentFlightLayoutService } from '../../preventivatore/preventivatore-dynamic/services/product-components/axa-annulment-flight-layout.service';
import { ModalCoveragesComponent } from 'app/modules/preventivatore/preventivatore-dynamic/components/accordion-for-what/modal-coverages/modal-coverages.component';
import { PreventivatoreYoloAnnullamentoViaggioContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-yolo-annullamento-viaggio-content-provider.service';
import { CheckoutLinearStepperYoloAnnullamentoViaggioReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-lianear-stepper-yolo-annullamento-viaggio-reducer';
import { CheckoutLinearStepperYoloViaggioReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-yolo-viaggio-reducer';
import { PolicyDetailModalClaimTravelComponent } from '../../private-area/components/policy-detail/policy-detail-modal-claim-travel/policy-detail-modal-claim-travel.component';
import { TelemedicinaLayoutService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/telemedicina-layout.service';
import { PreventivatoreTelemedicinaContentProvider } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-telemedicina-content-provider.service';
import { CheckoutLinearStepperTelemedicinaReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-telemedicina-reducer';
import { ScreenProtectionLayoutComponentProviderService } from '../../preventivatore/preventivatore-dynamic/services/product-components/screen-protection-layout-component-provider.service';
import { PreventivatoreScreenProtectionContentProviderService } from '../../preventivatore/preventivatore-dynamic/services/content/preventivatore-screen-protection-content-provider.service';
import { ModalScreenProtectionComponent } from 'app/modules/checkout/modal-screen-protection/modal-screen-protection/modal-screen-protection.component';
import { ScreenProtectionAskRefundModalComponent } from 'app/modules/checkout/screen-protection-ask-refund-modal/screen-protection-ask-refund-modal.component';
import { CheckoutContentProviderService } from 'app/modules/checkout/checkout-linear-stepper/services/content/checkout-content-provider.service';
import { CheckoutScreenProtectionContentService } from 'app/modules/checkout/checkout-linear-stepper/services/content/checkout-screen-protection-content-provider.service';
import { CheckoutLinearStepperScreenProtectionReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-screen-protection-reducer';
import { ScreenProtectionAskWithdrawalModalComponent } from 'app/modules/checkout/modal-screen-protection/screen-protection-ask-withdrawal-modal/screen-protection-ask-withdrawal-modal.component';
import { ModalScreenProtectionPromoCodeComponent } from 'app/modules/checkout/modal-screen-protection/modal-screen-protection-promo-code/modal-screen-protection-promo-code.component';
import { SkiNetComponentLayoutService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/ski-net-component-layout.service';
import { PreventivatoreYoloForSkiNetContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-yolo-for-ski-net-content-provider.service';
import { CheckoutLinearStepperYoloForSkiReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-yolo-for-ski-reducer';
import { PolicyDetailModalClaimYoloForSkiOthersModalityComponent } from './../../private-area/components/policy-detail/policy-detail-modal-claim-yolo-for-ski-others-modality/policy-detail-modal-claim-yolo-for-ski-others-modality.component';
import { SellaGeSkiLayoutComponentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/sella-ge-ski-layout-component-provider.service';
import { PreventivatoreGeWinterSportContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-ge-winter-sport-content-provider.service';
import { CheckoutLinearStepperWinterSportReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-winter-sport-reducer';
import { TenantDefault } from '../default/tenant-default.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ComponentLoaderModule
  ]
})
export class YModule {

  private readonly KENTICO_API: string = TenantDefault.KENTICO_API;

  constructor(
    private injectableProviderService: InjectableProviderService,
    private resolver: ComponentFactoryResolver,
    private componentMapper: ComponentMapper,
    private kenticoConfigurator: KenticoConfigurator,
    private kenticoTranslateService: KenticoTranslateService,
    private gtmHandlerService: GtmHandlerService,
    private gtmFillerGA4: YoloDataLayerGA4PageFiller,
    private gtmFiller: GtmYoloItPageFiller,
    private preventivatoreMapper: PreventivatoreProductMapperService,
    private checkoutLinearStepperReducerProvider: CheckoutLinearStepperReducerProvider,
    private preventivatoreContentProviderService: PreventivatoreContentProviderService,
    private preventivatoreComponentsLayoutProviderService: PreventivatoreComponentsProviderService,
    private dataService: DataService,
    private checkoutContentProviderService: CheckoutContentProviderService,
    @Inject('windowObject') private windowObject: Window
  ) {
    this.injectableProviderService.override(InsurancesService, (http, dataService) => new ExternalProductsInsurancesService(http, dataService));
    this.setupKentico();
    this.registerComponents();
    this.mapProducts();
    this.setupGtm();
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
    this.componentMapper.setComponentFor('policyModalClaim', this.getFactoryFor(PolicyDetailModalClaimComponent));
    this.componentMapper.setComponentFor('sunnyPolicyModalClaim', this.getFactoryFor(SunnyPolicyDetailModalClaimComponent));
    this.componentMapper.setComponentFor('PolicyDetailReplacementModal', this.getFactoryFor(PolicyDetailReplacementModalComponent));
    this.componentMapper.setComponentFor('PolicyDetailReplacementSuccessHomeAnimalsModal', this.getFactoryFor(PolicyDetailReplacementSuccessHomeAnimalsModalComponent));
    this.componentMapper.setComponentFor('PolicyDetailReplacementSuccessNotInterestedModal', this.getFactoryFor(PolicyDetailReplacementSuccessNotInterestedModalComponent));
    this.componentMapper.setComponentFor('ModalAutoProposal', this.getFactoryFor(InsuranceInfoModalAutoProposalComponent));
    this.componentMapper.setComponentFor('ModalOwnerAdressFormComponent', this.getFactoryFor(ModalOwnerAdressFormComponent));
    this.componentMapper.setComponentFor('ModalAutoOptionalWarranties', this.getFactoryFor(CheckoutInsuranceInfoMotorModalOptionalWarrantiesComponent));
    this.componentMapper.setComponentFor('ModalDetailsWarrantiesComponent', this.getFactoryFor(CheckoutInsuranceInfoMotorModalDetailsWarrantiesComponent));
    this.componentMapper.setComponentFor('PolicyDetailModalClaimPetForm', this.getFactoryFor(PolicyDetailModalClaimPetFormComponent));
    this.componentMapper.setComponentFor('checkoutLoginRegisterForm', this.getFactoryFor(RegisterFormComponent));
    this.componentMapper.setComponentFor('checkoutAddressForm', this.getFactoryFor(AddressFormComponent));
    this.componentMapper.setComponentFor('privateAreaUserDetails', this.getFactoryFor(UserDetailsComponent));
    this.componentMapper.setComponentFor('privateAreaMyPolicies', this.getFactoryFor(MyPoliciesComponent));
    this.componentMapper.setComponentFor('privateAreaMyQuotes', this.getFactoryFor(MyQuotesComponent));
    this.componentMapper.setComponentFor('contactsForm', this.getFactoryFor(ContactsFormComponent));
    this.componentMapper.setComponentFor('chi-siamo', this.getFactoryFor(TheteamComponent));
    this.componentMapper.setComponentFor('contatti', this.getFactoryFor(ContattiComponent));
    this.componentMapper.setComponentFor('ModalPetOptionalWarranties', this.getFactoryFor(CheckoutInsuranceInfoPetModalOptionalWarrantiesComponent));
    this.componentMapper.setComponentFor('ModalInfoComponent', this.getFactoryFor(CheckoutCardInsuranceInfoHomeOptionalWarrantiesModalComponent));
    this.componentMapper.setComponentFor('ModalRcMonopattinoBiciCoverages', this.getFactoryFor(ModalRcMonopattinoBiciCoveragesComponent));
    this.componentMapper.setComponentFor('PolicyDetailModalDoubleClaimScooterBike', this.getFactoryFor(PolicyDetailModalClaimScooterBikeComponent));
    this.componentMapper.setComponentFor('PromoModalSci', this.getFactoryFor(PromoModalSciComponent));
    this.componentMapper.setComponentFor('CookiesModal', this.getFactoryFor(CookiesPreferencesComponent));
    this.componentMapper.setComponentFor('CookiesModalChoise', this.getFactoryFor(CookiesPreferencesChoiseComponent));
    this.componentMapper.setComponentFor('PolicyDetailModalClaimEsComponent', this.getFactoryFor(PolicyDetailModalClaimEsComponent));
    this.componentMapper.setComponentFor('policyModalClaimSci', this.getFactoryFor(PolicyDetailModalClaimSciComponent));
    this.componentMapper.setComponentFor('policyModalClaimTravel', this.getFactoryFor(PolicyDetailModalClaimTravelComponent));
    this.componentMapper.setComponentFor('ModalCoverages', this.getFactoryFor(ModalCoveragesComponent));
    this.componentMapper.setComponentFor('ModalScreenProposal', this.getFactoryFor(ModalScreenProtectionComponent));
    this.componentMapper.setComponentFor('ScreenProtectionAskRefundModal', this.getFactoryFor(ScreenProtectionAskRefundModalComponent));
    this.componentMapper.setComponentFor('ScreenProtectionAskWithdrawalModal', this.getFactoryFor(ScreenProtectionAskWithdrawalModalComponent));
    this.componentMapper.setComponentFor('ModalScreenPromoCode', this.getFactoryFor(ModalScreenProtectionPromoCodeComponent));
    this.componentMapper.setComponentFor('home', this.getFactoryFor(HomepageYoloComponent));
    this.componentMapper.setComponentFor('ModalTerminiCondizioniInvestor', this.getFactoryFor(ModalTerminiCondizioniInvestorComponent));
    this.componentMapper.setComponentFor('policyDetailModalClaimYoloForSkiOthersModality', this.getFactoryFor(PolicyDetailModalClaimYoloForSkiOthersModalityComponent));
  }

  private setupKentico(): void {
    this.kenticoConfigurator.register('footer', this.KENTICO_API);
    this.kenticoConfigurator.register('quotator', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_pet', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_sport', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_sci', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_pet', this.KENTICO_API);
    this.kenticoConfigurator.register('elettrodomestici', this.KENTICO_API);
    this.kenticoConfigurator.register('seo', this.KENTICO_API);
    this.kenticoConfigurator.register('modal_sci_promo', this.KENTICO_API);
    this.kenticoConfigurator.register('claim_sunny', this.KENTICO_API);
    this.kenticoConfigurator.register('page_not_found', this.KENTICO_API);
    this.kenticoConfigurator.register('thank_you_page_precise_time', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_smartphone', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_bike_genertel', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_sport_genertel', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_sci_genertel', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_travel_genertel', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_motor_genertel', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_home_genertel', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_bike', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_travel_genertel', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_sport_genertel', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_mefio', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_holiday_house_genertel', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_ski_instant_genertel', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_ski_seasonal_genertel', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_winter_sport___genertel', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_yolo_for_pet', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_sport', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_telemedicina', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_yolo_for_pet', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_rc_monopattino_e_bici', this.KENTICO_API);
    this.kenticoConfigurator.register('alt_documents_acceptance', this.KENTICO_API);
    this.kenticoConfigurator.register('genertel_quote', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_scooter_bike', this.KENTICO_API);
    this.kenticoConfigurator.register('disclaimer_yolo_erv_sci', this.KENTICO_API);
    this.kenticoConfigurator.register('modal_open_claim_es', this.KENTICO_API);
    this.kenticoConfigurator.register('cookies_preferences_modal', this.KENTICO_API);
    this.kenticoConfigurator.register('sci_modal_open_claim', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_viaggio', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_annullamento_viaggio', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_annullamento_viaggio', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_telemedicina', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_screen_protection', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_screen_protection', this.KENTICO_API);
    this.kenticoConfigurator.register('screen_protection_promo_code_modal', this.KENTICO_API);
    this.kenticoConfigurator.register('thank_you_page_screen_protection', this.KENTICO_API);
    this.kenticoConfigurator.register('imei_code_invalid', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_ski_net', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_yolo_for_ski', this.KENTICO_API);
    this.kenticoConfigurator.register('modal_withdrawal_yolo_for_ski', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_step_1_sci', this.KENTICO_API);
    this.kenticoConfigurator.register('homepage_yolo', this.KENTICO_API);
    this.kenticoConfigurator.register('intermediaries', this.KENTICO_API);
    this.kenticoConfigurator.register('faq_intermediari', this.KENTICO_API);
    this.kenticoConfigurator.register('yolo_investor', this.KENTICO_API);
    this.kenticoConfigurator.register('governance_yolo', this.KENTICO_API);
    this.kenticoTranslateService.resolveAll();
  }
  private mapProducts() {
    this.preventivatoreMapper.register(/net-mefio/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/rbm-/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/erv-mountain/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/cc-devices/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/chubb-sport/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/chubb-sport-rec/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/ge-bike/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/ge-travel/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/ge-sport/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/ge-holiday-house/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/ge-ski/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/ge-ski-seasonal/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/ge-motor/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/ge-home/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/yolo-for-pet/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/rc-scooter-bike/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/axa-assistance/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/axa-annullament/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/virtualhospital/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/screen-protection/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/yolo-for-ski/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/winter-sport/, PreventivatoreDynamicComponent);
    this.preventivatoreComponentsLayoutProviderService.setProvider(['rbm-pandemic'], HeroSlidersWLayoutService); // TODO: use FAQableVariantsLayoutService when faqs are available
    this.preventivatoreComponentsLayoutProviderService.setProvider(['erv-mountain-gold', 'erv-mountain-silver'], HeroCardsFaqLayoutService);
    this.preventivatoreComponentsLayoutProviderService.setProvider
      (['ge-bike-plus', 'ge-bike-premium',
        'ge-travel-plus', 'ge-travel-premium',
        'ge-sport-plus', 'ge-sport-premium',
        'ge-holiday-house-plus', 'ge-holiday-house-premium',
        'ge-ski-plus', 'ge-ski-premium',
        'ge-ski-seasonal-plus', 'ge-ski-seasonal-premium',
      ],
        GoldenTriangleLayoutComponentProviderService
      );
    this.preventivatoreComponentsLayoutProviderService.setProvider(['winter-sport-plus', 'winter-sport-premium'], SellaGeSkiLayoutComponentProviderService);
    this.preventivatoreComponentsLayoutProviderService.setProvider(['net-mefio'], FiveTabsLayoutService);
    this.preventivatoreComponentsLayoutProviderService.setProvider(['cc-devices', 'yolo-for-pet'], FAQableLayoutService);
    this.preventivatoreComponentsLayoutProviderService.setProvider(['chubb-sport', 'chubb-sport-rec'], YoloSportLayoutComponentProviderService);
    this.preventivatoreComponentsLayoutProviderService.setProvider(['ge-motor-car', 'ge-motor-van'], MotorLayoutComponentProviderService);
    this.preventivatoreComponentsLayoutProviderService.setProvider(['ge-home'], HomeLayoutComponentProviderService);
    this.preventivatoreComponentsLayoutProviderService.setProvider(['rc-scooter-bike'], HowWorksLikeQuotatorMobileLayoutService);
    this.preventivatoreComponentsLayoutProviderService.setProvider(['axa-annullament'], AxaAnnulmentFlightLayoutService);
    this.preventivatoreComponentsLayoutProviderService.setProvider(['axa-assistance-gold', 'axa-assistance-silver'], AxaFlightLayoutService);
    this.preventivatoreComponentsLayoutProviderService.setProvider(['virtualhospital-monthly', 'virtualhospital-annual'], TelemedicinaLayoutService);
    this.preventivatoreComponentsLayoutProviderService.setProvider(['screen-protection'], ScreenProtectionLayoutComponentProviderService);

    this.preventivatoreContentProviderService.setProvider(['rbm-pandemic'], PreventivatoreYoloCareContentProvider);
    this.preventivatoreContentProviderService.setProvider(['net-mefio'], PreventivatoreMefioContentProvider);
    this.preventivatoreContentProviderService.setProvider(['yolo-for-pet'], PreventivatoreYoloForPetContentProvider);
    // this.preventivatoreContentProviderService.setProvider(['net-pet-gold', 'net-pet-silver'], PreventivatorePetContentProvider);
    this.preventivatoreContentProviderService.setProvider(['erv-mountain-gold', 'erv-mountain-silver'], PreventivatoreYoloSciContentProvider);
    this.preventivatoreContentProviderService.setProvider(['cc-devices'], PreventivatoreYoloSmartphoneContentProvider);
    this.preventivatoreContentProviderService.setProvider(['chubb-sport', 'chubb-sport-rec'], PreventivatoreYoloSportContentProviderService);
    this.preventivatoreContentProviderService.setProvider(['ge-bike-plus', 'ge-bike-premium'], PreventivatoreGeBikeProviderService);
    this.preventivatoreContentProviderService.setProvider(['ge-travel-plus', 'ge-travel-premium'], PreventivatoreGeYoloTravelContentProviderService);
    this.preventivatoreContentProviderService.setProvider(['ge-sport-plus', 'ge-sport-premium'], PreventivatoreGeYoloSportContentProviderService);
    this.preventivatoreContentProviderService.setProvider(['ge-holiday-house-plus', 'ge-holiday-house-premium'], PreventivatoreGeYoloHolidayHouseContentProviderService);
    this.preventivatoreContentProviderService.setProvider(['ge-ski-plus', 'ge-ski-premium'], PreventivatoreGeYoloSkiInstantContentProviderService);
    this.preventivatoreContentProviderService.setProvider(['winter-sport-plus', 'winter-sport-premium'], PreventivatoreGeWinterSportContentProviderService);
    this.preventivatoreContentProviderService.setProvider(['ge-ski-seasonal-plus', 'ge-ski-seasonal-premium'], PreventivatoreGeYoloSkiSeasonalContentProviderService);
    this.preventivatoreContentProviderService.setProvider(['ge-motor-car', 'ge-motor-van'], PreventivatoreGeYoloMotorContentProviderService);
    this.preventivatoreContentProviderService.setProvider(['rc-scooter-bike'], PreventivatoreRcMonopattinoBiciContentProvider);
    this.preventivatoreContentProviderService.setProvider(['axa-annullament'], PreventivatoreYoloAnnullamentoViaggioContentProviderService);
    this.preventivatoreContentProviderService.setProvider(['axa-assistance-gold', 'axa-assistance-silver'], PreventivatoreYoloViaggioContentProvider);
    this.preventivatoreContentProviderService.setProvider(['ge-home'], PreventivatoreGeYoloHomeContentProviderService);

    this.preventivatoreContentProviderService.setProvider(['virtualhospital-monthly', 'virtualhospital-annual'], PreventivatoreTelemedicinaContentProvider);
    this.preventivatoreContentProviderService.setProvider(['screen-protection'], PreventivatoreScreenProtectionContentProviderService);
    this.preventivatoreContentProviderService.setProvider(['yolo-for-ski-gold', 'yolo-for-ski-platinum'], PreventivatoreYoloForSkiNetContentProviderService);


    // TODO: check for genertel home coontent service
    this.preventivatoreContentProviderService.setProvider(['ge-home'], PreventivatoreGeYoloHomeContentProviderService);
    this.preventivatoreComponentsLayoutProviderService.setProvider(['yolo-for-ski-gold', 'yolo-for-ski-platinum'], SkiNetComponentLayoutService);

    // ################## N.B. ################################
    // When registering a chekcout content service do it from the module,
    // do not an OR statment in the checkoutContentProviderService !!!
    this.checkoutContentProviderService.setProvider(['screen-protection'], CheckoutScreenProtectionContentService);

    // this.checkoutLinearStepperReducerProvider.setReducer('net-pet', () => new CheckoutLinearStepperYoloPetReducer());
    // this.checkoutLinearStepperReducerProvider.setReducer('net-pet-gold', () => new CheckoutLinearStepperYoloPetReducer());
    // this.checkoutLinearStepperReducerProvider.setReducer('net-pet-silver', () => new CheckoutLinearStepperYoloPetReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('net-mefio', () => new CheckoutLinearStepperPetReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('rbm-pandemic', () => new CheckoutLinearStepperYoloCareReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('erv-mountain-gold', () => new CheckoutLinearStepperSciReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('erv-mountain-silver', () => new CheckoutLinearStepperSciReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('yolo-for-ski-gold', () => new CheckoutLinearStepperYoloForSkiReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('yolo-for-ski-platinum', () => new CheckoutLinearStepperYoloForSkiReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('cc-devices', () => new CheckoutLinearStepperCseSmartphoneReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('chubb-sport', () => new CheckoutLinearStepperSportNewReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('chubb-sport-rec', () => new CheckoutLinearStepperSportNewReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('ge-bike-plus', () => new CheckoutLinearStepperGeBikeReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('ge-bike-premium', () => new CheckoutLinearStepperGeBikeReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('ge-sport-plus', () => new CheckoutLinearStepperGeSportReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('ge-sport-premium', () => new CheckoutLinearStepperGeSportReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('ge-ski-plus', () => new CheckoutLinearStepperGeSkiReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('ge-ski-premium', () => new CheckoutLinearStepperGeSkiReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('ge-travel-plus', () => new CheckoutLinearStepperGeTravelReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('ge-travel-premium', () => new CheckoutLinearStepperGeTravelReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('ge-holiday-house-plus', () => new CheckoutLinearStepperGeHolidayHouseReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('ge-holiday-house-premium', () => new CheckoutLinearStepperGeHolidayHouseReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('ge-ski-seasonal-plus', () => new CheckoutLinearStepperGeSkiSeasonalReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('ge-ski-seasonal-premium', () => new CheckoutLinearStepperGeSkiSeasonalReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('ge-motor-car', () => new CheckoutLinearStepperGeMotorReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('ge-motor-van', () => new CheckoutLinearStepperGeMotorReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('ge-home', () => new CheckoutLinearStepperGeHomeReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('yolo-for-pet', () => new CheckoutLinearStepperYoloForPetReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('virtualhospital-monthly', () => new CheckoutLinearStepperTelemedicinaReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('virtualhospital-annual', () => new CheckoutLinearStepperTelemedicinaReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('rc-scooter-bike', () => new CheckoutLinearStepperScooterBikeReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('axa-annullament', () => new CheckoutLinearStepperYoloAnnullamentoViaggioReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('axa-assistance-silver', () => new CheckoutLinearStepperYoloViaggioReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('axa-assistance-gold', () => new CheckoutLinearStepperYoloViaggioReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('screen-protection', () => new CheckoutLinearStepperScreenProtectionReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('winter-sport-plus', () => new CheckoutLinearStepperWinterSportReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('winter-sport-premium', () => new CheckoutLinearStepperWinterSportReducer());
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

function ScreenProtectionAskRefundModal(ScreenProtectionAskRefundModal: any): ComponentFactory<any> {
  throw new Error('Function not implemented.');
}
