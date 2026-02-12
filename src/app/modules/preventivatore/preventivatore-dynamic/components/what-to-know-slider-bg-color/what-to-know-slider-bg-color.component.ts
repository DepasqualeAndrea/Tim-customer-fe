import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import {NgbCarouselConfig, NgbCarousel} from '@ng-bootstrap/ng-bootstrap';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-what-to-know-slider-bg-color',
  templateUrl: './what-to-know-slider-bg-color.component.html',
  styleUrls: ['./what-to-know-slider-bg-color.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgbCarouselConfig],
  animations: [
    trigger('animator', [
      transition('* => slideLeft', animate(300, keyframes([
        style({transform: 'translateX(100%)'}),
        style({transform: 'translateX(50%)'}),
        style({transform: 'translateX(0%)'}),
    ]))),
      transition('* => slideRight', animate(300, keyframes([
        style({transform: 'translateX(-100%)'}),
        style({transform: 'translateX(-50%)'}),
        style({transform: 'translateX(0%)'}),
    ]))),
    ])
  ]
})
export class WhatToKnowSliderBgColorComponent extends PreventivatoreAbstractComponent implements OnInit {

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
    console.log(this.data)
  }
}
