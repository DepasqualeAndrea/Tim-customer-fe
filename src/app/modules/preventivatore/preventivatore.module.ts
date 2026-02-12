import { TimHeroPurchaseComponent } from './preventivatore-dynamic/components/tim-hero-purchase/tim-hero-purchase.component';
import { QuotatorBaggageLossComponent } from './preventivatore-dynamic/components/quotator-baggage-loss/quotator-baggage-loss.component';
import { FaqComponent } from './preventivatore-dynamic/components/faq/faq.component';
import { BgImgHeroBreadcrumbComponent } from './preventivatore-dynamic/components/bg-img-hero-breadcrumb/bg-img-hero-breadcrumb.component';
import { WhatToKnowComponent } from './preventivatore-dynamic/components/what-to-know/what-to-know.component';
import { HowWorksTableCardComponent } from './preventivatore-dynamic/components/how-works-table-card/how-works-table-card.component';
import { PreventivatoreKenticoComponent } from './preventivatore-kentico/preventivatore-kentico.component';
import { QuotatorTravelPackComponent } from './partials/quotator-travel-pack.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { RouterService } from '../../core/services/router.service';
import { PreventivatoreRoutingModule } from './preventivatore-routing.module';
import { PreventivatoreComponent } from './preventivatore/preventivatore.component';
import { SportCtComponent } from './partials/sport-ct.component';
import { SportCbComponent } from './partials/sport-cb.component';
import { BikeCbComponent } from './partials/bike-cb.component';
import { ViaggiComponent } from './partials/viaggi.component';
import { ViaggiCbComponent } from './partials/viaggi-cb.component';
import { ViaggiCtComponent } from './partials/viaggi-ct.component';
import { ProductsBreadcrumbComponent } from './partials/products-breadcrumb/products-breadcrumb.component';
import { SmartphoneTabletComponent } from './partials/smartphone-tablet.component';
import { SmartphoneTabletCtComponent } from './partials/smartphone-tablet-ct.component';
import { AnnullamentoComponent } from './partials/annullamento.component';
import { VoloComponent } from './partials/volo.component';
import { QuotatorVariantsComponent } from './partials/quotator-variants.component';
import { DefaultPreventivoComponent } from './partials/default-preventivo.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IncludedComponent } from './included/included.component';
import { CardIncludeComponent } from './card-include/card-include.component';
import { HeaderThemaY } from './header/themaY/themaY.component';
import { ConfiguratoreLayoutComponent } from './partials/configuratore-layout/configuratore-layout.component';
import { ConfiguratoreCtLayoutComponent } from './partials/configuratore-ct-layout/configuratore-ct-layout.component';
import { ConfiguratoreCbLayoutComponent } from './partials/configuratore-cb-layout/configuratore-cb-layout.component';
import { QuotatorSimpleComponent } from './partials/quotator-simple.component';
import { QuotatorSimpleCtComponent } from './partials/quotator-simple-ct.component';
import { HowWorksPrevComponent } from './how-works-prev/how-works-prev.component';
import { HowWorksTableComponent } from './how-works-table/how-works-table.component';
import { HowWorksCbComponent } from './how-works-cb/how-works-cb.component';
import { WhatToKnowYComponent } from './what-to-know-y/what-to-know-y.component';
import { WhatToKnowCtComponent } from './what-to-know-ct/what-to-know-ct.component';
import { WhatToKnowCbComponent } from './what-to-know-cb/what-to-know-cb.component';
import { QuotatorPeopleVariantsComponent } from './partials/quotator-people-variants.component';
import { ProtezioneVoloComponent } from './partials/protezione-volo.component';
import { ViaggioEuropaComponent } from './partials/viaggio-europa.component';
import { ProductFoundComponent } from './product-found/product-found.component';
import { MotorCbComponent } from './partials/motor-cb.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { MyMobilityComponent } from './partials/my-mobility.component';
import { SunnyComponent } from './partials/sunny.component';
import { BlockUIModule } from 'ng-block-ui';
import { AgeSelectorComponent } from './age-selector/age-selector.component';
import { SciCbComponent } from './partials/sci-cb.component';
import { PreventivatoreHeaderComponent } from './header/preventivatore-header/preventivatore-header.component';
import { HolidayHomeComponent } from './partials/holidayhome-cb.component';
import { LegalProtectionComponent } from './partials/legal-protection/legal-protection.component';
import { LegalProtectionAddonsComponent } from './partials/legal-protection/legal-protection-addons.component';
import { QuotatorIspPet } from './partials/quotator-isp-pet.component';
import { ActivatedPolicyComponent } from './activated-policy/activated-policy.component';
import { ComponentLoaderModule } from '../tenants/component-loader/component-loader.module';
import { HeaderThemaIntesa } from './header/themaIntesa/themaIntesa.component';
import { SportsSpainComponent } from './partials/sports-spain/sports-spain.component';
import { ProductLandingComponent } from './product-landing/product-landing.component';
import { QuotatorSportPackComponent } from './partials/quotator-sport-pack.component';
import { PandemicBusinessComponent } from './partials/pandemic/pandemic-business/pandemic-business.component';
import { PandemicBusinessAddonsComponent } from './partials/pandemic/pandemic-business/pandemic-business-addons.component';
import { HowWorksTableSliderComponent } from './preventivatore-dynamic/components/how-works-table-slider/how-works-table-slider.component';
import { WhatToKnowSliderComponent } from './preventivatore-dynamic/components/what-to-know-slider/what-to-know-slider.component';
import { PreventivatoreAbstractComponent } from './preventivatore-dynamic/components/preventivatore-abstract/preventivatore-abstract.component';
import { PreventivatoreDynamicComponent } from './preventivatore-dynamic/preventivatore-dynamic.component';
import { HeroQuotatorComponent } from './preventivatore-dynamic/components/hero-quotator/hero-quotator.component';
import { ConfiguratoreBasicLayoutComponent } from './preventivatore-dynamic/components/configuratore-basic-layout/configuratore-basic-layout.component';
import { QuotatorPeopleVariantsBasicComponent } from './preventivatore-dynamic/components/quotator-people-variants-basic/quotator-people-variants-basic.component';
import { QuotatorVariantsBasicComponent } from './preventivatore-dynamic/components/quotator-variants-basic/quotator-variants-basic.component';
import { QuotatorBasicComponent } from './preventivatore-dynamic/components/quotator-basic/quotator-basic.component';
import { MoreInfoComponent } from './preventivatore-dynamic/components/more-info/more-info.component';
import { ForWhoComponent } from './preventivatore-dynamic/components/for-who/for-who.component';
import { PreventivatoreLoaderComponent } from './preventivatore-loader.component';
import { BgImgHeroComponent } from './preventivatore-dynamic/components/bg-img-hero/bg-img-hero.component';
import { QuotatorSmartphoneComponent } from './preventivatore-dynamic/components/quotator-smartphone/quotator-smartphone.component';
import { QuotatorLeasysComponent } from './preventivatore-dynamic/components/quotator-leasys/quotator-leasys.component';
import { SelectedValuesDirective } from './preventivatore-dynamic/components/selected-values-directive/selected-values-directive';
import { PreventivatoreDiscountCodeDynamicComponent } from './preventivatore-discount-code-dynamic/preventivatore-discount-code-dynamic.component';
import { BgImgHeroDCComponent } from './preventivatore-discount-code-dynamic/components/bg-img-hero/bg-img-hero-dc.component';
import { PreventivatoreDiscountCodeAbstractComponent } from './preventivatore-discount-code-dynamic/components/preventivatore-abstract/preventivatore-discount-code-abstract.component';
import { QuotatorTiresFreeComponent } from './preventivatore-discount-code-dynamic/components/quotator-tires-free/quotator-tires-free.component';
import { HowWorksTableSliderDCComponent } from './preventivatore-discount-code-dynamic/components/how-works-table-slider/how-works-table-slider-dc.component';
import { WhatToKnowSliderDCComponent } from './preventivatore-discount-code-dynamic/components/what-to-know-slider-dc/what-to-know-slider-dc.component';
import { QuotatorMoparStdComponent } from './preventivatore-dynamic/components/quotator-mopar-std/quotator-mopar-std.component';
import { BgImgComponent } from './preventivatore-dynamic/components/bg-img/bg-img.component';
import { BreadcrumbsComponent } from './preventivatore-dynamic/components/breadcrumbs/breadcrumbs.component';
import { HowWorksSingleTableSliderComponent } from './preventivatore-dynamic/components/how-works-single-table-slider/how-works-single-table-slider.component';
import { QuoteComponent } from './preventivatore-dynamic/components/quote/quote.component';
import { BgImgQuoteComponent } from './preventivatore-dynamic/components/bg-img-quote/bg-img-quote.component';
import { HowWorksWhithoutSliderComponent } from './preventivatore-dynamic/components/how-works-whithout-slider/how-works-whithout-slider.component';
import { QuotationRedirectButtonComponent } from './preventivatore-dynamic/components/quotation-redirect-button/quotation-redirect-button.component';
import { TimHeroComponent } from './preventivatore-dynamic/components/tim-hero/tim-hero.component';
import { WhatToKnowColorsComponent } from './preventivatore-dynamic/components/what-to-know-colors/what-to-know-colors.component';
import { HowWorksTableSliderTimComponent } from './preventivatore-dynamic/components/how-works-table-slider-tim/how-works-table-slider-tim.component';
import { AdditionalGuaranteesSliderComponent } from './preventivatore-dynamic/components/additional-guarantees-slider/additional-guarantees-slider.component';
import { ModalErrorComponent } from './modal-error/modal-error.component';
import { AgencyOfferActivationComponent } from './preventivatore-dynamic/components/agency-offer-activation/agency-offer-activation.component';
import { PreventivatoreDynamicWithTokenComponent } from './preventivatore-dynamic/preventivatore-dynamic-with-token.component';
import { ProductFaqComponent } from './product-faq/product-faq.component';
import { TimHeroPriceComponent } from './preventivatore-dynamic/components/tim-hero-price/tim-hero-price.component';
import { QuotatorTravelCivibankComponent } from './preventivatore-dynamic/components/quotator-travel-civibank/quotator-travel-civibank.component';
import { QuotatorRcFcaComponent } from './preventivatore-dynamic/components/quotator-rc-fca/quotator-rc-fca.component';
import { ProductsCarouselComponent } from './preventivatore-dynamic/components/products-carousel/products-carousel.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MoreInfoTwoButtonsComponent } from './preventivatore-dynamic/components/more-info-two-buttons/more-info-two-buttons.component';
import { BgImgBigQuotatorComponent } from './preventivatore-dynamic/components/bg-img-big-quotator/bg-img-big-quotator.component';
import { ConfiguratoreBigQuotatorLayoutComponent } from './preventivatore-dynamic/components/configuratore-big-quotator-layout/configuratore-big-quotator-layout.component';
import { HowWorksTableMultipleTabsComponent } from './preventivatore-dynamic/components/how-works-table-multiple-tabs/how-works-table-multiple-tabs.component';
import { QuotatorMultiplePetComponent } from './preventivatore-dynamic/components/quotator-multiple-pet/quotator-multiple-pet.component';
import { ForWhoAlsoMobileComponent } from './preventivatore-dynamic/components/for-who-also-mobile/for-who-also-mobile.component';
import { QuotatorCyberComponent } from './preventivatore-dynamic/components/quotator-cyber/quotator-cyber.component';
import { BgImgHeroQuotatorComponent } from './preventivatore-dynamic/components/bg-img-hero-quotator/bg-img-hero-quotator.component';
import { QuotatorYoloSportComponent } from './preventivatore-dynamic/components/quotator-yolo-sport/quotator-yolo-sport.component';
import { HowWorksNoTabsComponent } from './preventivatore-dynamic/components/how-works-no-tabs/how-works-no-tabs.component';
import { WhatOffersCollapseComponent } from './preventivatore-dynamic/components/what-offers-collapse/what-offers-collapse.component';
import { QuotatorGeBikeComponent } from './preventivatore-dynamic/components/quotator-ge-bike/quotator-ge-bike.component';
import { QuotatorGeSportComponent } from './preventivatore-dynamic/components/quotator-ge-sport/quotator-ge-sport.component';
import { OptionalWarrantyComponent } from './preventivatore-dynamic/components/optional-warranty/optional-warranty.component';
import { HowWorksWithBorderGaranteeComponent } from './preventivatore-dynamic/components/how-works-with-border-garantee/how-works-with-border-garantee.component';
import { ForWhoWithBorderComponent } from './preventivatore-dynamic/components/for-who-with-border/for-who-with-border.component';
import { QuotatorGeSkiComponent } from './preventivatore-dynamic/components/quotator-ge-ski/quotator-ge-ski.component';
import { ServiceProtectionAndMonitoringComponent } from './preventivatore-dynamic/components/service-protection-and-monitoring/service-protection-and-monitoring.component';
import { QuotatorGeViaggioComponent } from './preventivatore-dynamic/components/quotator-ge-viaggio/quotator-ge-viaggio.component';
import { QuotatorGeHolidayHomeComponent } from './preventivatore-dynamic/components/quotator-ge-holiday-home/quotator-ge-holiday-home.component';
import { QuotatorMotorGenertelComponent } from './preventivatore-dynamic/components/quotator-motor-genertel/quotator-motor-genertel.component';
import { ConfiguratoreBasicLayoutTwoComponent } from './preventivatore-dynamic/components/configuratore-basic-layout-two/configuratore-basic-layout-two.component';
import { HeroQuotatorWithConfigLayoutTwoComponent } from './preventivatore-dynamic/components/hero-quotator-with-config-layout-two/hero-quotator-with-config-layout-two.component';
import { QuotatorBaggageLossLongTermComponent } from './preventivatore-dynamic/components/quotator-baggage-loss-lt/quotator-baggage-loss-lt.component';
import { QuotatorHomeGenertelComponent } from './preventivatore-dynamic/components/quotator-home-genertel/quotator-home-genertel.component';
import { WhatToKnowDropdownComponent } from './preventivatore-dynamic/components/what-to-know-dropdown/what-to-know-dropdown.component';
import { ProductDetailSectionComponent } from './preventivatore-dynamic/components/product-detail-section/product-detail-section.component';
import { ProductDetailSectionInfoModalComponent } from './preventivatore-dynamic/components/product-detail-section/product-detail-section-info-modal/product-detail-section-info-modal.component';
import { ProductsSliderCustomersComponent } from './preventivatore-dynamic/components/products-slider-customers/products-slider-customers.component';
import { HowWorksCardLikeQuotatorComponent } from './preventivatore-dynamic/components/how-works-card-like-quotator/how-works-card-like-quotator.component';
import { PrefooterTimComponent } from '../../components/public/footer/prefooter-tim/prefooter-tim.component';
import { ConfiguratoreBasicDesktopCardsMobileLayoutComponent } from './preventivatore-dynamic/components/configuratore-basic-desktop-cards-mobile-layout/configuratore-basic-desktop-cards-mobile-layout.component';
import { HeroQuotatorScooterBikeComponent } from './preventivatore-dynamic/components/hero-quotator-scooter-bike/hero-quotator-scooter-bike.component';
import { QuotatorRcScooterBikeComponent } from './preventivatore-dynamic/components/quotator-rc-scooter-bike/quotator-rc-scooter-bike.component';
import { ModalRcMonopattinoBiciCoveragesComponent } from './preventivatore-dynamic/components/quotator-rc-scooter-bike/modal-rc-monopattino-bici-coverages/modal-rc-monopattino-bici-coverages.component';
import { AdditionalSingleCoveragesComponent } from './preventivatore-dynamic/components/additional-single-coverages/additional-single-coverages.component';
import { WhatToKnowCardsComponent } from './preventivatore-dynamic/components/what-to-know-cards/what-to-know-cards.component';
import { HowWorksTableTabsComponent } from './preventivatore-dynamic/components/how-works-table-tabs/how-works-table-tabs.component';
import { DisclaimerComponent } from './preventivatore-dynamic/components/disclaimer/disclaimer.component';
import { PromoModalSciComponent } from './promo-modal-sci/promo-modal-sci.component';
import { QuotatorSciGenertelComponent } from './preventivatore-dynamic/components/quotator-sci-genertel/quotator-sci-genertel.component';
import { OnlyQuotatorComponent } from './preventivatore-dynamic/components/only-quotator/only-quotator.component';
import { ConfiguratorOnlyQuotatorLayoutComponent } from './preventivatore-dynamic/components/configurator-only-quotator-layout/configurator-only-quotator-layout.component';
import { MoreInfoWithoutButtonComponent } from './preventivatore-dynamic/components/more-info-without-button/more-info-without-button.component';
import { WhatToKnowMoreInformationComponent } from './preventivatore-dynamic/components/what-to-know-more-information/what-to-know-more-information.component';
import { QuotatorScreenProtectionComponent } from './preventivatore-dynamic/components/quotator-screen-protection/quotator-screen-protection.component';
import { HowWorksContributionRepairComponent } from './preventivatore-dynamic/components/how-works-contribution-repair/how-works-contribution-repair.component';
import { HowWorksCardsComponent } from './preventivatore-dynamic/components/how-works-cards/how-works-cards.component';
import { WhatToKnowMefioComponent } from './preventivatore-dynamic/components/what-to-know-mefio/what-to-know-mefio.component';
import { ModalSportImaginIncludeComponent } from './modal-sport-imagin-include/modal-sport-imagin-include.component';
import { QuotatorStickyMefioComponent } from './preventivatore-dynamic/components/quotator-sticky-mefio/quotator-sticky-mefio.component';
import { FaqPreventivatoreNewComponent } from './preventivatore-dynamic/components/faq-preventivatore-new/faq-preventivatore-new.component';
import { AccordionForWhatComponent } from './preventivatore-dynamic/components/accordion-for-what/accordion-for-what.component';
import { ModalCoveragesComponent } from './preventivatore-dynamic/components/accordion-for-what/modal-coverages/modal-coverages.component';
import { YoloViaggiGoldGuaranteeComponent } from './yolo-viaggi-gold-guarantee/yolo-viaggi-gold-guarantee.component';
import { ModalCoveragesHolidayComponent } from './preventivatore-dynamic/components/accordion-for-what/modal-coverages-holiday/modal-coverages-holiday/modal-coverages-holiday.component';
import { YoloSportQuotatorComponent } from './preventivatore-dynamic/components/yolo-sport-quotator/yolo-sport-quotator.component';
import { WhatToKnowSliderBgColorComponent } from './preventivatore-dynamic/components/what-to-know-slider-bg-color/what-to-know-slider-bg-color.component';
import { HowWorksDoubleColNoTableComponent } from './preventivatore-dynamic/components/how-works-double-col-no-table/how-works-double-col-no-table.component';
import { QuotatorAxaAnnullamentoViaggioComponent } from './preventivatore-dynamic/components/quotator-axa-annullamento-viaggio/quotator-axa-annullamento-viaggio.component';
import { QuotatorAxaViaggioComponent } from './preventivatore-dynamic/components/quotator-axa-viaggio/quotator-axa-viaggio.component';
import { QuotatorTelemedicinaComponent } from './preventivatore-dynamic/components/quotator-telemedicina/quotator-telemedicina.component';
import { HowWorksTelemedicinaComponent } from './preventivatore-dynamic/components/how-works-telemedicina/how-works-telemedicina.component';
import { WhatToKnowTelemedicinaComponent } from './preventivatore-dynamic/components/what-to-know-telemedicina/what-to-know-telemedicina.component';
import { TelemedicinaHeroQuotatorComponent } from './preventivatore-dynamic/components/telemedicina-hero-quotator/telemedicina-hero-quotator.component';
import { QuotatorStickyTelemedicinaComponent } from './preventivatore-dynamic/components/quotator-sticky-telemedicina/quotator-sticky-telemedicina.component';
import { HowWorksTableMultipleTabsAccordionComponent } from './preventivatore-dynamic/components/how-works-table-multiple-tabs-accordion/how-works-table-multiple-tabs-accordion.component';
import { HowWorksTableCardCollapseComponent } from './preventivatore-dynamic/components/how-works-table-card-collapse/how-works-table-card-collapse.component';
import { QuotatorGeWinterSportComponent } from './preventivatore-dynamic/components/quotator-ge-winter-sport/quotator-ge-winter-sport.component';
import { QuotatorYoloForSkiComponent } from './preventivatore-dynamic/components/quotator-yolo-for-ski/quotator-yolo-for-ski.component';
import { QuotatorYMultirischiComponent } from './preventivatore-dynamic/components/quotator-y-multirischi/quotator-y-multirischi.component';
import { HowWorksCoveragesComponent } from './preventivatore-dynamic/components/how-works-coverages/how-works-coverages.component';
import { WhatIsForYoloMultirischiComponent } from './what-is-for-yolo-multirischi/what-is-for-yolo-multirischi.component';
import { QuotatorYMultirischiModalAtecoVatComponent } from './preventivatore-dynamic/components/quotator-y-multirischi/quotator-y-multirischi-modal-ateco-vat/quotator-y-multirischi-modal-ateco-vat.component';
import { QuotatorYMultirischiModalErrorFormatComponent } from './preventivatore-dynamic/components/quotator-y-multirischi/quotator-y-multirischi-modal-error-format/quotator-y-multirischi-modal-error-format.component';
import { PreventivatoreRedirectComponent } from './preventivatore-redirect.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        PreventivatoreRoutingModule,
        NgMultiSelectDropDownModule.forRoot(),
        NgbModule,
        BlockUIModule.forRoot(),
        ScrollToModule.forRoot(),
        ComponentLoaderModule,
        SlickCarouselModule,
    ],
    declarations: [
        HowWorksPrevComponent,
        HowWorksTableComponent,
        HowWorksCbComponent,
        WhatToKnowYComponent,
        WhatToKnowCtComponent,
        WhatToKnowCbComponent,
        PreventivatoreComponent,
        PreventivatoreKenticoComponent,
        SportCtComponent,
        SportCbComponent,
        BikeCbComponent,
        HolidayHomeComponent,
        MotorCbComponent,
        DefaultPreventivoComponent,
        ViaggiCbComponent,
        ViaggiCtComponent,
        ViaggiComponent,
        SmartphoneTabletComponent,
        SmartphoneTabletCtComponent,
        AnnullamentoComponent,
        VoloComponent,
        QuotatorVariantsComponent,
        ViaggioEuropaComponent,
        QuotatorPeopleVariantsComponent,
        IncludedComponent,
        CardIncludeComponent,
        HeaderThemaY,
        HeaderThemaIntesa,
        ConfiguratoreLayoutComponent,
        ConfiguratoreCtLayoutComponent,
        ConfiguratoreCbLayoutComponent,
        QuotatorSimpleComponent,
        QuotatorSimpleCtComponent,
        ProtezioneVoloComponent,
        ProductFoundComponent,
        ProductsBreadcrumbComponent,
        MyMobilityComponent,
        SunnyComponent,
        AgeSelectorComponent,
        SciCbComponent,
        PreventivatoreHeaderComponent,
        LegalProtectionComponent,
        LegalProtectionAddonsComponent,
        QuotatorIspPet,
        ActivatedPolicyComponent,
        QuotatorTravelPackComponent,
        QuotatorSportPackComponent,
        SportsSpainComponent,
        ProductLandingComponent,
        PandemicBusinessComponent,
        PandemicBusinessAddonsComponent,
        HowWorksTableSliderComponent,
        WhatToKnowSliderComponent,
        PreventivatoreAbstractComponent,
        PreventivatoreDynamicComponent,
        PreventivatoreDynamicWithTokenComponent,
        HeroQuotatorComponent,
        ConfiguratoreBasicLayoutComponent,
        QuotatorPeopleVariantsBasicComponent,
        QuotatorVariantsBasicComponent,
        QuotatorBasicComponent,
        MoreInfoComponent,
        MoreInfoTwoButtonsComponent,
        ForWhoComponent,
        PreventivatoreLoaderComponent,
        PreventivatoreRedirectComponent,
        BgImgHeroComponent,
        BgImgHeroBreadcrumbComponent,
        BgImgComponent,
        BgImgQuoteComponent,
        QuotatorSmartphoneComponent,
        QuotatorLeasysComponent,
        SelectedValuesDirective,
        PreventivatoreDiscountCodeDynamicComponent,
        PreventivatoreDiscountCodeAbstractComponent,
        BgImgHeroDCComponent,
        QuotatorTiresFreeComponent,
        HowWorksTableSliderDCComponent,
        WhatToKnowSliderDCComponent,
        HowWorksTableCardComponent,
        WhatToKnowComponent,
        QuotatorMoparStdComponent,
        BreadcrumbsComponent,
        QuoteComponent,
        QuotationRedirectButtonComponent,
        HowWorksSingleTableSliderComponent,
        HowWorksWhithoutSliderComponent,
        QuotationRedirectButtonComponent,
        TimHeroComponent,
        WhatToKnowColorsComponent,
        HowWorksTableSliderTimComponent,
        AdditionalGuaranteesSliderComponent,
        ModalErrorComponent,
        FaqComponent,
        AgencyOfferActivationComponent,
        ProductFaqComponent,
        TimHeroPriceComponent,
        QuotatorTravelCivibankComponent,
        QuotatorBaggageLossComponent,
        QuotatorRcFcaComponent,
        ProductsCarouselComponent,
        BgImgBigQuotatorComponent,
        ConfiguratoreBigQuotatorLayoutComponent,
        HowWorksTableMultipleTabsComponent,
        QuotatorMultiplePetComponent,
        ForWhoAlsoMobileComponent,
        TimHeroPurchaseComponent,
        QuotatorCyberComponent,
        BgImgHeroQuotatorComponent,
        QuotatorYoloSportComponent,
        HowWorksNoTabsComponent,
        WhatOffersCollapseComponent,
        QuotatorGeBikeComponent,
        QuotatorGeSportComponent,
        OptionalWarrantyComponent,
        HowWorksWithBorderGaranteeComponent,
        ForWhoWithBorderComponent,
        QuotatorGeSkiComponent,
        ServiceProtectionAndMonitoringComponent,
        QuotatorGeViaggioComponent,
        QuotatorGeHolidayHomeComponent,
        ForWhoWithBorderComponent,
        QuotatorMotorGenertelComponent,
        ConfiguratoreBasicLayoutTwoComponent,
        HeroQuotatorWithConfigLayoutTwoComponent,
        QuotatorBaggageLossLongTermComponent,
        QuotatorHomeGenertelComponent,
        WhatToKnowDropdownComponent,
        ProductDetailSectionComponent,
        ProductDetailSectionInfoModalComponent,
        ProductsSliderCustomersComponent,
        HowWorksCardLikeQuotatorComponent,
        PrefooterTimComponent,
        ConfiguratoreBasicDesktopCardsMobileLayoutComponent,
        HeroQuotatorScooterBikeComponent,
        QuotatorRcScooterBikeComponent,
        ModalRcMonopattinoBiciCoveragesComponent,
        AdditionalSingleCoveragesComponent,
        HowWorksTableTabsComponent,
        WhatToKnowCardsComponent,
        DisclaimerComponent,
        PromoModalSciComponent,
        QuotatorSciGenertelComponent,
        OnlyQuotatorComponent,
        ConfiguratorOnlyQuotatorLayoutComponent,
        MoreInfoWithoutButtonComponent,
        WhatToKnowMoreInformationComponent,
        HowWorksCardsComponent,
        WhatToKnowMefioComponent,
        QuotatorStickyMefioComponent,
        ModalSportImaginIncludeComponent,
        QuotatorScreenProtectionComponent,
        HowWorksContributionRepairComponent,
        FaqPreventivatoreNewComponent,
        AccordionForWhatComponent,
        ModalCoveragesComponent,
        YoloViaggiGoldGuaranteeComponent,
        ModalCoveragesHolidayComponent,
        YoloSportQuotatorComponent,
        WhatToKnowSliderBgColorComponent,
        HowWorksDoubleColNoTableComponent,
        QuotatorAxaAnnullamentoViaggioComponent,
        QuotatorAxaViaggioComponent,
        QuotatorTelemedicinaComponent,
        HowWorksTelemedicinaComponent,
        WhatToKnowTelemedicinaComponent,
        TelemedicinaHeroQuotatorComponent,
        QuotatorStickyTelemedicinaComponent,
        HowWorksTableMultipleTabsAccordionComponent,
        HowWorksTableCardCollapseComponent,
        QuotatorYMultirischiComponent,
        HowWorksCoveragesComponent,
        WhatIsForYoloMultirischiComponent,
        QuotatorYMultirischiModalAtecoVatComponent,
        QuotatorYMultirischiModalErrorFormatComponent,
        QuotatorYoloForSkiComponent,
        QuotatorGeWinterSportComponent
    ],
    providers: [
        RouterService
    ]
})
export class PreventivatoreModule {
}
