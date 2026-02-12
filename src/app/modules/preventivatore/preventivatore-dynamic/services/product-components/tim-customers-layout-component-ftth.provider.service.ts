import {PreventivatoreAbstractComponent} from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import {ComponentFactory, ComponentFactoryResolver, Injectable} from '@angular/core';
import {PreventivatoreModule} from 'app/modules/preventivatore/preventivatore.module';
import { PreventivatoreComponentProvider } from './preventivatore-component-provider.interface';
import { TimHeroPriceComponent } from '../../components/tim-hero-price/tim-hero-price.component';
import { ProductDetailSectionComponent } from '../../components/product-detail-section/product-detail-section.component';
import {PrefooterTimComponent} from '../../../../../components/public/footer/prefooter-tim/prefooter-tim.component';
import {WhatToKnowMoreInformationComponent} from '../../components/what-to-know-more-information/what-to-know-more-information.component';

@Injectable({
  providedIn: 'root'
})

export class TimCustomersLayoutComponentProviderFtthService implements PreventivatoreComponentProvider {
  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(TimHeroPriceComponent),
      this.componentFactoryResolver.resolveComponentFactory(ProductDetailSectionComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowMoreInformationComponent),
      this.componentFactoryResolver.resolveComponentFactory(PrefooterTimComponent)
    ];
  }
}
