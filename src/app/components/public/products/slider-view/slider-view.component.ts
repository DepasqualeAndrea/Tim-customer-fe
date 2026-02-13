import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { DataService } from '@services';
import * as _ from 'lodash';

@Component({
    selector: 'app-slider-view',
    templateUrl: './slider-view.component.html',
    styleUrls: ['./slider-view.component.scss'],
    standalone: false
})
export class SliderViewComponent implements OnInit {

  @Input() productsAgg;
  @Output() selectProductEmitter = new EventEmitter<any>();
  slideConfig;

  constructor(public dataService: DataService, ) {
    this.slideConfig = {
      'slidesToShow': 6,
      'slidesToScroll': 6,
      'prevArrow': false,
      'nextArrow': false,
      'dots': true,
      'infinite': true,
      'autoplay': true,
      'responsive': [
        {
          'breakpoint': 1024,
          'settings': {
            'slidesToShow': 3,
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
            'slidesToShow': 2,
            'slidesToScroll': 2
          }
        }
      ],
      'autoplaySpeed': 2500
    };
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.pushMetlife();
  }

  pushMetlife() {
    if (this.dataService.tenantInfo.tenant === 'yolodb') {
      if (this.productsAgg.length > 0 && !this.productsAgg.includes(this.productsAgg.key === 'liberamente')) {
        this.productsAgg.push({
          key: 'liberamente',
          name: 'libera mente special',
          url: 'https://liberamente.yolo-insurance.com/step-1',
          images: {
            small_url: '/assets/images/product_icons/logo-liberamente.svg'
          }
        });
      }
}
  }

  openPage(pageUrl) {
    window.open(pageUrl);
  }

  getSmallImage(images) {
    if (images.length) {
      let imgs = _.find(images, ['image_type', 'fp_image']);
      if (!imgs) {
        imgs = _.find(images, ['image_type', 'default']);
      }
      return imgs.small_url;
    } else {
      return '';
    }
  }

  selectedProduct(product) {
    this.selectProductEmitter.emit(product);
  }

  goAheadCard(titleCard: string): string {
    if ( (document.documentElement.scrollWidth > 1010 || document.documentElement.scrollWidth < 420)
          && titleCard.indexOf('.') !== -1) {
      const titleSplitted = titleCard.split('.');
      const titleAhead = titleSplitted[0] + ' .' + titleSplitted[1];
      return titleAhead;
    } else {
      return titleCard;
    }
  }

}

