import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Product} from '@model';
import {ProductsService, DataService} from '@services';
import {Router} from '@angular/router';
import {ImageHelper} from '../helpers/image.helper';

@Component({
  selector: 'app-recommanded-products-card',
  templateUrl: './recommanded-products-card.component.html',
  styleUrls: ['./recommanded-products-card.component.scss']
})
export class RecommandedProductsCardComponent implements OnInit, OnDestroy {

  productsRecommended: any;

  // TODO REMOVE
  @Input() recommendedProductsNumber: number;

  @Input() product: Product;

  productImage: string;

  constructor(private productsService: ProductsService,
              private router: Router, public dataService: DataService) {
  }

  ngOnInit() {
    this.productImage = ImageHelper.computeImage(this.product);
  }

  createPreventivo(product) {
    this.router.navigate(this.productsService.createPreventivatoreRoute([product]));
  }

  ngOnDestroy(): void {
  }
}
