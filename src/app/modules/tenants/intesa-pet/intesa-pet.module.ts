import { YoloDataLayerGA4PageFiller } from './../y/yolo-dl-ga4-page-filler.service';
import { DataService } from './../../../core/services/data.service';
import {ComponentFactory, ComponentFactoryResolver, NgModule, Type} from '@angular/core';
import {ComponentMapper} from '../component-loader/component-mapper.service';
import {KenticoConfigurator} from 'app/modules/kentico/kentico-configurator.service';
import {GtmHandlerService} from 'app/core/services/gtm/gtm-handler.service';
import {TheteamComponent} from 'app/components/public/theteam/default/theteam.component';
import {ContattiComponent} from 'app/components/public/contatti/yolo/contatti.component';
import {KenticoTranslateService} from '../../kentico/data-layer/kentico-translate.service';
import {GtmYoloItPageFiller} from '../y/gtm-yolo-it-page-filler.service';
import {GTMTrigger} from '../../../core/models/gtm/gtm-settings.model';
import { CookiesPreferencesComponent } from 'app/components/public/cookies-preferences/cookies-preferences.component';
import { CookiesPreferencesChoiseComponent } from 'app/components/public/cookies-preferences/cookies-preferences-choise/cookies-preferences-choise.component';

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [],
  entryComponents: [
    TheteamComponent,
    ContattiComponent,
    CookiesPreferencesComponent,
    CookiesPreferencesChoiseComponent
  ]
})
export class IntesaPetModule {

  private static readonly KENTICO_API: string = 'b3f4cc17-1a2b-01ee-5e4e-259e7f9baf05'; // Project_ID di Intesa

  constructor(
    private resolver: ComponentFactoryResolver,
    private componentMapper: ComponentMapper,
    private kenticoConfigurator: KenticoConfigurator,
    private gtmHandlerService: GtmHandlerService,
    private gtmFiller: GtmYoloItPageFiller,
    private gtmFillerGA4: YoloDataLayerGA4PageFiller,
    private kenticoTranslateService: KenticoTranslateService,
    private dataService: DataService
  ) {
    this.kenticoConfigurator.register('cookies_preferences_modal', IntesaPetModule.KENTICO_API);
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
    this.componentMapper.setComponentFor('chi-siamo', this.getFactoryFor(TheteamComponent));
    this.componentMapper.setComponentFor('contatti', this.getFactoryFor(ContattiComponent));
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
