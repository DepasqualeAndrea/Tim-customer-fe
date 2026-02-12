import { RequestOrder } from './../../../core/models/order.model';
import { take } from 'rxjs/operators';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { PreventivatoreComponent } from '../preventivatore/preventivatore.component';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { TimeHelper } from 'app/shared/helpers/time.helper';

@Component({
  selector: 'app-quotator-sport-pack',
  templateUrl: './quotator-sport-pack.component.html',
  styleUrls: ['./quotator-sport-pack.component.scss']
})
export class QuotatorSportPackComponent extends PreventivatoreComponent implements OnInit {

  @Input() product;
  @ViewChild('sportForm', { static: true }) private sportForm: NgForm;

  peopleQuantity = 1;
  startDate: NgbDateStruct;
  calendarMaxDate: NgbDateStruct;
  calendarMinDate: NgbDateStruct;
  price = 0;

  ngOnInit() {
    this.calendarMinDate = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
    this.calendarMaxDate = this.calendar.getNext(this.calendar.getToday(), 'd', 59);
  }

  addQuantity() {
    if (this.peopleQuantity < this.product.maximum_insurable) {
      this.peopleQuantity++;
    }
    this.calculatePrice();
  }

  subtractQuantity() {
    if (this.peopleQuantity > 1) {
      this.peopleQuantity--;
    }
    this.calculatePrice();
  }

  calculatePrice() {
    if (this.sportForm.valid) {
      const body = Object.assign({}, {
        tenant: 'net-insurance',
        product_code: this.product.product_code.toLowerCase(),
        product_data: {
          variant_name: this.sportForm.controls.variant.value.name,
          quantity: this.peopleQuantity
        }
      });
      this.insuranceService.submitNetInsuranceQuotation(body)
        .pipe(take(1)).subscribe(res => this.price = res.total);
    }
  }

  checkout() {
    const startDate = this.sportForm.controls.dateFrom.value;
    const stringStartDate = TimeHelper.fromNgbDateStrucutreStringTo(startDate);
    const duration = this.sportForm.controls.variant.value.name.toString().split(' ');
    const stringEndDate = moment(stringStartDate).add(+duration[0], duration[1]).format('YYYY-MM-DD');
    const endDate = TimeHelper.fromStringToNgbDateStrucutre(stringEndDate);
    const line_items_attributes = {
      '0': {
        variant_id: this.sportForm.controls.variant.value.id,
        quantity: this.peopleQuantity,
        start_date: `${startDate.day}-${startDate.month}-${startDate.year}`,
        expiration_date: `${endDate.day}-${endDate.month}-${endDate.year}`
      }
    };
  const order = { order: { line_items_attributes } };
    this.checkoutService.addToChart(<RequestOrder>order).subscribe(res => {
      this.dataService.setResponseOrder(res);
      this.dataService.setProduct(this.product);
      return this.router.navigate(['apertura']);
    });
  }
}
