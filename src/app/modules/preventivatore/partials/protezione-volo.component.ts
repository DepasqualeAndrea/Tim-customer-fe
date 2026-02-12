import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {PreventivatoreComponent} from '../preventivatore/preventivatore.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-protezione-volo',
  templateUrl: './protezione-volo.component.html',
  styleUrls: ['../preventivatoreY.component.scss']
})
export class ProtezioneVoloComponent extends PreventivatoreComponent implements OnInit {

  @Input() product;

  openPicker = false;
  datepicker;
  stringFromDate: string;
  stringToDate: string;
  hoveredDate: NgbDateStruct;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  minDate: NgbDateStruct;
  tomorrow: NgbDateStruct;
  peopleQuantity = 1;
  price = 0;
  currentField: 'toDate' | 'fromDate';

  ngOnInit() {
    this.tomorrow = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
    this.minDate = this.tomorrow;
  }

  toggleDatePicker(currentField?: 'toDate' | 'fromDate') {
    this.currentField = currentField;
    this.openPicker = !this.openPicker;
    if (this.currentField === 'fromDate') {
      this.resetPicker();
    }
  }

  private resetPicker(): void {
    this.datepicker = null;
    this.fromDate = null;
    this.stringFromDate = '';
    this.toDate = null;
    this.stringToDate = '';
    this.maxDate = this.getNextYear();
    this.minDate = this.tomorrow; 
  }

  singleDateSelection(date: NgbDateStruct) {
    if (this.currentField === 'fromDate') {
      this.fromDate = date;
      this.stringFromDate = this.fromDate.day + '/' + this.fromDate.month + '/' + this.fromDate.year;
      this.setMaxDate();
      this.setMinDate();
    }
    if (this.currentField === 'toDate') {
      this.toDate = date;
      this.stringToDate = this.toDate.day + '/' + this.toDate.month + '/' + this.toDate.year;
    }
    this.toggleDatePicker();
    this.setPrice();
  }

  // Range date selection - will be unused due to a CR, kept for reference
  onDateSelection(date: NgbDateStruct) {
    if (!this.fromDate || this.fromDate && this.toDate) {
      this.fromDate = date;
      this.stringFromDate = this.fromDate.day + '/' + this.fromDate.month + '/' + this.fromDate.year;
      this.setMaxDate();
      this.toDate = null;
    } else {
      this.toDate = date;
      this.stringToDate = this.toDate.day + '/' + this.toDate.month + '/' + this.toDate.year;
      this.toggleDatePicker();
    }
    const from = this.toDate ? new Date(`${this.fromDate.month}/${this.fromDate.day}/${this.fromDate.year}`) : null;
    const to = this.toDate ? new Date(`${this.toDate.month}/${this.toDate.day}/${this.toDate.year}`) : null;
    if (from && to && (from > to)) {
      this.toDate = [this.fromDate, this.fromDate = this.toDate][0];
      this.stringFromDate = this.fromDate.day + '/' + this.fromDate.month + '/' + this.fromDate.year;
      this.stringToDate = this.toDate.day + '/' + this.toDate.month + '/' + this.toDate.year;
    }
    this.setPrice();
  }

  equals = (one: NgbDateStruct, two: NgbDateStruct) =>
    one && two && two.year === one.year && two.month === one.month && two.day === one.day;

  before = (one: NgbDateStruct, two: NgbDateStruct) =>
    !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
      ? false : one.day < two.day : one.month < two.month : one.year < two.year;

  after = (one: NgbDateStruct, two: NgbDateStruct) =>
    !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
      ? false : one.day > two.day : one.month > two.month : one.year > two.year;

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && this.after(date, this.fromDate) && this.before(date, this.hoveredDate);
  isInside = date => this.after(date, this.fromDate) && this.before(date, this.toDate);
  isFrom = date => this.equals(date, this.fromDate);
  isTo = date => this.equals(date, this.toDate);


  setMaxDate() {
    this.maxDate = {
      year: +moment(this.stringFromDate, 'DD/MM/YYYY').add(29, 'days').format('YYYY'),
      month: +moment(this.stringFromDate, 'DD/MM/YYYY').add(29, 'days').format('MM'),
      day: +moment(this.stringFromDate, 'DD/MM/YYYY').add(29, 'days').format('DD')
    };
  }

  setMinDate() {
    this.minDate = {
      year: +moment(this.stringFromDate, 'DD/MM/YYYY').format('YYYY'),
      month: +moment(this.stringFromDate, 'DD/MM/YYYY').format('MM'),
      day: +moment(this.stringFromDate, 'DD/MM/YYYY').format('DD')
    };
  }

  addQuantity() {
    if (this.peopleQuantity < this.product.maximum_insurable) {
      this.peopleQuantity++;
      this.setPrice();
    }
  }

  subtractQuantity() {
    if (this.peopleQuantity > 1) {
      this.peopleQuantity--;
      this.setPrice();
    }
  }

  createOrderObj(variant) {
    return {
      order: {
        line_items_attributes: {
          0: {
            variant_id: variant.id,
            quantity: this.peopleQuantity,
            addon_ids: [],
            start_date: moment(this.stringFromDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            expiration_date: moment(this.stringToDate, 'DD/MM/YYYY').add(1, 'days').format('YYYY-MM-DD'),
            insured_is_contractor: true,
            display_expiration_date: moment(this.stringToDate, 'DD/MM/YYYY').format('DD/MM/YYYY')
          },
        },
      }
    };
  }

  checkout() {
    this.setPrice();
    const order = this.createOrderObj(this.findSelectedVariant());
    this.checkoutService.addToChart(order).subscribe((res) => {
      this.dataService.setResponseOrder(res);
      this.dataService.setProduct(this.product);
      return this.router.navigate(['apertura']);
    });
  }

  setPrice() {
    if (this.stringFromDate && this.stringToDate) {
      const durationRange = moment(this.stringToDate, 'DD/MM/YYYY').diff(moment(this.stringFromDate, 'DD/MM/YYYY'), 'days') + 1;
      let find = false;
      _.find(this.product.variants, (variant) => {
        _.each(variant.option_values, (option) => {
          if (option.duration && option.duration >= durationRange) {
            this.price = variant.price * this.peopleQuantity;
            find = true;
          }
        });
        return find;
      });
    }
  }

  findSelectedVariant() {
    const durationRange = moment(this.stringToDate, 'DD/MM/YYYY').diff(moment(this.stringFromDate, 'DD/MM/YYYY'), 'days') + 1;
    let foundVariant = null;
    this.product.variants.forEach((variant) => {
      variant.option_values.forEach((option) => {
        if (option.duration && option.duration >= durationRange) {
          if (!foundVariant || !foundVariant.option_values.find(opt => opt.duration && opt.duration < option.duration)) {
            foundVariant = variant;
          }
        }
      });
    });
    return foundVariant;
  }

  private getNextYear(): NgbDateStruct {
    return this.calendar.getNext(this.calendar.getToday(), 'd', 365);
  }
}
