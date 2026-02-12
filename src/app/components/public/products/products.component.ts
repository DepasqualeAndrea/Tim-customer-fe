import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, InsurancesService, ProductsService } from '@services';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { Product } from '@model';
import { LocaleService } from '../../../core/services/locale.service';
import { take } from 'rxjs/operators';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { RouterService } from 'app/core/services/router.service';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  public products = [];
  public initialProducts;
  public productsJson = {};
  public productsAgg = [];
  public productsAggFilter = [];
  partners: string[] = [];
  public kenticoitems: object;
  public moreInfo: object;

  constructor(
    private router: Router,
    private routerService: RouterService,
    public dataService: DataService,
    public productsService: ProductsService,
    private nypInsuranceService: NypInsurancesService,
    private componentFeaturesService: ComponentFeaturesService,
    public kenticoTranslateService: KenticoTranslateService,
    private locale: LocaleService,
  ) {
  }

  ngOnInit() {
    this.nypInsuranceService.getProducts().subscribe(
      (productsList: any) => {
        const filteredProducts = productsList.products.filter((p: Product) => {
          const productVisibility: boolean = (!p.product_structure || !p.product_structure.product_configuration) ? true : p.product_structure.product_configuration.visible;
          return p.show_in_dashboard === true && productVisibility && p.id;
        });
        this.initialProducts = filteredProducts;
        // aggregate products by featured_slug or singles
        this.productsAgg = this.productsService.createAggregateList(filteredProducts);
        this.filterProductList(filteredProducts, 'Goods');
      });
    this.partners.push(
      '/assets/images/partners/allianz.png',
      '/assets/images/partners/axa.svg',
      '/assets/images/partners/chubb.svg',
      '/assets/images/partners/covercare.png',
      '/assets/images/partners/ergo.png',
      '/assets/images/partners/europassistancesvg.svg',
      '/assets/images/partners/sara.svg',
      '/assets/images/partners/das.png',
      '/assets/images/partners/rbm.png',
      '/assets/images/partners/am-trust-logo.png',
      '/assets/images/partners/net-insurance-logo.png',
      '/assets/images/partners/logo_tua.jpg',
      '/assets/images/partners/blue-assistance.png',
      '/assets/images/partners/logo-metlife.png',
      '/assets/images/partners/covea-logo.svg',
      '/assets/images/partners/nobis_logo.png',
      '/assets/images/partners/zurich-logo.png',
    );
    this.moreInfoSection();
  }

  pushMetlife() {

    if (this.dataService.tenantInfo.tenant === 'yolodb') {
      this.productsAggFilter.push({
        key: 'Libera Mente Special',
        name: 'libera mente special',
        products: [
          {
            external_url: 'https://liberamente.yolo-insurance.com/step-1',
          }
        ],
        images: {
          small_url: '/assets/images/product_icons/logo-liberamente.svg'
        },
        category: 'Health',
        price: 0
      });
    }
  }

  filterProductList(productsList, filterCode) {
    const filterProduct = productsList.filter(p => p.category === filterCode);
    this.productsAggFilter = this.productsService.createAggregateList(filterProduct);
    if (filterCode == 'Health') {
      this.pushMetlife();
    }
  }
  ngOnDestroy() {
    this.dataService.productCategory = '';
  }

  createPreventivo(products) {
    const productsArray = [].concat(products);
    const externalUrl = productsArray[0].external_url;
    if (externalUrl) {
      window.location.href = productsArray[0].external_url;
      return;
    }
    const explicitRoute = this.dataService.tenantInfo.main.layout !== 'cb';

    if (this.dataService.tenantInfo.tenant === 'yolo-crif_db') {
      this.router.navigate(this.productsService.createPreventivatoreLinkDisabledRoute(productsArray, explicitRoute));
    } else {
      // check tenant product landing existance
      this.componentFeaturesService.useComponent('product-landing');
      this.componentFeaturesService.useRule('products');
      const constraints: Map<string, any> = this.componentFeaturesService.getConstraints();
      const product_landing: String[] = constraints.get('activated') || [];

      const landingProducts: Product[] = (productsArray as Product[]).filter(p => product_landing.includes(p.product_code));
      if (!!landingProducts && landingProducts.length > 0) {
        this.router.navigate(this.productsService.createPreventivatoreLandingProductRoute(productsArray));
      } else {
        this.router.navigate(this.productsService.createPreventivatoreRoute(productsArray, explicitRoute));
      }
    }


  }

  hasFullWidthMatrix() {
    this.componentFeaturesService.useComponent('products');
    this.componentFeaturesService.useRule('matrix-view');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints();
      return constraints.get('full-width');
    }
  }

  private moreInfoSection(): void {
    this.componentFeaturesService.useComponent('matrix-view');
    this.componentFeaturesService.useRule('more-info');
    if (this.componentFeaturesService.isRuleEnabled()) {
      this.kenticoTranslateService.getItem<any>('products_page').pipe(take(1)).subscribe(item => {
        this.moreInfo = item.more_info;
      });
    }
  }

  public mobilePage(): boolean {
    this.componentFeaturesService.useComponent('mobile-products-page');
    this.componentFeaturesService.useRule('mobile');
    if (this.componentFeaturesService.isRuleEnabled()) {
      this.kenticoTranslateService.getItem<any>('products_page').pipe(take(1)).subscribe(item => {
        this.kenticoitems = item;
      });
      this.dataService.isSplash = true;
      return true;
    }
  }

}
