import { MoreInfoComponent } from './../../components/more-info/more-info.component';
import { ComponentFactory, ComponentFactoryResolver, Injectable } from '@angular/core';
import { BgImgHeroComponent } from '../../components/bg-img-hero/bg-img-hero.component';
import { PreventivatoreAbstractComponent } from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import { WhatToKnowSliderComponent } from '../../components/what-to-know-slider/what-to-know-slider.component';
import { PreventivatoreComponentProvider } from './preventivatore-component-provider.interface';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';

@Injectable({
  providedIn: 'root'
})
export class GauntLayoutService implements PreventivatoreComponentProvider {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(BgImgHeroComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowSliderComponent),
      this.componentFactoryResolver.resolveComponentFactory(MoreInfoComponent)
    ];
  }
}
