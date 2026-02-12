import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators, ValidatorFn, ValidationErrors} from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-quotator-smartphone',
  templateUrl: './quotator-smartphone.component.html',
  styleUrls: ['./quotator-smartphone.component.scss']
})
export class QuotatorSmartphoneComponent implements OnInit {

  @Input() product;
  @Output() actionEvent = new EventEmitter<any>();

  form: FormGroup;

  brandList = [];
  modelList = [];
  valuesDeviceList = [];
  price = 0;
  tempId = null;
  showError = false;

  otherBrandObj = {
    brand: 'Altro',
    model: null,
    technology: null,
    variant_id: -1
  };

  otherModelObj = {
    brand: null,
    model: 'Altro',
    technology: null,
    variant_id: -1
  };

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      selectBrand: new FormControl(null, [Validators.required]),
      selectModel: new FormControl(null, [Validators.required]),
      selectValue: new FormControl(null, [Validators.required])
    });
    const brandList = this.product.goods.reduce((acc, curr) => {
      if (acc.every(a => a.brand !== curr.brand)) {
        return [...acc, curr];
      }
      return acc;
    }, []);
    this.brandList = [...brandList];
    this.valuesDeviceList = this.product.variants.reduce((acc, curr) => {
      return [...acc, ...curr.option_values.map(o => ({...o, id: curr.id, price: curr.price}))];
    }, []);
    this.modelList = this.createdModelList([], '');
  }

  formGroupValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const brandControl = group.controls['selectBrand'];
      const modelControl = group.controls['selectModel'];
      const brand = brandControl.value;
      const model = modelControl.value;
      brandControl.setErrors(null);
      if (!brand) {
        brandControl.setErrors({select_brand_model: true});
      }
      modelControl.setErrors(null);
      if (!model) {
        modelControl.setErrors({select_brand_model: true});
      }
      return;
    };
  }

  controlSelection(controlValue) {
    return !!controlValue;
  }

  selectBrand(good) {
    if (good) {
      const variantId = good.variant_id;
      if (variantId !== -1) {
        this.resetForm(this.form);
      }
      const brand = good.brand;
      const modelList = _.filter(this.product.goods, (g) => {
        return g['model'] ? g['brand'] === brand : null;
      });
      this.modelList = this.createdModelList(modelList, brand);
    }
  }

  selectModel(good) {
    if (good) {
      const variantId = good.variant_id;
      if (variantId === -1) {
        this.resetValue(this.form);
      } else {
        this.price = _.find(this.product.variants, ['id', variantId]).price
          ? _.find(this.product.variants, ['id', variantId]).price
          : 0;
      }
    }
  }

  selectValue(value) {
    this.tempId = value.id;
    this.price = value.price;
  }

  resetForm(form: FormGroup) {
    form.controls['selectModel'].patchValue(null);
    form.controls['selectValue'].patchValue(null);
    this.resetPrice();
  }

  resetValue(form: FormGroup) {
    form.controls['selectValue'].patchValue(null);
    this.resetPrice();
  }

  resetPrice() {
    this.price = 0;
  }

  createdModelList(modelList, brand) {
    this.otherModelObj.brand = brand;
    return [...modelList, this.otherModelObj];
  }

  createOrderObj(variant, good) {
    return {
      order: {
        line_items_attributes: {
          0: {
            variant_id: variant.id,
            quantity: 1,
            addon_ids: [],
            insurance_info_attributes: {
              covercare_brand: good.brand ? good.brand : 'Altro',
              covercare_model: good.model ? good.model : 'Altro',
              covercare_technology: good.technology ? good.technology : 'Smartphone',
            },
            insurance_info_extra: {
              covercare_brand: good.brand ? good.brand : 'Altro',
              covercare_model: good.model ? good.model : 'Altro',
              covercare_technology: good.technology ? good.technology : 'Smartphone',
            }
          },
        },
      }
    };
  }

  findVariant() {
    const model = this.form.controls['selectModel'].value;
    const value = this.form.controls['selectValue'].value;
    const selectedVariantId = (model || {}).variant_id > 0 ? (model || {}).variant_id : (value || {}).id;
    return this.product.variants.find(v => v.id === selectedVariantId);
  }

  checkout() {
    const brand = this.form.controls['selectBrand'].value;
    const model = this.form.controls['selectModel'].value;

    this.showError = false;
    if ((!brand || !model) && !!this.product.errors) {
      this.showError = true;
    }
    const good = {
      brand: this.form.controls['selectBrand'].value && this.form.controls['selectBrand'].value.brand,
      model: this.form.controls['selectModel'].value && this.form.controls['selectModel'].value.model,
      technology: this.form.controls['selectBrand'].value && this.form.controls['selectBrand'].value.technology
    };
    const order = this.createOrderObj(this.findVariant(), good);
    this.sendCheckoutAction(order);
  }

  sendCheckoutAction(order: any) {
    const action = {
      action: 'checkout_product',
      payload: {
        product: this.product,
        order: order,
        router: 'checkout'
      }
    };
    this.emitActionEvent(action);
  }

  emitActionEvent(action: any) {
    this.actionEvent.next(action);
  }

}

