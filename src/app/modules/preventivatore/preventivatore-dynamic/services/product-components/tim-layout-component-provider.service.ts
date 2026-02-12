import {PreventivatoreAbstractComponent} from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import {ComponentFactory, ComponentFactoryResolver, Injectable} from '@angular/core';
import {PreventivatoreModule} from 'app/modules/preventivatore/preventivatore.module';
import { PreventivatoreComponentProvider } from './preventivatore-component-provider.interface';
import { TimHeroComponent } from '../../components/tim-hero/tim-hero.component';
import { WhatToKnowColorsComponent } from '../../components/what-to-know-colors/what-to-know-colors.component';
import { HowWorksTableSliderTimComponent } from '../../components/how-works-table-slider-tim/how-works-table-slider-tim.component';
import { AdditionalGuaranteesSliderComponent } from '../../components/additional-guarantees-slider/additional-guarantees-slider.component';
import { AgencyOfferActivationComponent } from '../../components/agency-offer-activation/agency-offer-activation.component';

@Injectable({
  providedIn: 'root'
})
export class TimLayoutComponentProviderService implements PreventivatoreComponentProvider {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(TimHeroComponent),
      this.componentFactoryResolver.resolveComponentFactory(HowWorksTableSliderTimComponent),
      this.componentFactoryResolver.resolveComponentFactory(AdditionalGuaranteesSliderComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowColorsComponent),
      this.componentFactoryResolver.resolveComponentFactory(AgencyOfferActivationComponent),
    ];
  }

}
