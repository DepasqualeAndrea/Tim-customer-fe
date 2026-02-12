import {BgImgHeroBreadcrumbComponent} from './../../components/bg-img-hero-breadcrumb/bg-img-hero-breadcrumb.component';
import {PreventivatoreAbstractComponent} from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import {ComponentFactory, ComponentFactoryResolver, Injectable} from '@angular/core';
import {PreventivatoreModule} from 'app/modules/preventivatore/preventivatore.module';
import {PreventivatoreComponentProvider} from './preventivatore-component-provider.interface';
import {WhatToKnowComponent} from '../../components/what-to-know/what-to-know.component';
import {MoreInfoWithoutButtonComponent} from '../../components/more-info-without-button/more-info-without-button.component';
import { AccordionForWhatComponent } from '../../components/accordion-for-what/accordion-for-what.component';
import { YoloViaggiGoldGuaranteeComponent } from 'app/modules/preventivatore/yolo-viaggi-gold-guarantee/yolo-viaggi-gold-guarantee.component';
import { FaqComponent } from '../../components/faq/faq.component';

@Injectable({
  providedIn: 'root'
})

export class SellaNewLayoutComponentProviderService implements PreventivatoreComponentProvider {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(BgImgHeroBreadcrumbComponent),
      this.componentFactoryResolver.resolveComponentFactory(AccordionForWhatComponent),
      this.componentFactoryResolver.resolveComponentFactory(YoloViaggiGoldGuaranteeComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowComponent),
      this.componentFactoryResolver.resolveComponentFactory(FaqComponent),
      this.componentFactoryResolver.resolveComponentFactory(MoreInfoWithoutButtonComponent)
    ];
  }
}

