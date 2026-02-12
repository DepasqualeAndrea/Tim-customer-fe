import {BgImgHeroBreadcrumbComponent} from './../../components/bg-img-hero-breadcrumb/bg-img-hero-breadcrumb.component';
import {PreventivatoreAbstractComponent} from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import {ComponentFactory, ComponentFactoryResolver, Injectable} from '@angular/core';
import {PreventivatoreModule} from 'app/modules/preventivatore/preventivatore.module';
import {PreventivatoreComponentProvider} from './preventivatore-component-provider.interface';
import {HowWorksTableCardComponent} from '../../components/how-works-table-card/how-works-table-card.component';
import {FaqComponent} from '../../components/faq/faq.component';
import {MoreInfoWithoutButtonComponent} from '../../components/more-info-without-button/more-info-without-button.component';
import { MoreInfoComponent } from '../../components/more-info/more-info.component';
import { WhatToKnowSliderComponent } from '../../components/what-to-know-slider/what-to-know-slider.component';
import { BgImgHeroComponent } from '../../components/bg-img-hero/bg-img-hero.component';
import { HowWorksTableCardCollapseComponent } from '../../components/how-works-table-card-collapse/how-works-table-card-collapse.component';

@Injectable({
  providedIn: PreventivatoreModule
})

export class SellaGeSkiLayoutComponentProviderService implements PreventivatoreComponentProvider {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(BgImgHeroComponent),
      this.componentFactoryResolver.resolveComponentFactory(HowWorksTableCardCollapseComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowSliderComponent),
      this.componentFactoryResolver.resolveComponentFactory(FaqComponent),
      this.componentFactoryResolver.resolveComponentFactory(MoreInfoWithoutButtonComponent)
    ];
  }
}
