import {Component, Input, OnInit} from '@angular/core';
import {PreventivatoreComponent} from '../preventivatore/preventivatore.component';
import * as _ from 'lodash';
import * as moment from 'moment';
import {Product, RequestOrder} from '@model';

@Component({
    selector: 'app-viaggio-europa',
    templateUrl: './viaggio-europa.component.html',
    styleUrls: ['../preventivatoreY.component.scss'],
    standalone: false
})
export class ViaggioEuropaComponent extends PreventivatoreComponent implements OnInit {
  @Input() product;
  variants = [];
  price = 2;
  peopleQuantity = 1;
  daysQuantity = 1;
  countryList = [];
  startDate: any;
  endDate: any;
  country;
  daysList = [{
    value: 1,
    price: 2,
    active: true,
  }, {
    value: 2,
    price: 3,
    active: false,
  }, {
    value: 3,
    price: 4,
    active: false,
  }, {
    value: 4,
    price: 5,
    active: false,
  }, {
    value: 5,
    price: 5,
    active: false,
  }, {
    value: 6,
    price: 10,
    active: false,
  }, {
    value: 7,
    price: 10,
    active: false,
  }, {
    value: 8,
    price: 10,
    active: false,
  }, {
    value: 9,
    price: 10,
    active: false,
  }, {
    value: 10,
    price: 10,
    active: false,
  }];


  ngOnInit() {
    this.userService.getEuropeCountries().subscribe(
      res => {
        this.countryList = res.countries;
      }, error => {
      });
    this.setGiorni(this.daysList[0]);
  }

  setGiorni(day) {
    this.daysQuantity = day.value;
    this.price = day.price;
    const selectedDay = _.find(this.daysList, ['active', true]);
    if (selectedDay) {
      selectedDay['active'] = false;
    }
    day.active = true;
    this.startDate = moment().add(1, 'd');
    this.endDate = moment().add(1, 'd').add(day.value, 'd');
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

  createOrderObj(variant): RequestOrder {
    return {
      order: {
        line_items_attributes: {
          '0': {
            variant_id: variant,
            quantity: this.peopleQuantity,
            start_date: this.startDate.format('YYYY-MM-DD'),
            expiration_date: this.endDate.format('YYYY-MM-DD'),
            insurance_info_attributes: {
              allianz_destination_id: this.country.id
            }
          }
        },
      },
    };
  }


  checkout() {
    const order = this.createOrderObj(this.product.master_variant);
    this.checkoutService.addToChart(order).subscribe((res) => {
      res.line_items['0'].variant.price = this.price;
      this.dataService.setResponseOrder(res);
      this.dataService.setProduct(this.product);
      return this.router.navigate(['apertura']);
    });
  }

}
