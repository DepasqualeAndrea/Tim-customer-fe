import { YoloDataLayerGA4PageFiller } from './../y/yolo-dl-ga4-page-filler.service';
import { DataService } from './../../../core/services/data.service';
import {ComponentFactory, ComponentFactoryResolver, NgModule, Type} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderThemaCTComponent} from './themaCT/themaCT.component';
import {ScrollToModule} from '@nicky-lenaers/ngx-scroll-to';
import {PREVENTIVATORE_HEADER_PLACEHOLDER} from 'app/modules/preventivatore/header/preventivatore-header/preventivatore-header.component';
import {ComponentMapper} from '../component-loader/component-mapper.service';
import {PolicyDetailModalClaimComponent} from 'app/modules/private-area/components/policy-detail/policy-detail-modal-claim/policy-detail-modal-claim.component';
import {PrivateAreaModule} from 'app/modules/private-area/private-area.module';
import {KenticoConfigurator} from 'app/modules/kentico/kentico-configurator.service';
import {RegisterFormComponent} from 'app/modules/security/components/register-form/register-form.component';
import {AddressFormComponent} from 'app/modules/checkout/checkout-step/checkout-step-address/components/address-form/address-form.component';
import {UserDetailsComponent} from 'app/modules/private-area/components/user-details/user-details.component';
import {ComponentLoaderModule} from '../component-loader/component-loader.module';
import {SecurityModule} from 'app/modules/security/security.module';
import {EmptyComponent} from '../component-loader/empty/empty.component';
import {TheteamComponent} from 'app/components/public/theteam/default/theteam.component';
import {ContattiComponent} from 'app/components/public/contatti/yolo/contatti.component';
import {KenticoTranslateService} from '../../kentico/data-layer/kentico-translate.service';
import {MyPoliciesComponent} from 'app/modules/private-area/components/my-policies/my-policies.component';
import {GTMTrigger} from '../../../core/models/gtm/gtm-settings.model';
import {GtmHandlerService} from '../../../core/services/gtm/gtm-handler.service';
import {GtmYoloItPageFiller} from '../y/gtm-yolo-it-page-filler.service';


@NgModule({
  declarations: [
    HeaderThemaCTComponent,
  ],
  imports: [
    CommonModule,
    PrivateAreaModule,
    ComponentLoaderModule,
    SecurityModule,
    ScrollToModule.forRoot(),
  ],
  entryComponents: [
    HeaderThemaCTComponent,
    PolicyDetailModalClaimComponent,
    RegisterFormComponent,
    AddressFormComponent,
    UserDetailsComponent,
    MyPoliciesComponent,
    EmptyComponent,
    TheteamComponent,
    ContattiComponent
  ]
})
export class CtModule {
  constructor(
    private resolver: ComponentFactoryResolver,
    private componentMapper: ComponentMapper,
    private kenticoConfigurator: KenticoConfigurator,
    private kenticoTranslateService: KenticoTranslateService,
    private gtmHandlerService: GtmHandlerService,
    private gtmFiller: GtmYoloItPageFiller,
    private gtmFillerGA4: YoloDataLayerGA4PageFiller,
    private dataService: DataService
  ) {

    this.kenticoTranslateService.resolveAll();

    this.registerComponents();
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
    this.componentMapper.setComponentFor('policyModalClaim', this.resolver.resolveComponentFactory(PolicyDetailModalClaimComponent));
    this.componentMapper.setComponentFor(PREVENTIVATORE_HEADER_PLACEHOLDER, this.resolver.resolveComponentFactory(HeaderThemaCTComponent));
    this.componentMapper.setComponentFor('checkoutLoginRegisterForm', this.getFactoryFor(RegisterFormComponent));
    this.componentMapper.setComponentFor('checkoutAddressForm', this.getFactoryFor(AddressFormComponent));
    this.componentMapper.setComponentFor('privateAreaUserDetails', this.getFactoryFor(UserDetailsComponent));
    this.componentMapper.setComponentFor('privateAreaMyPolicies', this.getFactoryFor(MyPoliciesComponent));
    this.componentMapper.setComponentFor('contactsForm', this.getFactoryFor(EmptyComponent));
    this.componentMapper.setComponentFor('chi-siamo', this.getFactoryFor(TheteamComponent));
    this.componentMapper.setComponentFor('contatti', this.getFactoryFor(ContattiComponent));
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
