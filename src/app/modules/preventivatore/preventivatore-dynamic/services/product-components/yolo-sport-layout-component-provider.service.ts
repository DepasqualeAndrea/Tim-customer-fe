import { WhatToKnowSliderComponent } from './../../components/what-to-know-slider/what-to-know-slider.component';
import { ComponentFactory, ComponentFactoryResolver, Injectable } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import { PreventivatoreComponentProvider } from './preventivatore-component-provider.interface';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
//import { ForWhoAlsoMobileComponent } from '../../components/for-who-also-mobile/for-who-also-mobile.component';
//import { HowWorksNoTabsComponent } from '../../components/how-works-no-tabs/how-works-no-tabs.component';
import { FaqComponent } from '../../components/faq/faq.component';
import { HeroQuotatorComponent } from '../../components/hero-quotator/hero-quotator.component';
import { MoreInfoTwoButtonsComponent } from '../../components/more-info-two-buttons/more-info-two-buttons.component';
//import { HowWorksDoubleColNoTableComponent } from '../../components/how-works-double-col-no-table/how-works-double-col-no-table.component';
import { MoreInfoComponent } from '../../components/more-info/more-info.component';
import { WhatToKnowSliderBgColorComponent } from '../../components/what-to-know-slider-bg-color/what-to-know-slider-bg-color.component';
import { HowWorksDoubleColNoTableComponent } from '../../components/how-works-double-col-no-table/how-works-double-col-no-table.component';

@Injectable({
  providedIn: 'root'
})
export class YoloSportLayoutComponentProviderService implements PreventivatoreComponentProvider {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(HeroQuotatorComponent),
      this.componentFactoryResolver.resolveComponentFactory(HowWorksDoubleColNoTableComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowSliderBgColorComponent),
      this.componentFactoryResolver.resolveComponentFactory(FaqComponent),
      this.componentFactoryResolver.resolveComponentFactory(MoreInfoComponent)
    ];
  }

}
