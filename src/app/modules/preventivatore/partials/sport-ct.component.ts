import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {PreventivatoreComponent} from '../preventivatore/preventivatore.component';
import {RequestCheckout, RequestOrder} from '../../../core/models/order.model';
import * as _ from 'lodash';
import { PreventivatoreConstants } from '../PreventivatoreConstants';
import { finalize } from 'rxjs/operators';
import {ExternalPlatformRequestOrder} from '../../../core/models/externalCheckout/external-platform-request-order.model';

@Component({
    selector: 'app-sport-ct',
    templateUrl: './sport-ct.component.html',
    styleUrls: ['../preventivatoreCT.component.scss'],
    standalone: false
})
export class SportCtComponent extends PreventivatoreComponent implements OnInit {

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
  agesList = [
    {
      description: 'Età 4-24',
      number: 0,
      bodyProp: 'number_of_insureds_25',
      descriptionLabel: '(4-24)'
    },
    {
      description: 'Età 25-49',
      number: 0,
      bodyProp: 'number_of_insureds_50',
      descriptionLabel: '(25-49)'
    },
    {
      description: 'Età 50-59',
      number: 0,
      bodyProp: 'number_of_insureds_60',
      descriptionLabel: '(50-59)'
    },
    {
      description: 'Età 60-65',
      number: 0,
      bodyProp: 'number_of_insureds_65',
      descriptionLabel: '(60-65)'
    }];

  ngOnInit() {
    this.setSports(this.product.extras);
    this.setAddons(this.product.addons);
    this.setVariants(this.product.variants);
    this.setPackage(this.variants[0]);
    this.sportForm.form.valueChanges.subscribe((res) => {
      this.calculatePrice();
    });
    this.utm_source_prev = this.route.snapshot.queryParamMap.get('utm_source');
    this.telemarketer = parseInt(this.route.snapshot.queryParamMap.get('telemarketer'), 10);
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

  setPackage(variant) {
    this.variants = this.variants.map(v => v.name === variant.name
      ? {...v, active: true}
      : {...v, active: false});
    this.calculatePrice();
  }

  setSports(extras) {
    _.mapKeys(extras, (value, key) => {
      this.sports.push({value: value, description: key});
      return key + value;
    });
  }

  toggleSelectionAddons(addon) {
    addon.selected = !addon.selected;
    this.calculatePrice();
  }

  calculatePrice() {
    if (this.sportForm.value['selectSport'] && this.sportForm.value['selectAge']) {
      const variant = this.getVariant();
      const body = {
        'number_of_insureds_25': this.findAges('number_of_insureds_25').number,
        'number_of_insureds_50': this.findAges('number_of_insureds_50').number,
        'number_of_insureds_60': this.findAges('number_of_insureds_60').number,
        'number_of_insureds_65': this.findAges('number_of_insureds_65').number,
        'sport': this.sportForm.value['selectSport'],
        'quantity': this.sumAges(),
        'variant_id': variant.id,
        'addons': this.addons.filter(a => a.selected).map(a => a.addon.code)
      };
      this.insuranceService.submitSportQuotation(body).subscribe(
        res => {
          this.price = res.total_price;
        }, error => {
        });
    }
  }

  getVariant() {
    return this.product.variants
      .find(a => a.id === this.variants.find(v => v.active).id);
  }

  findAges(label) {
    return this.agesList.find(s => s.bodyProp === label);
  }

  sumAges() {
    return this.agesList.reduce((acc, cur) => acc + cur.number, 0);
  }

  addQuantity(quantity, i) {
    if (quantity < 20) {
      this.agesList[i].number++;
      this.updateQuantity();
    }
  }

  subtractQuantity(quantity, i) {
    if (quantity > 0) {
      this.agesList[i].number--;
      this.updateQuantity();
    }
  }

  ageSelect() {
    this.showAges = !this.showAges;
  }

  applyAge() {
    this.showAges = !this.showAges;
  }

  updateQuantity() {
    this.agesUpdated = this.agesList.reduce((acc, cur) => cur.number
      ? `${acc} ${cur.number} ${cur.descriptionLabel}`
      : acc
      , '');
  }

  checkoutCt() {
    const variant = this.getVariant();
    const order = this.createOrderObj(variant);
    const orderWithUtm = this.checkoutService.addUtmSource(order, this.utm_source_prev || 'con_te', this.telemarketer || 0);

    this.checkoutService.redirectExternalCheckout(orderWithUtm, this.product);
  }

  createOrderObj(variant): RequestOrder {
    return {
      order: {
        order_attributes: {
          utm_source: this.utm_source_prev || 'con_te',
          telemarketer: this.telemarketer || 0,
          number_of_insureds_25: this.findAges('number_of_insureds_25').number,
          number_of_insureds_50: this.findAges('number_of_insureds_50').number,
          number_of_insureds_60: this.findAges('number_of_insureds_60').number,
          number_of_insureds_65: this.findAges('number_of_insureds_65').number
        },
        line_items_attributes: {
          '0': {
            insured_is_contractor: false,
            variant_id: variant.id,
            quantity: this.sumAges(),
            addon_ids: this.addons.filter(a => a.selected).map(a => a.addon.id),
            insurance_info_attributes: {
              extra: this.sport
            }
          }
        }
      }
    };
  }

}
