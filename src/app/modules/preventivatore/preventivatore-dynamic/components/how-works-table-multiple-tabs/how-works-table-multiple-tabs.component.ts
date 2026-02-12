import { DataService } from './../../../../../core/services/data.service';
import { Product } from './../../../../../core/models/insurance.model';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { Component, ViewChild, AfterViewInit, OnChanges, ChangeDetectorRef, OnInit } from '@angular/core';
import { NgbCarouselConfig, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';
import { trigger, keyframes, animate, transition, style } from '@angular/animations';

@Component({
  selector: 'app-how-works-table-multiple-tabs',
  templateUrl: './how-works-table-multiple-tabs.component.html',
  styleUrls: ['./how-works-table-multiple-tabs.component.scss'],
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
export class HowWorksTableMultipleTabsComponent  extends PreventivatoreAbstractComponent implements AfterViewInit, OnChanges {

  //@ViewChild('carousel', { static: true }) carousel: NgbCarousel;
  slideConfig;

  constructor(public dataService: DataService, config: NgbCarouselConfig, ref: ChangeDetectorRef) {
    super(ref);
    //config.showNavigationArrows = false;
    //config.pauseOnHover = false;
    //config.interval = 100000;

    this.slideConfig = {
      'slidesToShow': 1,
      'slidesToScroll': 1,
      'prevArrow': false,
      'nextArrow': false,
      'dots': false,
      'infinite': false,
      'autoplay': false,
      'responsive': [
        {
          'breakpoint': 1024,
          'settings': {
            'slidesToShow': 1,
            'slidesToScroll': 1
          }
        },
        {
          'breakpoint': 768,
          'settings': {
            'slidesToShow': 1,
            'slidesToScroll': 1
          }
        },
        {
          'breakpoint': 600,
          'settings': {
            'slidesToShow': 1,
            'slidesToScroll': 1,
            'swipeToSlide': false,
            'touchThreshold': 100,
            'touchMove': true,
          }
        }
      ],
      'autoplaySpeed': 100000
    };
  }
  private loaded = false;

  animationState: string;

  startAnimation(state) {
    if (!this.animationState) {
      this.animationState = state;
    }
  }


  resetAnimationState() {
    this.animationState = '';
  }


  private selectSlide() {
    //if (this.carousel && this.loaded) {
    //  this.carousel.select(this.data.selected_slide);
    //  this.carousel.pause();
   // }

  }
  ngAfterViewInit() {
    this.loaded = true;
    this.selectSlide();
  }

  ngOnChanges() {
    this.selectSlide();
  }

  /*
  onSwipe(event) {
    const direction = Math.abs(event.deltaX) > 40 ? (event.deltaX > 0 ? 'right' : 'left') : '';
    switch (direction) {
      case 'right':
        if (this.carousel.activeId !== this.carousel.slides.first.id) {
          this.carousel.prev();
          this.startAnimation('slideRight');
        }
      break;
      case 'left':
        if (this.carousel.activeId !== this.carousel.slides.last.id) {
          this.carousel.next();
          this.startAnimation('slideLeft');
        }
      break;
      default: break;
    }
  }
*/
}
