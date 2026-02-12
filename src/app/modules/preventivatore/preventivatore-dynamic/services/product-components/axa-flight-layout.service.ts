import {ComponentFactory, ComponentFactoryResolver, Injectable} from '@angular/core';
import {PreventivatoreAbstractComponent} from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import {PreventivatoreComponentProvider} from './preventivatore-component-provider.interface';
import {HeroQuotatorComponent} from '../../components/hero-quotator/hero-quotator.component';
import { FaqPreventivatoreNewComponent } from '../../components/faq-preventivatore-new/faq-preventivatore-new.component';
import {AccordionForWhatComponent} from '../../components/accordion-for-what/accordion-for-what.component';
import {WhatToKnowSliderComponent} from '../../components/what-to-know-slider/what-to-know-slider.component';
import {MoreInfoComponent} from '../../components/more-info/more-info.component';
import {YoloViaggiGoldGuaranteeComponent} from 'app/modules/preventivatore/yolo-viaggi-gold-guarantee/yolo-viaggi-gold-guarantee.component';

@Injectable({
  providedIn: 'root'
})
export class AxaFlightLayoutService implements PreventivatoreComponentProvider {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(HeroQuotatorComponent),
      this.componentFactoryResolver.resolveComponentFactory(AccordionForWhatComponent),
      this.componentFactoryResolver.resolveComponentFactory(YoloViaggiGoldGuaranteeComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowSliderComponent),
      this.componentFactoryResolver.resolveComponentFactory(FaqPreventivatoreNewComponent),
      this.componentFactoryResolver.resolveComponentFactory(MoreInfoComponent)
    ];
  }

}
