import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderAttributes, Product, RequestOrder } from '@model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, CheckoutService, DataService, InsurancesService, ProductsService } from '@services';
import { CbGtmAction } from 'app/core/models/gtm/cb/cb-gtm-action.model';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { GtmService } from 'app/core/services/gtm/gtm.service';
import { AgeSelectorHelper } from 'app/modules/preventivatore/age-selector/age-selector.helper';
import { AgeSelection } from 'app/modules/preventivatore/age-selector/age-selector.model';
import { ModalErrorComponent } from 'app/modules/preventivatore/modal-error/modal-error.component';
import * as moment from 'moment';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
  selector: 'app-quotator-ge-bike',
  templateUrl: './quotator-ge-bike.component.html',
  styleUrls: ['./quotator-ge-bike.component.scss']
})
export class QuotatorGeBikeComponent extends PreventivatoreAbstractComponent implements OnInit {


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
  storedAgeAndDuration : any = {}

  ngOnInit() {
    this.setAddons(this.product.addons);
    this.setVariants();
    this.agesList = this.productsService
    .createAgesList(this.product.holder_minimum_age, this.product.holder_maximum_age);
    this.getAllStoredDataInfoBike();
    if(this.getAllStoredDataInfoBike()){
      this.updateQuantity();
      this.calculatePrice();
    }
  }
  saveDataInfoBike(){
    const dataInfo = {
     updatedAgeList:this.agesList,
     duration: this.variants,
    }
    try{
      sessionStorage.setItem('dataInfoBike', JSON.stringify(dataInfo))
      window.dispatchEvent(new CustomEvent('saveDataInfoBike'));
    }catch{
      sessionStorage.removeItem('dataInfoBike');
      window.dispatchEvent( new CustomEvent('saveDataInfoBike'));
    }
  }
  getAllStoredDataInfoBike(){
    let saveDataInfoBike = sessionStorage.getItem('dataInfoBike');
    if(saveDataInfoBike){
      this.storedAgeAndDuration = JSON.parse(saveDataInfoBike);
      this.agesList = this.storedAgeAndDuration.updatedAgeList;
      this.variants = this.storedAgeAndDuration.duration;
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
    if (this.bikeForm.valid || !!this.getAllStoredDataInfoBike()) {
      this.insuranceService.submitBikeCbQuotation(body).subscribe((res) => {
        this.price = res.total;
      });
    }
  }

  getVariant() {
    this.saveDataInfoBike()
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
      return this.router.navigate(['checkout']);
    });
  }


  onAgeSelectionUpdate(event: AgeSelection): void {
    this.agesList = this.agesList.map(item => item.id === event.id ? event : item);
    this.updateQuantity();
    if (event.quantity) {
      this.calculatePrice();
    }
    this.saveDataInfoBike()
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
