import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PreventivatoreComponent } from '../preventivatore/preventivatore.component';
import * as moment from 'moment';
import { LineItemsAttributes, OrderAttributes, RequestOrder } from '@model';
import { AgeSelection, DEFAULT_AGE_SELECTIONS } from '../age-selector/age-selector.model';
import { take } from 'rxjs/operators';
import { ModalErrorComponent } from '../modal-error/modal-error.component';

@Component({
    selector: 'app-holidayhome-cb',
    templateUrl: './holidayhome-cb.component.html',
    styleUrls: ['../preventivatoreCB.component.scss'],
    standalone: false
})
export class HolidayHomeComponent extends PreventivatoreComponent implements OnInit {

  @Input() product: any;
  @ViewChild('holidayForm', { static: true }) private holidayForm: NgForm;

  agesUpdated = '';
  variants = [];
  addons = [];
  selectedElements = [];
  selectedVariant = null;
  price = 0;
  includedSection = false;
  showAges = false;
  maxInsurableReached = false;
  holidayDestinations = [];
  destination;
  agesList: AgeSelection[] = [];

  ngOnInit() {
    this.setAddons(this.product.addons);
    this.setVariants();
    this.getHolidayDestinations();
    this.agesList = this.productsService
      .createAgesList(this.product.holder_minimum_age, this.product.holder_maximum_age);
  }

  setAddons(addons) {
    addons.map(addon => {
      const objAddon = {
        addon: addon,
        selected: false
      };
      this.addons.push(objAddon);
    });
  }

  setVariants() {
    this.variants = this.dataService.setVariantsCB();
  }

  setPackage(variant) {
    this.variants = this.variants.map(v => v.name === variant.name
      ? { ...v, active: true }
      : { ...v, active: false });
    this.calculatePrice();
  }

  toggleSelectionAddons(addon) {
    addon.selected = !addon.selected;
    this.calculatePrice();
  }

  setDestination(destination) {
    this.product.destination = destination;
    this.calculatePrice();
  }

  calculatePrice() {
    const body = Object.assign({
      variant_id: this.product.master_variant,
      start_date: moment().add(1, 'days').format('YYYY-MM-DD'),
      duration: this.getVariantDuration(),
      quantity: this.sumAges(),
      addons: this.addons.filter(a => a.selected).map(a => a.addon.code),
    }, this.computeOrderAttributes());
    if (this.holidayForm.valid) {
      this.insuranceService.submitCbHolidayHouseQuotation(body).subscribe((res) => {
        this.price = res.total;
      });
    }
  }

  getVariantDuration() {
    return this.variants.find(v => v.active).duration;
  }

  getHolidayDestinations() {
    this.insuranceService.getCbHolidayHouseCountries().subscribe(
      response => this.holidayDestinations = response);
  }

  findAges(label) {
    return this.agesList.find(s => s.id === label);
  }

  sumAges() {
    return this.agesList.reduce((acc, cur) => acc + cur.quantity, 0);
  }

  toggleAgeSelection() {
    this.showAges = !this.showAges;
  }

  updateQuantity() {
    this.agesUpdated = this.agesList.reduce((acc, cur) => cur.quantity
      ? `${acc} ${cur.quantity} ${cur.descriptionLabel}`
      : acc
      , '');
  }

  checkout(holidayForm: NgForm) {
    if (this.authService.loggedUser.email === this.getEmailProv()) {
      this.modalService.open(ModalErrorComponent, { size: 'lg' });
      return;
    }
    const tomorrow = moment().add(1, 'days');
    const line_items_attributes = {
      '0': {
        variant_id: this.product.master_variant,
        start_date: tomorrow.format('YYYY-MM-DD'),
        expiration_date: moment(tomorrow).add(this.getVariantDuration(), 'days').format('YYYY-MM-DD'),
        quantity: this.sumAges(),
        instant: false,
        destination: this.destination.id,
        addon_ids: this.addons.filter(a => a.selected).map(a => a.addon.id),
        insurance_info_attributes: {
          destination_id: this.destination.id
        }
      }
    } as LineItemsAttributes;
    const order_attributes: OrderAttributes = this.computeOrderAttributes();
    const order = { order: { line_items_attributes, order_attributes } };
    this.checkoutService.addToChart(<RequestOrder>order).pipe(take(1)).subscribe(res => {
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

  onAgeSelectionUpdate(event: AgeSelection): void {
    this.agesList = this.agesList.map(item => item.id === event.id ? event : item);
    this.updateQuantity();
  }

  computeOrderAttributes(): OrderAttributes {
    return {
      number_of_insureds_25: this.findAges('number_of_insureds_25').quantity,
      number_of_insureds_50: this.findAges('number_of_insureds_50').quantity,
      number_of_insureds_60: this.findAges('number_of_insureds_60').quantity,
      number_of_insureds_65: this.findAges('number_of_insureds_65').quantity
    };
  }


}
