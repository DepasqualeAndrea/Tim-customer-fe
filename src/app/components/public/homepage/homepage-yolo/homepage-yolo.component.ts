import { SplideSettings } from './../../../../shared/splide-slider-config.model';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataService, InsurancesService, ProductsService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { HomepageLayout, Products } from 'app/modules/kentico/models/homepage-layout.model';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Product } from '@model';
import * as _ from 'lodash';
import { SlickSliderConfigSettings } from 'app/shared/slick-slider-config.model';
import { isArray } from 'lodash';
import { Router } from '@angular/router';
import { PageLayout } from 'app/modules/kentico/models/page-layout.model';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

interface ProductCard {
  name: string;
  image: Object;
  category: string[];
  business: boolean;
  products: Product[];
}
const MAX_SPLIDE_SLIDES = 5;

@Component({
  selector: 'app-homepage-yolo',
  templateUrl: './homepage-yolo.component.html',
  styleUrls: ['./homepage-yolo.component.scss']
})
export class HomepageYoloComponent implements OnInit, OnDestroy {

  kenticoModel: HomepageLayout;
  model: {
    header: any, main: any, product_card: any, insurtech_platform: any, about_us: any
  };
  slideConfig: SlickSliderConfigSettings;
  slideConfigCard: SplideSettings;
  slideConfigPartners: SplideSettings;
  slideConfigLinks: SplideSettings;
  products: any[] = [];
  selectedCategory: string;
  categoryPrivate = true;
  categoryCompanies = false;
  public initialProducts: Products[] = [];
  filteredProduct: Products[] = [];
  productsAggFilter = [];

  modalIntermediaries = false;
  modalInterm: { icon_close_modal: any, title: any, subtitle: any, body: any, button: any };

  who = true;
  benefits = false;

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    public dataService: DataService,
    private nypInsuranceService: NypInsurancesService,
    public productsService: ProductsService,
    private router: Router
  ) {

    this.slideConfig = {
      'slidesToShow': 1,
      'slidesToScroll': 1,
      'infinite': true,
      'autoplay': true,
      'autoplaySpeed': 5000
    };

    this.slideConfigCard = {
      perPage: MAX_SPLIDE_SLIDES,
      width: '100%',
      type: 'slide',
      gap: '1rem',
      autoplay: false,
      interval: 2500,
      pagination: true,
      arrows: true,
      classes: {
        pagination: 'dots',
        prev: 'splide__arrow--prev arrow-prev arrow-splide',
        next: 'splide__arrow--next arrow-next arrow-splide',
      },
      breakpoints: {
        1024: {
          perPage: 4,
          perMove: 4,
          pagination: false,
          arrows: false,
        },
        768: {
          perPage: 3,
          perMove: 3,
          pagination: false,
          arrows: false,
        },
        600: {
          gap: '0.5rem',
          perPage: 1,
          perMove: 1,
          fixedHeight: '206px',
          fixedWidth: '168px',
          rewindByDrag: false,
          pagination: false,
          arrows: false,
          padding: { left: 36, right: 36 }
        }
      }
    };

    this.slideConfigPartners = {
      perPage: 3,
      perMove: 2,
      autoWidth: true,
      type: 'slide',
      gap: '1.5rem',
      trimspace: false,
      pagination: false,
      arrows: false,
      padding: { left: 36, right: 36 }
    };

    this.slideConfigLinks = {
      autoWidth: true,
      type: 'slide',
      gap: '0.8rem',
      autoplay: false,
      pagination: false,
      arrows: false,
    };
  }


  ngOnInit() {
    this.clearMyLocalStorage();
    this.kenticoTranslateService.getItem<HomepageLayout>('homepage_yolo').pipe(untilDestroyed(this)).subscribe(item => {
      this.kenticoModel = item;
      this.model = this.transformKenticoModel(item);
      this.nypInsuranceService.getProducts()
        .subscribe((productList) => {
          const products = productList.products.slice();
          this.initialProducts = this.aggregateList(products);

          const contentCategories = this.model.product_card[0].categories_private.value[0].private.value;
          const companyContentCategories = (this.model.product_card[0].categories_companies.value.length > 0 ? this.model.product_card[0].categories_companies.value[0].companies : []);

          this.filterProductCategories(contentCategories, products);

          if (!!contentCategories.length || !!companyContentCategories.length) {
            if (contentCategories.length > 0 || companyContentCategories.length > 0) {
              const firstCategory = contentCategories[0].system.codename;
              const firstCategoryCompanies = (companyContentCategories[0] ? companyContentCategories[0].system.codename : '');
              this.selectCategory(firstCategory);
              if (this.dataService.tenantInfo.tenant === 'yolo-pmi_db') {
                this.selectCategoryCompanies(firstCategoryCompanies);
              }
            }
          }
        });
    });

    this.kenticoTranslateService.getItem<HomepageLayout>('homepage_modal_intermediari').pipe(untilDestroyed(this)).subscribe(item => {
      this.kenticoModel = item;
      this.modalInterm = this.transformModalInterKenticoModel(item);
    }, (error) => {
      console.log('modulo homepage_modal_intermediari non presente o non pubblicato.');
    });
    setTimeout(() => {
      this.activeModalInter();
    }, 5000);
  }

  clearMyLocalStorage() {
    localStorage.removeItem('dataInfo',);
    sessionStorage.removeItem('dataInfoBike');
    sessionStorage.removeItem('dataHolidayHome');
    sessionStorage.removeItem('dataInfoSport');
    sessionStorage.removeItem('dataInfoProtezioneViaggio');
  }


  private aggregateList(products: Product[]): any[] {
    const aggregatedProducts = products.reduce((acc, cur) => {
      const findProperty = cur.properties.find(p => p.name === 'uniq_name');
      return findProperty
        ? { ...acc, [findProperty.value]: [...(acc[findProperty.value] || []), cur] }
        : { ...acc, ['single']: [...(acc['single'] || []), cur] };
    }, {});
    const mappedProducts = Object.keys(aggregatedProducts).map(key =>
      this.aggObjForSlider(key, aggregatedProducts)
    );
    const singleProducts = mappedProducts.find(item => isArray(item)) as ProductCard[];
    if (!!singleProducts && singleProducts.length) {
      singleProducts.forEach(product => {
        mappedProducts.push(product);
      });
    }
    if (mappedProducts.some(item => isArray(item))) {
      mappedProducts.splice(mappedProducts.findIndex(item => isArray(item)), 1);
    }
    return mappedProducts as ProductCard[];
  }

  private aggObjForSlider(key: string, aggregatedProducts): ProductCard | ProductCard[] {
    if (key === 'single') {
      const arraySingleProducts = [];
      for (const product of aggregatedProducts[key]) {
        arraySingleProducts.push({
          name: product.name,
          image: this.getImage(product),
          category: product.categories,
          business: product.business,
          products: new Array(product)
        });
      }
      arraySingleProducts.push({
        name: 'Libera Mente Special',
        business: false,
        category: ['Health'],
        image: {
          image_type: 'fp_image',
          large_url: "/assets/images/product_icons/logo-liberamente.svg",
          mini_url: "/assets/images/product_icons/logo-liberamente.svg",
          original_url: "/assets/images/product_icons/logo-liberamente.svg",
          product_url: "/assets/images/product_icons/logo-liberamente.svg",
          small_url: "/assets/images/product_icons/logo-liberamente.svg"
        },
        key: 'single',
        products: [{
          categories: ['Health'],
          category: "Health",
          url: 'https://liberamente.yolo-insurance.com/step-1',
          properties: [
            { value: 'liberamente', name: 'liberamente' }],
        }],

      })
      return arraySingleProducts;
    }
    const products = aggregatedProducts[key];
    return {
      name: products[0].properties.find(prop => prop.name === 'uniq_name').value,
      image: this.getImage(products[0]),
      category: products[0].categories,
      business: products[0].business,
      products: aggregatedProducts[key]
    };
  }

  private filterProductCategories(categories: any[], products: Product[]): any[] {
    categories.filter(category =>
      products.some(product =>
        product.categories.some(productCategory =>
          productCategory.replace(/ /g, '_').toLowerCase() + '_category' === category.system.codename
        )
      )
    );
    return categories;
  }


  getImage(product) {
    let img = '';
    img = _.find(product.images, ['image_type', 'common_image']);
    if (!img) {
      img = _.find(product.images, ['image_type', 'fp_image']);
    }

    return img;
  }


  transformKenticoModel(item: HomepageLayout): {
    header: any, main: any,
    product_card: any, insurtech_platform: any, about_us: any
  } {
    return {
      header: item.header.value,
      main: item.main.value,
      product_card: item.product_card.value,
      insurtech_platform: item.insurtech_platform.value,
      about_us: item.about_us.value
    };
  }


  selectCategory(categoryCode: string): void {
    this.selectedCategory = categoryCode;
    const productsByCategory = this.initialProducts.slice().filter(product =>
      product.category && product.category.some(category =>
        category.replace(/ /g, '_').toLowerCase() + '_category' === categoryCode
      )
    );
    this.filteredProduct = productsByCategory;
  }

  selectCategoryCompanies(categoryCode: string) {
    this.selectedCategory = categoryCode;
    const productsByCategoryCompanies = this.initialProducts.slice().filter(product =>
      product.business && product.category.some(category =>
        category + '_category' === categoryCode
      )
    );
    this.filteredProduct = productsByCategoryCompanies;
  }

  public isSlidesGreaterThanProducts(): boolean {
    return this.filteredProduct.length <= MAX_SPLIDE_SLIDES;
  }

  focusOnA(): void {
    this.who = true;
    this.benefits = false;
  }
  focusOnB() {
    this.who = false;
    this.benefits = true;
  }

  ngOnDestroy() {
  }

  breakpoint(e) {

  }
  afterChange(e) {

  }
  beforeChange(e) {

  }

  switchPrivate() {
    if (this.model.product_card[0].categories_private.value[0].private.value.length > 0) {
      const firstCategory = this.model.product_card[0].categories_private.value[0].private.value[0].system.codename;
      this.selectCategory(firstCategory);
    }
    if (this.categoryPrivate === false) {
      this.categoryPrivate = !this.categoryPrivate;
      this.categoryCompanies = !this.categoryCompanies;
    }
    return this.categoryPrivate;
  }

  switchCompanies() {
    if (this.model.product_card[0].categories_companies.value[0].companies.value.length > 0) {
      const firstCategory = this.model.product_card[0].categories_companies.value[0].companies.value[0].system.codename;
      this.selectCategoryCompanies(firstCategory);
    }

    if (this.categoryCompanies === false) {
      this.categoryCompanies = !this.categoryCompanies;
      this.categoryPrivate = !this.categoryPrivate;
    }
    return this.categoryCompanies;
  }

  public goToPreventivatore(products: Product[]): void {

    if (!!products[0].business) {
      let productAliases = '';
      products.forEach((product, index) => {
        productAliases += product.properties.find(prop => prop.name === 'alias').value;
        if (index + 1 !== products.length) {
          productAliases += '_';
        }
      });
      window.location.href = 'https://business.yolo-insurance.com/assicurazione-' + productAliases;
    }
    else if (products[0].properties.find(prop => prop.name === 'liberamente')) {
      window.location.href = 'https://liberamente.yolo-insurance.com/step-1'
    }
    else {
      this.router.navigate(this.productsService.createPreventivatoreRoute(products, true));
    }
  }

  transformModalInterKenticoModel(item: HomepageLayout): { icon_close_modal: any, title: any, subtitle: any, body: any, button: any, button_link: any } {
    return {
      icon_close_modal: item.icon_close_modal.value[0].url,
      title: item.title.value,
      subtitle: item.subtitle.value,
      body: item.body.value,
      button: item.button.value,
      button_link: item.button_link.value
    };
  }

  activeModalInter() {
    this.modalIntermediaries = true;
  }
  closeModalInterm() {
    this.modalIntermediaries = false;
  }

  goAheadCard(titleCard: string): string {
    if (document.documentElement.scrollWidth < 1500 && titleCard.indexOf('.') !== -1) {
      const titleSplitted = titleCard.split('.');
      const titleAhead = titleSplitted[0] + ' .' + titleSplitted[1];
      return titleAhead;
    } else {
      return titleCard;
    }
  }

}
