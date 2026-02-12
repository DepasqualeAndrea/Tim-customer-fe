import { Component, Input, OnInit } from '@angular/core';
import { PreventivatoreComponent } from '../preventivatore/preventivatore.component';
import {RequestCheckout, RequestOrder} from '../../../core/models/order.model';
import * as _ from 'lodash';
import { PreventivatoreConstants } from '../PreventivatoreConstants';
import { finalize } from 'rxjs/operators';
import {ExternalPlatformRequestOrder} from '../../../core/models/externalCheckout/external-platform-request-order.model';

@Component({
  selector: 'app-smartphone-tablet-ct',
  templateUrl: './smartphone-tablet-ct.component.html',
  styleUrls: ['../preventivatoreCT.component.scss']
})
export class SmartphoneTabletCtComponent extends PreventivatoreComponent implements OnInit {
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
      return [...acc, ...curr.option_values.map(o => ({ ...o, id: curr.id, price: curr.price }))];
    }, []);
    this.modelList = this.createdModelList([]);
    this.utm_source_prev = this.route.snapshot.queryParamMap.get('utm_source');
    this.telemarketer = parseInt(this.route.snapshot.queryParamMap.get('telemarketer'), 10);
  }

  selectBrand(brand) {
    this.resetSelect();
    if (brand) {
      const modelList = _.filter(this.product.goods, (good) => {
        return good['brand'] === brand.brand;
      });
      this.modelList = this.createdModelList(modelList);
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

  createdModelList(modelList) {
    return [...modelList, this.otherModelObj];
  }

  checkoutCt() {
    const variant = this.findVariant();
    const order = this.createOrderObj(variant);
    const orderWithUtm = this.checkoutService.addUtmSource(order, this.utm_source_prev || 'con_te', this.telemarketer || 0);

    this.checkoutService.redirectExternalCheckout(orderWithUtm, this.product);
  }

  findVariant() {
    const selectedVariantId = (this.model || {}).variant_id > 0 ? (this.model || {}).variant_id : (this.value || {}).id;
    return this.product.variants.find(v => v.id === selectedVariantId);
  }

  createOrderObj(variant): RequestOrder {
    return {
      order: {
        order_attributes: {
          utm_source: this.utm_source_prev || 'con_te',
          telemarketer: this.telemarketer || 0
        },
        line_items_attributes: {
          '0': {
            variant_id: variant.id,
            quantity: 1,
            addon_ids: [],
            insurance_info_attributes: {
              covercare_brand: this.getType('brand'),
              covercare_model: this.getType('model'),
              covercare_technology: this.brand.technology
            }
          }
        },
      },
    };
  }

  getType(type) {
    return (this[type] || {})[type] === 'Altro' ? null : (this[type] || {})[type];
  }

}
