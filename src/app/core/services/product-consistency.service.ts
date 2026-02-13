import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '@model';
import { DataService } from '@services';
import { UserType } from '../models/user-type.model';
import { Cacheable } from 'ngx-cacheable';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ComponentFeaturesService } from './componentFeatures.service';
import { Consistency, ConsistencyTarget, ConsistencyValue } from './product-consistency.interface';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

type ConsistencyConfigs = { [productName: string]: Consistency }
export type ConsistencyResponse = { [productName: string]: boolean }

@Injectable({
  providedIn: 'root'
})
export class ProductConsistencyService {

  private readonly COMPONENT_FEATURE_CONSISTENCY_NAME = 'product-consistency'
  private readonly COMPONENT_FEATURE_CONSISTENCY_RULE = 'product-consistency-config'
  private readonly COMPONENT_FEATURE_CONSISTENCY_PRICE_RULE = 'product-price-consistency-config'
  private readonly CONSISTENCY_TARGET_KEY = 'target'
  private readonly PRODUCT_CONSISTENCY__KEY = 'consistency'


  get isUserLoggedInWithSso() {
    return this.isUserLoggenInLegacy && !this.isUserTimBrokerCustomer()
  }

  get isUserLoggenInLegacy() {
    return this.auth.loggedIn
  }

  consistenciesRules: ConsistencyConfigs = {};
  consistencies: ConsistencyResponse;
  noConsistencyProducts: Product[];
  isConsistencyRuleEnabled: boolean = false;

  constructor(
    private nypInsurancesService: NypInsurancesService,
    private auth: AuthService,
    private componentFeaturesService: ComponentFeaturesService,
  ) { }

  public getProductsConsistencyMapping(): void {
    this.componentFeaturesService.useComponent(this.COMPONENT_FEATURE_CONSISTENCY_NAME);
    this.componentFeaturesService.useRule(this.COMPONENT_FEATURE_CONSISTENCY_RULE);
    this.isConsistencyRuleEnabled = this.componentFeaturesService.isRuleEnabled();
    if (this.isConsistencyRuleEnabled) {
      const constraints = this.componentFeaturesService.getConstraints()
      constraints.forEach((value, key) => {
        if (value.taxcode && this.isUserLoggedInWithSso) {
          value["taxcode"] = this.getUserTaxCode();
        }
        Object.assign(this.consistenciesRules, { [key]: value })
      })
    }
  }

  public getUserTaxCode(): string {
    const user = this.auth.loggedUser;
    return user.data.ndg;
  }

  public isUserTimBrokerCustomer(): boolean {
    if (this.isUserLoggenInLegacy) {
      const user = this.auth.loggedUser
      const userData = user.data
      const userType = userData && userData.user_type
      return userData && userType && userType === UserType.CUSTOMER
    }
  }

  public filterProductsBasedOnConsistency(products: Product[]): Product[] {
    if (this.isUserLoggedInWithSso && this.consistencies) {
      const consistencyValues = Object.entries(this.consistencies)
      const filteredProducts = products.filter(product => {
        for (const [key, value] of consistencyValues) {
          if (product.product_code === key) {
            return value
          }
        }
      })
      return filteredProducts
    }
    return products
  }

  public setNoConistencyProducts(products: Product[]): void {
    this.noConsistencyProducts = products.filter(product =>
      this.getProductNoConsistency(product)
    )
  }

  public isProductNoConsistency(productCode: string): boolean {
    const productToCheck = this.noConsistencyProducts.find(product =>
      product.product_code === productCode
    )
    if (!!productToCheck) {
      return this.getProductNoConsistency(productToCheck)
    }
  }

  public filterProductsBasedOnUserType(products: Product[]): Product[] {
    const userTargetType = this.getUserTargetType()
    if (userTargetType) {
      const targetedProducts = []
      products.forEach(product => {
        for (const [key, value] of Object.entries(this.consistenciesRules)) {
          if (product.product_code === key) {
            Object.assign(product, { [this.CONSISTENCY_TARGET_KEY]: value[this.CONSISTENCY_TARGET_KEY] })
            targetedProducts.push(product)
          }
        }
      })
      const filteredProducts = targetedProducts.filter(product => {
        return product[this.CONSISTENCY_TARGET_KEY] === userTargetType
          || product[this.CONSISTENCY_TARGET_KEY] === ConsistencyTarget.BOTH
      }).map(product => {
        delete product[this.CONSISTENCY_TARGET_KEY]
        return product
      })
      this.noConsistencyProducts.forEach(product => {
        filteredProducts.push(product)
      })
      return filteredProducts
    }
    return products
  }

  private getUserTargetType(): ConsistencyTarget {
    if (this.isUserLoggedInWithSso || this.isUserLoggenInLegacy) {
      return this.isUserTimBrokerCustomer() ? ConsistencyTarget.MY_BROKER : ConsistencyTarget.TIM
    }
  }

  @Cacheable()
  public consistency(): Observable<ConsistencyResponse> {
    return this.nypInsurancesService.consistency(this.consistenciesRules);
  }

  public priceConsistency(payload: Consistency): Observable<any> {
    return this.nypInsurancesService.priceConsistency(payload);
  }

  public saveConsistenciesResponse(consistencies: ConsistencyResponse) {
    this.consistencies = consistencies
  }

  public isUserEligibleForProduct(productCode: string): boolean {
    return !!this.consistencies[productCode]
  }

  public getProductConsistencyTargets(productCode: string): ConsistencyTarget {
    const productTarget = this.consistenciesRules[productCode].target as ConsistencyTarget
    const target = Object.keys(ConsistencyTarget)[Object.values(ConsistencyTarget).indexOf(productTarget)]
    return ConsistencyTarget[target]
  }

  public isUserEligibleForProductByTarget(productCode: string): boolean {
    const target = this.consistenciesRules[productCode].target
    return target === ConsistencyTarget.MY_BROKER || target === ConsistencyTarget.BOTH
  }

  public getProductNoConsistency(product: Product): boolean {
    const productConsistencyProperty = product.properties.find(property =>
      property.name === this.PRODUCT_CONSISTENCY__KEY
    )
    return productConsistencyProperty.value.toLowerCase() === ConsistencyValue.FALSE
  }

  public getPricingConsistency(productCode: string): Consistency {
    if (this.isUserLoggedInWithSso) {
      this.componentFeaturesService.useComponent(this.COMPONENT_FEATURE_CONSISTENCY_NAME)
      this.componentFeaturesService.useRule(this.COMPONENT_FEATURE_CONSISTENCY_PRICE_RULE)
      const isRuleEnabled = this.componentFeaturesService.isRuleEnabled()
      if (isRuleEnabled) {
        const constraints = this.componentFeaturesService.getConstraints()
        let pricingConsistency: Consistency = {}
        constraints.forEach((value, key) => {
          if (key === productCode) {
            pricingConsistency = value
          }
        })
        Object.assign(pricingConsistency, { product_code: productCode })
        return pricingConsistency
      }
    }
  }

}
