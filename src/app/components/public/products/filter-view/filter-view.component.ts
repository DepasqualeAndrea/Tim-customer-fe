import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';
import {KenticoTranslateService} from '../../../../modules/kentico/data-layer/kentico-translate.service';


@Component({
  selector: 'app-filter-view',
  templateUrl: './filter-view.component.html',
  styleUrls: ['./filter-view.component.scss']
})
export class FilterViewComponent implements OnInit {
  @Input() productsAggFilter;
  @Output() selectFilterProductEmitter = new EventEmitter<any>();
  @Output() selectProductEmitter = new EventEmitter<any>();


  filterViewTabsTranslations;
  filterProduct: any[] = [];


  constructor(
    private kenticoTranslateService: KenticoTranslateService
  ) { }

  ngOnInit() {
    this.filterViewTabsTranslations = [
      this.kenticoTranslateService.getItem('products.goods').pipe(map<any, string>(item => item.value)),
      this.kenticoTranslateService.getItem('products.health').pipe(map<any, string>(item => item.value)),
      this.kenticoTranslateService.getItem('products.people').pipe(map<any, string>(item => item.value)),
      this.kenticoTranslateService.getItem('products.travel').pipe(map<any, string>(item => item.value)),
      this.kenticoTranslateService.getItem('products.mobility').pipe(map<any, string>(item => item.value)),
    ];

    zip(...this.filterViewTabsTranslations)
    .pipe(
      map(filterViewTranslations => {
        const filterViewItems = [
          {
            active: true,
            description: filterViewTranslations[0],
            code: 'Goods'
          },
          {
            active: false,
            description: filterViewTranslations[1],
            code: 'Health'
          },
          {
            active: false,
            description: filterViewTranslations[2],
            code: 'People'
          },
          {
            active: false,
            description: filterViewTranslations[3],
            code: 'Travel'
          },
          {
            active: false,
            description: filterViewTranslations[4],
            code: 'Mobility'
          }
        ];
        return filterViewItems;
      })
      ).subscribe(filterView => this.filterProduct = filterView);


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
  filteredProduct(filter) {
    const activeFilter = _.find(this.filterProduct, ['active', true]);
    activeFilter.active = false;
    filter.active = true;
    this.selectFilterProductEmitter.emit(filter.code);
    // this.filterProductList(this.initialProducts, filter.code);
  }

  goToProduct(product) {
    this.selectProductEmitter.emit(product);
  }

}
