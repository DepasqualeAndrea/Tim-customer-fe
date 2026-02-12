import { Injectable } from '@angular/core';
import { ExternalProduct, ProductsList } from '@model';
import { InsurancesService } from '../insurances.service';
import { HttpClient } from '@angular/common/http';
import { DataService } from '..';
import { Cacheable } from 'ngx-cacheable';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EXTERNAL_PRODUCTS } from './external-products.const';

@Injectable()
export class ExternalProductsInsurancesService extends InsurancesService {

  constructor(http: HttpClient,
    dataService: DataService) {
    super(http, dataService);
  }

  @Cacheable()
  getProducts(): Observable<ProductsList> {
    return super.getProducts()
      .pipe(
        map((productsList: ProductsList) => {
          productsList.products = [...productsList.products, ...this.getExternalProducts()];
          return productsList;
        })
      );
  }

  private getExternalProducts(): ExternalProduct[] {
    return Object.assign([], EXTERNAL_PRODUCTS[this.dataService.tenantInfo.tenant]);
  }
}
