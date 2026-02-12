import { YoloDataLayerGA4PageFiller } from './../y/yolo-dl-ga4-page-filler.service';
import { DataService } from './../../../core/services/data.service';
import { ComponentFactory, ComponentFactoryResolver, NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PolicyDetailModalClaimComponent } from 'app/modules/private-area/components/policy-detail/policy-detail-modal-claim/policy-detail-modal-claim.component';
import { ComponentLoaderModule } from '../component-loader/component-loader.module';
import { ComponentMapper } from '../component-loader/component-mapper.service';
import { PrivateAreaModule } from 'app/modules/private-area/private-area.module';
import { KenticoConfigurator } from 'app/modules/kentico/kentico-configurator.service';
import { RegisterFormComponent } from 'app/modules/security/components/register-form/register-form.component';
import { UserDetailsComponent } from 'app/modules/private-area/components/user-details/user-details.component';
import { NotConfirmedIntesaComponent } from 'app/modules/security/components/not-confirmed-intesa/not-confirmed-intesa.component';
import { HeaderThemaIntesa } from 'app/modules/preventivatore/header/themaIntesa/themaIntesa.component';
import { PREVENTIVATORE_HEADER_PLACEHOLDER } from 'app/modules/preventivatore/header/preventivatore-header/preventivatore-header.component';
import { EmptyComponent } from '../component-loader/empty/empty.component';
import { TheteamComponent } from 'app/components/public/theteam/default/theteam.component';
import { ContattiComponent } from 'app/components/public/contatti/yolo/contatti.component';
import { KenticoTranslateService } from '../../kentico/data-layer/kentico-translate.service';
import { PreventivatoreProductMapperService } from '../../preventivatore/services/preventivatore-product-mapper.service';
import { PreventivatoreDynamicComponent } from '../../preventivatore/preventivatore-dynamic/preventivatore-dynamic.component';
import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';
import { GtmIntesaPageFiller } from './gtm-intesa-page-filler.service';
import { GTMTrigger } from 'app/core/models/gtm/gtm-settings.model';
import { CheckoutLinearStepperReducerProvider } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-reducer-provider';
import { CheckoutLinearStepperPetReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-pet-reducer';
import { TypeResolver } from 'kentico-cloud-delivery';
import { Preventivatore } from '../../kentico/models/preventivatore.model';
import { LandingPage } from '../../kentico/models/landing-page.model';
import { AngularLink } from '../../kentico/models/angular-link.model';
import { Assistance } from '../../kentico/models/contact-faq.model';
import { Tab, TabCard } from '../../kentico/models/tab.model';
import { Accordion, AccordionYolo } from '../../kentico/models/accordion.model';
import { Column, ColumnImage, Row } from '../../kentico/models/row-col.model';
import { PageLayout } from '../../kentico/models/page-layout.model';
import { SectionOverview } from '../../kentico/models/section-overview.model';
import { Architecture, Architecture_api } from '../../kentico/models/architecture.model';
import { Functionalities } from '../../kentico/models/functionalities.model';
import { Solutions } from '../../kentico/models/solutions.model';
import { Card, Cards, YoloButton } from '../../kentico/models/card.model';
import { YoloCarouselItem } from '../../kentico/models/homepage-yolo-carousel-item.model';
import { Team } from '../../kentico/models/ilteam.model';
import { PageModel, PageSectionModel } from '../../kentico/models/page.model';
import { ListItemModel, ListModel } from '../../kentico/models/list.model';
import { Image, ImageLink } from '../../kentico/models/image.model';
import { PreventivatorePetContentProvider } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-pet-content-provider.service';
import { PreventivatoreContentProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-content-provider-service';
import { MyPoliciesComponent } from 'app/modules/private-area/components/my-policies/my-policies.component';
import { PreventivatoreComponentsProviderService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/preventivatore-components-provider.service';
import { FAQableVariantsLayoutService } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/faqable-variants-layout.service';
import { PreventivatoreIntesaSciContentProvider } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/preventivatore-intesa-sci-content-provider.service';
import { FAQableVariantsSGLayout } from 'app/modules/preventivatore/preventivatore-dynamic/services/product-components/faqable-variants-sg-layout.service';
import { CheckoutLinearStepperIntesaSciReducer } from 'app/modules/checkout/checkout-linear-stepper/services/state/checkout-linear-stepper-intesa-sci-reducer';
import { PolicyDetailModalClaimSciComponent } from 'app/modules/private-area/components/policy-detail/policy-detail-modal-claim-sci/policy-detail-modal-claim-sci.component';
import { CookiesPreferencesComponent } from '../../../components/public/cookies-preferences/cookies-preferences.component';
import { CookiesPreferencesChoiseComponent } from '../../../components/public/cookies-preferences/cookies-preferences-choise/cookies-preferences-choise.component';
import { TenantDefault } from '../default/tenant-default.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ComponentLoaderModule,
    PrivateAreaModule
  ],
  entryComponents: [
    RegisterFormComponent,
    UserDetailsComponent,
    MyPoliciesComponent,
    PolicyDetailModalClaimComponent,
    NotConfirmedIntesaComponent,
    HeaderThemaIntesa,
    EmptyComponent,
    TheteamComponent,
    ContattiComponent,
    PolicyDetailModalClaimSciComponent,
    CookiesPreferencesComponent,
    CookiesPreferencesChoiseComponent
  ]
})
export class IntesaModule {

  private readonly KENTICO_API: string = TenantDefault.KENTICO_API;

  private createTypeResolvers(): TypeResolver[] {
    return [
      new TypeResolver('preventivatore', () => new Preventivatore()),
      new TypeResolver('landing_page', () => new LandingPage()),
      new TypeResolver('angular_link_b527c22', () => new AngularLink()),
      new TypeResolver('assistenza', () => new Assistance()),
      new TypeResolver('tab', () => new Tab()),
      new TypeResolver('tab_card', () => new TabCard()),
      new TypeResolver('accordion', () => new Accordion()),
      new TypeResolver('row', () => new Row()),
      new TypeResolver('column', () => new Column()),
      new TypeResolver('columnimage', () => new ColumnImage()),

      new TypeResolver('page_layout', () => new PageLayout()),
      new TypeResolver('section', () => new SectionOverview()),

      new TypeResolver('section', () => new Architecture()),
      new TypeResolver('section', () => new Architecture_api()),
      new TypeResolver('section', () => new Functionalities()),
      new TypeResolver('section', () => new Solutions()),

      new TypeResolver('button', () => new YoloButton()),
      new TypeResolver('yolohomepage_carouselitem', () => new YoloCarouselItem()),
      new TypeResolver('staff_page', () => new Team()),
      new TypeResolver('page', () => new PageModel()),
      new TypeResolver('page_section', () => new PageSectionModel()),
      new TypeResolver('list', () => new ListModel()),
      new TypeResolver('list_items', () => new ListItemModel()),
      new TypeResolver('card', () => new Card()),
      new TypeResolver('cards', () => new Cards()),
      new TypeResolver('imagelink', () => new ImageLink()),
      new TypeResolver('consiglio_amministrazione_yolo_group', () => new Card()),
      new TypeResolver('accordionyolo', () => new AccordionYolo()),
      new TypeResolver('image', () => new Image())
    ]
  }

  constructor(
    private componentMapper: ComponentMapper,
    private resolver: ComponentFactoryResolver,
    private kenticoConfigurator: KenticoConfigurator,
    private kenticoTranslateService: KenticoTranslateService,
    private preventivatoreMapper: PreventivatoreProductMapperService,
    private gtmHandlerService: GtmHandlerService,
    private gtmFiller: GtmIntesaPageFiller,
    private gtmFillerGA4: YoloDataLayerGA4PageFiller,
    private checkoutLinearStepperReducerProvider: CheckoutLinearStepperReducerProvider,
    private preventivatoreContentProviderService: PreventivatoreContentProviderService,
    private preventivatoreComponentsLayoutProviderService: PreventivatoreComponentsProviderService,
    private dataService: DataService
  ) {
    this.kenticoConfigurator.register('checkout_step_1_sci', this.KENTICO_API, this.createTypeResolvers());
    this.kenticoConfigurator.register('checkout', this.KENTICO_API);
    this.kenticoConfigurator.register('privacy', this.KENTICO_API);
    this.kenticoConfigurator.register('terms_yolo', this.KENTICO_API);
    this.kenticoConfigurator.register('assistenza_yolo', this.KENTICO_API);
    this.kenticoConfigurator.register('navbar', this.KENTICO_API);
    this.kenticoConfigurator.register('flagship_product_card', this.KENTICO_API);
    this.kenticoConfigurator.register('flagship_hero_space', this.KENTICO_API);
    this.kenticoConfigurator.register('assistance_image', this.KENTICO_API);
    this.kenticoConfigurator.register('assistance_section', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_pet', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_pet', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_mifido', this.KENTICO_API);
    this.kenticoConfigurator.register('preventivatore_sci', this.KENTICO_API);
    this.kenticoConfigurator.register('checkout_sci', this.KENTICO_API);
    this.kenticoConfigurator.register('homepage_intesa', this.KENTICO_API);
    this.kenticoConfigurator.register('alt_documents_acceptance', this.KENTICO_API);
    this.kenticoConfigurator.register('thank_you_page_precise_time', this.KENTICO_API);
    this.kenticoConfigurator.register('sci_modal_open_claim', this.KENTICO_API);
    this.kenticoConfigurator.register('cookies_preferences_modal', this.KENTICO_API);
    this.kenticoTranslateService.resolveAll();

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
    this.componentMapper.setComponentFor('checkoutLoginRegisterForm', this.getFactoryFor(RegisterFormComponent));
    this.componentMapper.setComponentFor('privateAreaUserDetails', this.getFactoryFor(UserDetailsComponent));
    this.componentMapper.setComponentFor('privateAreaMyPolicies', this.getFactoryFor(MyPoliciesComponent));
    this.componentMapper.setComponentFor('not-confirmed', this.getFactoryFor(NotConfirmedIntesaComponent));
    //this.componentMapper.setComponentFor('landing-page', this.getFactoryFor(LandingPageIntesaComponent));
    this.componentMapper.setComponentFor(PREVENTIVATORE_HEADER_PLACEHOLDER, this.getFactoryFor(HeaderThemaIntesa));
    this.componentMapper.setComponentFor('contactsForm', this.getFactoryFor(EmptyComponent));
    this.componentMapper.setComponentFor('chi-siamo', this.getFactoryFor(TheteamComponent));
    this.componentMapper.setComponentFor('contatti', this.getFactoryFor(ContattiComponent));
    // this.componentMapper.setComponentFor('home', this.getFactoryFor(HomepageIntesaComponent));
    this.componentMapper.setComponentFor('policyModalClaimSci', this.getFactoryFor(PolicyDetailModalClaimSciComponent));
    this.componentMapper.setComponentFor('CookiesModal', this.getFactoryFor(CookiesPreferencesComponent));
    this.componentMapper.setComponentFor('CookiesModalChoise', this.getFactoryFor(CookiesPreferencesChoiseComponent));
  }

  private mapProducts() {
    this.preventivatoreMapper.register(/net-pet/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/erv-mountain/, PreventivatoreDynamicComponent);
    this.preventivatoreMapper.register(/ergo-mountain/, PreventivatoreDynamicComponent);
    this.preventivatoreComponentsLayoutProviderService.setProvider(['net-pet-gold', 'net-pet-silver', 'erv-mountain-silver', 'erv-mountain-gold'], FAQableVariantsLayoutService);
    this.preventivatoreComponentsLayoutProviderService.setProvider(['ergo-mountain-silver', 'ergo-mountain-gold'], FAQableVariantsSGLayout);
    this.preventivatoreContentProviderService.setProvider(['net-pet-gold', 'net-pet-silver'], PreventivatorePetContentProvider);
    this.preventivatoreContentProviderService.setProvider(['erv-mountain-silver', 'erv-mountain-gold'], PreventivatoreIntesaSciContentProvider);
    this.preventivatoreContentProviderService.setProvider(['ergo-mountain-silver', 'ergo-mountain-gold'], PreventivatoreIntesaSciContentProvider);
    this.checkoutLinearStepperReducerProvider.setReducer('net-pet-silver', () => { return new CheckoutLinearStepperPetReducer() });
    this.checkoutLinearStepperReducerProvider.setReducer('net-pet-gold', () => { return new CheckoutLinearStepperPetReducer() });
    this.checkoutLinearStepperReducerProvider.setReducer('ergo-mountain-gold', () => new CheckoutLinearStepperIntesaSciReducer());
    this.checkoutLinearStepperReducerProvider.setReducer('ergo-mountain-silver', () => new CheckoutLinearStepperIntesaSciReducer());
  }

  /**
   * Get factory for componentType
   * @param componentType to get the factory for
   */
  private getFactoryFor(componentType: Type<any>): ComponentFactory<any> {
    return this.resolver.resolveComponentFactory(componentType);
  }

  private setupGtm() {
    this.gtmHandlerService.setCurrentTenant('intesa');
    // TEMP
    const type = this.dataService.tenantInfo.gtm.ecommerceType;
    const filler = type === 'GA4' ? this.gtmFillerGA4 : this.gtmFiller;
    this.gtmHandlerService.setPageInfoStrategy(filler);
    // this.gtmHandlerService.setPageInfoStrategy(this.gtmFiller);
    this.gtmHandlerService.setNavigationEndCallbackFn(this.gtmHandlerService.setPageInfoIntoDataLayer);
    this.gtmHandlerService.addException(GTMTrigger.Routing, /preventivatore/);
    this.gtmHandlerService.addException(GTMTrigger.Routing, /checkout\//);
    this.gtmHandlerService.addException(GTMTrigger.Routing, /apertura\//);
  }
}
