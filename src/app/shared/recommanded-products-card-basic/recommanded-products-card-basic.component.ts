import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Product} from '@model';
import {DataService, ProductsService} from '@services';
import {Router} from '@angular/router';
import {ImageHelper} from '../helpers/image.helper';
import {ComponentFeaturesService} from '../../core/services/componentFeatures.service';

@Component({
  selector: 'app-recommanded-products-card-basic',
  templateUrl: './recommanded-products-card-basic.component.html',
  styleUrls: ['./recommanded-products-card-basic.component.scss']
})
export class RecommandedProductsCardBasicComponent implements OnInit, OnDestroy {

  productsRecommended: any;

  // TODO REMOVE
  @Input() recommendedProductsNumber: number;

  @Input() product: Product;

  productImage: string;
  hidePrice: boolean;
  productDescription: string;

  constructor(private productsService: ProductsService,
              private router: Router,
              public dataService: DataService,
              private componentFeaturesService: ComponentFeaturesService) {
  }

  ngOnInit() {
    this.isShowPrice();
    this.productImage = ImageHelper.computeImage(this.product);
    this.productDescription = (this.dataService.tenantInfo.tenant === 'bancapc-it-it_db'
    || this.dataService.tenantInfo.tenant === 'civibank_db'
    || this.dataService.tenantInfo.tenant === 'banco-desio_db'
    ) ? this.product.title_prod : this.product.short_description;
  }

  createPreventivo(product) {
    this.router.navigate(this.productsService.createPreventivatoreRoute([product]));
  }

  isShowPrice () {
    this.hidePrice = false;
    this.componentFeaturesService.useComponent('matrix-view');
    this.componentFeaturesService.useRule('hide-price');
    if (this.componentFeaturesService.isRuleEnabled()) {
      this.hidePrice = true;
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      if (!!constraints) {
        this.hidePrice = constraints.some((product) => this.product.product_code === product);
      }
    }
  }

  ngOnDestroy(): void {
  }
}
