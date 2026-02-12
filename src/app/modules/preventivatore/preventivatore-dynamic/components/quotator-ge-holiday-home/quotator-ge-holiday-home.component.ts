import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LineItemsAttributes, OrderAttributes, RequestOrder } from '@model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, CheckoutService, DataService, ProductsService } from '@services';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { InsurancesService } from 'app/core/services/insurances.service';
import { AgeSelection } from 'app/modules/preventivatore/age-selector/age-selector.model';
import { ModalErrorComponent } from 'app/modules/preventivatore/modal-error/modal-error.component';
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';

@Component({
  selector: 'app-quotator-ge-holiday-home',
  templateUrl: './quotator-ge-holiday-home.component.html',
  styleUrls: ['./quotator-ge-holiday-home.component.scss']
})
export class QuotatorGeHolidayHomeComponent extends PreventivatoreAbstractComponent implements OnInit {

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
  storedHolidayHomeInfo : any = {}

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


  ngOnInit() {
    this.setAddons(this.product.addons);
    this.setVariants();
    this.getHolidayDestinations();
    this.agesList = this.productsService
      .createAgesList(this.product.holder_minimum_age, this.product.holder_maximum_age);
      this.getAllStoredDataInfoHolidayHome()
      if(this.getAllStoredDataInfoHolidayHome()){
        this.updateQuantity();
        this.calculatePrice();
        this.setDestination(this.destination)
      }
  }
  saveDataInfoHolidayHome(){
    const dataInfoHolidayHome = {
      updatedAgeList:this.agesList,
      duration: this.variants,
      selectedDestination: this.product.destination
    }
    try{
      sessionStorage.setItem('dataHolidayHome', JSON.stringify(dataInfoHolidayHome))
    }catch{
      sessionStorage.removeItem('dataHolidayHome');
    }
  }
  getAllStoredDataInfoHolidayHome(){
    let saveDataHolidayHome = sessionStorage.getItem('dataHolidayHome');
    if(saveDataHolidayHome){
      this.storedHolidayHomeInfo = JSON.parse(saveDataHolidayHome);
      this.agesList = this.storedHolidayHomeInfo.updatedAgeList;
      this.variants = this.storedHolidayHomeInfo.duration;
      this.destination = this.storedHolidayHomeInfo.selectedDestination;
      return true
    }else{
      this.storedHolidayHomeInfo = {
        updatedAgeList:'',
        duration:[],
        saveDestination:'',
      }
      return false
    }
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
    this.saveDataInfoHolidayHome();
  }

  calculatePrice() {
    const body = Object.assign({
      variant_id: this.product.master_variant,
      start_date: moment().add(1, 'days').format('YYYY-MM-DD'),
      duration: this.getVariantDuration(),
      quantity: this.sumAges(),
      addons: this.addons.filter(a => a.selected).map(a => a.addon.code),
    }, this.computeOrderAttributes());
    if (this.holidayForm.valid || this.getAllStoredDataInfoHolidayHome()) {
      this.insuranceService.submitCbHolidayHouseQuotation(body).subscribe((res) => {
        this.price = res.total;
      });
    }
  }

  getVariantDuration() {
    this.saveDataInfoHolidayHome()
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
      return this.router.navigate(['checkout']);
    });
  }


  onAgeSelectionUpdate(event: AgeSelection): void {
    this.agesList = this.agesList.map(item => item.id === event.id ? event : item);
    this.updateQuantity();
    if (event.quantity) {
      this.calculatePrice();
    }
    this.saveDataInfoHolidayHome()
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
