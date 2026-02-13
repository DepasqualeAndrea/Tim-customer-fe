import { DataService } from './../../../../../core/services/data.service';
import { Component, AfterViewInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';
import { trigger, keyframes, animate, transition, style } from '@angular/animations';
import { stringify } from 'querystring';

@Component({
    selector: 'app-how-works-table-multiple-tabs-accordion',
    templateUrl: './how-works-table-multiple-tabs-accordion.component.html',
    styleUrls: ['./how-works-table-multiple-tabs-accordion.component.scss'],
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
export class HowWorksTableMultipleTabsAccordionComponent  extends PreventivatoreAbstractComponent implements AfterViewInit, OnChanges {

  slideConfig;

  constructor(public dataService: DataService, config: NgbCarouselConfig, ref: ChangeDetectorRef) {
    super(ref);

    this.slideConfig = {
      'slidesToShow': 1,
      'slidesToScroll': 1,
      'prevArrow': false,
      'nextArrow': false,
      'dots': true,
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

  clicked: boolean[] = [false, false];

  startAnimation(state) {
    if (!this.animationState) {
      this.animationState = state;
    }
  }


  resetAnimationState() {
    this.animationState = '';
  }


  private selectSlide() {

  }
  ngAfterViewInit() {
    this.loaded = true;
    this.selectSlide();
  }

  ngOnChanges() {
    this.selectSlide();
  }

  changeClicked(c: number){
    const buttons: any = document.getElementsByClassName('btn-content');
    let array = [...buttons]
    array.forEach(item => {
      if(item.id === ('button' + c) && this.clicked[c] === false){
        item.textContent = 'v'
      } else if (item.id === ('button' + c) && this.clicked[c] === true){
        item.textContent = '^'
      }
    })
    this.clicked[c] = !this.clicked[c]
  }
}
