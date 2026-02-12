import { WhatToKnowSliderComponent } from './../../components/what-to-know-slider/what-to-know-slider.component';
import { HowWorksTableSliderComponent } from './../../components/how-works-table-slider/how-works-table-slider.component';
import { ComponentFactory, ComponentFactoryResolver, Injectable } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import { PreventivatoreComponentProvider } from './preventivatore-component-provider.interface';
import { MoreInfoComponent } from '../../components/more-info/more-info.component';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { ForWhoComponent } from '../../components/for-who/for-who.component';
import { BgImgBigQuotatorComponent } from '../../components/bg-img-big-quotator/bg-img-big-quotator.component';
import { HowWorksTableMultipleTabsComponent } from '../../components/how-works-table-multiple-tabs/how-works-table-multiple-tabs.component';
import { ForWhoAlsoMobileComponent } from '../../components/for-who-also-mobile/for-who-also-mobile.component';
import { HowWorksNoTabsComponent } from '../../components/how-works-no-tabs/how-works-no-tabs.component';
import { FaqComponent } from '../../components/faq/faq.component';
import { BgImgHeroComponent } from '../../components/bg-img-hero/bg-img-hero.component';
import { HeroQuotatorComponent } from '../../components/hero-quotator/hero-quotator.component';
import { MoreInfoTwoButtonsComponent } from '../../components/more-info-two-buttons/more-info-two-buttons.component';

@Injectable({
  providedIn: 'root'
})
export class BgNoSliderLayoutService implements PreventivatoreComponentProvider {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(BgImgHeroComponent),
      this.componentFactoryResolver.resolveComponentFactory(HowWorksNoTabsComponent),
      this.componentFactoryResolver.resolveComponentFactory(ForWhoAlsoMobileComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowSliderComponent),
      this.componentFactoryResolver.resolveComponentFactory(FaqComponent),
      this.componentFactoryResolver.resolveComponentFactory(MoreInfoTwoButtonsComponent)
    ];
  }

}
