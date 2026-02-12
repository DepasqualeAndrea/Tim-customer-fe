import { PreventivatoreComponent } from 'app/modules/preventivatore/preventivatore/preventivatore.component';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-quotator-variants-basic',
  templateUrl: './quotator-variants-basic.component.html',
  styleUrls: ['../preventivatore-basic.component.scss']
})
export class QuotatorVariantsBasicComponent extends PreventivatoreComponent implements OnInit {

  @Input() product;
  @Output() actionEvent = new EventEmitter<any>();

  variants = [];
  price: number;

  ngOnInit() {
    _.each(this.product.variants, (variant, index) => {
      _.each(variant.option_values, (option) => {
        const variantName = this.product.variants_names ? this.product.variants_names[index].name : option.presentation;
        this.variants.push({
          'id': variant.id,
          'name': variantName,
          'price': variant.price,
          'active': false
        });
      });
    });
    this.setPackage(this.variants[0]);
  }

  setPackage(_variant) {
    const selectedVariant = _.find(this.variants, ['active', true]);
    if (selectedVariant) {
      selectedVariant['active'] = false;
    }
    _variant.active = true;
    this.price = _variant.price;
  }

  checkout() {
    const selectedVariant = this.variants.find((variant) => !!variant.active);
    const firstLine = { variant_id: selectedVariant.id, quantity: 1 };
    const order = {order: {line_items_attributes: {'0': firstLine}}};
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
