import { OnInit, AfterViewInit, Directive } from '@angular/core';
import { ComponentFeaturesService } from './../../../../core/services/componentFeatures.service';
import { CheckoutStepService } from '../../services/checkout-step.service';
import { CheckoutStepComponent } from '../checkout-step.component';
import { Product } from '@model';
import { AuthService, DataService, InsurancesService } from '@services';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { PREVENTIVATORE_URL_KEY } from 'app/modules/preventivatore/preventivatore/preventivatore.component';
import { CHECKOUT_OPENED } from '../../services/checkout.resolver';
import { KenticoTranslateService } from '../../../kentico/data-layer/kentico-translate.service';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';


@Directive()
export abstract class CheckoutStepCompleteAbstractComponent extends CheckoutStepComponent implements OnInit, AfterViewInit {

  public recommendedProductsNumber: number;

  recommended: Product[];
  selectedProduct: any;
  listProducts: any;

  cart: string;
  ty_image: string;
  externalLink: string;
  linearStepper: boolean;

  constructor(checkoutStepService: CheckoutStepService,
    private insurancesService: InsurancesService,
    protected nypInsuranceService: NypInsurancesService,
    private authService: AuthService,
    public dataService: DataService,
    public kenticoTranslateService: KenticoTranslateService,
    public componentFeaturesService: ComponentFeaturesService
  ) {
    super(checkoutStepService, null);
  }

  ngOnInit() {
    this.getRecommendedProducts();
  }

  ngAfterViewInit() {
    localStorage.removeItem(PREVENTIVATORE_URL_KEY);
    localStorage.removeItem(CHECKOUT_OPENED);
  }

  isLegalProtectionAnnual(product) {
    return product.originalProduct.variants.find(variant =>
      variant.id === product.variantId).sku.startsWith('TUTLEG12_');
  }

  isPaymentBankTransfer(payment) {
    return payment.payment_method.name === 'Transfer';
  }

  private getProduct(): void {
    this.nypInsuranceService.getProducts().pipe(untilDestroyed(this)).subscribe((response) => {
      this.listProducts.forEach(e => {
        this.recommended = [];
        this.recommended.push(...response.products.filter(x => x.product_code === e));
      });
    });
  }

  private getProductByNumber(productsNumber): void {
    const user = this.authService.loggedUser;
    this.insurancesService.getRecommendedProducts(user.id, productsNumber).pipe(untilDestroyed(this)).subscribe((response) => {
      this.recommended = response.products;
    });
  }

  private getRecommendedProducts(): void {
    this.componentFeaturesService.useComponent('recommended-products');
    this.componentFeaturesService.useRule('product-list');
    this.selectedProduct = this.componentFeaturesService.isRuleEnabled();
    this.listProducts = this.componentFeaturesService.getConstraints().get(this.dataService.product.product_code);
    if (this.listProducts) {
      this.getProduct();
    } else {
      let recommendedProductsNumber: number;
      if (this.dataService.product.product_code === 'net-pet' || this.dataService.product.product_code === 'yolo-for-pet') {
        recommendedProductsNumber = 0;
      } else if (['net-pet-gold', 'net-pet-silver'].includes(this.dataService.product.product_code) &&
        !(this.dataService.tenantInfo.tenant === 'intesa_db')) {
        recommendedProductsNumber = 2;
      } else {
        recommendedProductsNumber = this.dataService.tenantInfo.checkout.recommendedProductsNumber;
      }
      if (recommendedProductsNumber) {
        this.getProductByNumber(recommendedProductsNumber);
      }
    }
  }
}



