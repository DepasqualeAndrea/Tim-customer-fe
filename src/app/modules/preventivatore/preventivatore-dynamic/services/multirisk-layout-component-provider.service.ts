import { ComponentFactory, ComponentFactoryResolver, Injectable } from "@angular/core";
import { PreventivatoreModule } from "../../preventivatore.module";
import { FaqComponent } from "../components/faq/faq.component";
import { HeroQuotatorComponent } from "../components/hero-quotator/hero-quotator.component";
import { HowWorksCoveragesComponent } from "../components/how-works-coverages/how-works-coverages.component";
import { MoreInfoComponent } from "../components/more-info/more-info.component";
import { PreventivatoreAbstractComponent } from "../components/preventivatore-abstract/preventivatore-abstract.component";
import { WhatToKnowSliderComponent } from "../components/what-to-know-slider/what-to-know-slider.component";
import { PreventivatoreComponentProvider } from "./product-components/preventivatore-component-provider.interface";
import {WhatIsForYoloMultirischiComponent} from "../../what-is-for-yolo-multirischi/what-is-for-yolo-multirischi.component";

@Injectable({
  providedIn: PreventivatoreModule
})
export class MultiriskLayoutService implements PreventivatoreComponentProvider {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
    return [
      this.componentFactoryResolver.resolveComponentFactory(HeroQuotatorComponent),
      this.componentFactoryResolver.resolveComponentFactory(HowWorksCoveragesComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatIsForYoloMultirischiComponent),
      this.componentFactoryResolver.resolveComponentFactory(WhatToKnowSliderComponent),
      this.componentFactoryResolver.resolveComponentFactory(FaqComponent),
      this.componentFactoryResolver.resolveComponentFactory(MoreInfoComponent)

    ];
  }

}
