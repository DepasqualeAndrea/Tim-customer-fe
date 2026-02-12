import {PreventivatoreAbstractComponent} from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import {ComponentFactory, ComponentFactoryResolver, Injectable} from '@angular/core';
import {PreventivatoreModule} from 'app/modules/preventivatore/preventivatore.module';
import { PreventivatoreComponentProvider } from './preventivatore-component-provider.interface';
import { TimHeroPriceComponent } from '../../components/tim-hero-price/tim-hero-price.component';
import { WhatToKnowDropdownComponent } from '../../components/what-to-know-dropdown/what-to-know-dropdown.component';
import { ProductDetailSectionComponent } from '../../components/product-detail-section/product-detail-section.component';
import { ProductsSliderCustomersComponent } from '../../components/products-slider-customers/products-slider-customers.component';
import {PrefooterTimComponent} from '../../../../../components/public/footer/prefooter-tim/prefooter-tim.component';

@Injectable({
  providedIn: 'root'
})
export class TimCustomersLayoutComponentProviderService implements PreventivatoreComponentProvider {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(TimHeroPriceComponent),
      this.componentFactoryResolver.resolveComponentFactory(ProductDetailSectionComponent),
      this.componentFactoryResolver.resolveComponentFactory(ProductsSliderCustomersComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowDropdownComponent),
      this.componentFactoryResolver.resolveComponentFactory(PrefooterTimComponent)
    ];
  }

}
