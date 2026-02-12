import { BreadcrumbsComponent } from './../../components/breadcrumbs/breadcrumbs.component';
import {PreventivatoreAbstractComponent} from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import {ComponentFactory, ComponentFactoryResolver, Injectable} from '@angular/core';
import {PreventivatoreModule} from 'app/modules/preventivatore/preventivatore.module';
import {MoreInfoComponent} from '../../components/more-info/more-info.component';
import { PreventivatoreComponentProvider } from './preventivatore-component-provider.interface';
import { WhatToKnowComponent } from '../../components/what-to-know/what-to-know.component';
import { HowWorksWhithoutSliderComponent } from '../../components/how-works-whithout-slider/how-works-whithout-slider.component';
import { QuotationRedirectButtonComponent } from '../../components/quotation-redirect-button/quotation-redirect-button.component';
import { HeroQuotatorWithConfigLayoutTwoComponent } from '../../components/hero-quotator-with-config-layout-two/hero-quotator-with-config-layout-two.component';

@Injectable({
  providedIn: 'root'
})
export class BgNoSliderDoubleQuoteWLayoutService implements PreventivatoreComponentProvider {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
                                                              //BgImgQuoteComponent
       this.componentFactoryResolver.resolveComponentFactory(HeroQuotatorWithConfigLayoutTwoComponent),
      this.componentFactoryResolver.resolveComponentFactory(BreadcrumbsComponent),
      this.componentFactoryResolver.resolveComponentFactory(HowWorksWhithoutSliderComponent),
      //this.componentFactoryResolver.resolveComponentFactory(HowWorksWithBorderGaranteeComponent),
      //this.componentFactoryResolver.resolveComponentFactory(OptionalWarrantyComponent),
      this.componentFactoryResolver.resolveComponentFactory(QuotationRedirectButtonComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowComponent),
      this.componentFactoryResolver.resolveComponentFactory(MoreInfoComponent)
    ];
  }

}
