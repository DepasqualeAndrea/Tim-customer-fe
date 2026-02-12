import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Product } from '@model';
import { InsurancesService, DataService, ProductsService, KenticoYoloService } from '@services';
import { map, take, find } from 'rxjs/operators';
import { LandingBike } from 'app/modules/kentico/models/landing-bike.model';
import { RichTextHtmlHelper } from 'app/modules/kentico/data-layer/helpers/rich-text-html.helper';
import { untilDestroyed } from 'ngx-take-until-destroy';
import * as _ from 'lodash';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-product-landing',
  templateUrl: './product-landing.component.html',
  styleUrls: ['./product-landing.component.scss']
})
export class ProductLandingComponent implements OnInit, OnDestroy {

  products: any = [];
  product: Product;

  kenticoModel: LandingBike;
  model: {
    title: string,
    background_immage: any,
    subtitle: string,
    subsectiontitle: string,
    title_card: any,
    image_card: any
  };


  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public nypInsurancesService: NypInsurancesService,
    public dataService: DataService,
    public productService: ProductsService,
    private kenticoYoloService: KenticoYoloService
  ) { }


  ngOnInit() {
    this.kenticoService();
    this.route.params.pipe(take(1)).subscribe((params: Params) => {
      this.initializeParamsFromCodes(params.code.split(','));
    });
  }

  initializeParamsFromCodes(productCodes: Array<string>) {
    this.initializeParams(p => productCodes.includes(p.product_code));
  }


  initializeParams(filterFn: (products: Product) => boolean) {
    this.nypInsurancesService.getProducts()
      .pipe(map(productList => productList.products.filter(filterFn)))
      .subscribe((products: Product[]) => this.products = products);
  }

  createPreventivo(products) {
    // const productsArray = [].concat(products);
    const explicitRoute = true;
    this.router.navigate(this.productService.createPreventivatoreRoute([products], explicitRoute));
  }


  transformKenticoModel(item: LandingBike): { title: string, background_immage: any, subtitle: string, subsectiontitle: string, title_card: any, image_card: any } {
    return {
      title: RichTextHtmlHelper.computeHtml(item.title),
      background_immage: item.background_immage.value,
      subtitle: RichTextHtmlHelper.computeHtml(item.subtitle),
      subsectiontitle: RichTextHtmlHelper.computeHtml(item.subsectiontitle),
      title_card: item.title_card,
      image_card: item.image_card
    };
  }

  kenticoService() {
    this.kenticoYoloService.getItem<LandingBike>('landing_bike').pipe(untilDestroyed(this)).subscribe(item => {
      this.kenticoModel = item;
      this.model = this.transformKenticoModel(item);
    });
  }

  getCardImage(product: Product): string {
    return product.images.find(img => img.image_type === 'configurator_image').original_url;
  }

  ngOnDestroy() {
  }

}
