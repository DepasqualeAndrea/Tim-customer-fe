import { ComponentFactory, ComponentFactoryResolver, Injectable } from "@angular/core";
import { PreventivatoreModule } from "app/modules/preventivatore/preventivatore.module";
import { BgImgHeroQuotatorComponent } from "../../components/bg-img-hero-quotator/bg-img-hero-quotator.component";
import { HowWorksTableSliderComponent } from "../../components/how-works-table-slider/how-works-table-slider.component";
import { WhatToKnowSliderComponent } from "../../components/what-to-know-slider/what-to-know-slider.component";
import { FaqComponent } from "../../components/faq/faq.component";
import { MoreInfoTwoButtonsComponent } from "../../components/more-info-two-buttons/more-info-two-buttons.component";
import { PreventivatoreAbstractComponent } from "../../components/preventivatore-abstract/preventivatore-abstract.component";
import { PreventivatoreComponentProvider } from "./preventivatore-component-provider.interface";
import { WhatOffersCollapseComponent } from "../../components/what-offers-collapse/what-offers-collapse.component";
import { ServiceProtectionAndMonitoringComponent } from "../../components/service-protection-and-monitoring/service-protection-and-monitoring.component";

@Injectable({
    providedIn: 'root'
  })
  export class CyberLayoutService implements PreventivatoreComponentProvider {
  
    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    }
  
    getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
      return [
        this.componentFactoryResolver.resolveComponentFactory(BgImgHeroQuotatorComponent),
        this.componentFactoryResolver.resolveComponentFactory(HowWorksTableSliderComponent),
        this.componentFactoryResolver.resolveComponentFactory(WhatToKnowSliderComponent),
        this.componentFactoryResolver.resolveComponentFactory(ServiceProtectionAndMonitoringComponent),
        this.componentFactoryResolver.resolveComponentFactory(WhatOffersCollapseComponent),
        this.componentFactoryResolver.resolveComponentFactory(FaqComponent),
        this.componentFactoryResolver.resolveComponentFactory(MoreInfoTwoButtonsComponent),
      ];
    }
  
  }