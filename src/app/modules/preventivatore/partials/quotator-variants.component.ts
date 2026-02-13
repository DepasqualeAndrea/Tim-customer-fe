import {Component, Input, OnInit} from '@angular/core';
import { PreventivatoreComponent } from '../preventivatore/preventivatore.component';
import * as _ from 'lodash';
import { RequestCheckout, VARIANT_TYPE_DAY } from '@model';
import { PreventivatoreConstants } from '../PreventivatoreConstants';
import { finalize } from 'rxjs/operators';


  @Component({
    selector: 'app-quotator-variants',
    templateUrl: './quotator-variants.component.html',
    styleUrls: ['../preventivatoreY.component.scss'],
    standalone: false
})
  export class QuotatorVariantsComponent extends PreventivatoreComponent implements OnInit {
    @Input() product;
    variants = [];
    price: number;
    daily: boolean;
    productDescription: string;

    ngOnInit() {
      _.each(this.product.variants, (variant) => {
        _.each(variant.option_values, (option) => {
          this.variants.push({
            'name': option.presentation,
            'price': variant.price,
            'active': false,
            'id': variant.id,
            'typeName': option.option_type_name
          });
        });
      });
      this.setPackage(this.variants[0]);
      this.utm_source_prev = this.route.snapshot.queryParamMap.get('utm_source');
      this.telemarketer = parseInt(this.route.snapshot.queryParamMap.get('telemarketer'), 10);
    }

    setPackage(_variant) {
      const selectedVariant = _.find(this.variants, ['active', true]);
      this.productDescription = this.getProductDescription(_variant);
      if (selectedVariant) {
        selectedVariant['active'] = false;
      }
      _variant.active = true;
      this.price = _variant.price;
      this.daily = _variant.typeName === VARIANT_TYPE_DAY;
    }

    getProductDescription(variant): string {
      if (this.product.product_code === 'cc-appliances') {
        let productDescription: string;
        if (variant.id === 132) {
          this.kenticoTranslateService.getItem<any>('quotator.appliances_description_3').subscribe(text => { productDescription = text.value});
        } else if (variant.id === 133) {
          this.kenticoTranslateService.getItem<any>('quotator.appliances_description_5_1').subscribe(text => { productDescription = text.value; });
        }
        return productDescription;
      } else {
        return this.product.short_description as string;
      }
    }

    createOrderObj(variant) {
      return {
        order: {
          line_items_attributes: {
            0: {
              variant_id: variant.id,
              quantity: 1,
            },
          },
        }
      };
    }

    checkout() {
      const selectedVariant = this.variants.find(variant => variant.active === true);
      const order = this.createOrderObj(selectedVariant);
      if (this.dataService.tenantInfo.main.layout === 'je') {
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
