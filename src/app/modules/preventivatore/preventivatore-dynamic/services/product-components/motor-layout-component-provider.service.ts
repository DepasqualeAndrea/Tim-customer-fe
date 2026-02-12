import {ComponentFactory, ComponentFactoryResolver, Injectable} from '@angular/core';
import {PreventivatoreAbstractComponent} from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import {HeroQuotatorComponent} from '../../components/hero-quotator/hero-quotator.component';
import {ForWhoComponent} from '../../components/for-who/for-who.component';
import {WhatToKnowSliderComponent} from '../../components/what-to-know-slider/what-to-know-slider.component';
import {FaqComponent} from '../../components/faq/faq.component';
import {MoreInfoTwoButtonsComponent} from '../../components/more-info-two-buttons/more-info-two-buttons.component';
import {ProductsCarouselComponent} from '../../components/products-carousel/products-carousel.component';
import {PreventivatoreModule} from '../../../preventivatore.module';
import {OptionalWarrantyComponent} from '../../components/optional-warranty/optional-warranty.component';
import {HowWorksWithBorderGaranteeComponent} from '../../components/how-works-with-border-garantee/how-works-with-border-garantee.component';
import {ForWhoWithBorderComponent} from '../../components/for-who-with-border/for-who-with-border.component';
import {HeroQuotatorWithConfigLayoutTwoComponent} from '../../components/hero-quotator-with-config-layout-two/hero-quotator-with-config-layout-two.component';

@Injectable({
  providedIn: 'root'
})
export class MotorLayoutComponentProviderService {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(HeroQuotatorWithConfigLayoutTwoComponent),
      this.componentFactoryResolver.resolveComponentFactory(HowWorksWithBorderGaranteeComponent),
      this.componentFactoryResolver.resolveComponentFactory(ForWhoWithBorderComponent),
      this.componentFactoryResolver.resolveComponentFactory(OptionalWarrantyComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowSliderComponent),
      this.componentFactoryResolver.resolveComponentFactory(FaqComponent),
      this.componentFactoryResolver.resolveComponentFactory(MoreInfoTwoButtonsComponent),
      this.componentFactoryResolver.resolveComponentFactory(ProductsCarouselComponent),
    ];
  }
}
