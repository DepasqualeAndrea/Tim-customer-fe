import { KenticoConfigurator } from 'app/modules/kentico/kentico-configurator.service';
import { ComponentLoaderModule } from '../component-loader/component-loader.module';
import { ComponentFactory, ComponentFactoryResolver, NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentMapper } from '../component-loader/component-mapper.service';
import { PolicyDetailModalClaimComponent } from 'app/modules/private-area/components/policy-detail/policy-detail-modal-claim/policy-detail-modal-claim.component';
import { RegisterFormComponent } from 'app/modules/security/components/register-form/register-form.component';
import { AddressFormComponent } from 'app/modules/checkout/checkout-step/checkout-step-address/components/address-form/address-form.component';
import { UserDetailsComponent } from 'app/modules/private-area/components/user-details/user-details.component';
import { EmptyComponent } from '../component-loader/empty/empty.component';
import { ChiSiamoNetComponent } from './chi-siamo-net/chi-siamo-net.component';
import { SharedModule } from 'app/shared/shared.module';
import { ContattiNetComponent } from 'app/components/public/contatti/net-insurance/contatti-net.component';
import { ContactFormNetComponent } from './contact-form-net/contact-form-net.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { KenticoTranslateService } from '../../kentico/data-layer/kentico-translate.service';
import { TypeResolver } from 'kentico-cloud-delivery';
import { PageSection } from '../../kentico/models/architecture.model';
import { YoloButton } from '../../kentico/models/card.model';
import { AccessLogo } from '../../kentico/models/logo.model';
import { HREFButton } from '../../kentico/models/button.model';
import { AngularLink } from '../../kentico/models/angular-link.model';
import { MyPoliciesComponent } from 'app/modules/private-area/components/my-policies/my-policies.component';
import { GTMTrigger } from '../../../core/models/gtm/gtm-settings.model';
import { GtmHandlerService } from '../../../core/services/gtm/gtm-handler.service';
import { GtmYoloItPageFiller } from '../y/gtm-yolo-it-page-filler.service';

@NgModule({
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
    EmptyComponent,
    ChiSiamoNetComponent,
    ContattiNetComponent,
    ContactFormNetComponent,
  ],
  declarations: [
    ChiSiamoNetComponent,
    ContattiNetComponent,
    ContactFormNetComponent,
  ]
})
export class NetInsuranceModule {
  private static readonly KENTICO_API: string = '2f0fba60-9b75-01b8-5228-32817d046777';

  constructor(
    private kenticoConf: KenticoConfigurator,
    private kenticoTranslateService: KenticoTranslateService,
    private componentMapper: ComponentMapper,
    private resolver: ComponentFactoryResolver,
    private gtmHandlerService: GtmHandlerService,
    private gtmFiller: GtmYoloItPageFiller
  ) {
    this.kenticoConf.register('flagship', NetInsuranceModule.KENTICO_API, this.createTypeResolvers());
    this.kenticoConf.register('insurances', NetInsuranceModule.KENTICO_API);
    this.kenticoConf.register('who_we_are', NetInsuranceModule.KENTICO_API);
    this.kenticoConf.register('talk_about_us', NetInsuranceModule.KENTICO_API);
    this.kenticoConf.register('footer', NetInsuranceModule.KENTICO_API);
    this.kenticoConf.register('checkout', NetInsuranceModule.KENTICO_API);
    this.kenticoConf.register('private_area', NetInsuranceModule.KENTICO_API);
    this.kenticoConf.register('access', NetInsuranceModule.KENTICO_API);
    this.kenticoConf.register('navbar', NetInsuranceModule.KENTICO_API);
    this.kenticoConf.register('quotator', NetInsuranceModule.KENTICO_API);
    this.kenticoConf.register('faq_image', NetInsuranceModule.KENTICO_API);
    this.kenticoConf.register('chi_siamo_header', NetInsuranceModule.KENTICO_API);
    this.kenticoConf.register('contatti_header', NetInsuranceModule.KENTICO_API);
    this.kenticoConf.register('assistenza_faq', NetInsuranceModule.KENTICO_API);
    this.kenticoConf.register('seo', NetInsuranceModule.KENTICO_API);

    this.kenticoTranslateService.resolveAll();

    this.registerComponents();
    this.setupGtm();

  }

  private createTypeResolvers(): TypeResolver[] {
    return [
      new TypeResolver('section', () => new PageSection()),
      new TypeResolver('yolobutton', () => new YoloButton()), // create a new button layout
      new TypeResolver('logo', () => new AccessLogo()),
      new TypeResolver('href_button', () => new HREFButton()),
      new TypeResolver('angular_link_b527c22', () => new AngularLink())
    ];
  }


  private registerComponents() {
    // Please insert here all components that should be loaded ONLY by this tenant
    // Remember to add the correspondenting component type into entryComponents array.
    this.componentMapper.setComponentFor('policyModalClaim', this.getFactoryFor(PolicyDetailModalClaimComponent));
    this.componentMapper.setComponentFor('checkoutLoginRegisterForm', this.getFactoryFor(RegisterFormComponent));
    this.componentMapper.setComponentFor('checkoutAddressForm', this.getFactoryFor(AddressFormComponent));
    this.componentMapper.setComponentFor('privateAreaUserDetails', this.getFactoryFor(UserDetailsComponent));
    this.componentMapper.setComponentFor('privateAreaMyPolicies', this.getFactoryFor(MyPoliciesComponent));
    this.componentMapper.setComponentFor('contactsForm', this.getFactoryFor(ContactFormNetComponent));
    this.componentMapper.setComponentFor('chi-siamo', this.getFactoryFor(ChiSiamoNetComponent));
    this.componentMapper.setComponentFor('contatti', this.getFactoryFor(ContattiNetComponent));
    // this.componentMapper.setComponentFor('home', this.getFactoryFor(HomepageNetInsuranceComponent));
  }

  private getFactoryFor(componentType: Type<any>): ComponentFactory<any> {
    return this.resolver.resolveComponentFactory(componentType);
  }

  private setupGtm() {
    this.gtmHandlerService.setCurrentTenant('yolo-it-it');
    this.gtmHandlerService.setPageInfoStrategy(this.gtmFiller);
    this.gtmHandlerService.setNavigationEndCallbackFn(this.gtmHandlerService.setPageInfoIntoDataLayer);
    this.gtmHandlerService.addException(GTMTrigger.Routing, /preventivatore/);
    this.gtmHandlerService.addException(GTMTrigger.Routing, /apertura\//);
  }
}
