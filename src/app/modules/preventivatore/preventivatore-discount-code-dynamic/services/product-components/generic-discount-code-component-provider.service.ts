import {ComponentFactory, ComponentFactoryResolver, Injectable} from '@angular/core';
import {PreventivatoreModule} from 'app/modules/preventivatore/preventivatore.module';
import { PreventivatoreDiscountCodeComponentProvider } from './preventivatore-discount-code-component-provider.interface';
import { PreventivatoreDiscountCodeAbstractComponent } from '../../components/preventivatore-abstract/preventivatore-discount-code-abstract.component';
import { BgImgHeroDCComponent } from '../../components/bg-img-hero/bg-img-hero-dc.component';
import { HowWorksTableSliderDCComponent } from '../../components/how-works-table-slider/how-works-table-slider-dc.component';
import { WhatToKnowSliderDCComponent } from '../../components/what-to-know-slider-dc/what-to-know-slider-dc.component';

@Injectable({
  providedIn: 'root'
})
export class GenericDiscountCodeComponentProviderService
  implements PreventivatoreDiscountCodeComponentProvider {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }


  getBgImgHeroDCComponent(): ComponentFactory<PreventivatoreDiscountCodeAbstractComponent> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(BgImgHeroDCComponent);
    return componentFactory;
  }

  getHowWorksComponent(): ComponentFactory<PreventivatoreDiscountCodeAbstractComponent> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(HowWorksTableSliderDCComponent);
    return componentFactory;
  }

  getWhatToKnowComponent(): ComponentFactory<PreventivatoreDiscountCodeAbstractComponent> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(WhatToKnowSliderDCComponent);
    return componentFactory;
  }
}
