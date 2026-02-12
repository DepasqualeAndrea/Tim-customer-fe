import { ComponentFactory, ComponentFactoryResolver, Injectable } from '@angular/core';
import { HeroQuotatorComponent } from '../../components/hero-quotator/hero-quotator.component';
import { PreventivatoreAbstractComponent } from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import { PreventivatoreComponentProvider } from './preventivatore-component-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class TimCustomersSkiNetComponentLayoutService implements PreventivatoreComponentProvider {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(HeroQuotatorComponent)
    ];
  }

}
