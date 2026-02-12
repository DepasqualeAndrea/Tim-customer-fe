import {ComponentFactory, ComponentFactoryResolver, Injectable} from '@angular/core';
import {PreventivatoreComponentProvider} from './preventivatore-component-provider.interface';
import {PreventivatoreAbstractComponent} from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import {HeroQuotatorComponent} from '../../components/hero-quotator/hero-quotator.component';
import {MoreInfoComponent} from '../../components/more-info/more-info.component';
import {WhatToKnowSliderComponent} from '../../components/what-to-know-slider/what-to-know-slider.component';
import {FaqPreventivatoreNewComponent} from '../../components/faq-preventivatore-new/faq-preventivatore-new.component';
import { AccordionForWhatComponent } from '../../components/accordion-for-what/accordion-for-what.component';

@Injectable({
  providedIn: 'root'
})
export class AxaAnnulmentFlightLayoutService implements PreventivatoreComponentProvider {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(HeroQuotatorComponent),
      this.componentFactoryResolver.resolveComponentFactory(AccordionForWhatComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowSliderComponent),
      this.componentFactoryResolver.resolveComponentFactory(FaqPreventivatoreNewComponent),
      this.componentFactoryResolver.resolveComponentFactory(MoreInfoComponent)
    ];
  }

}
