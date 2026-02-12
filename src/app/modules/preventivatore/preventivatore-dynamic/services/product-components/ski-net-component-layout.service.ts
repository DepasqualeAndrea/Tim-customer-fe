import { ComponentFactory, ComponentFactoryResolver, Injectable } from '@angular/core';
import { DisclaimerComponent } from '../../components/disclaimer/disclaimer.component';
import { FaqComponent } from '../../components/faq/faq.component';
import { HeroQuotatorComponent } from '../../components/hero-quotator/hero-quotator.component';
import { HowWorksTableCardCollapseComponent } from '../../components/how-works-table-card-collapse/how-works-table-card-collapse.component';
import { MoreInfoComponent } from '../../components/more-info/more-info.component';
import { PreventivatoreAbstractComponent } from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import { WhatToKnowSliderComponent } from '../../components/what-to-know-slider/what-to-know-slider.component';
import { PreventivatoreComponentProvider } from './preventivatore-component-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class SkiNetComponentLayoutService implements PreventivatoreComponentProvider {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(HeroQuotatorComponent),
      this.componentFactoryResolver.resolveComponentFactory(HowWorksTableCardCollapseComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowSliderComponent),
      this.componentFactoryResolver.resolveComponentFactory(FaqComponent),
      this.componentFactoryResolver.resolveComponentFactory(MoreInfoComponent)
    ];
  }

}
