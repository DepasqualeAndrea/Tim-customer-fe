import { NypInsurancesService } from '@NYP/ngx-multitenant-core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InsurancesService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { forkJoin } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-products-leasys',
  templateUrl: '../products-leasys/products-leasys.component.html',
  styleUrls: ['../products-leasys/products-leasys.component.scss']
})
export class ProductsLeasysComponent implements OnInit {

  kenticoProductList = [];
  productList = [];

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private router: Router,
    private nypInsuranceService: NypInsurancesService
  ) { }

  ngOnInit() {
    this.loadContent();
  }

  loadContent() {
    const kentico$ = this.kenticoTranslateService.getItem<any>('filtered_products_page').pipe(take(1));
    const products$ = this.nypInsuranceService.getProducts().pipe(map(res => res.products));
    forkJoin([kentico$, products$]).pipe(
      tap(([kenticoItem, products]) => {
        this.kenticoProductList = kenticoItem.list_products.value;
        this.createProductListToRender(products);
      })
    ).subscribe();
  }

  createProductListToRender(products) {
    const filteredProducts = this.kenticoProductList.filter(kp => products.some(p => kp.code.value.split(',').includes(p.product_code)));
    filteredProducts.map(product =>
      this.productList.push({
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
