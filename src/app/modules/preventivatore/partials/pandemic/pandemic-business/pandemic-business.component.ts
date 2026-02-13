import { Product } from '@model';
import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { PandemicBusinessAddon } from './pandemic-business-addon.model';
import { PandemicVariant } from './pandemic-variant.model';
import { CheckoutService, DataService } from '@services';
import { Router } from '@angular/router';
import { CheckOutBehavior } from '../../checkout-behavior';
import { insuredSubjectCountValidatorFactory } from './insured-subject-count.validator';
import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';
import { ProductData } from 'app/modules/checkout/checkout.model';
import { YoloDataLayerEventObjGeneratorService } from 'app/modules/tenants/y/yolo-data-layer-event-obj-generator.service';

@Component({
    selector: 'app-pandemic-business',
    templateUrl: './pandemic-business.component.html',
    styleUrls: ['../../../preventivatoreY.component.scss'],
    standalone: false
})
export class PandemicBusinessComponent implements OnInit {

  @Input() product;
  maxInsuredSubjects = 9999;
  price = 0;
  insuredSubjects = 0;
  pandemicBusinessFormGroup: UntypedFormGroup;
  pandemicVariants: PandemicVariant[];
  formVariants: { id: number, presentation: string }[];

  pandemicBusinessAddons: PandemicBusinessAddon[];

  constructor(private formBuilder: UntypedFormBuilder,
    private checkoutService: CheckoutService,
    private dataService: DataService,
    private router: Router,
    private gtmHandlerService: GtmHandlerService,
    private gtmEventGeneratorService: YoloDataLayerEventObjGeneratorService
  ) { }

  ngOnInit() {
    this.pandemicVariants = this.getProductVariants(this.product);
    this.formVariants = this.getFormVariants(this.pandemicVariants);
    this.pandemicBusinessAddons = this.getPandemicBusinessAddonsFromProduct(this.product);
    this.pandemicBusinessFormGroup = this.createFormGroup(this.pandemicBusinessAddons);
    this.pandemicBusinessFormGroup.valueChanges.subscribe(values => this.formValueChanged(values));
  }

  createFormGroup(pandemicBusinessAddons: PandemicBusinessAddon[]): UntypedFormGroup {
    const addons = null;
    const formGroup = this.formBuilder.group({
      hospitalizationOption: new UntypedFormControl(null, [Validators.required]),
      insuredSubjects: new UntypedFormControl(0, [Validators.min(1), Validators.required, insuredSubjectCountValidatorFactory(1, this.maxInsuredSubjects)]),
    });
    formGroup.addControl('addOns', this.formBuilder.control(addons));
    return formGroup;
  }

  getProductVariants(product: any): PandemicVariant[] {
    return product.variants;
  }

  getFormVariants(variants: PandemicVariant[]) {
    return variants.map(variant => ({
      id: variant.id,
      presentation: variant.option_values[0].presentation
    }));
  }

  getPandemicBusinessAddonsFromProduct(product: any): PandemicBusinessAddon[] {
    return product.addons;
  }

  formValueChanged(formValue: any) {
    if (this.pandemicBusinessFormGroup.valid) {
      this.price = this.calculatePrice(formValue);
    } else {
      this.price = 0;
    }
  }

  calculatePrice(formValue: any) {
    const selectedVariantPrice = this.getSelectedVariant(formValue.hospitalizationOption).price;
    const selectedAddonsPrice = this.getSelectedAddonsPrices(formValue);
    return (selectedVariantPrice + selectedAddonsPrice) * formValue.insuredSubjects;
  }

  getSelectedVariant(variantId: number) {
    return this.pandemicVariants.find(variant =>
      variant.id === variantId
    );
  }

  getSelectedAddonsPrices(formValue) {
    let totalAddonsPrice = 0;
    const variant = formValue.hospitalizationOption;
    const addons = formValue.addOns;
    if (!!addons) {
      addons.forEach(addon => {
        if (addon.prices.variant_id === variant) {
          totalAddonsPrice += addon.prices.price;
        }
        totalAddonsPrice += addon.price;
      });
    }
    return totalAddonsPrice;
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

  addInsuredSubjects() {
    if (this.pandemicBusinessFormGroup.controls['insuredSubjects'].valid) {
      this.insuredSubjects = this.pandemicBusinessFormGroup.controls['insuredSubjects'].value;
    } else {
      this.insuredSubjects = 0;
    }

    if (!this.maxInsuredReached()) {
      this.insuredSubjects++;
      this.pandemicBusinessFormGroup.controls['insuredSubjects'].setValue(this.insuredSubjects);
    }
  }

  subtractInsuredSubjects() {
    if (this.pandemicBusinessFormGroup.controls['insuredSubjects'].valid) {
      this.insuredSubjects = this.pandemicBusinessFormGroup.controls['insuredSubjects'].value;
    } else {
      this.insuredSubjects = 0;
    }
    if (this.insuredSubjects > 0) {
      this.insuredSubjects--;
      this.pandemicBusinessFormGroup.controls['insuredSubjects'].setValue(this.insuredSubjects);
    }
  }

  maxInsuredReached() {
    return this.insuredSubjects >= this.maxInsuredSubjects;
  }

  checkout() {
    const order = {
      order: {
        line_items_attributes: {
          0: {
            variant_id: this.pandemicBusinessFormGroup.controls.hospitalizationOption.value,
            quantity: this.pandemicBusinessFormGroup.controls.insuredSubjects.value,
            addon_ids: this.pandemicBusinessFormGroup.controls.addOns.value ?
              this.pandemicBusinessFormGroup.controls.addOns.value.map(addon => addon.id) : [],
          }
        }
      }
    };
    const checkoutBehavior = new CheckOutBehavior(this.checkoutService, this.dataService, this.router);
    checkoutBehavior.checkout(order, this.product, 'apertura/address', true);
    this.gtmAddToCart();
  }

  private gtmAddToCart() {
    const productData = Object.assign({}, {originalProduct: this.product as Product}, {total: this.price}) as ProductData;
    this.gtmHandlerService.multiPush(
      this.gtmEventGeneratorService.resetEcommerce(),
      this.gtmEventGeneratorService.fillAddToCartEvent(productData)
    );
  }
}
