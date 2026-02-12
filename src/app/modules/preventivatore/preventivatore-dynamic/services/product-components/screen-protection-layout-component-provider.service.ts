import {ComponentFactory, ComponentFactoryResolver, Injectable} from '@angular/core';
import {PreventivatoreModule} from '../../../preventivatore.module';
import {PreventivatoreAbstractComponent} from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import {HeroQuotatorComponent} from '../../components/hero-quotator/hero-quotator.component';
import {PreventivatoreComponentProvider} from './preventivatore-component-provider.interface';
import {WhatToKnowSliderComponent} from '../../components/what-to-know-slider/what-to-know-slider.component';
import {HowWorksTableCardComponent} from '../../components/how-works-table-card/how-works-table-card.component';
import {MoreInfoTwoButtonsComponent} from '../../components/more-info-two-buttons/more-info-two-buttons.component';
import {ProductsCarouselComponent} from '../../components/products-carousel/products-carousel.component';
import {FaqComponent} from '../../components/faq/faq.component';
import { HowWorksContributionRepairComponent } from '../../components/how-works-contribution-repair/how-works-contribution-repair.component';

@Injectable({
  providedIn: 'root'
})
export class ScreenProtectionLayoutComponentProviderService implements PreventivatoreComponentProvider {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(HeroQuotatorComponent),
      this.componentFactoryResolver.resolveComponentFactory(HowWorksContributionRepairComponent),
      this.componentFactoryResolver.resolveComponentFactory(HowWorksTableCardComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowSliderComponent),
      this.componentFactoryResolver.resolveComponentFactory(FaqComponent),
      this.componentFactoryResolver.resolveComponentFactory(MoreInfoTwoButtonsComponent),
      this.componentFactoryResolver.resolveComponentFactory(ProductsCarouselComponent)
    ];
  }

}