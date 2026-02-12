import { Component, OnInit } from '@angular/core';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { map, take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { InsurancesService } from '@services';
import { forkJoin } from 'rxjs';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-products-fca',
  templateUrl: '../products-fca/products-fca.component.html',
  styleUrls: ['../products-fca/products-fca.component.scss']
})
export class ProductsFcaComponent implements OnInit {

  productList = [];
  kenticoProductList: any;

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private router: Router,
    private nypInsuranceService: NypInsurancesService,
  ) { }

  ngOnInit() {
    this.loadContent();
  }

  loadContent() {
    const kentico$ = this.kenticoTranslateService.getItem<any>('filtered_products_page').pipe(take(1));
    const products$ = this.nypInsuranceService.getProducts().pipe(map(res => res.products));
    forkJoin([kentico$, products$]).pipe(
      tap(([kenticoContent, products]) => {
        this.kenticoProductList = kenticoContent.list_products.value;
        this.createProductListToRender(products);
      })
    ).subscribe();
  }

  createProductListToRender(products) {
    const filteredProducts = this.kenticoProductList.filter(kp => products.some(p => kp.code.value.split(',').includes(p.product_code)));
    filteredProducts.map(
      product => this.productList.push({
        code: product.code.value,
        name: product.name.value,
        img: product.image.value[0].url,
        description: product.description.value,
        cta: product.cta.value,
        size: product.size.value[0].codename.replace(/_/gm, '-')
      })
    );
  }

  goToPreventivatore(code: string): void {
    this.router.navigate(['preventivatore', { code }]);
  }

}
