import {ComponentFactory, ComponentFactoryResolver, Injectable} from '@angular/core';
import {PreventivatoreModule} from 'app/modules/preventivatore/preventivatore.module';
import {HeroQuotatorComponent} from '../../components/hero-quotator/hero-quotator.component';
import {HowWorksTableTabsComponent} from '../../components/how-works-table-tabs/how-works-table-tabs.component';
import {PreventivatoreAbstractComponent} from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import {PreventivatoreComponentProvider} from './preventivatore-component-provider.interface';
import {WhatToKnowCardsComponent} from '../../components/what-to-know-cards/what-to-know-cards.component';
import {FaqComponent} from '../../components/faq/faq.component';
import {DisclaimerComponent} from '../../components/disclaimer/disclaimer.component';
import {MoreInfoComponent} from '../../components/more-info/more-info.component';

@Injectable({
  providedIn: 'root'
})
export class HeroCardsFaqLayoutService implements PreventivatoreComponentProvider {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(HeroQuotatorComponent),
      this.componentFactoryResolver.resolveComponentFactory(DisclaimerComponent),
      this.componentFactoryResolver.resolveComponentFactory(HowWorksTableTabsComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowCardsComponent),
      this.componentFactoryResolver.resolveComponentFactory(FaqComponent),
      this.componentFactoryResolver.resolveComponentFactory(MoreInfoComponent)
    ];
  }

}
