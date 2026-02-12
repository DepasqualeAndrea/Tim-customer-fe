import { AgeSelectorHelper } from './../age-selector/age-selector.helper';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PreventivatoreComponent } from '../preventivatore/preventivatore.component';
import * as moment from 'moment';
import { OrderAttributes, Product, RequestOrder } from '@model';
import { AgeSelection } from '../age-selector/age-selector.model';
import { GtmService } from '../../../core/services/gtm/gtm.service';
import { CbGtmAction } from '../../../core/models/gtm/cb/cb-gtm-action.model';
import { ModalErrorComponent } from '../modal-error/modal-error.component';

@Component({
  selector: 'app-bike-cb',
  templateUrl: './bike-cb.component.html',
  styleUrls: ['../preventivatoreCB.component.scss']
})
export class BikeCbComponent extends PreventivatoreComponent implements OnInit {

  @Input() product: any;
  @ViewChild('bikeForm', { static: true }) private bikeForm: NgForm;

  sport;
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

  ngOnInit() {
    this.setAddons(this.product.addons);
    this.setVariants();
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

  calculatePrice() {
    const body = Object.assign({
      variant_id: this.product.master_variant,
      start_date: moment().add(1, 'days').format('YYYY-MM-DD'),
      duration: this.getVariant(),
      quantity: AgeSelectorHelper.sumAges(this.agesList),
      addons: this.addons.filter(a => a.selected).map(a => a.addon.code),
    }, AgeSelectorHelper.toOrderAttributes(this.agesList));
    if (this.bikeForm.valid) {
      this.insuranceService.submitBikeCbQuotation(body).subscribe((res) => {
        this.price = res.total;
      });
    }
  }

  getVariant() {
    return this.variants.find(v => v.active).duration;
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

  checkout(bikeForm: NgForm) {
    if (this.authService.loggedUser.email === this.getEmailProv()) {
      this.modalService.open(ModalErrorComponent, { size: 'lg' });
      return;
    }
    const tomorrow = moment().add(1, 'days');
    const line_items_attributes = {
      '0': {
        variant_id: this.product.master_variant,
        expiration_date: moment(tomorrow).add(this.getVariant(), 'days').format('YYYY-MM-DD'),
        start_date: tomorrow.format('YYYY-MM-DD'),
        quantity: AgeSelectorHelper.sumAges(this.agesList),
        instant: true,
        addon_ids: this.addons.filter(a => a.selected).map(a => a.addon.id),
      }
    };
    const order_attributes: OrderAttributes = AgeSelectorHelper.toOrderAttributes(this.agesList);
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

  onAgeSelectionUpdate(event: AgeSelection): void {
    this.agesList = this.agesList.map(item => item.id === event.id ? event : item);
    this.updateQuantity();
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
    const action = new CbGtmAction('bikeEvent', 'click procedi acquisto', 'Protezione Bike ' + productType);
    service.reset();
    service.add(action);
    service.push();
  }
}
