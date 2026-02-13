import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PreventivatoreComponent } from '../preventivatore/preventivatore.component';
import * as moment from 'moment';
import { RequestOrder } from '@model';
import { AgeSelection } from '../age-selector/age-selector.model';
import { AgeSelectorHelper } from '../age-selector/age-selector.helper';
import { take } from 'rxjs/internal/operators/take';
import { DataService } from '@services';
import { ModalErrorComponent } from '../modal-error/modal-error.component';

@Component({
    selector: 'app-sci-cb',
    templateUrl: './sci-cb.component.html',
    styleUrls: ['../preventivatoreCB.component.scss'],
    standalone: false
})
export class SciCbComponent extends PreventivatoreComponent implements OnInit {

  @Input() product: any;
  currentDate = moment().year(new Date().getFullYear()).month(new Date().getMonth());
  startDateSeasonalPeriod = moment().year(new Date().getFullYear()).month(10).date(1);
  endDateSeasonalPeriod = moment().year(new Date().getFullYear()).month(4).date(1);
  startDateSeasonal: string;
  agesUpdated = '';
  variants = [];
  addons = [];
  selectedElements = [];
  selectedVariant = null;
  price = 0;
  includedSection = false;
  showAges = false;
  maxInsurableReached = false;
  agesList: AgeSelection[] = [];
  destinations: any = [];
  destination: string;
  setInfoSeasonal: DataService;
  @ViewChild('sciForm', { static: true }) private sciForm: NgForm;
  @ViewChild('setInfo') private setInfo: DataService;

  ngOnInit() {
    this.destinations = this.productsService.getTravelDestinationsName(this.product.travel_detinations);
    this.setAddons(this.product.addons);
    this.variants = !this.product.product_code.startsWith('ge-ski-seasonal') ? this.dataService.setVariantsCB() : [];
    this.agesList = this.productsService.createAgesList(this.product.holder_minimum_age, this.product.holder_maximum_age);
    if (this.currentDate > this.endDateSeasonalPeriod) {
      this.endDateSeasonalPeriod.add(1, 'year');
    } else if (this.currentDate < this.endDateSeasonalPeriod) {
      this.startDateSeasonalPeriod.subtract(1, 'year');
    }
  }

  setAddons(addons) {
    addons.forEach(addon => {
      const objAddon = {
        addon: addon,
        selected: false
      };
      this.addons.push(objAddon);
    });
  }

  toggleSelectionAddons(addon) {
    addon.selected = !addon.selected;
    this.calculatePrice();
  }

  calculatePrice() {
    if (this.sciForm.valid) {
      const body = Object.assign({
        variant_id: this.product.master_variant,
        start_date: moment().add(1, 'days').format('YYYY-MM-DD'),
        duration: this.setExpirationDate(),
        quantity: AgeSelectorHelper.sumAges(this.agesList),
        addons: this.addons.filter(a => a.selected).map(a => a.addon.code)
      }, AgeSelectorHelper.toOrderAttributes(this.agesList));
      if (this.product.product_code.startsWith('ge-ski-seasonal')) {
        this.insuranceService.submitCbSkiSeasonalQuotation(body).pipe(take(1)).subscribe(
          res => {
            this.price = res.total;
          });
      } else {
        this.insuranceService.submitCbSkiQuotation(body).pipe(take(1)).subscribe(
          res => {
            this.price = res.total;
          });
      }
    }
  }

  getVariant() {
    return this.variants.find(v => v.active);
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

  onAgeSelectionUpdate(event: AgeSelection): void {
    this.agesList = this.agesList.map(item => item.id === event.id ? event : item);
    this.updateQuantity();
    this.calculatePrice();
  }

  checkoutCb() {
    if (this.authService.loggedUser.email === this.getEmailProv()) {
      this.modalService.open(ModalErrorComponent, { size: 'lg' });
      return;
    }
    const order = this.createOrderObj();
    this.checkoutService.addToChart(<RequestOrder>order).pipe(take(1)).subscribe(res => {
      this.dataService.setOrderAttributes(order.order.order_attributes);
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

  setStartDateSeasonal() {
    if ((this.currentDate) > (this.startDateSeasonalPeriod)) {
      const now = moment();
      const tomorrow = moment().add(1, 'days').startOf('day');
      this.startDateSeasonal = moment().add(tomorrow.diff(now, 'seconds', true), 'seconds').format('YYYY-MM-DD');
    }
  }

  startDate() {
    this.setStartDateSeasonal();
    if (this.product.product_code.startsWith('ge-ski-seasonal')) {
      return this.startDateSeasonalPeriod.toDate();
    } else {
      return moment().add(1, 'days').format('YYYY-MM-DD');
    }
  }


  createOrderObj() {
    return {
      order: {
        order_attributes: AgeSelectorHelper.toOrderAttributes(this.agesList),
        line_items_attributes: {
          0: {
            variant_id: this.product.master_variant,
            expiration_date: moment().add(this.setExpirationDate() + 1, 'days').format('YYYY-MM-DD'),
            start_date: this.startDate(),
            quantity: AgeSelectorHelper.sumAges(this.agesList),
            addon_ids: this.addons.filter(a => a.selected).map(a => a.addon.id),
            instant: false,
            insurance_info_attributes: {
              travel_destination: this.destination,
            }
          }
        }
      }
    };
  }

  setExpirationDate() {

    return this.variants.length ? this.getVariant().duration : 40;
  }

  setActiveVariant(variant) {
    this.variants = this.variants
      .map(v => v.id === variant.id ? { ...v, active: true } : { ...v, active: false });
    this.calculatePrice();
  }

}
