import {ComponentFactory, ComponentFactoryResolver, Injectable} from '@angular/core';
import {PreventivatoreComponentProvider} from './preventivatore-component-provider.interface';
import {PreventivatoreAbstractComponent} from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import {TimHeroPriceComponent} from '../../components/tim-hero-price/tim-hero-price.component';
import {ProductDetailSectionComponent} from '../../components/product-detail-section/product-detail-section.component';
import {ProductsSliderCustomersComponent} from '../../components/products-slider-customers/products-slider-customers.component';import {PrefooterTimComponent} from '../../../../../components/public/footer/prefooter-tim/prefooter-tim.component';
import { WhatToKnowColorsComponent } from '../../components/what-to-know-colors/what-to-know-colors.component';

@Injectable({
  providedIn: 'root'
})
export class TimEmployeesLayoutComponentProviderService implements PreventivatoreComponentProvider{

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(TimHeroPriceComponent),
      this.componentFactoryResolver.resolveComponentFactory(ProductDetailSectionComponent),
      this.componentFactoryResolver.resolveComponentFactory(ProductsSliderCustomersComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowColorsComponent),
      this.componentFactoryResolver.resolveComponentFactory(PrefooterTimComponent)
    ];
  }
}
