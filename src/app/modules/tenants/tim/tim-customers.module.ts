import { CommonModule } from '@angular/common';
import { ComponentFactory, ComponentFactoryResolver, NgModule, Type } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComplaintsTimComponent } from 'app/components/public/complaints/complaints-tim/complaints-tim.component';
import { TimCustomersContactsFormComponent } from 'app/components/public/contatti/tim/tim-customers-contacts-form/tim-customers-contacts-form.component';
import { LandingPageTimCustomersComponent } from 'app/components/public/landing-page/landing-page-tim-customers/landing-page-tim-customers.component';
import { MainPageComponent } from 'app/components/public/main-page/main-page.component';
import { NavbarTimCustomersComponent } from 'app/components/public/navbar/navbar-tim/navbar-tim-customers/navbar-tim-customers.component';
import { ModalPrivacyComponent } from 'app/components/public/privacy/modal-privacy/modal-privacy.component';
import { ProductsTimCustomersComponent } from 'app/components/public/products-container/products-tim-customers/products-tim-customers.component';
import { SupportByProductTimComponent } from 'app/components/public/support/support-tim/support-by-product-tim/support-by-product-tim.component';
import { GTMTrigger } from 'app/core/models/gtm/gtm-settings.model';
import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';


import { LoginRegisterTimCustomersCheckoutComponent } from 'app/modules/security/components/login-register/login-register-tim-customers-checkout/login-register-tim-customers-checkout.component';

import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { KenticoConfigurator } from 'app/modules/kentico/kentico-configurator.service';
import { NYP_KENTICO_SLUG, SELLER_CODE_KENTICO_SLUG, TIM_BILL_PROTECTION_2_KENTICO_SLUG, TIM_BILL_PROTECTION_KENTICO_SLUG, TIM_BILL_PROTECTOR_KENTICO_SLUG, TIM_EHEALTH_QUIXA_STANDARD_KENTICO_SLUG, TIM_FOR_SKI_KENTICO_SLUG, TIM_MY_PET_KENTICO_SLUG, TIM_PROTEZIONE_CASA_KENTICO_SLUG, TIM_PROTEZIONE_VIAGGI_KENTICO_SLUG, TIM_SPORT_KENTICO_SLUG } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { PolicyConfirmModalClaimHomeProtectionComponent } from 'app/modules/nyp-checkout/modules/nyp-private-area/modal/policy-confirm-modal-claim-home-protection/policy-confirm-modal-claim-home-protection.component';
import { PolicyDetailModalDoubleClaimHomeProtectionComponent } from 'app/modules/nyp-checkout/modules/nyp-private-area/modal/policy-detail-modal-double-claim-home-protection/policy-detail-modal-double-claim-home-protection.component';

import { PrivateAreaModule } from 'app/modules/private-area/private-area.module';
import { ModalFtthTimHomeComponent } from 'app/modules/security/components/login/modal-ftth-tim-home/modal-ftth-tim-home.component';
import { SecurityModule } from 'app/modules/security/security.module';
import { SharedModule } from 'app/shared/shared.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { CookiesPreferencesChoiseComponent } from '../../../components/public/cookies-preferences/cookies-preferences-choise/cookies-preferences-choise.component';
import { CookiesPreferencesComponent } from '../../../components/public/cookies-preferences/cookies-preferences.component';

import { PolicyConfirmModalClaimTimMySciComponent } from 'app/modules/nyp-checkout/modules/nyp-private-area/modal/policy-confirm-modal-claim-tim-my-sci/policy-confirm-modal-claim-tim-my-sci.component';
import { PolicyDetailModalDoubleClaimTimMySciComponent } from 'app/modules/nyp-checkout/modules/nyp-private-area/modal/policy-detail-modal-double-claim-tim-my-sci/policy-detail-modal-double-claim-tim-my-sci.component';

import { ComponentLoaderModule } from '../component-loader/component-loader.module';
import { ComponentMapper } from '../component-loader/component-mapper.service';
import { TimGtmPageFillerService } from './tim-gtm-page-filler.service';
import { DataService } from './../../../core/services/data.service';
import { ModalWalletListGupComponent } from 'app/modules/nyp-checkout/modules/nyp-gup/components/modal-wallet-list-gup/modal-wallet-list-gup.component';
import { ConfirmBackModalComponent } from 'app/modules/nyp-checkout/services/confirm-back-modal.component';

@NgModule({
  declarations: [
    ProductsTimCustomersComponent,
    ComplaintsTimComponent,
    MainPageComponent
  ],
  imports: [
    CommonModule,
    ComponentLoaderModule,
    PrivateAreaModule,
    NgbModule,
    ReactiveFormsModule,
    SecurityModule,
    SharedModule,
    SlickCarouselModule,
  ],
  exports: [],
  providers: []
})
export class TimCustomersModule {

  //MOCKED WITH STRING PLACEHOLDER TO KEEP KENTICO CONFIGURATOR WORK
  //EVEN THOUGHT KENTICO API ARE NOT USED IN FE, KENTICO ABSTRACT SERVICE REDIRECT CALL
  //TO CMS SERVICE THAT MAKE ACTUAL KENTICO CALL AND PASS RIGHT KENTICO API KEY DEPENDING ON THE ENVIRONMENT.
  private readonly KENTICO_API: string = 'palceholder_timcustomer_kentico';

  constructor(
    private componentMapper: ComponentMapper,
    private resolver: ComponentFactoryResolver,
    private kenticoConfigurator: KenticoConfigurator,
    private kenticoTranslateService: KenticoTranslateService,
    private gtmHandlerService: GtmHandlerService,
    private gtmFiller: TimGtmPageFillerService,
    private gtmFillerGA4: TimGtmPageFillerService,

    private dataService: DataService
  ) {
    this.registerDynamicContent();
    this.registerComponents();
    this.setupGtm();
    this.mapProducts();
  }

  registerDynamicContent() {
    this.kenticoConfigurator.register('navbar', this.KENTICO_API, null);
    this.kenticoConfigurator.register('footer', this.KENTICO_API, null);
    this.kenticoConfigurator.register('page_not_found', this.KENTICO_API, null);
    this.kenticoConfigurator.register('terms_and_conditions', this.KENTICO_API, null);
    this.kenticoConfigurator.register('cookies', this.KENTICO_API, null);
    this.kenticoConfigurator.register('privacy', this.KENTICO_API, null);
    this.kenticoConfigurator.register('distance_sell_informative', this.KENTICO_API, null);
    this.kenticoConfigurator.register('page_not_confirmed', this.KENTICO_API, null);
    this.kenticoConfigurator.register('checkout_ehealth_quixa', this.KENTICO_API, null);
    this.kenticoConfigurator.register('checkout_ehealth_quixa_standard', this.KENTICO_API, null);
    this.kenticoConfigurator.register('checkout_tim_myhome', this.KENTICO_API, null);
    this.kenticoConfigurator.register('checkout_tim_mysci', this.KENTICO_API, null);
    this.kenticoConfigurator.register('checkout_customers_tim_pet', this.KENTICO_API, null);
    this.kenticoConfigurator.register('thank_you_page_tim_homage', this.KENTICO_API, null);
    this.kenticoConfigurator.register('thank_you_page_simple', this.KENTICO_API, null);
    this.kenticoConfigurator.register('thank_you_page_tim_ftth', this.KENTICO_API, null);
    this.kenticoConfigurator.register('thank_you_page_tim', this.KENTICO_API, null);
    this.kenticoConfigurator.register('private_area', this.KENTICO_API, null);
    this.kenticoConfigurator.register('my_home_claims_numbers', this.KENTICO_API, null);
    this.kenticoConfigurator.register('forms', this.KENTICO_API, null);
    this.kenticoConfigurator.register('tim_products_steppers', this.KENTICO_API, null);
    this.kenticoConfigurator.register('access', this.KENTICO_API, null);
    this.kenticoConfigurator.register('buttons', this.KENTICO_API, null);
    this.kenticoConfigurator.register('checkout', this.KENTICO_API, null);
    this.kenticoConfigurator.register('complaints', this.KENTICO_API, null);
    this.kenticoConfigurator.register('access_customers', this.KENTICO_API, null);
    this.kenticoConfigurator.register('access_business', this.KENTICO_API, null);
    this.kenticoConfigurator.register('ordered_tags', this.KENTICO_API, null);
    this.kenticoConfigurator.register('checkout_step_gup', this.KENTICO_API, null);
    this.kenticoConfigurator.register('customers_contact_form', this.KENTICO_API, null);
    this.kenticoConfigurator.register('cookies_preferences_modal', this.KENTICO_API, null);
    this.kenticoConfigurator.register('modal_tim_home_protection_open_claim', this.KENTICO_API, null);
    this.kenticoConfigurator.register('modal_tim_confirm_home_protection_open_claim', this.KENTICO_API, null);
    this.kenticoConfigurator.register('modal_confirm_open_claim', this.KENTICO_API, null);
    this.kenticoConfigurator.register('modal_tim_my_sci_open_claim', this.KENTICO_API, null);
    this.kenticoConfigurator.register('private_area_claims', this.KENTICO_API, null);
    this.kenticoConfigurator.register('modal_privacy', this.KENTICO_API, null);
    this.kenticoConfigurator.register('insured_data', this.KENTICO_API, null);
    this.kenticoConfigurator.register('thank_you_page_tim_sci', this.KENTICO_API, null);
    this.kenticoConfigurator.register('modal_ftth_tim_casa', this.KENTICO_API, null);
    this.kenticoConfigurator.register('thank_you_page_tim_pet', this.KENTICO_API, null);
    this.kenticoConfigurator.register('modal_ftth_tim_myhome_already_purchased', this.KENTICO_API, null);
    this.kenticoConfigurator.register('seo', this.KENTICO_API, null);
    this.kenticoConfigurator.register('preventivatore_tim_my_home_ftth', this.KENTICO_API, null);
    this.kenticoConfigurator.register('preventivatore_ehealth_homage', this.KENTICO_API, null);
    this.kenticoConfigurator.register('preventivatore_ehealth_quixa_standard', this.KENTICO_API, null);
    this.kenticoConfigurator.register('preventivatore_tim_myhome', this.KENTICO_API, null);

    this.kenticoConfigurator.register('preventivatore_tim_customers_pet', this.KENTICO_API, null);
    this.kenticoConfigurator.register('preventivatore_cyber_risk', this.KENTICO_API, null);
    this.kenticoConfigurator.register('support', this.KENTICO_API, null);
    this.kenticoConfigurator.register('main_page', this.KENTICO_API, null);
    this.kenticoConfigurator.register('filtered_product_page', this.KENTICO_API, null);
    this.kenticoConfigurator.register('preventivatore_tim_mysci', this.KENTICO_API, null);
    this.kenticoConfigurator.register('checkout_tim_for_ski', this.KENTICO_API, null);
    this.kenticoConfigurator.register('tim_for_ski_modal_open_claim', this.KENTICO_API, null);
    this.kenticoConfigurator.register('preventivatore_ski_net', this.KENTICO_API, null);
    this.kenticoConfigurator.register('thank_you_page_tim_for_ski', this.KENTICO_API, null);
    this.kenticoConfigurator.register('modale_broswer_back', this.KENTICO_API, null);
    this.kenticoConfigurator.register('existing_policy_result', this.KENTICO_API, null);
    this.kenticoConfigurator.register('checkout_customers_nat_cat', this.KENTICO_API, null);
    this.kenticoConfigurator.register('checkout_customers_net_cyber_business', this.KENTICO_API, null);
    this.kenticoConfigurator.register('checkout_cyber_consumer', this.KENTICO_API, null);
    this.kenticoConfigurator.register('step_contractor', this.KENTICO_API, null);
    this.kenticoConfigurator.register('checkout_cyber_consumer', this.KENTICO_API, null);
    this.kenticoConfigurator.register(SELLER_CODE_KENTICO_SLUG, this.KENTICO_API, null);
    this.kenticoConfigurator.register(TIM_BILL_PROTECTION_KENTICO_SLUG, this.KENTICO_API, null);
    this.kenticoConfigurator.register(TIM_BILL_PROTECTOR_KENTICO_SLUG, this.KENTICO_API, null);
    this.kenticoConfigurator.register(TIM_BILL_PROTECTION_2_KENTICO_SLUG, this.KENTICO_API, null);
    this.kenticoConfigurator.register(TIM_PROTEZIONE_CASA_KENTICO_SLUG, this.KENTICO_API, null);
    this.kenticoConfigurator.register(TIM_MY_PET_KENTICO_SLUG, this.KENTICO_API, null);
    this.kenticoConfigurator.register(TIM_FOR_SKI_KENTICO_SLUG, this.KENTICO_API, null);
    this.kenticoConfigurator.register(TIM_EHEALTH_QUIXA_STANDARD_KENTICO_SLUG, this.KENTICO_API, null);
    this.kenticoConfigurator.register(TIM_PROTEZIONE_VIAGGI_KENTICO_SLUG, this.KENTICO_API, null);
    this.kenticoConfigurator.register(TIM_SPORT_KENTICO_SLUG, this.KENTICO_API, null);
    this.kenticoConfigurator.register(NYP_KENTICO_SLUG, this.KENTICO_API, null);
    this.kenticoTranslateService.resolveAll();
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
    this.componentMapper.setComponentFor('navbar-tim-container', this.getFactoryFor(NavbarTimCustomersComponent));
    this.componentMapper.setComponentFor('checkoutLoginRegisterForm', this.getFactoryFor(LoginRegisterTimCustomersCheckoutComponent));
    this.componentMapper.setComponentFor('NYPWalletListGupModal', this.getFactoryFor(ModalWalletListGupComponent));
    this.componentMapper.setComponentFor('contatti', this.getFactoryFor(TimCustomersContactsFormComponent));
    this.componentMapper.setComponentFor('CookiesModal', this.getFactoryFor(CookiesPreferencesComponent));
    this.componentMapper.setComponentFor('CookiesModalChoise', this.getFactoryFor(CookiesPreferencesChoiseComponent));
    this.componentMapper.setComponentFor('PolicyDetailModalDoubleClaimHomeProtection', this.getFactoryFor(PolicyDetailModalDoubleClaimHomeProtectionComponent));
    this.componentMapper.setComponentFor('PolicyConfirmModalClaimTimMySci', this.getFactoryFor(PolicyConfirmModalClaimTimMySciComponent));
    this.componentMapper.setComponentFor('PolicyDetailModalDoubleClaimTimMySciComponent', this.getFactoryFor(PolicyDetailModalDoubleClaimTimMySciComponent));
    this.componentMapper.setComponentFor('PolicyConfirmModalClaimHomeProtection', this.getFactoryFor(PolicyConfirmModalClaimHomeProtectionComponent));
    this.componentMapper.setComponentFor('PrivacyModal', this.getFactoryFor(ModalPrivacyComponent));
    this.componentMapper.setComponentFor('FtthModal', this.getFactoryFor(ModalFtthTimHomeComponent));
    this.componentMapper.setComponentFor('ConfirmBackModal', this.getFactoryFor(ConfirmBackModalComponent));

    this.componentMapper.setComponentFor('assistenza-detail', this.getFactoryFor(SupportByProductTimComponent));
  }

  private mapProducts() {
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
