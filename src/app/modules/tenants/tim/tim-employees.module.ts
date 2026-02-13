import { DataService } from './../../../core/services/data.service';
import { AddressFormTimEmployeesComponent } from './../../checkout/checkout-step/checkout-step-address/components/address-form-tim/address-form-tim-employees/address-form-tim-employees.component';
import { CheckoutContentProviderService } from './../../checkout/checkout-linear-stepper/services/content/checkout-content-provider.service';
import { MyTimLayoutComponentProviderService } from './../../preventivatore/preventivatore-dynamic/services/product-components/my-tim-layout-component-provider.service';
import { SupportSidebarComponent } from './../../../components/public/support/support-tim/support-sidebar/support-sidebar.component';
import { SupportExtraInfoComponent } from './../../../components/public/support/support-tim/support-extra-info/support-extra-info.component';
import { RouterModule } from '@angular/router';
import { ComponentFactory, ComponentFactoryResolver, NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentLoaderModule } from '../component-loader/component-loader.module';
import { PrivateAreaModule } from 'app/modules/private-area/private-area.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { SecurityModule } from 'app/modules/security/security.module';
import { SharedModule } from 'app/shared/shared.module';
import { EmptyComponent } from '../component-loader/empty/empty.component';
import { ComponentMapper } from '../component-loader/component-mapper.service';
import { KenticoConfigurator } from 'app/modules/kentico/kentico-configurator.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { PreventivatoreProductMapperService } from 'app/modules/preventivatore/services/preventivatore-product-mapper.service';
import { PreventivatoreContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-content-provider-service';
import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';
import { GTMTrigger } from 'app/core/models/gtm/gtm-settings.model';
import { ProductsTimEmployeesComponent } from 'app/components/public/products-container/products-tim-employees/products-tim-employees.component';
import { NavbarTimEmployeesComponent } from 'app/components/public/navbar/navbar-tim/navbar-tim-employees/navbar-tim-employees.component';
import { PreventivatoreTimEmployeesRCAutoProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-tim-employees-rc-auto-content-provider.service';
import { PreventivatoreComponentsProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/preventivatore-components-provider.service';
import { TimLayoutComponentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/tim-layout-component-provider.service';
import { ChiSiamoTimMybrokerComponent } from 'app/components/public/chi-siamo/chi-siamo-tim-mybroker/chi-siamo-tim-mybroker.component';
import { PreventivatoreTimEmployeesRCAutoUnipolProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-tim-employees-rc-auto-unipol-content-provider.service';
import { NotConfirmedTimEmployeesComponent } from 'app/modules/security/components/not-confirmed-tim-employees/not-confirmed-tim-employees.component';
import { PreventivatoreDynamicWithTokenComponent } from 'app/modules/preventivatore/preventivatore-dynamic/preventivatore-dynamic-with-token.component';
import { LandingPageTimEmployeesComponent } from 'app/components/public/landing-page/landing-page-tim/landing-page-tim-employees.component';
import { SupportByProductTimComponent } from 'app/components/public/support/support-tim/support-by-product-tim/support-by-product-tim.component';
import { SupportFaqComponent } from 'app/components/public/support/support-tim/support-faq/support-faq.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { PreventivatoreTimEmployeesAziendaVitaContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/tim/azienda/preventivatore-tim-employees-azienda-vita-content-provider.service';
import { PreventivatoreTimEmployeesAziendaInfortuniContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/tim/azienda/preventivatore-tim-employees-azienda-infortuni-content-provider.service';
import { PreventivatoreTimEmployeesRcAutoConteContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/tim/rc-auto/preventivatore-tim-employees-rc-auto-conte-content-provider.service';
import { PreventivatoreTimEmployeesRcAutoQuixaContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/tim/rc-auto/preventivatore-tim-employees-rc-auto-quixa-content-provider.service';
import { PreventivatoreTimEmployeesPersonaVitaContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/tim/persona/preventivatore-tim-employees-persona-vita-content-provider.service';
import { PreventivatoreTimEmployeesPersonaInfortuniContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/tim/persona/preventivatore-tim-employees-persona-infortuni-content-provider.service';
import { PreventivatoreTimEmployeesRcAutoVertiContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/tim/rc-auto/preventivatore-tim-employees-rc-auto-verti-content-provider.service';
import { ComplaintsTimComponent } from 'app/components/public/complaints/complaints-tim/complaints-tim.component';
import { UserTimDetailsComponent } from 'app/modules/private-area/components/user-tim-details/user-tim-details.component';
import { MyPoliciesComponent } from 'app/modules/private-area/components/my-policies/my-policies.component';
import { PreventivatoreTimEmployeesMyPetContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/tim/pet/preventivatore-tim-employees-my-pet-content-provider.service';
import { CheckoutLinearStepperReducerProvider } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-reducer-provider';
import { CheckoutLinearStepperMyPetReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-my-pet-reducer';
import { CheckoutMyPetContentService } from 'app/modules/checkout/checkout-linear-stepper/services/content/checkout-my-pet-content.service';
import { PreventivatoreTimLongTermCareContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/tim/persona/preventivatore-tim-long-term-care-content-provider.service';
import { CheckoutStepLdapLoginComponent } from 'app/modules/checkout/checkout-step/checkout-step-insurance-info/checkout-step-ldap-login/checkout-step-ldap-login.component';
import { ModalPaymentWalletListGupComponent } from 'app/modules/checkout/checkout-step/checkout-step-payment/checkout-linear-stepper-payment-redirect/checkout-linear-stepper-payment-redirect-gup/modal-payment-wallet-list-gup/modal-payment-wallet-list-gup.component';
import { PreventivatoreTimEmployeesMyHealthProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/tim/azienda/preventivatore-tim-employees-my-health-provider.service';
import { CookiesPreferencesComponent } from '../../../components/public/cookies-preferences/cookies-preferences.component';
import { CookiesPreferencesChoiseComponent } from '../../../components/public/cookies-preferences/cookies-preferences-choise/cookies-preferences-choise.component';
import { ModalPrivacyComponent } from 'app/components/public/privacy/modal-privacy/modal-privacy.component';
import { TimCustomersLayoutComponentProviderService } from '../../preventivatore/preventivatore-dynamic/services/product-components/tim-customers-layout-component-provider.service';
import { PreventivatoreDynamicComponent } from '../../preventivatore/preventivatore-dynamic/preventivatore-dynamic.component';
import { PreventivatoreTimEmployeesMotorContentProviderService } from '../../preventivatore/preventivatore-dynamic/services/content/tim/motor/preventivatore-tim-employees-motor-content-provider.service';
import { TimEmployeesLayoutComponentProviderService } from '../../preventivatore/preventivatore-dynamic/services/product-components/tim-employees-layout-component-provider-.service';
import { CheckoutLinearStepperTimMotor } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-tim-motor-reducer';
import { CheckoutTimMotorContentService } from 'app/modules/checkout/checkout-linear-stepper/services/content/checkout-tim-motor-content-provider.service';
import { TenantDefault } from '../default/tenant-default.module';

@NgModule({
    declarations: [
        SupportByProductTimComponent,
        SupportSidebarComponent,
        SupportFaqComponent,
        SupportExtraInfoComponent
    ],
    imports: [
        CommonModule,
        ComponentLoaderModule,
        PrivateAreaModule,
        NgbModule,
        ReactiveFormsModule,
        SecurityModule,
        SharedModule,
        RouterModule,
        ScrollToModule.forRoot(),
    ],
    exports: [],
    providers: []
})
export class TimEmployeesModule {

  private readonly KENTICO_API: string = TenantDefault.KENTICO_API;

  constructor(
    private componentMapper: ComponentMapper,
    private resolver: ComponentFactoryResolver,
    private kenticoConfigurator: KenticoConfigurator,
    private kenticoTranslateService: KenticoTranslateService,
    private gtmHandlerService: GtmHandlerService,
    private gtmFiller: GtmYoloItPageFiller,
    private gtmFillerGA4: YoloDataLayerGA4PageFiller,
    private preventivatoreMapper: PreventivatoreProductMapperService,
    private preventivatoreContentProviderService: PreventivatoreContentProviderService,
    private preventivatoreComponentsLayoutProviderService: PreventivatoreComponentsProviderService,
    private checkoutLinearStepperReducerProvider: CheckoutLinearStepperReducerProvider,
    private checkoutContentProviderService: CheckoutContentProviderService,
    private dataService: DataService
  ) {
    this.kenticoConfigurator.register('filtered_product_page', this.KENTICO_API);
    this.kenticoConfigurator.register('navbar', this.KENTICO_API);
    this.kenticoConfigurator.register('footer', this.KENTICO_API);
    this.kenticoConfigurator.register('page_not_found', this.KENTICO_API);
    this.kenticoConfigurator.register('chi_siamo', this.KENTICO_API);
    this.kenticoConfigurator.register('chi_siamo_employee', this.KENTICO_API);
    this.kenticoConfigurator.register('terms_and_conditions', this.KENTICO_API);
    this.kenticoConfigurator.register('distance_sell_informative', this.KENTICO_API);
    this.kenticoConfigurator.register('cookies', this.KENTICO_API);
    this.kenticoConfigurator.register('privacy', this.KENTICO_API);
    this.kenticoConfigurator.register('complaints', this.KENTICO_API);
    this.kenticoConfigurator.register('page_not_confirmed', this.KENTICO_API);
    this.kenticoConfigurator.register('landing_page', this.KENTICO_API);
    this.kenticoConfigurator.register('private_area', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_rc_auto', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_rc_auto_unipol', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_rc_auto_quixa', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_rc_auto_conte', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_rc_auto_verti', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_azienda_vita', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_azienda_infortuni', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_persona_vita', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_persona_infortuni', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_long_term_care', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_myhealth', this.KENTICO_API);
    this.kenticoConfigurator.register('login_register_retirees', this.KENTICO_API);
    this.kenticoConfigurator.register('access', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_step_gup', this.KENTICO_API);
    this.kenticoConfigurator.register('cookies_preferences_modal', this.KENTICO_API);
    this.kenticoConfigurator.register('modal_privacy', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_tim_motor', this.KENTICO_API);
    this.kenticoConfigurator.register('thank_you_page_simple', this.KENTICO_API);

    this.kenticoConfigurator.setDefaultService(this.KENTICO_API);

    this.kenticoTranslateService.resolveAll();
    this.registerComponents();
    this.setupGtm();
    this.mapProducts();
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
    this.componentMapper.setComponentFor('privateAreaUserDetails', this.getFactoryFor(UserTimDetailsComponent));
    this.componentMapper.setComponentFor('privateAreaMyPolicies', this.getFactoryFor(MyPoliciesComponent));
    this.componentMapper.setComponentFor('products-container', this.getFactoryFor(ProductsTimEmployeesComponent));
    this.componentMapper.setComponentFor('navbar-tim-container', this.getFactoryFor(NavbarTimEmployeesComponent));
    //  this.componentMapper.setComponentFor('chi-siamo', this.getFactoryFor(ChiSiamoTimMybrokerEmployeesComponent));
    this.componentMapper.setComponentFor('not-confirmed', this.getFactoryFor(NotConfirmedTimEmployeesComponent));
    this.componentMapper.setComponentFor('landing-page', this.getFactoryFor(LandingPageTimEmployeesComponent));
    this.componentMapper.setComponentFor('assistenza-detail', this.getFactoryFor(SupportByProductTimComponent));
    this.componentMapper.setComponentFor('reclami', this.getFactoryFor(ComplaintsTimComponent));
    this.componentMapper.setComponentFor('checkoutAddressForm', this.getFactoryFor(AddressFormTimEmployeesComponent));
    this.componentMapper.setComponentFor('checkoutLoginRegisterForm', this.getFactoryFor(CheckoutStepLdapLoginComponent));
    this.componentMapper.setComponentFor('PaymentWalletListGupModal', this.getFactoryFor(ModalPaymentWalletListGupComponent));
    this.componentMapper.setComponentFor('CookiesModal', this.getFactoryFor(CookiesPreferencesComponent));
    this.componentMapper.setComponentFor('CookiesModalChoise', this.getFactoryFor(CookiesPreferencesChoiseComponent));
    this.componentMapper.setComponentFor('PrivacyModal', this.getFactoryFor(ModalPrivacyComponent));

  }

  private mapProducts() {
    this.preventivatoreComponentsLayoutProviderService.setProvider([
      'rc-auto', 'rc-auto-unipol', 'azienda-infortuni', 'azienda-vita', 'rc-auto-quixa', 'rc-auto-conte',
      'persona-vita', 'persona-infortuni', 'rc-auto-verti', 'long-term-care', 'my-health'
    ], TimLayoutComponentProviderService);
    this.preventivatoreComponentsLayoutProviderService.setProvider(['tim-motor'], TimEmployeesLayoutComponentProviderService);
    this.preventivatoreComponentsLayoutProviderService.setProvider(['tim-my-pet'], MyTimLayoutComponentProviderService);
    this.preventivatoreMapper.register(/rc-auto/, PreventivatoreDynamicWithTokenComponent);
    this.preventivatoreMapper.register(/rc-auto-unipol/, PreventivatoreDynamicWithTokenComponent);
    this.preventivatoreContentProviderService.setProvider(['rc-auto'], PreventivatoreTimEmployeesRCAutoProviderService);
    this.preventivatoreContentProviderService.setProvider(['rc-auto-unipol'], PreventivatoreTimEmployeesRCAutoUnipolProviderService);

    this.preventivatoreMapper.register(/rc-auto-quixa/, PreventivatoreDynamicWithTokenComponent);
    this.preventivatoreMapper.register(/rc-auto-conte/, PreventivatoreDynamicWithTokenComponent);
    this.preventivatoreMapper.register(/rc-auto-verti/, PreventivatoreDynamicWithTokenComponent);
    this.preventivatoreContentProviderService.setProvider(['rc-auto-quixa'], PreventivatoreTimEmployeesRcAutoQuixaContentProviderService);
    this.preventivatoreContentProviderService.setProvider(['rc-auto-conte'], PreventivatoreTimEmployeesRcAutoConteContentProviderService);
    this.preventivatoreContentProviderService.setProvider(['rc-auto-verti'], PreventivatoreTimEmployeesRcAutoVertiContentProviderService);

    this.preventivatoreMapper.register(/azienda-vita/, PreventivatoreDynamicWithTokenComponent);
    this.preventivatoreMapper.register(/azienda-infortuni/, PreventivatoreDynamicWithTokenComponent);
    this.preventivatoreContentProviderService.setProvider(['azienda-vita'], PreventivatoreTimEmployeesAziendaVitaContentProviderService);
    this.preventivatoreContentProviderService.setProvider(['azienda-infortuni'], PreventivatoreTimEmployeesAziendaInfortuniContentProviderService);

    this.preventivatoreMapper.register(/persona-vita/, PreventivatoreDynamicWithTokenComponent);
    this.preventivatoreMapper.register(/persona-infortuni/, PreventivatoreDynamicWithTokenComponent);
    this.preventivatoreContentProviderService.setProvider(['persona-vita'], PreventivatoreTimEmployeesPersonaVitaContentProviderService);
    this.preventivatoreContentProviderService.setProvider(['persona-infortuni'], PreventivatoreTimEmployeesPersonaInfortuniContentProviderService);

    this.preventivatoreMapper.register(/tim-my-pet/, PreventivatoreDynamicWithTokenComponent);
    this.preventivatoreContentProviderService.setProvider(['tim-my-pet'], PreventivatoreTimEmployeesMyPetContentProviderService);
    this.checkoutContentProviderService.setProvider(['tim-my-pet'], CheckoutMyPetContentService);
    this.checkoutLinearStepperReducerProvider.setReducer('tim-my-pet', () => new CheckoutLinearStepperMyPetReducer());

    this.preventivatoreMapper.register(/long-term-care/, PreventivatoreDynamicWithTokenComponent);
    this.preventivatoreContentProviderService.setProvider(['long-term-care'], PreventivatoreTimLongTermCareContentProviderService);

    this.preventivatoreMapper.register(/my-health/, PreventivatoreDynamicWithTokenComponent);
    this.preventivatoreContentProviderService.setProvider(['my-health'], PreventivatoreTimEmployeesMyHealthProviderService);

    this.preventivatoreMapper.register(/tim-motor/, PreventivatoreDynamicComponent);
    this.preventivatoreContentProviderService.setProvider(['tim-motor'], PreventivatoreTimEmployeesMotorContentProviderService);
    this.checkoutContentProviderService.setProvider(['tim-motor'], CheckoutTimMotorContentService);
    this.checkoutLinearStepperReducerProvider.setReducer('tim-motor', () => new CheckoutLinearStepperTimMotor());

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
    this.gtmHandlerService.setNavigationEndCallbackFn(this.gtmHandlerService.setPageInfoIntoDataLayer);
    this.gtmHandlerService.addException(GTMTrigger.Routing, /preventivatore/);
    this.gtmHandlerService.addException(GTMTrigger.Routing, /apertura/);
    this.gtmHandlerService.addException(GTMTrigger.Routing, /checkout/);
  }
}
