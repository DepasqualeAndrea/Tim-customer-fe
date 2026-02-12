import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {take} from 'rxjs/operators';
import {NgForm} from '@angular/forms';
import {Addons, Country, RequestOrder} from '@model';
import {NgbCalendar, NgbDate, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {CheckoutService, DataService, InsurancesService} from '@services';
import {Router} from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-quotator-travel-pack',
  templateUrl: './quotator-travel-pack.component.html',
  styleUrls: ['./quotator-travel-pack.component.scss', '../preventivatoreY.component.scss']
})
export class QuotatorTravelPackComponent implements OnInit {

  @Input() product;
  destinations: Country[];
  startTrip: NgbDateStruct;
  endTrip: NgbDateStruct;
  calendarMaxDate: NgbDateStruct;
  calendarMinDate: NgbDateStruct;
  minEndTripDate: NgbDateStruct;
  peopleQuantity = 1;
  selectedAddons = [];
  price = 0;
  destination;
  @ViewChild('tripForm', { static: true }) private tripForm: NgForm;

  constructor(
    private calendar: NgbCalendar,
    private insuranceService: InsurancesService,
    public dataService: DataService,
    private checkoutService: CheckoutService,
    private router: Router) {
  }

  ngOnInit() {
    this.setDestinations();
    this.calendarMinDate = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
    this.minEndTripDate = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
    this.calendarMaxDate = this.calendar.getNext(this.calendar.getToday(), 'd', 59);
  }

  setDestinations() {
    if (this.dataService.tenantInfo.tenant === 'net-ins-it-it_db') {
      this.destinations =
        [
          {id: this.product.travel_detinations.europe, name: 'Europa (Italia compresa)', iso_name: 'europe', iso: 'europe'},
          {id: this.product.travel_detinations.world_without_usa_canada, name: 'Mondo intero (esclusi USA e Canada)', iso_name: 'worldnousaca', iso: 'world_without_usa_canada'},
          {id: this.product.travel_detinations.world, name: 'Mondo intero', iso_name: 'world', iso: 'world'},
        ];
    } else {
      this.insuranceService.getTravelPackDestinations().pipe(take(1)).subscribe(res => this.destinations = res);
    }
  }

  updateEndDate(selectedStartDate: NgbDate) {
    if (this.tripForm.controls.endTrip.value) {
      this.tripForm.controls.endTrip.setValue(null);
    }
    this.calendarMaxDate = this.calendar.getNext(selectedStartDate, 'd', 59);
    this.minEndTripDate = this.calendar.getNext(selectedStartDate, 'd', 0);
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

  onAddonSelection(addon: Addons) {
    this.selectedAddons.includes(addon.code) ? this.selectedAddons.splice(this.selectedAddons.indexOf(addon.code), 1) : this.selectedAddons.push(addon.code);
    this.calculatePrice();
  }

  getVariantPresentation(variantSku: string) {
    return this.product.variants.find(v => v.sku === variantSku).option_values[0].presentation;
  }

  formatDate(date: NgbDateStruct) {
    const formatDate = new Date(Date.UTC(date.year, date.month - 1, date.day - 1, 24, 0, 0));
    return formatDate.toISOString();
  }

  getSelectedAddonsId() {
    let addonIdList = [];
    this.product.addons.map(ad => {
      if (this.selectedAddons.includes(ad.code)) {
        addonIdList = [...addonIdList, ad.id];
      }
    });
    return addonIdList;
  }

  getVariantId(variantSku) {
    return this.product.variants.find(variant => variant.sku === variantSku).id;

  }

  createBodyYolo() {
    return Object.assign({
      tenant: 'yolo',
      product_code: this.product.product_code.toLowerCase(),
      product_data: {
        resource_id: this.product.id,
        start_date: this.formatDate(this.tripForm.controls.startTrip.value),
        expiration_date: this.formatDate(this.calendar.getNext(this.tripForm.controls.endTrip.value, 'd', 1)),
        quantity: this.peopleQuantity,
        variant_sku: this.tripForm.controls.maximal.value,
        variant_presentation: this.getVariantPresentation(this.tripForm.controls.maximal.value),
        addon_ids: this.selectedAddons
      }
    });
  }

  createBodyNet() {
    const startDate = this.tripForm.controls.startTrip.value;
    const endDate = this.tripForm.controls.endTrip.value;

    const endDateForBE = this.calendar.getNext(endDate, 'd', 1);

    return Object.assign({
      tenant: 'net-insurance',
      product_code: this.product.product_code,
      product_data: {
        variant_sku: this.tripForm.controls.maximal.value,
        addon_ids: this.selectedAddons,
        quantity: this.peopleQuantity,
        destination: this.tripForm.controls.destination.value.iso_name,
        start_date: `${startDate.day}-${startDate.month}-${startDate.year}`,
        expiration_date: `${endDateForBE.day}-${endDateForBE.month}-${endDateForBE.year}`,
      }
    });
  }

  calculatePrice() {
    if (this.tripForm.valid) {
      const body = this.dataService.isTenant('net') ? this.createBodyNet() : this.createBodyYolo();
      this.insuranceService.submitNetInsuranceQuotation(body).pipe(take(1)).subscribe(res => this.price = res.total);
    }
  }

  checkout() {
    const startDate = this.tripForm.controls.startTrip.value;
    const endDate = this.tripForm.controls.endTrip.value;
    const endDateForBE = this.calendar.getNext(endDate, 'd', 1);
    const jsDate: Date = new Date(endDate.year, endDate.month - 1, endDate.day);
    const date = moment(jsDate);
    const travelDestination = this.dataService.tenantInfo.tenant === 'net-ins-it-it_db' ? {travel_destination: this.tripForm.controls.destination.value.iso} : {destination_id: this.tripForm.controls.destination.value.id};
    const line_items_attributes = {
      '0': {
        variant_id: this.getVariantId(this.tripForm.controls.maximal.value),
        start_date: `${startDate.day}-${startDate.month}-${startDate.year}`,
        expiration_date: `${endDateForBE.day}-${endDateForBE.month}-${endDateForBE.year}`,
        quantity: this.peopleQuantity,
        instant: true,
        display_expiration_date: date.subtract(1, 'seconds').format('DD-MM-YYYY'),
        insurance_info_attributes: travelDestination,
        addon_ids: this.getSelectedAddonsId()
      }
    };
    const order = {order: {line_items_attributes}};
    this.checkoutService.addToChart(<RequestOrder>order).subscribe(res => {
      this.dataService.setResponseOrder(res);
      this.dataService.setProduct(this.product);
      return this.router.navigate(['apertura']);
    });
  }


}
