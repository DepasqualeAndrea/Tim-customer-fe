import { YoloDataLayerGA4PageFiller } from './../y/yolo-dl-ga4-page-filler.service';
import { DataService } from './../../../core/services/data.service';
import { ComponentFactory, ComponentFactoryResolver, NgModule, Type } from '@angular/core';
import { ComponentLoaderModule } from '../component-loader/component-loader.module';
import { ComponentMapper } from '../component-loader/component-mapper.service';
import { PolicyDetailModalClaimComponent } from 'app/modules/private-area/components/policy-detail/policy-detail-modal-claim/policy-detail-modal-claim.component';
import { KenticoConfigurator } from 'app/modules/kentico/kentico-configurator.service';
import { TheteamComponent } from 'app/components/public/theteam/default/theteam.component';
import { ContattiComponent } from 'app/components/public/contatti/yolo/contatti.component';
import { KenticoTranslateService } from '../../kentico/data-layer/kentico-translate.service';
import { MyPoliciesComponent } from 'app/modules/private-area/components/my-policies/my-policies.component';
import { UserDetailsComponent } from 'app/modules/private-area/components/user-details/user-details.component';
import { RegisterFormComponent } from 'app/modules/security/components/register-form/register-form.component';
import { CommonModule } from '@angular/common';
import { EmptyComponent } from '../component-loader/empty/empty.component';
import { AddressFormComponent } from 'app/modules/checkout/checkout-step/checkout-step-address/components/address-form/address-form.component';
import { SharedModule } from 'app/shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { PreventivatoreProductMapperService } from 'app/modules/preventivatore/services/preventivatore-product-mapper.service';
import { CheckoutLinearStepperReducerProvider } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-reducer-provider';
import { PreventivatoreDynamicComponent } from 'app/modules/preventivatore/preventivatore-dynamic/preventivatore-dynamic.component';
import { PreventivatoreReducerProvider } from 'app/modules/preventivatore/preventivatore-dynamic/state/preventivatore-reducer-provider';
import { PreventivatoreDiscountCodeDynamicComponent } from 'app/modules/preventivatore/preventivatore-discount-code-dynamic/preventivatore-discount-code-dynamic.component';
import { PreventivatoreDiscountCodeContentProviderService } from 'app/modules/preventivatore/preventivatore-discount-code-dynamic/services/content/preventivatore-discount-code-content-provider-service';
import { PreventivatoreDiscountCountTiresContentProvider } from 'app/modules/preventivatore/preventivatore-discount-code-dynamic/services/content/preventivatore-discount-code-tires-content-provider';
import { CheckoutLinearStepperPromoTiresReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-promo-covered-tires-reducer';
import { ContactsFormComponent } from 'app/shared/contact-form/contacts-form.component';
import { SupportComponent } from 'app/components/public/support/support.component';
import { ProductsMoparComponent } from 'app/components/public/products-container/products-mopar/products-mopar.component';
import { PreventivatoreDiscountCountCovidContentProvider } from 'app/modules/preventivatore/preventivatore-discount-code-dynamic/services/content/preventivatore-discount-code-covid-content-provider';
import { CheckoutLinearStepperPromoCovidReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-promo-covid-reducer';
import { ProductsStandardMoparComponent } from 'app/components/public/products-standard-container/products-standard-mopar/products-standard-mopar.component';
import { PreventivatoreCovidStdContentProvider } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-covid-std-content-provider.service';
import { PreventivatoreContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-content-provider-service';
import { CheckoutLinearStepperCovidStdReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-covid-std-reducer';
import { PreventivatoreTiresStandardPlusContentProvider } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-tires-standar-plus-content-provider.service';
import { GTMTrigger } from '../../../core/models/gtm/gtm-settings.model';
import { GtmHandlerService } from '../../../core/services/gtm/gtm-handler.service';
import { GtmYoloItPageFiller } from '../y/gtm-yolo-it-page-filler.service';
import { CookiesPreferencesComponent } from '../../../components/public/cookies-preferences/cookies-preferences.component';
import { CookiesPreferencesChoiseComponent } from '../../../components/public/cookies-preferences/cookies-preferences-choise/cookies-preferences-choise.component';
import { HomepageYoloComponent } from 'app/components/public/homepage/homepage-yolo/homepage-yolo.component';
import { TenantDefault } from '../default/tenant-default.module';

@NgModule({
  declarations: [
    ProductsStandardMoparComponent
  ],
  imports: [
    CommonModule,
    ComponentLoaderModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    SlickCarouselModule
  ],
  entryComponents: [
    PolicyDetailModalClaimComponent,
    RegisterFormComponent,
    AddressFormComponent,
    UserDetailsComponent,
    MyPoliciesComponent,
    ContactsFormComponent,
    EmptyComponent,
    TheteamComponent,
    ContattiComponent,
    HomepageYoloComponent,
    ProductsMoparComponent,
    ProductsStandardMoparComponent,
    CookiesPreferencesComponent,
    CookiesPreferencesChoiseComponent
  ],
})
export class MoparModule {

  private readonly KENTICO_API: string = TenantDefault.KENTICO_API;

  private getFactoryFor(component: Type<any>): ComponentFactory<any> {
    return this.resolver.resolveComponentFactory(component);
  }

  constructor(
    private resolver: ComponentFactoryResolver,
    private componentMapper: ComponentMapper,
    private kenticoConfigurator: KenticoConfigurator,
    private kenticoTranslateService: KenticoTranslateService,
    private gtmHandlerService: GtmHandlerService,
    private gtmFiller: GtmYoloItPageFiller,
    private gtmFillerGA4: YoloDataLayerGA4PageFiller,
    private preventivatoreMapper: PreventivatoreProductMapperService,
    private preventivatoreDiscountCodeContentProviderService: PreventivatoreDiscountCodeContentProviderService,
    private preventivatoreContentProviderService: PreventivatoreContentProviderService,
    private checkoutLinearStepperReducerProvider: CheckoutLinearStepperReducerProvider,
    private dataService: DataService
  ) {
    this.registerComponents();
    this.registerDynamicContent();
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
  registerComponents() {
    this.componentMapper.setComponentFor('privateAreaUserDetails', this.getFactoryFor(UserDetailsComponent));
    this.componentMapper.setComponentFor('privateAreaMyPolicies', this.getFactoryFor(MyPoliciesComponent));
    this.componentMapper.setComponentFor('policyModalClaim', this.getFactoryFor(PolicyDetailModalClaimComponent));
    this.componentMapper.setComponentFor('checkoutLoginRegisterForm', this.getFactoryFor(RegisterFormComponent));
    this.componentMapper.setComponentFor('checkoutAddressForm', this.getFactoryFor(AddressFormComponent));
    this.componentMapper.setComponentFor('contactsForm', this.getFactoryFor(ContactsFormComponent));
    this.componentMapper.setComponentFor('chi-siamo', this.getFactoryFor(TheteamComponent));
    this.componentMapper.setComponentFor('contatti', this.getFactoryFor(ContattiComponent));
    this.componentMapper.setComponentFor('assistenza', this.getFactoryFor(SupportComponent));
    this.componentMapper.setComponentFor('home', this.getFactoryFor(HomepageYoloComponent));
    this.componentMapper.setComponentFor('products-container', this.getFactoryFor(ProductsMoparComponent));
    this.componentMapper.setComponentFor('products-standard-container', this.getFactoryFor(ProductsStandardMoparComponent));
    this.componentMapper.setComponentFor('CookiesModal', this.getFactoryFor(CookiesPreferencesComponent));
    this.componentMapper.setComponentFor('CookiesModalChoise', this.getFactoryFor(CookiesPreferencesChoiseComponent));
  }

  private mapProducts() {
    this.preventivatoreMapper.register(/covea-tires-covered-homage/, PreventivatoreDiscountCodeDynamicComponent);
    this.preventivatoreMapper.register(/covea-tires-covered/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/nobis-covid-homage/, PreventivatoreDiscountCodeDynamicComponent);
    this.preventivatoreMapper.register(/nobis-covid-standard/, PreventivatoreDynamicComponent);
    this.preventivatoreDiscountCodeContentProviderService.setProvider(['covea-tires-covered-homage'], PreventivatoreDiscountCountTiresContentProvider);
    this.preventivatoreDiscountCodeContentProviderService.setProvider(['nobis-covid-homage'], PreventivatoreDiscountCountCovidContentProvider);
    this.preventivatoreContentProviderService.setProvider(['nobis-covid-standard'], PreventivatoreCovidStdContentProvider);
    this.preventivatoreContentProviderService.setProvider(['covea-tires-covered-standard', 'covea-tires-covered-plus'], PreventivatoreTiresStandardPlusContentProvider);
    this.checkoutLinearStepperReducerProvider.setReducer('covea-tires-covered-homage', () => new CheckoutLinearStepperPromoTiresReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('covea-tires-covered-standard', () => new CheckoutLinearStepperPromoTiresReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('covea-tires-covered-plus', () => new CheckoutLinearStepperPromoTiresReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('nobis-covid-homage', () => new CheckoutLinearStepperPromoCovidReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('nobis-covid-standard', () => new CheckoutLinearStepperCovidStdReducer());
  }

  registerDynamicContent() {
    this.kenticoConfigurator.register('toasts', this.KENTICO_API);
    this.kenticoConfigurator.register('privacy', this.KENTICO_API);
    this.kenticoConfigurator.register('cookie_yolo', this.KENTICO_API);
    this.kenticoConfigurator.register('terms_yolo', this.KENTICO_API);
    this.kenticoConfigurator.register('contatti_yolo', this.KENTICO_API);
    this.kenticoConfigurator.register('assistenza_fca', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_covered_tires', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_covid', this.KENTICO_API);
    this.kenticoConfigurator.register('private_area', this.KENTICO_API);
    this.kenticoConfigurator.register('products_page', this.KENTICO_API);
    this.kenticoConfigurator.register('products_standard_page', this.KENTICO_API);
    this.kenticoConfigurator.register('navbar', this.KENTICO_API);
    this.kenticoConfigurator.register('secondary_logo', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_tires_free', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_tires_standard_and_plus', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_covid', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_covid_standard', this.KENTICO_API);
    this.kenticoConfigurator.register('footer', this.KENTICO_API);
    this.kenticoConfigurator.register('access', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout', this.KENTICO_API);
    this.kenticoConfigurator.register('page_not_found', this.KENTICO_API);
    this.kenticoConfigurator.register('cookies_preferences_modal', this.KENTICO_API);
    this.kenticoTranslateService.resolveAll();
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
    this.gtmHandlerService.addException(GTMTrigger.Routing, /apertura\//);
  }

}
