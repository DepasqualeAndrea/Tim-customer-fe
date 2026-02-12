import { HeroQuotatorComponent } from './../../components/hero-quotator/hero-quotator.component';
import { ComponentFactory, ComponentFactoryResolver, Injectable } from '@angular/core';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { PreventivatoreAbstractComponent } from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import { PreventivatoreComponentProvider } from './preventivatore-component-provider.interface';
import { HowWorksTableSliderComponent } from '../../components/how-works-table-slider/how-works-table-slider.component';
import { WhatToKnowSliderComponent } from '../../components/what-to-know-slider/what-to-know-slider.component';
import { MoreInfoComponent } from '../../components/more-info/more-info.component';

@Injectable({
  providedIn: 'root'
})
export class HeroSlidersLayoutService implements PreventivatoreComponentProvider {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(HeroQuotatorComponent),
      this.componentFactoryResolver.resolveComponentFactory(HowWorksTableSliderComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowSliderComponent),
      this.componentFactoryResolver.resolveComponentFactory(MoreInfoComponent)
    ];
  }

}
