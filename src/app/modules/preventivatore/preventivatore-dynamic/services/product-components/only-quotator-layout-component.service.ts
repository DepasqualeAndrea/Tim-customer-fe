import { ComponentFactory, ComponentFactoryResolver, Injectable } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import { PreventivatoreComponentProvider } from './preventivatore-component-provider.interface';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { HeroQuotatorComponent } from '../../components/hero-quotator/hero-quotator.component';
import { OnlyQuotatorComponent } from '../../components/only-quotator/only-quotator.component';


@Injectable({
  providedIn: 'root'
})
export class OnlyQuotatorLayoutComponent implements PreventivatoreComponentProvider {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(OnlyQuotatorComponent),
    ];
  }

}