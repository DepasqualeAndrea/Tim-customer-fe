import { ProductsCarouselComponent } from './../../components/products-carousel/products-carousel.component';
import { ComponentFactory, ComponentFactoryResolver, Injectable } from '@angular/core';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { PreventivatoreAbstractComponent } from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import { WhatToKnowSliderComponent } from '../../components/what-to-know-slider/what-to-know-slider.component';
import { PreventivatoreComponentProvider } from './preventivatore-component-provider.interface';
import { FaqComponent } from '../../components/faq/faq.component';
import { MoreInfoTwoButtonsComponent } from '../../components/more-info-two-buttons/more-info-two-buttons.component';
import { HowWorksCardLikeQuotatorComponent } from '../../components/how-works-card-like-quotator/how-works-card-like-quotator.component';
import { HeroQuotatorScooterBikeComponent } from '../../components/hero-quotator-scooter-bike/hero-quotator-scooter-bike.component';

@Injectable({
  providedIn: 'root'
})
export class HowWorksLikeQuotatorMobileLayoutService implements PreventivatoreComponentProvider {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(HeroQuotatorScooterBikeComponent),
      this.componentFactoryResolver.resolveComponentFactory(HowWorksCardLikeQuotatorComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowSliderComponent),
      this.componentFactoryResolver.resolveComponentFactory(FaqComponent),
      this.componentFactoryResolver.resolveComponentFactory(MoreInfoTwoButtonsComponent),
      this.componentFactoryResolver.resolveComponentFactory(ProductsCarouselComponent),
    ];
  }

}