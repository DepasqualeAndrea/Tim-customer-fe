import { TimHeroPurchaseComponent } from './../../components/tim-hero-purchase/tim-hero-purchase.component';
import { PreventivatoreAbstractComponent } from '../../components/preventivatore-abstract/preventivatore-abstract.component';
import { ComponentFactory, ComponentFactoryResolver, Injectable } from '@angular/core';
import { PreventivatoreModule } from 'app/modules/preventivatore/preventivatore.module';
import { PreventivatoreComponentProvider } from './preventivatore-component-provider.interface';
import { WhatToKnowColorsComponent } from '../../components/what-to-know-colors/what-to-know-colors.component';
import { HowWorksTableSliderTimComponent } from '../../components/how-works-table-slider-tim/how-works-table-slider-tim.component';
import { AdditionalGuaranteesSliderComponent } from '../../components/additional-guarantees-slider/additional-guarantees-slider.component';
import { AgencyOfferActivationComponent } from '../../components/agency-offer-activation/agency-offer-activation.component';

@Injectable({
  providedIn: 'root'
})
export class MyTimLayoutComponentProviderService implements PreventivatoreComponentProvider {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(TimHeroPurchaseComponent),
      this.componentFactoryResolver.resolveComponentFactory(HowWorksTableSliderTimComponent),
      this.componentFactoryResolver.resolveComponentFactory(AdditionalGuaranteesSliderComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowColorsComponent),
      this.componentFactoryResolver.resolveComponentFactory(AgencyOfferActivationComponent),
    ];
  }

}
