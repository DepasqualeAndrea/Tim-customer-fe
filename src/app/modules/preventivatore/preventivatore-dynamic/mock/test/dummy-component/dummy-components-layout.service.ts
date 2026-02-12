import { PreventivatoreComponentProvider } from '../../../services/product-components/preventivatore-component-provider.interface';
import { ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../../../components/preventivatore-abstract/preventivatore-abstract.component';
export class DummyComponentsLayoutService implements PreventivatoreComponentProvider {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(PreventivatoreAbstractComponent),
      this.componentFactoryResolver.resolveComponentFactory(PreventivatoreAbstractComponent),
      this.componentFactoryResolver.resolveComponentFactory(PreventivatoreAbstractComponent)
    ];
  }
}
