import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-partner-slider',
  templateUrl: './partner-slider.component.html',
  styleUrls: ['./partner-slider.component.scss']
})
export class PartnerSliderComponent {
  slideConfig;
  @Input() partners;
  constructor() {
    this.slideConfig = {
      'slidesToShow': 5,
      'slidesToScroll': 5,
      'infinite': true,
      'autoplay': true,
      'responsive': [
        {
          'breakpoint': 1024,
          'settings': {
            'slidesToShow': 4,
            'slidesToScroll': 3
          }
        },
        {
          'breakpoint': 768,
          'settings': {
            'slidesToShow': 2,
            'slidesToScroll': 2
          }
        },
        {
          'breakpoint': 600,
          'settings': {
            'slidesToShow': 1,
            'slidesToScroll': 1
          }
        }
      ],
      'autoplaySpeed': 2500
    };
  }
  breakpoint(e) {

  }
  afterChange(e) {

  }
  beforeChange(e) {

  }
}
