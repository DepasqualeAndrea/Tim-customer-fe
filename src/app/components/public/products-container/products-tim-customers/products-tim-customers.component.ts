import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckoutService, DataService, InsurancesService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { forkJoin, Observable, of } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { Product, ProductsList } from '@model';
import { ConsistencyResponse, ProductConsistencyService } from 'app/core/services/product-consistency.service';
import { CheckOutBehavior } from 'app/modules/preventivatore/partials/checkout-behavior';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-products-tim-customers',
  templateUrl: './products-tim-customers.component.html',
  styleUrls: ['./products-tim-customers.component.scss']
})
export class ProductsTimCustomersComponent implements OnInit {

  private readonly QUERYPARAM_TAG = 'category'

  constructor(
    private router: Router,
    private nypInsuranceService: NypInsurancesService,
    private kenticoTranslateService: KenticoTranslateService,
    private route: ActivatedRoute,
    private consistencyService: ProductConsistencyService,
    private checkoutService: CheckoutService,
    private dataService: DataService
  ) { }

  content: any
  productsFromBE
  productsFromKentico
  showingProductList = []
  tagsList = []
  filteredProducts = []
  selectedTag: string
  highlightedToggle: boolean = false

  ngOnInit() {
    this.consistencyService.getProductsConsistencyMapping()
    this.nypInsuranceService.getProducts().subscribe(res =>
      this.redirectIfThereIsOnlyHomageProduct(res)
    )
    this.loadContent()
  }

  private redirectIfThereIsOnlyHomageProduct(data: ProductsList): void {
    if (data['products'].length === 1 &&
      data['products'][0].product_code === 'ehealth-quixa-homage') {
      this.router.navigate(['/preventivatore', { code: 'ehealth-quixa-homage' }])
    }
  }

  private loadContent(): void {

    const kentico$ = this.kenticoTranslateService.getItem<any>('filtered_product_page').pipe(take(1))
    const orderedTags$ = this.kenticoTranslateService.getItem<any>('ordered_tags').pipe(take(1))
    const products$ = this.nypInsuranceService.getProducts().pipe(map(res => res.products), tap(products => this.dataService.products = products))

    let consistencies$: Observable<ConsistencyResponse | null>
    if (this.consistencyService.isUserLoggedInWithSso) {
      consistencies$ = this.consistencyService.consistency().pipe(take(1))
    } else {
      consistencies$ = of(null)
    }

    forkJoin([kentico$, products$, orderedTags$, consistencies$]).pipe(
      tap(([kenticoContent, products, orderedTags, consistencies]) => {
        this.productsFromKentico = kenticoContent['product_cards'].value
        this.productsFromBE = products
        this.consistencyService.setNoConistencyProducts(products)

        if (!!consistencies) {
          this.consistencyService.saveConsistenciesResponse(consistencies)
          products = this.consistencyService.filterProductsBasedOnConsistency(products)
        }
        products = this.consistencyService.filterProductsBasedOnUserType(products)

        this.content = this.createContentToRender(kenticoContent)
        this.createShowingProductsList(products)
        this.createTagsList(orderedTags)
        this.toggleProductsByTag(this.tagsList[0])
        this.filterProductsByQueryParam()
      })
    ).subscribe()
  }

  private createContentToRender(kenticoContent) {
    return {
      breadcrumb1: kenticoContent['text_link_1'].value,
      breadcrumb2: kenticoContent['text_link_2'].value,
      title: kenticoContent['title'].value,
      subtitle: kenticoContent['subtitle'].value
    }
  }

  private createShowingProductsList(products: Product[]) {
    let filteredProds = this.productsFromKentico.filter(kp => products.some(bep => bep.product_code === kp.code.value))
    filteredProds.map(product => this.showingProductList.push({
      code: product['code'].value,
      img: !!product['img'].value[0] ? product['img'].value[0].url : null,
      promo_tags: this.getPromoTags(product['promo_tags'].value),
      name: product['title'].value,
      description: product['description'].value,
      featureList: this.getListFeature(product['list'].value),
      cta_text: product['cta_text'].value,
      cta_link: product['cta_link'].value,
      cta: product['cta_preventivatore'].value,
      cta_link_prev: product['cta_link_preventivatore'].value,
      starting_from: product['starting_from'].value,
      price: this.formatPrice(product['price'].value),
      filter_tags: product['filter_tags'].value.map(tag => tag.name)
    }))
  }

  private getPromoTags(tags: any[]) {
    const promoTags = tags.map(tag => {
      return {
        text: tag['text'].value,
        color: tag['color'].value[0].codename
      }
    })
    return promoTags
  }

  private getListFeature(features: any[]) {
    const productFeatures = features.map(feature => {
      return {
        text: feature['text'].value,
        highlight: feature['format'].value.some(format =>
          format.codename === 'highlighted'
        ),
        subtext: feature['subtext'].value
      }
    })
    return productFeatures
  }

  private formatPrice(priceLabel: string) {
    const priceParts = priceLabel.split('€')
    const price = priceParts[0].split(',')
    return {
      units: price[0],
      cents: ',' + price[1] + '€',
      label: priceParts[1]
    }
  }

  private createTagsList(orderedTags): void {
    const kenticoOrderedTagsList = orderedTags['tags'].value.map(tg => tg.text.value)
    const productTagsList = this.showingProductList.reduce((acc, cur) => {
      cur.filter_tags.forEach(tag =>
        acc = acc.includes(tag) ? acc : [...acc, tag]
      );
      return acc
    }, [])
    this.tagsList = kenticoOrderedTagsList.filter(tg => productTagsList.includes(tg))
    this.filteredProducts = this.showingProductList
  }

  toggleProductsByTag(selectedTag: string): void {
    this.selectedTag = selectedTag
    this.filteredProducts = this.filterProductsBySelectedTag(selectedTag)
  }

  private filterProductsBySelectedTag(selectedTag: string): any[] {
    return this.showingProductList.filter(prod =>
      prod.filter_tags.some(tag => tag === selectedTag)
    )
  }

  private filterProductsByQueryParam() {
    const filterParam = this.route.snapshot.queryParams[this.QUERYPARAM_TAG]
    if (!!filterParam) {
      this.toggleProductsByTag(filterParam)
    }
  }

  goToPreventivatore(link: string): void {
    this.router.navigate([link]);
  }

  goToCheckout(link: string, code: string): void {
    if (link.startsWith('/checkout')) {
      const product = this.productsFromBE.find(p => p.product_code === code);
      this.redirectToCheckout(product);
    } else {
      window.location.href = link
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

  isTagActive(tag: string) {
    return tag === this.selectedTag
  }
}
