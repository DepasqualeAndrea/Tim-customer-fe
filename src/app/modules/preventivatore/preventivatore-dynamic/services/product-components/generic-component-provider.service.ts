import {PreventivatoreAbstractComponent} from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import {ComponentFactory, ComponentFactoryResolver, Injectable} from '@angular/core';
import {PreventivatoreModule} from 'app/modules/preventivatore/preventivatore.module';
import {HowWorksTableSliderComponent} from '../../components/how-works-table-slider/how-works-table-slider.component';
import {WhatToKnowSliderComponent} from '../../components/what-to-know-slider/what-to-know-slider.component';
import {HeroQuotatorComponent} from '../../components/hero-quotator/hero-quotator.component';
import {MoreInfoComponent} from '../../components/more-info/more-info.component';
import {ForWhoComponent} from '../../components/for-who/for-who.component';
import { PreventivatoreComponentProvider } from './preventivatore-component-provider.interface';
import { BgImgHeroComponent } from '../../components/bg-img-hero/bg-img-hero.component';

@Injectable({
  providedIn: 'root'
})
export class GenericComponentProviderService implements PreventivatoreComponentProvider {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  // TODO: TO BE REMOVED
  getHeroComponent(): ComponentFactory<PreventivatoreAbstractComponent> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(HeroQuotatorComponent);
    return componentFactory;
  }

  getBgImgHeroComponent(): ComponentFactory<PreventivatoreAbstractComponent> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(BgImgHeroComponent);
    return componentFactory;
  }

  getHeaderComponent(): ComponentFactory<PreventivatoreAbstractComponent> {
    return null;
  }

  getHowWorksComponent(): ComponentFactory<PreventivatoreAbstractComponent> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(HowWorksTableSliderComponent);
    return componentFactory;
  }

  getMoreInfoComponent(): ComponentFactory<PreventivatoreAbstractComponent> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(MoreInfoComponent);
    return componentFactory;
  }

  getWhatToKnowComponent(): ComponentFactory<PreventivatoreAbstractComponent> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(WhatToKnowSliderComponent);
    return componentFactory;
  }

  getForWhoComponent(): ComponentFactory<PreventivatoreAbstractComponent> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ForWhoComponent);
    return componentFactory;
  }


  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return null;
  }

}
