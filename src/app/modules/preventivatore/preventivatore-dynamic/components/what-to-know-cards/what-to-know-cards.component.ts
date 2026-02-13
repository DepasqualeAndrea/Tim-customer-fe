import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {SlickSliderConfigSettings} from 'app/shared/slick-slider-config.model';
import {SlickCarouselComponent} from 'ngx-slick-carousel';
import {PreventivatoreAbstractComponent} from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-what-to-know-cards',
    templateUrl: './what-to-know-cards.component.html',
    styleUrls: ['./what-to-know-cards.component.scss'],
    standalone: false
})
export class WhatToKnowCardsComponent extends PreventivatoreAbstractComponent {

  @ViewChild('slider') slider: SlickCarouselComponent;
  slideConfig: SlickSliderConfigSettings;
  activeSlide = 0;

  constructor(
    ref: ChangeDetectorRef
  ) {
    super(ref);
    this.setSliderConfig();
  }

  public isCurrentCardActive(index: number): boolean {
    return this.activeSlide === index;
  }

  public selectCard(index: number): void {
    this.activeSlide = index;
    this.slider.slickGoTo(index);
  }

  public updateActiveSlide(slickEvent): void {
    this.activeSlide = slickEvent.nextSlide;
  }

  private setSliderConfig() {
    this.slideConfig = {
      slidesToShow: 1,
      swipeToSlide: true,
      prevArrow: false,
      nextArrow: false,
      dots: false,
      infinite: false,
      autoplay: false,
    };
  }

}
