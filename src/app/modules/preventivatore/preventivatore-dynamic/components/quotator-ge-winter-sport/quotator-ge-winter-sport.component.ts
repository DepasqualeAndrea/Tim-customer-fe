import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, DoCheck, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';
import { RequestOrder } from '@model';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';
import { AgeSelection } from 'app/modules/preventivatore/age-selector/age-selector.model';
import { AuthService, CheckoutService, DataService, InsurancesService, ProductsService } from '@services';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { AgeSelectorHelper } from 'app/modules/preventivatore/age-selector/age-selector.helper';
import { take } from 'rxjs/operators';
import { SlickSliderConfigSettings } from 'app/shared/slick-slider-config.model';

@Component({
  selector: 'app-quotator-ge-winter-sport',
  templateUrl: './quotator-ge-winter-sport.component.html',
  styleUrls: ['./quotator-ge-winter-sport.component.scss']
})
export class QuotatorGeWinterSportComponent extends PreventivatoreAbstractComponent implements OnInit, DoCheck {

  @Input() product: any;
  currentDate = moment();
  startDateSeasonalPeriod: moment.Moment;
  endDateSeasonalPeriod: moment.Moment;
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
  hideSticky: number;
  slideConfig: SlickSliderConfigSettings;
  customName: string;

  constructor(
    public insuranceService: InsurancesService,
    public dataService: DataService,
    public checkoutService: CheckoutService,
    public router: Router,
    public productsService: ProductsService,
    public authService: AuthService,
    public modalService: NgbModal,
    public componentFeaturesService: ComponentFeaturesService,
    ref: ChangeDetectorRef
  ) {
    super(ref);

    this.slideConfig = {
        'slidesToShow': 4.5,
        'slidesToScroll': 1,
        'infinite': false,
        'autoplay': false,
        'arrows': false,
        responsive: [{ breakpoint: 445, settings: {
          'slidesToShow': 4,
          'slidesToScroll': 1,
          'infinite': false,
          'autoplay': false,
          'arrows': false,
        }},
        { breakpoint: 400, settings: {
          'slidesToShow': 3.5,
          'slidesToScroll': 1,
          'infinite': false,
          'autoplay': false,
          'arrows': false,
        }},
        { breakpoint: 360, settings: {
          'slidesToShow': 3,
          'slidesToScroll': 1,
          'infinite': false,
          'autoplay': false,
          'arrows': false,
        }}]
      };
  }

  ngOnInit() {
    this.setSeasonalDates()
    this.destinations = this.productsService.getTravelDestinationsName(this.product.travel_detinations);
    this.setAddons(this.product.addons);
    this.getVariants();
    this.agesList = this.productsService.createAgesListWinterSport(this.product.holder_minimum_age, this.product.holder_maximum_age);
    this.getCustomProductName()
  }

  ngDoCheck() {
    if (document.documentElement.scrollWidth < 400 && document.documentElement.scrollWidth > 350) {
        this.hideSticky = 2800;
    }else if (document.documentElement.scrollWidth < 350) {
      this.hideSticky = 3100;
    }else {
      this.hideSticky = 2540;
    }
  }

  setSeasonalDates(){
    this.startDateSeasonalPeriod = moment(this.product.attributes.season_start_date);
    this.endDateSeasonalPeriod = moment(this.product.attributes.season_end_date);
  }


  getVariants(){
    this.variants = this.product.variants.map(item => {
      return {
        id: item.id,
        name: item.option_values[0].presentation,
        active: item.name === '1 day' ? true : false,
        duration: item.option_values[0].duration
      }
    })
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
        variant_id: this.setId(),
        start_date: moment().add(1, 'days').format('YYYY-MM-DD'),
        duration: this.setExpirationDate(),
        quantity: AgeSelectorHelper.sumAges(this.agesList),
        addons: this.addons.filter(a => a.selected).map(a => a.addon.code)
      }, AgeSelectorHelper.toOrderAttributes(this.agesList));
    this.insuranceService.submitCbSkiQuotation(body).pipe(take(1)).subscribe(
      res => {
        this.price = res.total;
      });
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
    if (event.quantity) {
      this.calculatePrice();
    }
  }

  checkout() {
    const order = this.createOrderObj();
    this.checkoutService.addToChart(<RequestOrder>order).pipe(take(1)).subscribe(res => {
      this.dataService.setOrderAttributes(order.order.order_attributes);
      this.dataService.setResponseOrder(res);
      this.dataService.setProduct(this.product);
      return this.router.navigate(['checkout']);
    });
  }

  startDate() {
    if (this.getVariant().name === 'Stagionale') {
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
            variant_id: this.setId(),
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
    return this.getVariant().duration === 0 ? 30 : this.getVariant().duration;
  }

  setId() {
    return this.variants.length ? this.getVariant().id : '';
  }

  setActiveVariant(variant) {
    this.variants = this.variants
      .map(v => v.id === variant.id ? { ...v, active: true } : { ...v, active: false });
    this.calculatePrice();
  }

  scrollHeight() {
    return document.documentElement.scrollTop;
  }

  scrollToTop() {
    return document.documentElement.scrollTo(0, 0);
  }

  getCustomProductName(){
    this.componentFeaturesService.useComponent('quotator-select-package');
    this.componentFeaturesService.useRule('package-name');
    if(this.componentFeaturesService.isRuleEnabled()){
      const constraints = this.componentFeaturesService.getConstraints()
      if(constraints){
        constraints.forEach((value, key) => {
          if(this.product.product_code === key){
            this.customName = value;
          }
        })
      }
    }
  }

}
