import { YoloDataLayerGA4PageFiller } from './../y/yolo-dl-ga4-page-filler.service';
import { DataService } from './../../../core/services/data.service';
import {ComponentFactory, ComponentFactoryResolver, NgModule, Type} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InjectableProviderService} from 'app/core/services/injectable-provider.service';
import {ComponentMapper} from '../component-loader/component-mapper.service';
import {RegisterFormComponent} from 'app/modules/security/components/register-form/register-form.component';
import {AddressFormComponent} from 'app/modules/checkout/checkout-step/checkout-step-address/components/address-form/address-form.component';
import {UserDetailsComponent} from 'app/modules/private-area/components/user-details/user-details.component';
import {ComponentLoaderModule} from '../component-loader/component-loader.module';
import {PolicyDetailModalClaimComponent} from 'app/modules/private-area/components/policy-detail/policy-detail-modal-claim/policy-detail-modal-claim.component';
import {KenticoConfigurator} from 'app/modules/kentico/kentico-configurator.service';
import {EmptyComponent} from '../component-loader/empty/empty.component';
import {TheteamComponent} from 'app/components/public/theteam/default/theteam.component';
import {ContattiComponent} from 'app/components/public/contatti/yolo/contatti.component';
import {KenticoTranslateService} from '../../kentico/data-layer/kentico-translate.service';
import {MyPoliciesComponent} from 'app/modules/private-area/components/my-policies/my-policies.component';
import {GtmHandlerService} from '../../../core/services/gtm/gtm-handler.service';
import {GtmYoloItPageFiller} from '../y/gtm-yolo-it-page-filler.service';
import {GTMTrigger} from '../../../core/models/gtm/gtm-settings.model';
import { CookiesPreferencesComponent } from 'app/components/public/cookies-preferences/cookies-preferences.component';
import { CookiesPreferencesChoiseComponent } from 'app/components/public/cookies-preferences/cookies-preferences-choise/cookies-preferences-choise.component';
import { HomepageYoloComponent } from 'app/components/public/homepage/homepage-yolo/homepage-yolo.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ComponentLoaderModule
  ],
  entryComponents: [
    PolicyDetailModalClaimComponent,
    RegisterFormComponent,
    AddressFormComponent,
    UserDetailsComponent,
    MyPoliciesComponent,
    EmptyComponent,
    TheteamComponent,
    ContattiComponent,
    HomepageYoloComponent,
    CookiesPreferencesComponent,
    CookiesPreferencesChoiseComponent,
  ],
})
export class CRIFModule {
  private static readonly KENTICO_API: string = '7a7736a9-4f32-0102-4ab8-526e565dccc7';

  constructor(
    private injectableProviderService: InjectableProviderService,
    private resolver: ComponentFactoryResolver,
    private componentMapper: ComponentMapper,
    private kenticoConfigurator: KenticoConfigurator,
    private kenticoTranslateService: KenticoTranslateService,
    private gtmHandlerService: GtmHandlerService,
    private gtmFiller: GtmYoloItPageFiller,
    private gtmFillerGA4: YoloDataLayerGA4PageFiller,
    private dataService: DataService
  ) {
    this.registerComponents();
    this.registerDynamicContent();
    this.setupGtm();

  }

  registerDynamicContent() {
    this.kenticoConfigurator.register('checkout_step_1_sci', CRIFModule.KENTICO_API);
    this.kenticoConfigurator.register('checkout_step_1_annullamento_viaggio', CRIFModule.KENTICO_API);
    this.kenticoConfigurator.register('checkout_step_1_smartphone', CRIFModule.KENTICO_API);
    this.kenticoConfigurator.register('footer', CRIFModule.KENTICO_API);
    this.kenticoConfigurator.register('navbar', CRIFModule.KENTICO_API);
    this.kenticoConfigurator.register('products', CRIFModule.KENTICO_API);
    this.kenticoConfigurator.register('yolo_forms', CRIFModule.KENTICO_API);
    this.kenticoConfigurator.register('yolo_homepage', CRIFModule.KENTICO_API);
    this.kenticoConfigurator.register('page_not_found', CRIFModule.KENTICO_API);
    this.kenticoConfigurator.register('cookies_preferences_modal', CRIFModule.KENTICO_API);


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
    this.componentMapper.setComponentFor('policyModalClaim', this.getFactoryFor(PolicyDetailModalClaimComponent));
    this.componentMapper.setComponentFor('checkoutLoginRegisterForm', this.getFactoryFor(RegisterFormComponent));
    this.componentMapper.setComponentFor('checkoutAddressForm', this.getFactoryFor(AddressFormComponent));
    this.componentMapper.setComponentFor('privateAreaUserDetails', this.getFactoryFor(UserDetailsComponent));
    this.componentMapper.setComponentFor('privateAreaMyPolicies', this.getFactoryFor(MyPoliciesComponent));
    this.componentMapper.setComponentFor('contactsForm', this.getFactoryFor(EmptyComponent));
    this.componentMapper.setComponentFor('chi-siamo', this.getFactoryFor(TheteamComponent));
    this.componentMapper.setComponentFor('contatti', this.getFactoryFor(ContattiComponent));
    this.componentMapper.setComponentFor('home', this.getFactoryFor(HomepageYoloComponent));
    this.componentMapper.setComponentFor('CookiesModal', this.getFactoryFor(CookiesPreferencesComponent));
    this.componentMapper.setComponentFor('CookiesModalChoise', this.getFactoryFor(CookiesPreferencesChoiseComponent));
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
    this.gtmHandlerService.addException(GTMTrigger.Routing, /apertura\//);
  }
}
