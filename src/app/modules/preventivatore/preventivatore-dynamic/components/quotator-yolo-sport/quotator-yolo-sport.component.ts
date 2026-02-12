import {ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import {RequestOrder} from '@model';
import {AgeSelection, FROM_4_AGE_SELECTIONS, FROM_4_AGE_SELECTIONS_TO_65} from 'app/modules/preventivatore/age-selector/age-selector.model';
import {AgeSelectorHelper} from 'app/modules/preventivatore/age-selector/age-selector.helper';
import {CheckoutService, DataService, InsurancesService} from '@services';
import {Router} from '@angular/router';
import {PreventivatoreAbstractComponent} from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
  selector: 'app-quotator-yolo-sport',
  templateUrl: './quotator-yolo-sport.component.html',
  styleUrls: ['./quotator-yolo-sport.component.scss'],
})
export class QuotatorYoloSportComponent
  extends PreventivatoreAbstractComponent
  implements OnInit {
  @Input() product;
  @Input() products;
  sport;
  agesUpdated = '';
  variants = [];
  addons = [];
  price = 0;
  includedSection = false;
  sports: any = [];
  showAges = false;
  rotated = false;
  agesList: AgeSelection[];
  showErrorMessagge = false;
  @ViewChild('sportForm', { static: true }) private sportForm: NgForm;

  constructor(
    public insuranceService: InsurancesService,
    public dataService: DataService,
    public checkoutService: CheckoutService,
    public router: Router,
    ref: ChangeDetectorRef
  ) {
    super(ref);
  }

  ngOnInit() {
    this.ageListSelector();
    this.variants = this.getVariantsFromProducts(this.products);
    this.setSports(this.product.extras);
    this.sortSportsAlphabeticOrder();
    this.addons = this.getAddOnsToShow(this.products);
    this.setPackage(this.variants[0]);
    this.sportForm.form.valueChanges.subscribe((res) => {
      this.calculatePrice();
      if (this.sportForm.valid) {
        this.showErrorMessagge = false;
      }
    });
  }

  ageListSelector() {
    if (this.product.product_code === 'chubb-deporte') {
      return (this.agesList = Object.assign([], FROM_4_AGE_SELECTIONS_TO_65));
    } else {
      return (this.agesList = Object.assign([], FROM_4_AGE_SELECTIONS));
    }
  }

  getVariantsFromProducts(products: any) {
    const productsVariants = [];
    products.forEach((product) =>
      product.variants.forEach((variant) => {
        productsVariants.push(variant);
      })
    );
    return productsVariants;
  }

  setSports(extras) {
    if (this.product.product_code === 'chubb-deporte') {
      _.mapKeys(extras, (value, key) => {
        this.sports.push({value: value, description: key});
        return key + value;
      });
    } else {
      _.mapKeys(extras, (value, key) => {
        this.sports.push({
          value: value,
          description:
            key.charAt(0).toUpperCase() + key.slice(1).toLocaleLowerCase(),
        });
        return key + value;
      });
    }
  }

  sortSportsAlphabeticOrder() {
    this.sports.sort((a, b) => (a.description < b.description ? -1 : 1));
  }

  getAddOnsToShow(products: any) {
    const productAddOns = [];
    products.forEach((product) =>
      product.addons.forEach((addon) => {
        productAddOns.push({
          addon: {
            code: addon.code,
            name: addon.name,
            description: addon.description,
            image: addon.image,
          },
          selected: false,
        });
      })
    );
    const uniqueAddons = [];
    productAddOns.forEach(() => {
      const firstAddon = productAddOns.shift();
      uniqueAddons.push(firstAddon);
      productAddOns.filter(
        (addon) => addon.addon.code !== firstAddon.addon.code
      );
    });
    return uniqueAddons;
  }

  getProductFromVariant(products: any, variantId: number) {
    return products.find((product) =>
      product.variants.some((variant) => variantId === variant.id)
    );
  }

  getProductSelectedAddOns(product: any, selected_addons_code: string[]) {
    const selectedAddons = [];
    selected_addons_code.forEach((code) => {
      selectedAddons.push(product.addons.find((addon) => addon.code === code));
    });
    return selectedAddons;
  }

  setPackage(variant) {
    this.product = this.getProductFromVariant(this.products, variant.id);
    this.variants = this.variants.map((v) =>
      v.name === variant.name ? {...v, active: true} : {...v, active: false}
    );
    this.calculatePrice();
  }

  toggleSelectionAddons(addon) {
    addon.selected = !addon.selected;
    this.calculatePrice();
  }

  calculatePrice() {
    if (
      this.sportForm.value['selectSport'] &&
      this.sportForm.value['selectAge']
    ) {
      const variantId = this.getVariantId();
      const body = Object.assign(
        {},
        AgeSelectorHelper.toOrderAttributes(this.agesList),
        {
          sport: this.sportForm.value['selectSport'],
          quantity: AgeSelectorHelper.sumAges(this.agesList),
          variant_id: variantId,
          addons: this.addons
            .filter((a) => a.selected)
            .map((a) => a.addon.code),
        }
      );
      this.insuranceService
        .submitSportQuotation(body)
        .subscribe((res) => (this.price = res.total_price));
    }
  }

  getVariantId() {
    return this.variants.find(
      (a) => a.id === this.variants.find((v) => v.active).id
    ).id;
  }

  rotateArrowSelect() {
    if (this.product.product_code === 'chubb-sport') {
      this.rotated = !this.rotated;
    }
  }

  toggleAgeSelection() {
    this.showAges = !this.showAges;
  }

  updateQuantity() {
    this.agesUpdated = AgeSelectorHelper.toString(this.agesList);
  }

  onAgeSelectionUpdate(event: AgeSelection): void {
    this.agesList = this.agesList.map((item) =>
      item.id === event.id ? event : item
    );
    this.updateQuantity();
  }

  createOrderObj(variant) {
    const selectedAddons = this.addons
      .filter((addon) => addon.selected)
      .map((addon) => addon.addon.code);
    return {
      order: {
        order_attributes: AgeSelectorHelper.toOrderAttributes(this.agesList),
        line_items_attributes: {
          0: {
            insured_is_contractor: false,
            variant_id: variant.id,
            expiration_date: moment()
              .add(variant.option_values[0].duration, 'days')
              .format('YYYY-MM-DD'),
            start_date: moment().add(2, 'hours').format('YYYY-MM-DD, HH:mm'),
            quantity: AgeSelectorHelper.sumAges(this.agesList),
            addon_ids: this.getProductSelectedAddOns(
              this.product,
              selectedAddons
            ).map((addon) => addon.id),
            insurance_info_attributes: {
              extra: this.sport,
            },
          },
        },
      },
    };
  }

  checkout() {
    if (this.sportForm.invalid) {
      this.showErrorMessagge = true;
    } else {
      const variant = this.variants.find((v) => v.active);
      const order = this.createOrderObj(variant);
      this.checkoutService.addToChart(<RequestOrder>order).subscribe((res) => {
        this.dataService.setOrderAttributes(order.order.order_attributes);
        this.dataService.setResponseOrder(res);
        this.dataService.setProduct(this.product);
        return this.router.navigate(['checkout']);
      });
    }
  }
}
