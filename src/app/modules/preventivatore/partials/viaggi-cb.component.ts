import { Component, Input, OnInit } from '@angular/core';
import { NgbCalendar, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { ViaggiComponent } from './viaggi.component';
import { Product, RequestOrder } from '@model';
import { AgeSelection, DEFAULT_AGE_SELECTIONS } from '../age-selector/age-selector.model';
import { AgeSelectorHelper } from '../age-selector/age-selector.helper';
import { GtmService } from '../../../core/services/gtm/gtm.service';
import { CbGtmAction } from '../../../core/models/gtm/cb/cb-gtm-action.model';
import { ModalErrorComponent } from '../modal-error/modal-error.component';
import { NypUserService } from '@NYP/ngx-multitenant-core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService, UserService, AuthService, InsurancesService, CheckoutService, ProductsService } from '@services';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-viaggi-cb',
  templateUrl: './viaggi-cb.component.html',
  styleUrls: ['../preventivatoreCB.component.scss']
})
export class ViaggiCbComponent extends ViaggiComponent implements OnInit {
  constructor(public dataService: DataService,
    public router: Router,
    public userService: UserService,
    public authService: AuthService,
    public route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public calendar: NgbCalendar,
    public toastr: ToastrService,
    public insuranceService: InsurancesService,
    public checkoutService: CheckoutService,
    public productsService: ProductsService,
    public kenticoTranslateService: KenticoTranslateService,
    public componentFeaturesService: ComponentFeaturesService,
    public modalService: NgbModal,
    protected nypUserService: NypUserService
  ) {
    super(dataService,
      router,
      userService,
      authService,
      route,
      formBuilder,
      calendar,
      toastr,
      insuranceService,
      checkoutService,
      productsService,
      kenticoTranslateService,
      componentFeaturesService,
      modalService)
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

  filteredCountries = [];
  selectedCountries = [];
  elementRef;

  country;
  countries;

  tripFormCb: FormGroup;

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
    this.maxDate = this.getNextYear();
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

  onItemSelect(item: any) {
    // console.log('onItemSelect', item);
  }

  onSelectAll(items: any) {
    // console.log('onSelectAll', items);
  }

  onAgeSelectionUpdate(event: AgeSelection): void {
    this.agesList = this.agesList.map(item => item.id === event.id ? event : item);
    this.updateQuantityCb();
    this.calculatePrice();
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

  resetPicker(): void {
    this.datepicker = null;
    this.fromDate = null;
    this.stringFromDate = '';
    this.toDate = null;
    this.stringToDate = '';
    this.maxDate = this.getNextYear();
    this.minDate = this.today;
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
    // compare dates
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

  selectCountry() {
    this.calculatePrice();
  }

  updateQuantityCb() {
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
    if (this.authService.loggedUser.email === this.getEmailProv()) {
      this.modalService.open(ModalErrorComponent, { size: 'lg' });
      return;
    }
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
      return this.router.navigate(['apertura']);
    });
  }

  getEmailProv() {
    this.componentFeaturesService.useComponent('address-form-cse');
    this.componentFeaturesService.useRule('email-prov');
    return this.componentFeaturesService.getConstraints().get('email');
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
  }
}
