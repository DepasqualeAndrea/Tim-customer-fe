import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as _ from 'lodash';
import {Product} from '@model';
import {AuthService, DataService, ProductsService} from '@services';
import {take} from 'rxjs/operators';
import {KenticoTranslateService} from 'app/modules/kentico/data-layer/kentico-translate.service';
import {ComponentFeaturesService} from '../../../../core/services/componentFeatures.service';

@Component({
    selector: 'app-matrix-view',
    templateUrl: './matrix-view.component.html',
    styleUrls: ['./matrix-view.component.scss'],
    standalone: false
})
export class MatrixViewComponent implements OnInit {

  @Input() productsAgg: any;
  @Input() mobileCards: boolean;
  @Output() sendProduct: any;

  buttontxt: string;
  buttonnotlogged: string;
  buttonlogged: string;
  buttoncb: string;
  listProductsToHidePrice: string[];
  kenticoItems: object;

  constructor(
    public dataService: DataService,
    private authService: AuthService,
    public kenticoTranslateService: KenticoTranslateService,
    public productsService: ProductsService,
    private componentFeaturesService: ComponentFeaturesService
  ) {
    this.sendProduct = new EventEmitter<any>();

  }

  ngOnInit() {
    this.getListProductsToHide();
    this.kenticoTranslateService.getItem<any>('products_page').pipe(take(1)).subscribe(item => {
      const contentItem = item;
      this.kenticoItems = item;
      if (this.dataService.tenantInfo.main.layout === 'pc' || this.dataService.tenantInfo.main.layout === 'cvb'
      || this.dataService.tenantInfo.main.layout === 'bd') {
        this.buttonnotlogged = contentItem.header_products.vetrinamatrix___btn_notlogged.text.value;
        this.buttonlogged = contentItem.header_products.vetrinamatrix___btn_logged.text.value;
      }
      if (this.dataService.tenantInfo.main.layout === 'cb' || this.dataService.tenantInfo.main.layout === 'ril') {
        this.buttoncb = contentItem.header_products.productbutton.text.value;
      }
      this.getAuthserviceloggedIn();
    });
  }

  getAuthserviceloggedIn() {
    if (this.authService.loggedIn && (this.dataService.tenantInfo.main.layout === 'pc' || this.dataService.tenantInfo.main.layout === 'cvb'
    || this.dataService.tenantInfo.main.layout === 'bd')) {
      this.buttontxt = this.buttonlogged;
    } else {
      this.buttontxt = this.buttonnotlogged;
    }
    if (this.dataService.tenantInfo.main.layout === 'cb' || this.dataService.tenantInfo.main.layout === 'ril') {
      this.buttontxt = this.buttoncb;
    }
  }

  isAnnualProduct(product) {
    return product.product_code === 'sara-sereneta' || product.product_code === 'rbm-pandemic';
  }

  showRecurrency(product) {
    return this.productsService.isRecurrent(product) || product.product_code === 'sara-sereneta';
  }

  getProductName(agg) {
    const prodName = (agg.products.find(p => p.name) || {}).name;
    const nameSpliced = prodName.split(' ');
    if (agg.products[0].properties && agg.products[0].properties[0].name === 'uniq_name_presenter' || 'uniq_name') {
      return agg.products[0].properties[0].value;
    } else {
      return nameSpliced.reduce((acc, cur, i) => {
        return (acc.length < nameSpliced.length - 1 || nameSpliced.length === 1) ? `${acc} ${cur}` : acc;
      }, '');
    }
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

  getProductImages(products) {
    const productName = products.products[0].name.split(' ')[0].toLowerCase();
    return `./assets/images/product_icons/${productName}-cb.svg`;
  }

  emitProduct(prod) {
    if (this.dataService.tenantInfo.main.layout === 'pc' && !this.authService.loggedIn) {
      window.location.href = 'https://www.bancadipiacenza.it/site/home.html';
    } else if (this.dataService.tenantInfo.main.layout === 'cvb' && !this.authService.loggedIn) {
      window.location.href = 'https://www.civibank.it/';
    }
    this.sendProduct.emit(prod);
  }

  getListProductsToHide() {
    this.componentFeaturesService.useComponent('matrix-view');
    this.componentFeaturesService.useRule('hide-price');
    if (this.componentFeaturesService.isRuleEnabled()) {
      this.listProductsToHidePrice = this.componentFeaturesService.getConstraints().get('products');
    }
  }

  isProductToHide(product: Product) {
    if (product) {
      return this.listProductsToHidePrice.some(prodHide => prodHide === product.product_code);
    }
  }
}
