import { ComponentFactory, ComponentFactoryResolver, Injectable } from "@angular/core";
import { PreventivatoreModule } from "app/modules/preventivatore/preventivatore.module";
import { BgImgHeroQuotatorComponent } from "../../components/bg-img-hero-quotator/bg-img-hero-quotator.component";
import { BgImgHeroComponent } from "../../components/bg-img-hero/bg-img-hero.component";
import { FaqComponent } from "../../components/faq/faq.component";
import { ForWhoComponent } from "../../components/for-who/for-who.component";
import { HeroQuotatorComponent } from "../../components/hero-quotator/hero-quotator.component";
import { HowWorksTableCardComponent } from "../../components/how-works-table-card/how-works-table-card.component";
import { HowWorksTableSliderComponent } from "../../components/how-works-table-slider/how-works-table-slider.component";
import { MoreInfoTwoButtonsComponent } from "../../components/more-info-two-buttons/more-info-two-buttons.component";
import { PreventivatoreAbstractComponent } from "../../components/preventivatore-abstract/preventivatore-abstract.component";
import { WhatToKnowSliderComponent } from "../../components/what-to-know-slider/what-to-know-slider.component";
import { PreventivatoreComponentProvider } from "./preventivatore-component-provider.interface";


@Injectable({
    providedIn: 'root'
  })
  export class FAQableDoubleGuaranteesSectionLayoutService implements PreventivatoreComponentProvider {
  
    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    }
  
    getComponents(): ComponentFactory<PreventivatoreAbstractComponent>[] {
      return [
        this.componentFactoryResolver.resolveComponentFactory(BgImgHeroQuotatorComponent),
        this.componentFactoryResolver.resolveComponentFactory(HowWorksTableCardComponent),
        this.componentFactoryResolver.resolveComponentFactory(HowWorksTableSliderComponent),
        this.componentFactoryResolver.resolveComponentFactory(ForWhoComponent),
        this.componentFactoryResolver.resolveComponentFactory(WhatToKnowSliderComponent),
        this.componentFactoryResolver.resolveComponentFactory(FaqComponent),
        this.componentFactoryResolver.resolveComponentFactory(MoreInfoTwoButtonsComponent),
      ];
    }
  
  }