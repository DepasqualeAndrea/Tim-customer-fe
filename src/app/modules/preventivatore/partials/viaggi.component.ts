import {Component, Input, OnInit} from '@angular/core';
import {PreventivatoreComponent} from '../preventivatore/preventivatore.component';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {UntypedFormGroup, NgForm} from '@angular/forms';
import * as _ from 'lodash';

@Component({
    selector: 'app-viaggi',
    templateUrl: './viaggi.component.html',
    styleUrls: ['../preventivatoreY.component.scss'],
    standalone: false
})
export class ViaggiComponent extends PreventivatoreComponent implements OnInit {

  @Input() product: any;
  peopleQuantity = 1;
  areas;
  price = 0;

  dropdownSettings: any = {};

  hoveredDate: NgbDateStruct;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  dateRange: any;
  stringToDate: string;
  stringFromDate: string;
  datepicker;
  openPicker = false;
  duration: number;
  nazione: any;
  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  tomorrow: NgbDateStruct;
  currentField: 'toDate' | 'fromDate';

  filteredCountries = [];
  selectedCountries = [];
  elementRef;
  area;

  variantChoise: any;

  tripForm: UntypedFormGroup;

  equals = (one: NgbDateStruct, two: NgbDateStruct) =>
    one && two && two.year === one.year && two.month === one.month && two.day === one.day;

  before = (one: NgbDateStruct, two: NgbDateStruct) =>
    !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
      ? false : one.day < two.day : one.month < two.month : one.year < two.year;

  after = (one: NgbDateStruct, two: NgbDateStruct) =>
    !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
      ? false : one.day > two.day : one.month > two.month : one.year > two.year;


  ngOnInit() {
    this.tomorrow = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
    this.minDate = this.tomorrow;
    this.getArea();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
    };
  }

  onItemSelect(item: any) {
    // console.log('onItemSelect', item);
  }

  onSelectAll(items: any) {
    // console.log('onSelectAll', items);
  }

  getArea() {
    this.userService.getAreas().subscribe(
      data => {
        this.areas = data.areas;
      });
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

  public toggleDatePicker(currentField?: 'toDate' | 'fromDate') {
    this.currentField = currentField;
    this.openPicker = !this.openPicker;
    if (this.currentField === 'fromDate') {
      this.resetPicker();
    }
  }

  public resetPicker(): void {
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
    // compare dates
    if (from && to && (from > to)) {
      this.toDate = [this.fromDate, this.fromDate = this.toDate][0];
      this.stringFromDate = this.fromDate.day + '/' + this.fromDate.month + '/' + this.fromDate.year;
      this.stringToDate = this.toDate.day + '/' + this.toDate.month + '/' + this.toDate.year;
    }
    this.setPrice();
  }

  isHovered = date => this.fromDate && !this.toDate && this.hoveredDate && this.after(date, this.fromDate) && this.before(date, this.hoveredDate);
  isInside = date => this.after(date, this.fromDate) && this.before(date, this.toDate);
  isFrom = date => this.equals(date, this.fromDate);
  isTo = date => this.equals(date, this.toDate);

  public setMaxDate() {
    this.stringFromDate = this.fromDate.day + '/' + this.fromDate.month + '/' + this.fromDate.year;
    this.maxDate = {
      year: +moment(this.stringFromDate, 'DD/MM/YYYY').add(29, 'days').format('YYYY'),
      month: +moment(this.stringFromDate, 'DD/MM/YYYY').add(29, 'days').format('MM'),
      day: +moment(this.stringFromDate, 'DD/MM/YYYY').add(29, 'days').format('DD')
    };
  }

  public setMinDate() {
    this.minDate = {
      year: +moment(this.stringFromDate, 'DD/MM/YYYY').format('YYYY'),
      month: +moment(this.stringFromDate, 'DD/MM/YYYY').format('MM'),
      day: +moment(this.stringFromDate, 'DD/MM/YYYY').format('DD')
    };
  }

  selectCountry() {
    this.setPrice();
  }

  setPrice() {
    if (this.area && this.stringFromDate && this.stringToDate) {
      const durationRange = moment(this.stringToDate, 'DD/MM/YYYY').diff(moment(this.stringFromDate, 'DD/MM/YYYY'), 'days') + 1;
      this.product.variants.some((variant) => {
        if (variant.option_values[1]['name'] === this.area.area && variant.option_values[0].duration >= durationRange || variant.option_values[0]['name'] === this.area.area && variant.option_values[1].duration >= durationRange) {
          this.variantChoise = variant;
          this.price = variant.price * this.peopleQuantity;
          return true;
        }
        return false;
      });
    }
  }

  public createOrder() {
    return {
      order: {
        line_items_attributes: {
          0: {
            variant_id: this.variantChoise.id,
            quantity: this.peopleQuantity,
            start_date: moment(this.stringFromDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            expiration_date: moment(this.stringToDate, 'DD/MM/YYYY').add(1, 'days').format('YYYY-MM-DD'),
            insured_is_contractor: true,
            display_expiration_date: moment(this.stringToDate, 'DD/MM/YYYY').format('DD/MM/YYYY'),
            insurance_info_attributes: {
              axa_destination: this.area.country_id
            }
          },
        },
      }
    };
  }

  checkout(tripForm: NgForm): Promise<any> | void {
    const order = this.createOrder();
    this.checkoutService.addToChart(order).subscribe((res) => {
      this.dataService.setResponseOrder(res);
      this.dataService.setProduct(this.product);
      return this.router.navigate(['apertura']);
    });
  }

  public getNextYear(): NgbDateStruct {
    return this.calendar.getNext(this.calendar.getToday(), 'd', 365);
  }
}
