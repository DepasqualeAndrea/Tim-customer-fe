import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { PreventivatoreDiscountCodeAbstractComponent } from '../preventivatore-abstract/preventivatore-discount-code-abstract.component';

@Component({
    selector: 'app-what-to-know-slider-dc',
    templateUrl: './what-to-know-slider-dc.component.html',
    styleUrls: ['./what-to-know-slider-dc.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [NgbCarouselConfig],
    animations: [
        trigger('animator', [
            transition('* => slideLeft', animate(300, keyframes([
                style({ transform: 'translateX(100%)' }),
                style({ transform: 'translateX(50%)' }),
                style({ transform: 'translateX(0%)' }),
            ]))),
            transition('* => slideRight', animate(300, keyframes([
                style({ transform: 'translateX(-100%)' }),
                style({ transform: 'translateX(-50%)' }),
                style({ transform: 'translateX(0%)' }),
            ]))),
        ])
    ],
    standalone: false
})
export class WhatToKnowSliderDCComponent extends PreventivatoreDiscountCodeAbstractComponent implements OnInit {

  @ViewChild('carousel') carousel: NgbCarousel;

  constructor(config: NgbCarouselConfig, ref: ChangeDetectorRef) {
    super(ref);
    config.showNavigationArrows = false;
    config.interval = 10000;
  }

  animationState: string;

  startAnimation(state) {
    if (!this.animationState) {
      this.animationState = state;
    }
  }

  resetAnimationState() {
    this.animationState = '';
  }

  onSwipe(event) {
    const direction = Math.abs(event.deltaX) > 40 ? (event.deltaX > 0 ? 'right' : 'left') : '';
    switch (direction) {
      case 'left': this.carousel.next();
      this.startAnimation('slideLeft');
      break;
      case 'right': this.carousel.prev();
      this.startAnimation('slideRight');
      break;
      default: break;
    }
  }

  ngOnInit() {
  }

}
