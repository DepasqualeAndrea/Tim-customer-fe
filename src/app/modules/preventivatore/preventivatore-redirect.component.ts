

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'app/app.component';
import { zip } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { IProduct } from '../nyp-checkout/models/api.model';
import { NYP_ENABLED_PRODUCTS } from '../nyp-checkout/nyp-checkout.module';
import { NypApiService } from '../nyp-checkout/services/api.service';
import { NypDataService } from '../nyp-checkout/services/nyp-data.service';

@Component({
  template: '',
  selector: 'app-preventivatore-redirect'
})
export class PreventivatoreRedirectComponent implements OnInit {

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private apiService: NypApiService,
    private nypDataService: NypDataService,
  ) {
  }

  ngOnInit(): void {
    AppComponent.AppReady$
      .pipe(
        filter(v => v === true),
        mergeMap(() => zip(
          this.apiService.getProduct(),
          this.route.params.pipe(map(p => p.code.split(','))),
        ))
      ).subscribe(([latestProducts, productCodeParam]: [IProduct[], string[]]) => {
        const currentLatestProduct = latestProducts.find(p => productCodeParam.some(pcp => pcp == p.code));

        localStorage.setItem('product_code', productCodeParam.join(";"));
        localStorage.removeItem('fieldToRecover');

        if (NYP_ENABLED_PRODUCTS.includes(currentLatestProduct.code)) {
          this.nypDataService.CurrentProduct$.next(currentLatestProduct);
          sessionStorage.setItem('old_path', this.router.url);
          this.router.navigate(['/nyp-checkout', currentLatestProduct.code, 'preventivatore']);
        } else {
          this.router.navigate(['/notfound']);
        }
      });
  }
}