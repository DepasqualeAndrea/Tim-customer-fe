import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Product, RequestOrder } from '@model';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';
import { AgeSelection } from 'app/modules/preventivatore/age-selector/age-selector.model';
import { AuthService, CheckoutService, DataService, InsurancesService, ProductsService } from '@services';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { AgeSelectorHelper } from 'app/modules/preventivatore/age-selector/age-selector.helper';
import { ModalErrorComponent } from 'app/modules/preventivatore/modal-error/modal-error.component';
import { CbGtmAction } from 'app/core/models/gtm/cb/cb-gtm-action.model';
import { GtmService } from 'app/core/services/gtm/gtm.service';



@Component({
  selector: 'app-quotator-ge-sport',
  templateUrl: './quotator-ge-sport.component.html',
  styleUrls: ['./quotator-ge-sport.component.scss']
})
export class QuotatorGeSportComponent extends PreventivatoreAbstractComponent implements OnInit {

  @Input() product: any;
  @ViewChild('sportForm', { static: true }) private sportForm: NgForm;

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
  }

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
  storedAgeAndDuration : any = {}

  ngOnInit() {
    this.setSports(this.product.extras);
    this.setAddons(this.product.addons);
    this.variants = this.dataService.setVariantsCB();
    this.agesList = this.productsService
      .createAgesList(this.product.holder_minimum_age, this.product.holder_maximum_age);
      this.getAllStoredDataInfoSport();
    if(this.getAllStoredDataInfoSport()){
      this.updateQuantity();
      this.calculatePrice();
    }
  }

  saveDataInfoSport(){
    const dataInfo = {
     updatedAgeList:this.agesList,
     duration: this.variants,
     selectedSport:this.sport
    }
    try{
      sessionStorage.setItem('dataInfoSport', JSON.stringify(dataInfo))
      window.dispatchEvent(new CustomEvent('saveDataInfoSport'));
    }catch{
      sessionStorage.removeItem('dataInfoSport');
      window.dispatchEvent( new CustomEvent('saveDataInfoSport'));
    }
  }
  getAllStoredDataInfoSport(){
    let saveDataInfoSport = sessionStorage.getItem('dataInfoSport');
    if(saveDataInfoSport){
      this.storedAgeAndDuration = JSON.parse(saveDataInfoSport);
      this.agesList = this.storedAgeAndDuration.updatedAgeList;
      this.variants = this.storedAgeAndDuration.duration;
      this.sport = this.storedAgeAndDuration.selectedSport
      return true
    }else{
      this.storedAgeAndDuration = {
        updatedAgeList:'',
        duration:[],
      }
      return false
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
      if (this.sportForm.valid|| !!this.getAllStoredDataInfoSport()) {
        this.insuranceService.submitCbSportQuotation(body).subscribe(
          res => {
            this.price = res.total;
          });
      }
    }
  }

  getVariant() {
    this.saveDataInfoSport();
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
    this.saveDataInfoSport();
  }

  checkout() {
    const variant = this.getVariant();
    const order = this.createOrderObj(variant);
    this.checkoutService.addToChart(<RequestOrder>order).subscribe(res => {
      this.dataService.setOrderAttributes(order.order.order_attributes);
      this.dataService.setResponseOrder(res);
      this.dataService.setProduct(this.product);
      return this.router.navigate(['checkout']);
    });
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
