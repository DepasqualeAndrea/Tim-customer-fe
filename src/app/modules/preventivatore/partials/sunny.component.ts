import {Component, Input, OnInit} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {PreventivatoreComponent} from '../preventivatore/preventivatore.component';

@Component({
  selector: 'app-sunny',
  templateUrl: './sunny.component.html',
  styleUrls: ['../preventivatoreY.component.scss']
})
export class SunnyComponent extends PreventivatoreComponent implements OnInit {
  @Input() product;

  openPicker = false;
  stringFromDate: string;
  stringToDate: string;
  hoveredDate: NgbDateStruct;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  maxDate: any;
  minDate: NgbDateStruct;
  destination: string;
  price = 0;
  checkoutReady = false;

  ngOnInit() {
    this.minDate = this.calendar.getNext(this.calendar.getToday(), 'd', 10);
  }

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
    this.checkoutReady = false;
  }

  setFromDate() {
    if (this.stringFromDate) {
      this.fromDate = {
        year: +moment(this.stringFromDate, 'DD/MM/YYYY').format('YYYY'),
        month: +moment(this.stringFromDate, 'DD/MM/YYYY').format('MM'),
        day: +moment(this.stringFromDate, 'DD/MM/YYYY').format('DD')
      };
      this.setMaxDate();
    }
  }

  equals = (one: NgbDateStruct, two: NgbDateStruct) =>
    one && two && two.year === one.year && two.month === one.month && two.day === one.day

  before = (one: NgbDateStruct, two: NgbDateStruct) =>
    !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
      ? false : one.day < two.day : one.month < two.month : one.year < two.year

  after = (one: NgbDateStruct, two: NgbDateStruct) =>
    !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
      ? false : one.day > two.day : one.month > two.month : one.year > two.year

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && this.after(date, this.fromDate) && this.before(date, this.hoveredDate);
  isInside = date => this.after(date, this.fromDate) && this.before(date, this.toDate);
  isFrom = date => this.equals(date, this.fromDate);
  isTo = date => this.equals(date, this.toDate);


  setMaxDate() {
    this.maxDate = {
      year: +moment(this.stringFromDate, 'DD/MM/YYYY').add(6, 'days').format('YYYY'),
      month: +moment(this.stringFromDate, 'DD/MM/YYYY').add(6, 'days').format('MM'),
      day: +moment(this.stringFromDate, 'DD/MM/YYYY').add(6, 'days').format('DD')
    };
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


  createOrderObj(variant) {
    return {
      order: {
        line_items_attributes: {
          0: {
            variant_id: variant,
            start_date: moment(this.stringFromDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            expiration_date: moment(this.stringToDate, 'DD/MM/YYYY').add(1, 'days').format('YYYY-MM-DD'),
            // addon_ids: [],
            quantity: 1,
            // display_expiration_date: moment(this.stringToDate, 'DD/MM/YYYY').format('DD/MM/YYYY'),
            insurance_info_attributes: {
              travel_destination: this.destination
            }
          },
        }
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
  }


  onDateRangeClick(event) {
    const isDay = event.target.parentElement.classList.contains('ngb-dp-day');
    const isDisabled = event.target.parentElement.classList.contains('disabled');
    if (isDay && isDisabled) {
      this.fromDate = null;
      this.toDate = null;
      this.maxDate = null;
    }
  }

  setDestination() {
    this.insuranceService.submitSunnyQuotation({
      start_date: moment(this.stringFromDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      end_date: moment(this.stringToDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      destination: this.destination
    }).subscribe(response => {
      this.price = response.price;
      this.checkoutReady = true;
    });
  }

  isNotValid() {
    if (!this.destination || !this.stringFromDate || !this.stringToDate) {
      return true;
    }
  }


}
