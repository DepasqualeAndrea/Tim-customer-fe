import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PreventivatoreAbstractComponent} from '../preventivatore-abstract/preventivatore-abstract.component';
import {AuthService, CheckoutService, DataService, InsurancesService, ProductsService, UserService} from "@services";
import {LoaderService} from "../../../../../core/services/loader.service";
import * as moment from "moment";
import {NgbCalendar, NgbDateStruct, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UntypedFormBuilder, NgForm} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {KenticoTranslateService} from "../../../../kentico/data-layer/kentico-translate.service";
import {ComponentFeaturesService} from "../../../../../core/services/componentFeatures.service";
import { animate, group, state, style, transition, trigger } from '@angular/animations';
import { fromEvent, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Areas, ShipmentAddressAttributes } from '@model';

@Component({
    selector: 'app-quotator-axa-viaggio',
    templateUrl: './quotator-axa-viaggio.component.html',
    styleUrls: ['./quotator-axa-viaggio.component.scss'],
    animations: [
        trigger('changePanelState', [
            state('floating', style({ display: 'none' })),
            state('sticking', style({ margin: '0', position: 'fixed', zIndex: '100', bottom: '0', left: '0', width: '100vw', backgroundColor: '#fff',
                boxShadow: '0 0 8px rgb(0 0 0 / 25%)', maxHeight: '120px', height: '100px', justifyContent: 'flex-end' })),
            transition('*=>floating', [group([animate('0ms 0ms')])]),
            transition('*=>sticking', [group([animate('0ms 0ms')])]),
        ]),
    ],
    standalone: false
})
export class QuotatorAxaViaggioComponent extends PreventivatoreAbstractComponent  implements OnInit,OnDestroy {
  @Input() product: any;
  currentField: 'toDate' | 'fromDate';
  stringFromDate: string;
  dropdownSettings: any = {};
  area;
  areas;
  stringToDate: string;
  fromDate: NgbDateStruct;
  openPicker = false;
  datepicker;
  toDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  tomorrow: NgbDateStruct;
  minDate: NgbDateStruct;
  variantChoise: any;
  price = 0;
  peopleQuantity = 1;
  variants = [];
  storedInfo: any = {};
 
  


  @ViewChild('tripForm') private tripForm: NgForm;
  public currentState: string = 'floating';

  constructor(
    ref: ChangeDetectorRef,
    public dataService: DataService,
    public router: Router,
    public userService: UserService,
    public authService: AuthService,
    public route: ActivatedRoute,
    public formBuilder: UntypedFormBuilder,
    public calendar: NgbCalendar,
    public toastr: ToastrService,
    public insuranceService: InsurancesService,
    public checkoutService: CheckoutService,
    public productsService: ProductsService,
    public kenticoTranslateService: KenticoTranslateService,
    public componentFeaturesService: ComponentFeaturesService,
    public modalService: NgbModal,
  ) {
    super(ref);
  }

  ngOnDestroy() {
  }

  ngOnInit() {
    this.getAllStoredData();
    this.tomorrow = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
    this.minDate = this.tomorrow;
    this.timeComparison();
    this.getArea();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
    };
    this.setPrice();
  }

saveDataInfo(){
    const dataInfo = {
      destination : this.area,
      fromDate : this.stringFromDate,
      toDate:this.stringToDate,
      people:this.peopleQuantity,
      price:this.price,
    }
    try{
      localStorage.setItem('dataInfo', JSON.stringify(dataInfo))
      window.dispatchEvent(new CustomEvent('savedDataInfo'));
    }catch{
      localStorage.removeItem('dataInfo');
      window.dispatchEvent( new CustomEvent('savedDataInfo'));
    }
  }
  getAllStoredData(){
    let savedDataInfo = localStorage.getItem('dataInfo');
    if(savedDataInfo){
      this.storedInfo = JSON.parse(savedDataInfo);
    }else{
      this.storedInfo = {
        destination : '',
        fromDate : '',
        toDate : '',
        people : 1,
        price:0,
      }
    }
    this.area = this.storedInfo.destination;
    this.stringFromDate = this.storedInfo.fromDate ;
    this.stringToDate = this.storedInfo.toDate ;
    this.peopleQuantity =this.storedInfo.people;
    this.price = this.storedInfo.price;
  }


  private createScrollEventListener(): Observable<number> {
    return fromEvent(window, 'scroll').pipe(untilDestroyed(this), map(() => window.pageYOffset));
  }

  ngAfterViewInit() {
    this.createScrollEventListener()
      .subscribe(scrollOffset => {
        this.currentState = scrollOffset >= 700 ? 'sticking' : 'floating';
      });
  }

  getArea() {
    this.userService.getAreas().subscribe(
      data => {
        this.areas = data.areas;
      });
  }
  public toggleDatePicker(currentField?: 'toDate' | 'fromDate') {
    this.currentField = currentField;
    this.openPicker = !this.openPicker;
    if (this.currentField === 'fromDate') {
      this.resetPicker();
    }
  }

  selectCountry() {
    this.saveDataInfo();
    this.setPrice();
  }
  setPrice() {
    if (this.area && this.stringFromDate && this.stringToDate) {
      const durationRange = moment(this.stringToDate, 'DD/MM/YYYY').diff(moment(this.stringFromDate, 'DD/MM/YYYY'), 'days');
      this.product.variants.some((variant) => {
        if (variant.option_values[1]['name'] === this.area.area && variant.option_values[0].duration >= durationRange || variant.option_values[0]['name'] === this.area.area && variant.option_values[1].duration >= durationRange) {
          this.variantChoise = variant;
          this.price = variant.price * this.peopleQuantity;
          this.saveDataInfo();
          return true;
        }
        return false;
      });
    }
  }

  public resetPicker(): void {
    this.datepicker = null;
    this.fromDate = null;
    this.stringFromDate = '';
    this.toDate = null;
    this.stringToDate = '';
    this.maxDate = this.getNextYear();
    this.minDate = this.tomorrow;
  }

  public getNextYear(): NgbDateStruct {
    return this.calendar.getNext(this.calendar.getToday(), 'd', 365);
  }
  addQuantity() {
    if (this.peopleQuantity < this.product.maximum_insurable) {
      this.peopleQuantity++;
      this.setPrice();
      this.saveDataInfo();
    }
  }
  subtractQuantity() {
    if (this.peopleQuantity > 1) {
      this.peopleQuantity--;
      this.setPrice();
      this.saveDataInfo()  
    }
  }
  checkout(tripForm: NgForm): Promise<any> | void {
      if(this.timeComparison()){
        const order = this.createOrder();
        this.checkoutService.addToChart(order).subscribe((res) => {
          this.dataService.setResponseOrder(res);
          this.dataService.setProduct(this.product);
          return this.router.navigate(['checkout']);
        });
      }else{
        this.resetPicker()
      }
  }
  
  timeComparison(){
    let currentD = new Date();
    let startOfDay = new Date();
    startOfDay.setHours(0,0,0);
    let endOfDay = new Date();
    endOfDay.setHours(23,45,0); 
    if(currentD > startOfDay && currentD < endOfDay ){
        return true
    }else{
        this.tomorrow = this.calendar.getNext(this.calendar.getToday(), 'd', 2)
        return false
    }
  }
  public createOrder() {
    return {
      order: {
        line_items_attributes: {
          0: {
            variant_id: this.variantChoise.id,
            quantity: this.peopleQuantity,
            start_date: moment(this.stringFromDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            expiration_date: moment(this.stringToDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            insured_is_contractor: true,
            display_expiration_date: moment(this.stringToDate, 'DD/MM/YYYY').format('DD/MM/YYYY'),
            insurance_info_attributes: {
              axa_destination: this.area.country_id
            }
          },
        },
      }
    };
  }
  singleDateSelection(date: NgbDateStruct) {
    if (this.currentField === 'fromDate') {
      this.fromDate = date;
      this.stringFromDate = this.fromDate.day + '/' + this.fromDate.month + '/' + this.fromDate.year;
      this.setMaxDate();
      this.setMinDate();
      this.saveDataInfo();
    }
    if (this.currentField === 'toDate') {
      this.toDate = date;
      this.stringToDate = this.toDate.day + '/' + this.toDate.month + '/' + this.toDate.year;
      this.saveDataInfo();    
    }
    this.toggleDatePicker();
    this.setPrice();
  }
  public setMaxDate() {
    this.stringFromDate = this.fromDate.day + '/' + this.fromDate.month + '/' + this.fromDate.year;
    this.maxDate = {
      year: +moment(this.stringFromDate, 'DD/MM/YYYY').add(29, 'days').format('YYYY'),
      month: +moment(this.stringFromDate, 'DD/MM/YYYY').add(29, 'days').format('MM'),
      day: +moment(this.stringFromDate, 'DD/MM/YYYY').add(29, 'days').format('DD')
    };
  }
  public setMinDate() {
    this.minDate = {
      year: +moment(this.stringFromDate , 'DD/MM/YYYY').format('YYYY'),
      month: +moment(this.stringFromDate, 'DD/MM/YYYY').format('MM'),
      day: +moment(this.stringFromDate, 'DD/MM/YYYY').format('DD')                
    };
  }

  scrollTop($event) {
    const element = document.querySelector('container-quotator') || window;
    element.scrollTo(0, 0);
  }
}