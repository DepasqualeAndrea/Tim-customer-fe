import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService, DataService, InsurancesService } from '@services';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Product } from '@model';
import { ComponentFeaturesService } from '../../../../core/services/componentFeatures.service';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Component({
    selector: 'app-recommended-products',
    templateUrl: './recommended-products.component.html',
    styleUrls: ['./recommended-products.component.scss'],
    standalone: false
})
export class RecommendedProductsComponent implements OnInit, OnDestroy {

  recommended: Product[];
  useBasicComponent: boolean;
  listProducts: any;

  constructor(public dataService: DataService,
    private authService: AuthService,
    private insurancesService: InsurancesService,
    protected nypInsuranceService: NypInsurancesService,
    private componentFeaturesService: ComponentFeaturesService
  ) {
  }

  ngOnInit() {
    this.componentFeaturesService.useComponent('recommended-products');
    this.componentFeaturesService.useRule('product-list');
    if (this.componentFeaturesService.isRuleEnabled()) {
      this.listProducts = this.componentFeaturesService.getConstraints().get('any product');
      this.getProduct();
    } else {
      this.componentFeaturesService.useComponent('private-area');
      this.componentFeaturesService.useRule('basic-components');
      this.useBasicComponent = this.componentFeaturesService.isRuleEnabled();
      const recommendedProductsNumber = this.dataService.tenantInfo.privateArea.recommendedProductsNumber;
      const user = this.authService.loggedUser;
      if (recommendedProductsNumber) {
        this.insurancesService.getRecommendedProducts(user.id, recommendedProductsNumber).pipe(untilDestroyed(this)).subscribe((response) => {
          this.recommended = response.products;
        });
      }
    }
  }
  private getProduct(): void {
    this.recommended = [];
    this.nypInsuranceService.getProducts().pipe(untilDestroyed(this)).subscribe((response) => {
      this.listProducts.forEach(e => {
        this.recommended.push(...response.products.filter(x => x.product_code === e));
      });
    });
  }

  ngOnDestroy(): void {
  }
}
