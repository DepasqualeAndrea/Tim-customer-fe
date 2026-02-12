import { ComponentFactory, ComponentFactoryResolver, Injectable } from '@angular/core';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { FaqComponent } from '../../components/faq/faq.component';
import { HeroQuotatorComponent } from '../../components/hero-quotator/hero-quotator.component';
import { HowWorksCardsComponent } from '../../components/how-works-cards/how-works-cards.component';
import { MoreInfoComponent } from '../../components/more-info/more-info.component';
import { PreventivatoreAbstractComponent } from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import { WhatToKnowMefioComponent } from '../../components/what-to-know-mefio/what-to-know-mefio.component';
import { PreventivatoreComponentProvider } from './preventivatore-component-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class FiveTabsLayoutService implements PreventivatoreComponentProvider {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) 
  { }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(HeroQuotatorComponent),
      this.componentFactoryResolver.resolveComponentFactory(HowWorksCardsComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowMefioComponent),
      this.componentFactoryResolver.resolveComponentFactory(FaqComponent),
      this.componentFactoryResolver.resolveComponentFactory(MoreInfoComponent),
    ];
  }
}
