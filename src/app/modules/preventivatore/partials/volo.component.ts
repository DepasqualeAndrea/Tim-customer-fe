import {Component, Input, OnInit} from '@angular/core';
import { PreventivatoreComponent } from '../preventivatore/preventivatore.component';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'app-volo',
  templateUrl: './volo.component.html',
  styleUrls: ['../preventivatoreY.component.scss']
})
export class VoloComponent extends PreventivatoreComponent implements OnInit {
  @Input() product: any;
  peopleQuantity = 1;
  hoveredDate: NgbDateStruct;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  dateRange: any;
  stringToDate: string;
  stringFromDate: string;
  openPicker = false;
  duration: number;
  maxDate: any;
  tomorrow: NgbDateStruct;
  // startDate = {
  //   year: +moment().add(1, 'days').format('YYYY'),
  //   month: +moment().add(1, 'days').format('MM'),
  //   day: +moment().add(1, 'days').format('DD')
  // };
  // endDate = {
  //   year: +moment().add(30, 'days').format('YYYY'),
  //   month: +moment().add(30, 'days').format('MM'),
  //   day: +moment().add(30, 'days').format('DD')
  // };
  // duration: number;
  // tomorrow = {
  //   year: +moment().add(1, 'days').format('YYYY'),
  //   month: +moment().add(1, 'days').format('MM'),
  //   day: +moment().add(1, 'days').format('DD')
  // };
  // maxEndDate = {
  //   year: +moment().add(30, 'days').format('YYYY'),
  //   month: +moment().add(30, 'days').format('MM'),
  //   day: +moment().add(30, 'days').format('DD')
  // };
  includedSection = false;

  equals = (one: NgbDateStruct, two: NgbDateStruct) =>
    one && two && two.year === one.year && two.month === one.month && two.day === one.day

  before = (one: NgbDateStruct, two: NgbDateStruct) =>
    !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
      ? false : one.day < two.day : one.month < two.month : one.year < two.year

  after = (one: NgbDateStruct, two: NgbDateStruct) =>
    !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
      ? false : one.day > two.day : one.month > two.month : one.year > two.year

  ngOnInit() {
    this.tomorrow = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
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

  // setEndDate(item: any) {
  //   if (item) {
  //     const changeEndDate = item.year + '-' + item.month + '-' + item.day;
  //     this.maxEndDate = {
  //       year: +moment(changeEndDate, 'YYYY-MM-DD').add(29, 'days').format('YYYY'),
  //       month: +moment(changeEndDate, 'YYYY-MM-DD').add(29, 'days').format('MM'),
  //       day: +moment(changeEndDate, 'YYYY-MM-DD').add(29, 'days').format('DD')
  //     };
  //   }
  // }

  toggleDatePicker() {
    this.openPicker = !this.openPicker;
  }

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
    // compare dates
    if (from && to && (from > to)) {
      this.toDate = [this.fromDate, this.fromDate = this.toDate][0];
      this.stringFromDate = this.fromDate.day + '/' + this.fromDate.month + '/' + this.fromDate.year;
      this.stringToDate = this.toDate.day + '/' + this.toDate.month + '/' + this.toDate.year;
    }
  }
  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && this.after(date, this.fromDate) && this.before(date, this.hoveredDate);
  isInside = date => this.after(date, this.fromDate) && this.before(date, this.toDate);
  isFrom = date => this.equals(date, this.fromDate);
  isTo = date => this.equals(date, this.toDate);

  setMaxDate() {
    this.stringFromDate = this.fromDate.day + '/' + this.fromDate.month + '/' + this.fromDate.year;
    this.maxDate = {
      year: +moment(this.stringFromDate, 'DD/MM/YYYY').add(29, 'days').format('YYYY'),
      month: +moment(this.stringFromDate, 'DD/MM/YYYY').add(29, 'days').format('MM'),
      day: +moment(this.stringFromDate, 'DD/MM/YYYY').add(29, 'days').format('DD')
    };
  }

  setFromDate() {
    this.fromDate = {
      year: +moment(this.stringFromDate, 'DD/MM/YYYY').format('YYYY'),
      month: +moment(this.stringFromDate, 'DD/MM/YYYY').format('MM'),
      day: +moment(this.stringFromDate, 'DD/MM/YYYY').format('DD')
    };
    this.setMaxDate();
  }
  setToDate() {
    if (moment(this.stringToDate, 'DD/MM/YYYY').diff(moment(this.stringFromDate, 'DD/MM/YYYY'), 'days') < 30) {
      this.toDate = {
        year: +moment(this.stringToDate, 'DD/MM/YYYY').format('YYYY'),
        month: +moment(this.stringToDate, 'DD/MM/YYYY').format('MM'),
        day: +moment(this.stringToDate, 'DD/MM/YYYY').format('DD')
      };
    } else {
      this.stringToDate = '';
    }
  }

  checkout() {
    //   const stringStartDate = this.startDate.year + '-' + this.startDate.month + '-' + this.startDate.day;
    //   const stringEndDate = this.endDate.year + '-' + this.endDate.month + '-' + this.endDate.day;
    //   this.duration = moment(stringEndDate, 'YYYY-MM-DD').diff(moment(stringStartDate, 'YYYY-MM-DD'), 'days') + 1;
    //   this.product.variants.forEach(variant => {
    //     if (this.duration <= variant.option_values[0].duration && !this.dataService.pq_variantId) {
    //       this.dataService.pq_variantId = variant.id;
    //     }
    //   });
    //   this.dataService.pq_quantity = this.peopleQuantity;
    //   this.dataService.startDateFlight = this.startDate;
    //   this.dataService.endDateFlight = this.endDate;
    //   return this.router.navigate(['apertura']);
    console.log('checkout');
  }

}
