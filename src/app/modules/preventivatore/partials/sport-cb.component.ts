import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PreventivatoreComponent } from '../preventivatore/preventivatore.component';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Product, RequestOrder } from '@model';
import { AgeSelection } from '../age-selector/age-selector.model';
import { AgeSelectorHelper } from '../age-selector/age-selector.helper';
import { GtmService } from '../../../core/services/gtm/gtm.service';
import { CbGtmAction } from '../../../core/models/gtm/cb/cb-gtm-action.model';
import { ModalErrorComponent } from '../modal-error/modal-error.component';

@Component({
    selector: 'app-sport-cb',
    templateUrl: './sport-cb.component.html',
    styleUrls: ['../preventivatoreCB.component.scss'],
    standalone: false
})
export class SportCbComponent extends PreventivatoreComponent implements OnInit {

  @Input() product: any;
  @ViewChild('sportForm', { static: true }) private sportForm: NgForm;

  sport;
  agesUpdated = '';
  variants = [];
  addons = [];
  selectedElements = [];
  selectedVariant = null;
  price = 0;
  includedSection = false;
  sports: any = [];
  showAges = false;
  maxInsurableReached = false;
  agesList: AgeSelection[] = [];

  ngOnInit() {
    this.setSports(this.product.extras);
    this.setAddons(this.product.addons);
    this.variants = this.dataService.setVariantsCB();
    this.agesList = this.productsService
      .createAgesList(this.product.holder_minimum_age, this.product.holder_maximum_age);
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

  setSports(extras) {
    _.mapKeys(extras, (value, key) => {
      this.sports.push({ value: value, description: key });
      return key + value;
    });
  }

  toggleSelectionAddons(addon) {
    addon.selected = !addon.selected;
    this.calculatePrice();
  }

  calculatePrice() {
    if (this.sportForm.valid) {
      const variant = this.getVariant();
      const body = Object.assign({
        sport: this.sportForm.value['selectSport'],
        start_date: moment().add(1, 'days').format('YYYY-MM-DD'),
        duration: variant.duration,
        quantity: AgeSelectorHelper.sumAges(this.agesList),
        variant_id: this.product.master_variant,
        addons: this.addons.filter(a => a.selected).map(a => a.addon.code)
      }, AgeSelectorHelper.toOrderAttributes(this.agesList));
      if (this.sportForm.valid) {
        this.insuranceService.submitCbSportQuotation(body).subscribe(
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
    const variant = this.getVariant();
    const order = this.createOrderObj(variant);
    this.checkoutService.addToChart(<RequestOrder>order).subscribe(res => {
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

  createOrderObj(variant) {
    return {
      order: {
        order_attributes: AgeSelectorHelper.toOrderAttributes(this.agesList),
        line_items_attributes: {
          0: {
            insured_is_contractor: false,
            variant_id: this.product.master_variant,
            expiration_date: moment().add(variant.duration + 1, 'days').format('YYYY-MM-DD'),
            start_date: moment().add(1, 'days').format('YYYY-MM-DD'),
            quantity: AgeSelectorHelper.sumAges(this.agesList),
            addon_ids: this.addons.filter(a => a.selected).map(a => a.addon.id),
            insurance_info_attributes: {
              extra: this.sport
            }
          }
        }
      }
    };
  }

  setActiveVariant(variant) {
    this.variants = this.variants
      .map(v => v.id === variant.id ? { ...v, active: true } : { ...v, active: false });
    this.calculatePrice();
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
    const action = new CbGtmAction('sportEvent', 'click procedi acquisto', 'Protezione Sport ' + productType);
    service.reset();
    service.add(action);
    service.push();
  }
}
