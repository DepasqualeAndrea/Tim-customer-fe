import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PreventivatoreComponent } from '../../../preventivatore/preventivatore.component';
import * as _ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-quotator-pepole-variants-basic',
    templateUrl: './quotator-people-variants-basic.component.html',
    styleUrls: ['../preventivatore-basic.component.scss'],
    standalone: false
})
export class QuotatorPeopleVariantsBasicComponent extends PreventivatoreComponent implements OnInit {

  @Input() product;
  @Output() actionEvent = new EventEmitter<any>();
  @Output() swipeEvent = new EventEmitter<string>();
  variants = [];
  price: number;
  peopleQuantity = 1;
  promoModal: NgbModal;

  ngOnInit() {
    _.each(this.product.variants, (variant) => {
      _.each(variant.option_values, (option) => {
        this.variants.push({
          'id': variant.id,
          'name': option.presentation,
          'price': variant.price,
          'active': false
        });
      });
    });
    this.setDefaultPackage();
  }

  setDefaultPackage(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('prod');
    let defaultPackage;
    let param;
    this.componentFeaturesService.useComponent('quotator-select-package');
    this.componentFeaturesService.useRule('select-package');

    if (!!myParam) {
      if (this.dataService.tenantInfo.language === 'it') {
        param = myParam === '1d' ? myParam.replace('1d', '1 giorno') :
                myParam === '2d' ? myParam.replace('2d', '2 giorni') :
                myParam === '6d' ? myParam.replace('6d', '6 giorni') :
                myParam === 's' ? myParam.replace('s', 'Stagione')  : ''
      }
      else if (this.dataService.tenantInfo.language === 'es') {
        param = myParam === '1d' ? myParam.replace('1d', '1 día') :
                myParam === '2d' ? myParam.replace('2d', '2 días') :
                myParam === '6d' ? myParam.replace('6d', '6 días') : ''
             // myParam === 's' ? myParam.replace('s', 'Estacional') : '' not present in tenant language es Seasonal variant
      }
      else {
        param = myParam === '1d' ? myParam.replace('1d', '1 day') :
                myParam === '2d' ? myParam.replace('2d', '2 days') :
                myParam === '6d' ? myParam.replace('6d', '6 days') :
                myParam === 's' ? myParam.replace('s', 'Seasonal') : ''
      }
      this.variants.some((variant) => {
        if (variant.name === param) {
          this.setPackage(variant);
          return true;
        } else {
          this.setPackage(this.variants[0]);
        }
      })
    } else if (this.componentFeaturesService.isRuleEnabled()) {
      defaultPackage = this.componentFeaturesService.getConstraints().get(this.product.product_code);
      this.variants.filter((variant) => {
        if (variant.name === defaultPackage) {
          this.setPackage(variant);
        }
      })
    } else {
      this.setPackage(this.variants[0]);
    }
  }


  addQuantity() {
    if (this.peopleQuantity < this.product.maximum_insurable) {
      this.peopleQuantity++;
    }
  }

  subtractQuantity() {
    if (this.peopleQuantity > 1) {
      this.peopleQuantity--;
    }
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
    const firstLine = { variant_id: selectedVariant.id, quantity: this.peopleQuantity };
    const order = { order: { line_items_attributes: { '0': firstLine } } };
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

  onSwipe(event) {
    const direction = Math.abs(event.deltaX) > 40 ? (event.deltaX > 0 ? 'right' : 'left') : '';
    this.swipeEvent.next(direction);
  }

}
