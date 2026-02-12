import { WhatToKnowSliderComponent } from './../../components/what-to-know-slider/what-to-know-slider.component';
import { HowWorksTableSliderComponent } from './../../components/how-works-table-slider/how-works-table-slider.component';
import { BgImgHeroComponent } from './../../components/bg-img-hero/bg-img-hero.component';
import { ComponentFactory, ComponentFactoryResolver, Injectable } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import { PreventivatoreComponentProvider } from './preventivatore-component-provider.interface';
import { MoreInfoComponent } from '../../components/more-info/more-info.component';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { ForWhoComponent } from '../../components/for-who/for-who.component';

@Injectable({
  providedIn: 'root'
})
export class BgSlidersWLayoutService implements PreventivatoreComponentProvider {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(BgImgHeroComponent),
      this.componentFactoryResolver.resolveComponentFactory(HowWorksTableSliderComponent),
      this.componentFactoryResolver.resolveComponentFactory(ForWhoComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowSliderComponent),
    ];
  }

}
