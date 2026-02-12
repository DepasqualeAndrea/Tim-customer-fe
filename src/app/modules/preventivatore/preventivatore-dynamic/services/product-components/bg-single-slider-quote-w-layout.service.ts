import { HowWorksSingleTableSliderComponent } from './../../components/how-works-single-table-slider/how-works-single-table-slider.component';
import { PreventivatoreAbstractComponent } from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import { ComponentFactory, ComponentFactoryResolver, Injectable } from '@angular/core';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { MoreInfoComponent } from '../../components/more-info/more-info.component';
import { PreventivatoreComponentProvider } from './preventivatore-component-provider.interface';
import { WhatToKnowComponent } from '../../components/what-to-know/what-to-know.component';
import { BgImgComponent } from '../../components/bg-img/bg-img.component';
import { QuoteComponent } from '../../components/quote/quote.component';
import { BreadcrumbsComponent } from '../../components/breadcrumbs/breadcrumbs.component';

@Injectable({
  providedIn: 'root'
})
export class BgSingleSliderQuoteWLayoutService implements PreventivatoreComponentProvider {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(BgImgComponent),
      this.componentFactoryResolver.resolveComponentFactory(BreadcrumbsComponent),
      this.componentFactoryResolver.resolveComponentFactory(HowWorksSingleTableSliderComponent),
      this.componentFactoryResolver.resolveComponentFactory(QuoteComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowComponent),
      this.componentFactoryResolver.resolveComponentFactory(MoreInfoComponent)
    ];
  }

}
