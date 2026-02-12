import { WhatToKnowSliderComponent } from './../../components/what-to-know-slider/what-to-know-slider.component';
import { HowWorksTableSliderComponent } from './../../components/how-works-table-slider/how-works-table-slider.component';
import { ComponentFactory, ComponentFactoryResolver, Injectable } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import { PreventivatoreComponentProvider } from './preventivatore-component-provider.interface';
import { MoreInfoComponent } from '../../components/more-info/more-info.component';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { ForWhoComponent } from '../../components/for-who/for-who.component';
import { BgImgBigQuotatorComponent } from '../../components/bg-img-big-quotator/bg-img-big-quotator.component';
import { ForWhoAlsoMobileComponent } from '../../components/for-who-also-mobile/for-who-also-mobile.component';
import { HowWorksTableMultipleTabsAccordionComponent } from '../../components/how-works-table-multiple-tabs-accordion/how-works-table-multiple-tabs-accordion.component';

@Injectable({
  providedIn: 'root'
})
export class BgBigQuotatorLayoutService implements PreventivatoreComponentProvider {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(BgImgBigQuotatorComponent),
      this.componentFactoryResolver.resolveComponentFactory(HowWorksTableMultipleTabsAccordionComponent),
      this.componentFactoryResolver.resolveComponentFactory(ForWhoAlsoMobileComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowSliderComponent),
      // this.componentFactoryResolver.resolveComponentFactory(MoreInfoComponent)
    ];
  }

}
