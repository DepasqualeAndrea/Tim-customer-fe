import {ComponentFactory, ComponentFactoryResolver, Injectable} from '@angular/core';
import {PreventivatoreComponentProvider} from "./preventivatore-component-provider.interface";
import {
  PreventivatoreAbstractComponent
} from "../../components/preventivatore-abstract/preventivatore-abstract.component";
import {
  HeroQuotatorWithConfigLayoutTwoComponent
} from "../../components/hero-quotator-with-config-layout-two/hero-quotator-with-config-layout-two.component";
import {BreadcrumbsComponent} from "../../components/breadcrumbs/breadcrumbs.component";
import {
  HowWorksWhithoutSliderComponent
} from "../../components/how-works-whithout-slider/how-works-whithout-slider.component";
import {
  QuotationRedirectButtonComponent
} from "../../components/quotation-redirect-button/quotation-redirect-button.component";
import {WhatToKnowComponent} from "../../components/what-to-know/what-to-know.component";
import {MoreInfoComponent} from "../../components/more-info/more-info.component";
import {BgImgQuoteComponent} from "../../components/bg-img-quote/bg-img-quote.component";

@Injectable({
  providedIn: 'root'
})
export class PreventivatoreGeHomeVetrinaService implements PreventivatoreComponentProvider{

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      //BgImgQuoteComponent
      this.componentFactoryResolver.resolveComponentFactory(BgImgQuoteComponent),
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
