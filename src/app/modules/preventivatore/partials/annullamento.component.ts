import { Component, Input } from '@angular/core';
import { PreventivatoreComponent } from '../preventivatore/preventivatore.component';
import * as moment from './protezione-volo.component';

@Component({
    selector: 'app-annullamento',
    templateUrl: './annullamento.component.html',
    styleUrls: ['../preventivatoreY.component.scss'],
    standalone: false
})
export class AnnullamentoComponent extends PreventivatoreComponent {

  @Input() product;

  peopleQuantity = 1;
  travelPrice = null;
  totalPrice = 0;
  includedSection = false;
  travelPriceError = false;

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

  calcTotalPrice() {
    this.totalPrice = this.travelPrice > 2000 ? 0 : this.dataService.calculateFlightPrice(this.travelPrice);
  }

  checkVlaidChars() {
    const regex = /[0-9]/;
    const regexSym = /[,.]/;
    this.travelPrice = this.travelPrice.split('').reduce((acc, cur) => {
      if (cur === ',') {cur = '.'}

      if (cur.match(regexSym)) {
        if (acc.includes('.')) {return acc}
        else if (acc.match(regex)) {return acc + cur}
        else return null;
      }
      else {
        if (!cur.match(regex)) {return acc;}
      }

      if (cur.match(regex)) {return this.digitsControl(acc + cur)}

    }, '');
    this.travelPriceError = false;
    if (this.travelPrice > 2000) {
      this.travelPriceError = true;
    }
  }

  digitsControl(formNumber) {
    if (formNumber.includes('.')) {
      var fn = formNumber.split(".");
      if (fn[1].length > 2) {return fn[0] + '.' + fn[1].substring(0,2)}
      return formNumber;
    }
    else {
      if (formNumber.length > 3 && this.travelPrice > 2000) {return formNumber.substring(0,4)}
      return formNumber;
    }
  }

  createOrderObj(variant) {
    return {
      order: {
        line_items_attributes: {
          0: {
            variant_id: variant,
            quantity: this.peopleQuantity,
            insured_is_contractor: true,
            insurance_info_attributes: {
              price: this.travelPrice
            }
          },
        },
      }
    };
  }
  checkout() {
    const order = this.createOrderObj(this.product.master_variant);
    this.checkoutService.addToChart(order).subscribe((res) => {
      this.dataService.setResponseOrder(res);
      this.dataService.setProduct(this.product);
      return this.router.navigate(['apertura']);
    });

    // } else {
    //   this.toastr.error(`Inserire il prezzo del viaggio`, '', { onActivateTick: true });
    // }
  }

}
