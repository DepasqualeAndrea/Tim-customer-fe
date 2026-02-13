import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NgbCarousel, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
    selector: 'app-how-works-single-table-slider',
    templateUrl: './how-works-single-table-slider.component.html',
    styleUrls: ['./how-works-single-table-slider.component.scss'],
    providers: [NgbCarouselConfig],
    animations: [
        trigger('animator', [
            transition('* => slideLeft', animate(400, keyframes([
                style({ transform: 'translateX(100%)' }),
                style({ transform: 'translateX(50%)' }),
                style({ transform: 'translateX(0%)' }),
            ]))),
            transition('* => slideRight', animate(400, keyframes([
                style({ transform: 'translateX(-100%)' }),
                style({ transform: 'translateX(-50%)' }),
                style({ transform: 'translateX(0%)' }),
            ]))),
        ])
    ],
    standalone: false
})
export class HowWorksSingleTableSliderComponent extends PreventivatoreAbstractComponent {

  @ViewChild('carouselMobile', { static: true }) carouselMobile: NgbCarousel;

  animationState: string;

  constructor(config: NgbCarouselConfig, ref: ChangeDetectorRef) {
    super(ref);
    config.showNavigationArrows = false;
    config.showNavigationIndicators = true;
    config.wrap = false;
  }

  startAnimation(state) {
    if (!this.animationState) {
      this.animationState = state;
    }
  }

  resetAnimationState() {
    this.animationState = '';
  }

  slide(event) {
    const direction = Math.abs(event.deltaX) > 40 ? (event.deltaX > 0 ? 'right' : 'left') : '';
    switch (direction) {
      case 'right':
        if (this.carouselMobile.activeId !== this.carouselMobile.slides.first.id) {
          this.carouselMobile.prev();
          this.startAnimation('slideRight');
        }
        break;
      case 'left':
        if (this.carouselMobile.activeId !== this.carouselMobile.slides.last.id) {
          this.carouselMobile.next();
          this.startAnimation('slideLeft');
        }
        break;
      default: break;
    }
  }
}
