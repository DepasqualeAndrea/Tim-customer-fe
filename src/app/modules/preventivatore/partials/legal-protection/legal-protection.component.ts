import { YoloDataLayerEventObjGeneratorService } from 'app/modules/tenants/y/yolo-data-layer-event-obj-generator.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { OrderAttributes, RequestOrder, DasQuotationRequest, DasQuotationResponse, Product } from '@model';
import { LegalProtectionAddon } from './legal-protection-addon.model';
import { EmployeeVariant } from './employee-variant.model';
import { Range } from './employee-range.model';
import { CheckoutService, DataService, InsurancesService } from '@services';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { VariantPeriod } from './employee-variant-period.enum';
import { RenewingPolicyFromUrl } from './renewing-policy.model';
import { PolicyFromUrl } from './policy-from-url.model';
import { map, take } from 'rxjs/operators';
import { Observable, zip } from 'rxjs';
import { CheckOutBehavior } from '../checkout-behavior';
import {KenticoTranslateService} from '../../../kentico/data-layer/kentico-translate.service';
import { ProductData } from 'app/modules/checkout/checkout.model';
import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';

@Component({
  selector: 'app-legal-protection',
  templateUrl: './legal-protection.component.html',
  styleUrls: ['../../preventivatoreY.component.scss']
})
export class LegalProtectionComponent implements OnInit {
  @Input() product;

  yearlySku = 'TUTLEG12_';
  monthlySku = 'TUTLEG1_';

  quotatorPaymentTranslations: string[] = [];

  ranges;
  employee: any;
  employees: any = [];
  employeeVariants: EmployeeVariant[];
  legalProtectionAddons: LegalProtectionAddon[];
  legalProtectionFormGroup: FormGroup;
  public monthlyEmployeeVariants: EmployeeVariant[];
  public yearlyEmployeeVariants: EmployeeVariant[];
  public resultRanges: Range[];
  price = 0;
  annualTotal = 0;
  renewingPolicy: RenewingPolicyFromUrl;
  policyFromUrl: PolicyFromUrl;
  monthlyVariantPeriod: VariantPeriod = VariantPeriod.Monthly;
  yearlyVariantPeriod: VariantPeriod = VariantPeriod.Yearly;
  showError = false;

  constructor(private formBuilder: FormBuilder,
    private checkoutService: CheckoutService,
    private dataService: DataService,
    private inurancesService: InsurancesService,
    private kenticoTranslateService: KenticoTranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private gtmHandlerService: GtmHandlerService,
    private gtmEventGeneratorService: YoloDataLayerEventObjGeneratorService
  ) {
  }

  ngOnInit(): void {
    this.employeeVariants = this.getEmployeeVariantsFromProduct(this.product);
    this.legalProtectionAddons = this.getLegalProtectionAddonsFromProduct(this.product);
    this.monthlyEmployeeVariants = this.getEmployeeMonthlyVariants(this.employeeVariants);
    this.yearlyEmployeeVariants = this.getEmployeeYearlyVariants(this.employeeVariants);
    this.resultRanges = this.getRangesToDisplay();
    this.legalProtectionFormGroup = this.createFormGroup(this.legalProtectionAddons);
    this.legalProtectionFormGroup.valueChanges.subscribe(values => this.formValueChanged(values));
    this.renewingPolicy = this.createRenewingPolicyFromUrl(this.route.snapshot, this.product.addons);
    this.policyFromUrl = this.createPolicyFromUrl(this.route.snapshot, this.product.addons);
    this.checkForUrlPolicy(this.renewingPolicy, this.policyFromUrl);
    if (!!this.policyFromUrl) {
      this.checkout();
    }
  }

  checkForUrlPolicy(renewingPolicy, policyFromUrl) {
    if (!!renewingPolicy) {
      this.fillFormValuesFromPolicy(renewingPolicy);
    }
    if (!!policyFromUrl) {
      this.fillFormValuesFromPolicy(policyFromUrl);
    }
  }

  formValueChanged(formValue: any) {
    if (this.legalProtectionFormGroup.valid) { this.showQuotationPrice(formValue); }
  }

  createFormGroup(legalProtectionAddon: LegalProtectionAddon[]): FormGroup {
    const addons = null;
    const range = null;
    const period = null;
    const formGroup = this.formBuilder.group({
      employeeRange: new FormControl(range, [Validators.required])
    });
    formGroup.addControl('paymentPeriods', this.formBuilder.control(period, [Validators.required]));
    formGroup.addControl('addOns', this.formBuilder.control(addons));

    return formGroup;
  }

  getEmployeeVariantsFromProduct(product: any): EmployeeVariant[] {
    return product.variants;
  }

  getEmployeeMonthlyVariants(employeeVariants: EmployeeVariant[]): EmployeeVariant[] {
    return employeeVariants.filter(variant => variant.sku.startsWith(this.monthlySku));
  }

  getEmployeeYearlyVariants(employeeVariants: EmployeeVariant[]): EmployeeVariant[] {
    return employeeVariants.filter(variant => variant.sku.startsWith(this.yearlySku));
  }

  getRangesToDisplay(): Range[] {
    const rangesList: Range[] = [];
    this.employeeVariants.forEach(
      empVariant => {
        const tempRange = empVariant.option_values[0].presentation;
        const existRange = rangesList.some(element => element.presentation === tempRange);
        if (!existRange) {
          const rangeToAdd = new Range(tempRange);
          rangesList.push(rangeToAdd);
        }
      }
    );
    return this.getOrderRanges(rangesList);
  }

  getOrderRanges(rangeList: Range[]): Range[] {
    return rangeList.sort(
      (rangeA: Range, rangeB: Range) => {
        if (rangeA.rangeMin < rangeB.rangeMin) {
          return -1;
        }
        if (rangeA.rangeMin > rangeB.rangeMin) {
          return 1;
        }
        if (rangeA.rangeMin === rangeB.rangeMin) {
          return 0;
        }
      });
  }

  getVariant(range: Range, period: string): EmployeeVariant {
    if (period === VariantPeriod.Monthly) {
      return this.getVariantFromVariants(this.monthlyEmployeeVariants, range);
    } if (period === VariantPeriod.Yearly) {
      return this.getVariantFromVariants(this.yearlyEmployeeVariants, range);
    } else {
      return null;
    }
  }

  getVariantFromVariants(employeeVariants: EmployeeVariant[], range: Range): EmployeeVariant {
    return employeeVariants.find((element: EmployeeVariant) => {
      return element.option_values[0].presentation === range.presentation;
    });
  }

  getLegalProtectionAddonsFromProduct(product: any): LegalProtectionAddon[] {
    return this.product.addons;
  }

  checkout() {
    const employeeRange = this.legalProtectionFormGroup.controls['employeeRange'].value;
    const paymentPeriods = this.legalProtectionFormGroup.controls['paymentPeriods'].value;
    this.showError = false;
    if ((!employeeRange || !paymentPeriods) && !!this.product.errors) {
      this.showError = true;
    }

    const formValues = {
      selectedRange: this.legalProtectionFormGroup.controls.employeeRange.value,
      selectedPeriod: this.legalProtectionFormGroup.controls.paymentPeriods.value,
      selectedAddOns: this.legalProtectionFormGroup.controls.addOns.value || [],
    };
    if (this.renewingPolicy) {
     return this.checkoutRenewPolicy(formValues);
    }

    this.checkoutNewOrder(formValues);
  }

  checkoutRenewPolicy(formValues) {
    const renewingPolicyOrder = {
      insurance: {
        variant_id: this.getVariant(formValues.selectedRange, formValues.selectedPeriod).id,
        addon_ids: formValues.selectedAddOns ? formValues.selectedAddOns.map(addon => addon.id) : [],
        quantity: 1,
      }
    };
    this.inurancesService.renew(this.renewingPolicy.policy_id, renewingPolicyOrder).subscribe(res => {
        return this.router.navigate(['private-area/my-policies']);
      }
    );
  }

  checkoutNewOrder(formValues) {
    const order = {
      order: {
        line_items_attributes: {
          0: {
            variant_id: this.getVariant(formValues.selectedRange, formValues.selectedPeriod).id,
            quantity: 1,
            addon_ids: formValues.selectedAddOns ? formValues.selectedAddOns.map(addon => addon.id) : [],
            contractor_is_insured: true
          }
        }
      }
    };

    if (!this.policyFromUrl) {
      this.checkoutService.setQuotatorOrder(this.createUrlFromOrder(order.order.line_items_attributes['0']));
    }
    const checkoutBehavior = new CheckOutBehavior(this.checkoutService, this.dataService, this.router);
    checkoutBehavior.checkout(order, this.product, 'checkout/address', true);
    this.gtmAddToCart();
  }

  showQuotationPrice(formValue) {
    const selectedRange = formValue['employeeRange'];
    const selectedPeriod = formValue['paymentPeriods'];
    const selectedAddOns = formValue['addOns'];
    const variant = this.getVariant(selectedRange, selectedPeriod);
    this.price = 0;
    this.getCalculatePrice(variant, selectedAddOns).pipe(take(1)).subscribe(result => this.price = result);
  }

  calculatePrice(variant: EmployeeVariant, selectedAddOns: LegalProtectionAddon[]): number {
    const rangePrice = variant.price;
    let addonsPrice = 0;
    if (selectedAddOns) {
      selectedAddOns.forEach((addon) => {
        const addonPriceOfVariant = addon.prices.find(addonPrice => addonPrice.variant_id === variant.id);
        addonsPrice += +addonPriceOfVariant.price;
      });
    }
    return rangePrice + addonsPrice;
  }

  getSmallImage(images) {
    if (!images.length) {
      return '';
    }
    let smallImage;
    smallImage = images.find((img) => img.image_type === 'fp_image');
    if (!!smallImage) {
      return smallImage.original_url;
    }
    smallImage = images.find((img) => img.image_type === 'default');
    if (!!smallImage) {
      return smallImage.original_url;
    }
    smallImage = images.find((img) => img.image_type === 'common_image');
    if (!!smallImage) {
      return smallImage.original_url;
    }
    return '';
  }

  createRenewingPolicyFromUrl(routeSnaphot: ActivatedRouteSnapshot, addOns: any): RenewingPolicyFromUrl {
    if (!!routeSnaphot && !!routeSnaphot.params['policyId']) {
      return new RenewingPolicyFromUrl(
        routeSnaphot.params['policyId'],
        routeSnaphot.params['variantId'],
        routeSnaphot.params['addonIds'],
        routeSnaphot.params['code'],
        addOns
      );
    }
    return null;
  }

  createPolicyFromUrl(routeSnaphot: ActivatedRouteSnapshot, addOns: any): PolicyFromUrl {
    if (!routeSnaphot.params['policyId'] && !!routeSnaphot.params['variantId']) {
      return new PolicyFromUrl(
        routeSnaphot.params['variantId'],
        routeSnaphot.params['addonIds'],
        routeSnaphot.params['code'],
        addOns
      );
    }
    return null;
  }

  fillFormValuesFromPolicy(policy: PolicyFromUrl) {
    if (!!policy) {
      const variantFromUrl = this.product.variants.find(variant => variant.id === policy.variant_id);
      this.legalProtectionFormGroup.controls['employeeRange'].setValue(
        this.resultRanges.find( range =>
          range.presentation === variantFromUrl.option_values['0'].presentation)
      );
      this.legalProtectionFormGroup.controls['paymentPeriods'].setValue(
        variantFromUrl.sku.startsWith(this.monthlySku) ? this.yearlyVariantPeriod :
        variantFromUrl.sku.startsWith(this.yearlySku) ? this.monthlyVariantPeriod : null
      );
      this.legalProtectionFormGroup.controls['addOns'].setValue(
        policy.selected_addons
      );
    }
  }

  createUrlFromOrder(order) {
    return {
      code: this.product.product_code,
      variantId: order.variant_id,
      addonIds: order.addon_ids.join(','),
    };
  }

  getCalculatePrice(variant: EmployeeVariant, selectedAddOns: LegalProtectionAddon[]): Observable<number> {
    const request = this.createQuotationRequest(variant, selectedAddOns);
    return this.getQuotation(request);
  }

  createQuotationRequest(variant: EmployeeVariant, selectedAddOns: LegalProtectionAddon[]): DasQuotationRequest {
    return {
      tenant: 'Yolo',
      product_code: this.product.product_code,
      product_data: {
        variant_sku: variant.sku,
        addon_ids: selectedAddOns ? selectedAddOns.map(addOn => addOn.code) : [],
      }
    };
  }

  getPriceFromQuotation(response: DasQuotationResponse): number {
    this.annualTotal = response.additional_total;
    return +response.total;
  }

  getQuotation(request: DasQuotationRequest): Observable<number> {
    return this.inurancesService.submitDasQuotation(request)
          .pipe(map(response => this.getPriceFromQuotation(response)));
  }
  // TODO: create pipe
  getEmployeeRangeDataCyValue(range: Range) {
    return 'das-quotator__employee-range-' + range.rangeMin.toString() + '-' + range.rangeMax.toString();
  }

  private gtmAddToCart() {
    const productData = Object.assign({}, {originalProduct: this.product as Product}, {total: this.price}) as ProductData;
    this.gtmHandlerService.multiPush(
      this.gtmEventGeneratorService.resetEcommerce(),
      this.gtmEventGeneratorService.fillAddToCartEvent(productData)
    );
  }

}

