import { ComponentFactory, ComponentFactoryResolver, Injectable } from '@angular/core';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { FaqComponent } from '../../components/faq/faq.component';
import { MoreInfoComponent } from '../../components/more-info/more-info.component';
import { PreventivatoreAbstractComponent } from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import { PreventivatoreComponentProvider } from './preventivatore-component-provider.interface';
import { TelemedicinaHeroQuotatorComponent } from '../../components/telemedicina-hero-quotator/telemedicina-hero-quotator.component';
import { HowWorksTelemedicinaComponent } from '../../components/how-works-telemedicina/how-works-telemedicina.component';
import { WhatToKnowTelemedicinaComponent } from '../../components/what-to-know-telemedicina/what-to-know-telemedicina.component';

@Injectable({
  providedIn: 'root'
})
export class TelemedicinaLayoutService implements PreventivatoreComponentProvider {

  constructor(private componentFactoryResolver: ComponentFactoryResolver)
  { }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(TelemedicinaHeroQuotatorComponent),
      this.componentFactoryResolver.resolveComponentFactory(HowWorksTelemedicinaComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowTelemedicinaComponent),
      this.componentFactoryResolver.resolveComponentFactory(FaqComponent),
      this.componentFactoryResolver.resolveComponentFactory(MoreInfoComponent),
    ];
  }
}
