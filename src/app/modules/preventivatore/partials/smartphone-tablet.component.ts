import {Component, Input, OnInit} from '@angular/core';
import {PreventivatoreComponent} from '../preventivatore/preventivatore.component';
import * as _ from 'lodash';
import { PreventivatoreConstants } from '../PreventivatoreConstants';
import { finalize } from 'rxjs/operators';
import { RequestCheckout } from '@model';

@Component({
  selector: 'app-smartphone-tablet',
  templateUrl: './smartphone-tablet.component.html',
  styleUrls: ['../preventivatoreY.component.scss']
})
export class SmartphoneTabletComponent extends PreventivatoreComponent implements OnInit {
  @Input() product;
  // product: any;
  includedSection = false;
  brandList = [];
  modelList = [];
  valuesDeviceList = [];
  brand = null;
  model = null;
  value = null;
  price = 0;
  tempId = null;

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

  ngOnInit() {
    // this.product = this.product;
    const brandList = this.product.goods.reduce((acc, curr) => {
      if (acc.every(a => a.brand !== curr.brand)) {
        return [...acc, curr];
      }
      return acc;
    }, []);
    this.brandList = [...brandList, this.otherBrandObj];
    this.valuesDeviceList = this.product.variants.reduce((acc, curr) => {
      return [...acc, ...curr.option_values.map(o => ({...o, id: curr.id, price: curr.price}))];
    }, []);
    this.modelList = this.createdModelList([], '');
    this.utm_source_prev = this.route.snapshot.queryParamMap.get('utm_source');
  }

  selectBrand(brand) {
    this.resetSelect();
    if (brand) {
      const modelList = _.filter(this.product.goods, (good) => {
        return good['brand'] === brand.brand;
      });
      this.modelList = this.createdModelList(modelList, brand.brand);
    }
  }

  selectModel(model) {
    this.resetPrice();
    if (model) {
      this.price = _.find(this.product.variants, ['id', model.variant_id])
        ? _.find(this.product.variants, ['id', model.variant_id]).price
        : 0;
    }
  }

  selectValue(value) {
    this.tempId = value.id;
    this.price = value.price;
  }

  resetSelect() {
    this.model = null;
    this.value = null;
    this.resetPrice();
  }

  resetPrice() {
    this.price = 0;
  }

  createdModelList(modelList, brand) {
    this.otherModelObj.brand = brand;
    return [...modelList, this.otherModelObj];
  }

  createOrderObj(variant) {
    return {
      order: {
        line_items_attributes: {
          0: {
            variant_id: variant.id,
            quantity: 1,
            addon_ids: [],
            insurance_info_attributes: {
              covercare_brand: this.brand && this.brand.brand ? this.brand.brand : 'Altro',
              covercare_model: this.model && this.model.model ? this.model.model : 'Altro',
              covercare_technology: this.brand && this.brand.technology ? this.brand.technology : 'Smartphone',
            }
          },
        },
      }
    };
  }

  findVariant() {
    const selectedVariantId = (this.model || {}).variant_id > 0 ? (this.model || {}).variant_id : (this.value || {}).id;
    return this.product.variants.find(v => v.id === selectedVariantId);
  }

  checkout() {
    this.dataService.pq_variantId = this.product.master_variant;
    if (this.brand.brand === 'Altro') {
      this.brand.variant_id = this.tempId;
      this.brand.model = 'Altro';
      this.brand.technology = 'Smartphone';
    }
    const order = this.createOrderObj(this.findVariant());
    if (this.dataService.tenantInfo.main.layout === 'w') {
      const orderWithUtm = this.checkoutService.addUtmSource(order, this.utm_source_prev, this.telemarketer);
      this.checkoutService.redirectExternalCheckout(orderWithUtm, this.product);
    } else {
      this.checkoutService.addToChart(order).subscribe((res) => {
        this.dataService.setResponseOrder(res);
        this.dataService.setProduct(this.product);
        return this.router.navigate(['apertura']);
      });
  }
}
}
