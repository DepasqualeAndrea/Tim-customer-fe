import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, CheckoutService, DataService, InsurancesService } from '@services';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { CheckOutBehavior } from 'app/modules/preventivatore/partials/checkout-behavior';
import { forkJoin } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserTypes } from './user-types.enum';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Component({
    selector: 'app-products-tim-employees',
    templateUrl: './products-tim-employees.component.html',
    styleUrls: ['./products-tim-employees.component.scss'],
    standalone: false
})
export class ProductsTimEmployeesComponent implements OnInit, OnDestroy {
  productsFromBE;
  productsFromKentico;
  showingProductList = [];
  title1 = '';
  title2 = '';
  pageTitle = '';
  pageSubtitle = '';
  tagsList = [];
  filteredProducts = [];
  selectedTag = '';
  subject = new Subject();

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private router: Router,
    private nypInsuranceService: NypInsurancesService,
    private checkoutService: CheckoutService,
    private dataService: DataService,
    private authService: AuthService,
    private componentFeaturesService: ComponentFeaturesService,
  ) { }

  ngOnInit() {
    this.loadContent();
  }

  loadContent() {
    const kentico$ = this.kenticoTranslateService.getItem<any>('filtered_product_page').pipe(take(1));
    const orderedTags$ = this.kenticoTranslateService.getItem<any>('ordered_tags').pipe(take(1));
    const products$ = this.nypInsuranceService.getProducts().pipe(map(res => res.products));
    forkJoin([kentico$, products$, orderedTags$]).pipe(
      tap(([kenticoContent, products, orderedTags]) => {
        this.productsFromKentico = kenticoContent.filter_product_card.value;
        this.productsFromBE = products;
        this.createContentToRender(kenticoContent);
        this.createShowingProductsList(products, orderedTags);
      })
    ).subscribe();
  }

  createContentToRender(kenticoContent) {
    this.title1 = kenticoContent.text_link_1.value;
    this.title2 = kenticoContent.text_link_2.value;
    this.pageTitle = kenticoContent.title.value;
    this.pageSubtitle = kenticoContent.subtitle.value;
  }

  createShowingProductsList(products, orderedTags) {
    let filteredProds = this.productsFromKentico.filter(kp => products.some(bep => bep.product_code === kp.code.value));
    filteredProds = this.filterRetireeUnaccessibleProducts(filteredProds)
    filteredProds.map(product => this.showingProductList.push({
      code: product.code.value,
      tag: product.tag.value[0].name,
      name: product.title.value,
      description: product.description.value,
      featureList: product.list.value.map(feature => feature.text.value),
      subscribeBefore: product.subscribe_before.value,
      cta_text: product.cta_text.value,
      cta_link: product.cta_link.value,
      cta: product.cta_preventivatore.value,
    })
    );
    this.createTagsList(orderedTags);
  }

  createTagsList(orderedTags) {
    const kenticoOrderedTagsList = orderedTags.tag_to_be_order.value.map(tg => tg.text.value);
    const productsTagsList = this.showingProductList.reduce((acc, cur) => acc.includes(cur.tag) ? acc : [...acc, cur.tag], []);
    this.tagsList = kenticoOrderedTagsList.filter(tg => productsTagsList.includes(tg) || tg === 'Tutte');
    this.selectedTag = this.tagsList.includes('Tutte') ? 'Tutte' : '';
    this.filteredProducts = this.showingProductList;
  }

  toggleProductsByTag(selectedTag) {
    this.selectedTag = selectedTag;
    this.filteredProducts = selectedTag !== 'Tutte' ? this.showingProductList.filter(prod => prod.tag === selectedTag) : this.showingProductList;
  }

  goToPreventivatore(code: string): void {
    this.router.navigate(['preventivatore', { code }]);
  }

  goToCheckout(link: string, code: string): void {
    if (link.startsWith('/checkout')) {
      const product = this.productsFromBE.find(p => p.product_code === code);
      this.redirectToCheckout(product);
    } else {
      window.open(link, '_blank');
    }
  }

  private redirectToCheckout(product) {
    const order = this.createOrderObj(product.master_variant);
    const payload = this.createPayload(order, product);
    this.checkout(payload);
  }

  private checkout(payload: any) {
    const checkoutBehavior = new CheckOutBehavior(this.checkoutService, this.dataService, this.router);
    checkoutBehavior.checkout(payload.order, payload.product, payload.router, true);
  }

  private createOrderObj(variant) {
    return {
      order: {
        line_items_attributes: {
          0: {
            variant_id: variant,
            quantity: 1
          },
        },
      }
    };
  }

  private createPayload(order: any, product: any) {
    const payload = {
      product: product,
      order: order,
      router: 'checkout'
    };
    return payload;
  }

  filterRetireeUnaccessibleProducts(filteredProducts: any[]): any[] {
    const unaccessibleProducts = this.getRetireeUnaccessibleProducts()
    const userData = this.authService.loggedUser.data
    const isUserRetiree = !!userData.user_type && userData.user_type === UserTypes.RETIREE
    if (isUserRetiree && unaccessibleProducts) {
      return filteredProducts.filter(product =>
        !unaccessibleProducts.some(unaccessibleProduct =>
          product.code.value === unaccessibleProduct
        )
      )
    }
    return filteredProducts
  }

  getRetireeUnaccessibleProducts() {
    this.componentFeaturesService.useComponent('products-overview')
    this.componentFeaturesService.useRule('unaccessible-retiree-products')
    const isRuleEnabled = this.componentFeaturesService.isRuleEnabled()
    if (isRuleEnabled) {
      const unaccessibleProducts = this.componentFeaturesService.getConstraints().get('product-codes');
      return unaccessibleProducts
    }
    return false
  }

  ngOnDestroy(): void {
  }

}
