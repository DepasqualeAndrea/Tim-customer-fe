import {BgImgHeroBreadcrumbComponent} from './../../components/bg-img-hero-breadcrumb/bg-img-hero-breadcrumb.component';
import {PreventivatoreAbstractComponent} from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import {ComponentFactory, ComponentFactoryResolver, Injectable} from '@angular/core';
import {PreventivatoreModule} from 'app/modules/preventivatore/preventivatore.module';
import {PreventivatoreComponentProvider} from './preventivatore-component-provider.interface';
import {HowWorksTableCardComponent} from '../../components/how-works-table-card/how-works-table-card.component';
import {WhatToKnowComponent} from '../../components/what-to-know/what-to-know.component';
import {FaqComponent} from '../../components/faq/faq.component';
import {MoreInfoWithoutButtonComponent} from '../../components/more-info-without-button/more-info-without-button.component';

@Injectable({
  providedIn: 'root'
})

export class SellaLayoutComponentProviderService implements PreventivatoreComponentProvider {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(BgImgHeroBreadcrumbComponent),
      this.componentFactoryResolver.resolveComponentFactory(HowWorksTableCardComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowComponent),
      this.componentFactoryResolver.resolveComponentFactory(FaqComponent),
      this.componentFactoryResolver.resolveComponentFactory(MoreInfoWithoutButtonComponent)
    ];
  }
}
