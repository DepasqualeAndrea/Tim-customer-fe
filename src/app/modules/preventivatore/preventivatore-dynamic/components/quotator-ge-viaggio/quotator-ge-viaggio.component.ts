import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Product, RequestOrder } from '@model';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';
import { AgeSelection, DEFAULT_AGE_SELECTIONS } from 'app/modules/preventivatore/age-selector/age-selector.model';
import { AuthService, CheckoutService, DataService, InsurancesService, ProductsService, UserService } from '@services';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDatepicker, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { AgeSelectorHelper } from 'app/modules/preventivatore/age-selector/age-selector.helper';
import { CbGtmAction } from 'app/core/models/gtm/cb/cb-gtm-action.model';
import { GtmService } from 'app/core/services/gtm/gtm.service';
import { EventEmitter } from 'stream';
import { NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-quotator-ge-viaggio',
  templateUrl: './quotator-ge-viaggio.component.html',
  styleUrls: ['./quotator-ge-viaggio.component.scss']
})
export class QuotatorGeViaggioComponent extends PreventivatoreAbstractComponent implements OnInit {
  constructor(
    public insuranceService: InsurancesService,
    public dataService: DataService,
    public checkoutService: CheckoutService,
    public router: Router,
    public calendar: NgbCalendar,
    public productsService: ProductsService,
    public authService: AuthService,
    public modalService: NgbModal,
    public componentFeaturesService: ComponentFeaturesService,
    public userService: UserService,
    protected nypUserService: NypUserService,
    ref: ChangeDetectorRef
  ) {
    super(ref);
  }
  @Input() product: any;
  peopleQuantity = 1;
  showAges = false;
  agesUpdated = '';
  price = 0;
  addons = [];
  variants = [];
  dropdownSettings: any = {};

  hoveredDate: NgbDateStruct;
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  dateRange: any;
  stringToDate: string;
  stringFromDate: string;
  datepicker;
  singleDatePicker;
  openPicker = false;
  duration: number;
  nazione: any;
  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  tomorrow: NgbDateStruct;
  today: NgbDateStruct;
  endDate: NgbDateStruct;
  maxInsurableReached = false;
  storedViaggioInfo: any = {}
  filteredCountries = [];
  selectedCountries = [];
  elementRef;
  storedInfo: any = {};

  country;
  countries;

  tripFormCb: FormGroup;
  currentField: 'toDate' | 'fromDate';

  agesList: AgeSelection[] = Object.assign([], DEFAULT_AGE_SELECTIONS);

  equals = (one: NgbDateStruct, two: NgbDateStruct) =>
    one && two && two.year === one.year && two.month === one.month && two.day === one.day

  before = (one: NgbDateStruct, two: NgbDateStruct) =>
    !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
      ? false : one.day < two.day : one.month < two.month : one.year < two.year

  after = (one: NgbDateStruct, two: NgbDateStruct) =>
    !one || !two ? false : one.year === two.year ? one.month === two.month ? one.day === two.day
      ? false : one.day > two.day : one.month > two.month : one.year > two.year

  ngOnInit() {
    this.dataService.countriesEndpoint = '/genertel/travel/countries';
    this.tomorrow = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
    this.today = this.calendar.getToday();
    this.minDate = this.today;
    this.getCountriesCb();
    this.setVariants(this.product.variants);
    this.setAddons(this.product.addons);
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
    };
    this.getAllStoredData()
    if (this.getAllStoredData()) {
      this.updateQuantity();
      this.calculatePrice();
    }
    ;
    this.timeComparison();
  }
  saveDataInfoProtezioneViaggio() {
    const dataInfo = {
      fromDate: this.stringFromDate,
      toDate: this.stringToDate,
      people: this.agesList,
      price: this.price,
      savedCountry: this.country
    }
    try {
      sessionStorage.setItem('dataInfoProtezioneViaggio', JSON.stringify(dataInfo))
      window.dispatchEvent(new CustomEvent('savedDataInfoProtezioneViaggio'));
    } catch {
      sessionStorage.removeItem('dataInfoProtezioneViaggio');
      window.dispatchEvent(new CustomEvent('savedDataInfoProtezioneViaggio'));
    }
  }
  getAllStoredData() {
    let savedDataInfoProtezioneViaggio = sessionStorage.getItem('dataInfoProtezioneViaggio');
    if (savedDataInfoProtezioneViaggio) {
      this.storedInfo = JSON.parse(savedDataInfoProtezioneViaggio);
      this.stringFromDate = this.storedInfo.fromDate;
      this.stringToDate = this.storedInfo.toDate;
      this.price = this.storedInfo.price;
      this.agesList = this.storedInfo.people
      this.country = this.storedInfo.savedCountry;
      return true
    } else {
      this.storedInfo = {
        destination: '',
        fromDate: '',
        toDate: '',
        people: 1,
        price: 0, updatedAgeList: ''
      }
      return false
    }
  }
  setAddons(addons) {
    addons.forEach(addon => {
      const objAddon = {
        addon: addon,
        selected: false,
        checkIstant: false
      };
      this.addons.push(objAddon);
    });
  }

  setVariants(variants) {
    _.each(variants, (variant) => {
      _.each(variant.option_values, (option) => {
        this.variants.push({
          'id': variant.id,
          'name': option.presentation,
          'price': variant.price,
          'active': false
        });
      });
    });
  }


  onAgeSelectionUpdate(event: AgeSelection): void {
    this.agesList = this.agesList.map(item => item.id === event.id ? event : item);
    this.updateQuantity();
    if (event.quantity) {
      this.calculatePrice();
    }
  }

  getCountriesCb() {
    this.nypUserService.getCountries(this.dataService.countriesEndpoint).subscribe(
      countries => {
        this.dataService.setCountries(countries);
        const list = countries;
        this.countries = list.sort((a, b) => (a.name > b.name) ? 1 : -1);
      });
  }

  applyAge() {
    this.calculatePrice();
    this.showAges = !this.showAges;
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
    this.minDate = this.today;
  }

  singleDateSelection(date: NgbDateStruct) {
    if (this.currentField === 'fromDate') {
      this.fromDate = date;
      this.stringFromDate = this.fromDate.day + '/' + this.fromDate.month + '/' + this.fromDate.year;
      this.setMinDate();
      this.setMaxDate();
      this.checkAddonIstant(this.fromDate);
    }
    if (this.currentField === 'toDate') {
      this.toDate = date;
      this.stringToDate = this.toDate.day + '/' + this.toDate.month + '/' + this.toDate.year;
    }
    this.toggleDatePicker();
    this.calculatePrice();
  }

  // Range date selection - will be unused due to a CR, kept for reference
  onDateSelection(date: NgbDateStruct) {
    if (!this.fromDate || this.fromDate && this.toDate) {
      this.fromDate = date;
      this.stringFromDate = this.fromDate.day + '/' + this.fromDate.month + '/' + this.fromDate.year;
      this.setMaxDate();
      this.toDate = null;
      this.checkAddonIstant(this.fromDate);
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
    this.calculatePrice();
  }

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

  selectCountry() {
    this.saveDataInfoProtezioneViaggio();
    this.calculatePrice();
  }

  updateQuantity() {
    this.agesUpdated = this.agesList.reduce((acc, cur) => cur.quantity
      ? `${acc} ${cur.quantity} ${cur.descriptionLabel}`
      : acc
      , '');
  }

  calculatePrice() {
    const sumAges = AgeSelectorHelper.sumAges(this.agesList);
    if ((this.fromDate && this.toDate) && this.country && sumAges > 0) {
      const duration = moment(this.stringToDate, 'DD/MM/YYYY').diff(moment(this.stringFromDate, 'DD/MM/YYYY'), 'days') + 1;
      const order_attributes = AgeSelectorHelper.toOrderAttributes(this.agesList);
      const body = Object.assign({
        variant_id: this.product.master_variant,
        start_date: moment(this.stringFromDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        duration,
        destination_id: this.country.id,
        quantity: AgeSelectorHelper.sumAges(this.agesList),
        addons: this.addons.filter(a => a.selected).map(a => a.addon.code),
      }, order_attributes);
      this.insuranceService.submitViaggiQuotation(body).subscribe((res) => {
        this.price = res.total;
      });
      this.saveDataInfoProtezioneViaggio();
    }
  }

  getActiveVariant() {
    return this.variants.find(v => v.active);
  }

  toggleAgeSelection() {
    this.showAges = !this.showAges;
  }

  toggleSelectionAddons(addon) {
    addon.selected = !addon.selected;
    this.calculatePrice();
  }

  checkout() {
    if (this.timeComparison()) {
      const startToday = moment(this.stringFromDate, 'DD/MM/YYYY').format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');
      const insurance_info_attributes = {
        destination_id: this.country.id
      };
      const line_items_attributes = {
        '0': {
          variant_id: this.product.master_variant,
          expiration_date: moment(this.stringToDate, 'DD/MM/YYYY').add(1, 'days').format('YYYY-MM-DD'),
          start_date: moment(this.stringFromDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
          quantity: AgeSelectorHelper.sumAges(this.agesList),
          instant: startToday,
          addon_ids: this.addons.filter(a => a.selected).map(a => a.addon.id),
          insurance_info_attributes
        }
      };
      const order_attributes = AgeSelectorHelper.toOrderAttributes(this.agesList);
      const order = { order: { line_items_attributes, order_attributes } };
      this.checkoutService.addToChart(<RequestOrder>order).subscribe(res => {
        this.dataService.setOrderAttributes(order_attributes);
        this.dataService.setResponseOrder(res);
        this.dataService.setProduct(this.product);
        return this.router.navigate(['checkout']);
      });
    } else {
      this.resetPicker();
    }
  }

  timeComparison() {
    let currentD = new Date();
    let startOfDay = new Date();
    startOfDay.setHours(0, 0, 0);
    let endOfDay = new Date();
    endOfDay.setHours(23, 45, 0);
    if (currentD > startOfDay && currentD < endOfDay) {
      return true
    } else {
      this.today = this.tomorrow
      return false
    }
  }

  resetDataPicker() {
    this.fromDate = null;
    this.toDate = null;
    this.maxDate = this.calendar.getNext(this.calendar.getToday(), 'd', 365);
  }

  checkAddonIstant(date) {
    const addonProv = this.addons.find(a => a.addon.code === 'genertel_travel_flight');
    if (addonProv) {
      if (date.equals(this.today)) {
        addonProv.checkIstant = true;
        addonProv.selected = false;
      } else {
        addonProv.checkIstant = false;
      }
    }
  }

  private getGtmProductType(): string {
    if ((this.product as Product).product_code.includes('premium')) {
      return 'Premium';
    } else if ((this.product as Product).product_code.includes('plus')) {
      return 'Plus';
    }

    return '';
  }

  handleGtm(service: GtmService) {
    const productType: string = this.getGtmProductType();
    const action = new CbGtmAction('travelEvent', 'click procedi acquisto', 'Protezione Viaggio ' + productType);
    service.reset();
    service.add(action);
    service.push();
  } private getNextYear(): NgbDateStruct {
    return this.calendar.getNext(this.calendar.getToday(), 'd', 365);
  }
}
