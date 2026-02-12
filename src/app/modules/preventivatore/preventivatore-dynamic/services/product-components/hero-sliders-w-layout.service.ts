import { MoreInfoComponent } from './../../components/more-info/more-info.component';
import { ForWhoComponent } from './../../components/for-who/for-who.component';
import { ComponentFactory, ComponentFactoryResolver, Injectable } from '@angular/core';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { HeroQuotatorComponent } from '../../components/hero-quotator/hero-quotator.component';
import { HowWorksTableSliderComponent } from '../../components/how-works-table-slider/how-works-table-slider.component';
import { PreventivatoreAbstractComponent } from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import { WhatToKnowSliderComponent } from '../../components/what-to-know-slider/what-to-know-slider.component';
import { PreventivatoreComponentProvider } from './preventivatore-component-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class HeroSlidersWLayoutService implements PreventivatoreComponentProvider {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(HeroQuotatorComponent),
      this.componentFactoryResolver.resolveComponentFactory(HowWorksTableSliderComponent),
      this.componentFactoryResolver.resolveComponentFactory(ForWhoComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowSliderComponent),
      this.componentFactoryResolver.resolveComponentFactory(MoreInfoComponent)
    ];
  }
}
