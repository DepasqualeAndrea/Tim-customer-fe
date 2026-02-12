import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { ComponentFactory, ComponentFactoryResolver, Injectable } from '@angular/core';
import { PreventivatoreComponentProvider } from './preventivatore-component-provider.interface';
import { PreventivatoreAbstractComponent } from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import { BgImgHeroComponent } from '../../components/bg-img-hero/bg-img-hero.component';
import { HowWorksTableCardComponent } from '../../components/how-works-table-card/how-works-table-card.component';

@Injectable({
  providedIn: 'root'
})
export class BgSingleSliderLayoutService implements PreventivatoreComponentProvider {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(BgImgHeroComponent),
      this.componentFactoryResolver.resolveComponentFactory(HowWorksTableCardComponent)
    ];
  }

}
