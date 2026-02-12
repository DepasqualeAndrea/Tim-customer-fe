import {Areas, RequestOrder} from '@model';
import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {take} from 'rxjs/operators';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {NgbCalendar, NgbDate, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {CheckoutService, DataService, InsurancesService} from '@services';
import {PreventivatoreAbstractComponent} from '../preventivatore-abstract/preventivatore-abstract.component';
import { CheckoutDocumentAcceptanceService } from 'app/modules/checkout/checkout-step/checkout-step-payment/checkout-step-payment-document-acceptance.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-quotator-travel-civibank',
  templateUrl: './quotator-travel-civibank.component.html',
  styleUrls: ['../preventivatore-basic.component.scss', './quotator-travel-civibank.component.scss']
})
export class QuotatorTravelCivibankComponent extends PreventivatoreAbstractComponent implements OnInit, OnDestroy {

  @Input() product;
  destinations: Areas[];
  calendarMaxDate: NgbDateStruct;
  calendarMinDate: NgbDateStruct;
  minEndTripDate: NgbDateStruct;
  peopleQuantity = 0;
  maxPeople: number;
  price = 0;
  form: FormGroup;
  ticketList: FormArray;
  @Output() swipeEvent = new EventEmitter<string>();
  @Output() saveQuotatorForm = new EventEmitter<FormGroup>();
  @Input() savedForm: FormGroup;
  maxRangeDate: NgbDate;
  subscriptions: Subscription[] = []

  constructor(
    private calendar: NgbCalendar,
    private insuranceService: InsurancesService,
    public dataService: DataService,
    private checkoutService: CheckoutService,
    private router: Router,
    private fb: FormBuilder,
    ref: ChangeDetectorRef,
    private acceptanceService: CheckoutDocumentAcceptanceService
  ) {
    super(ref);
  }

  ngOnInit() {
    this.maxPeople = this.product.maximum_insurable;
    this.setDestinations();
    // this.setArrayNumberPeople();
    this.calendarMinDate = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
    this.maxRangeDate = this.calendar.getNext(this.calendar.getToday(), 'd', 365);
    this.minEndTripDate = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
    this.calendarMaxDate = this.calendar.getNext(this.calendar.getToday(), 'd', 100);
  }

  private createForm(): void {
    this.form = this.savedForm || this.fb.group({
      destinationOption: ['single', Validators.nullValidator],
      destinations: this.fb.array([this.createDestinationForm()]),
      numbersPeople: [0, {validators: [Validators.min(1), Validators.max(this.product.maximum_insurable)]}],
      moreInfo: [null, Validators.requiredTrue],
      startTrip: [null, Validators.required],
      endTrip: [null, Validators.required],
    });
    const $formUpdate = this.form.valueChanges.subscribe(() => {
      this.emitQuotatorValues(this.form)
      this.calculatePrice()
    })
    this.subscriptions.push($formUpdate)
    this.ticketList = this.form.get('destinations') as FormArray;
    this.peopleQuantity = this.form.get('numbersPeople').value
    this.calculatePrice()
  }

  createDestinationForm(): FormGroup {
    return this.fb.group({
      destination: new FormControl(null, Validators.required),
    });
  }

  getDestinationForm(): FormArray {
    return this.form.get('destinations') as FormArray;
  }

  addDestination() {
    this.ticketList.push(this.createDestinationForm());
  }

  removeDestination(index) {
    this.ticketList.removeAt(index);
  }


  setDestinations() {
    this.insuranceService.getTravelHelvetiaDestinations().pipe(take(1)).subscribe(res => {
      this.destinations = res
      this.createForm()
    });
  }

  updateEndDate(selectedStartDate: NgbDate) {
    if (this.form.controls.endTrip.value) {
      this.form.controls.endTrip.setValue(null);
    }
    this.calendarMaxDate = this.calendar.getNext(selectedStartDate, 'd', 100);
    this.minEndTripDate = this.calendar.getNext(selectedStartDate, 'd', 0);
  }

  choiseNumberPeople(event) {
    this.peopleQuantity = event;
  }

  formatDate(date: NgbDateStruct) {
    const formatDate = new Date(Date.UTC(date.year, date.month - 1, date.day - 1, 24, 0, 0));
    return formatDate.toISOString();
  }


  getMandatoryAddonsId(isChekcoutRequest = false) {
    let idList;
    const addon_insurance_infos_attributes = [];
    this.product.addons.map(ad => {
      if (ad.taxons.find(taxon => taxon.name === 'mandatory')) {
        idList = {
          maximal: ad.ceilings ? ad.ceilings[0] : 0
        };
        if (isChekcoutRequest) {
          idList.addon_id = ad.id;
        } else {
          idList.code = ad.code;
        }
        addon_insurance_infos_attributes.push(idList);
      }
    });
    return addon_insurance_infos_attributes;
  }

  createRequestQuoteTravel() {
    return {
      token: localStorage.getItem('token-dhi'),
      tenant: 'civibank',
      product_code: this.product.product_code,
      product_data: {
        variant_name: 'traveling_master',
        quantity: this.peopleQuantity.toString(),
        start_date: this.formatDate(this.form.controls.startTrip.value).split('T')[0],
        expiration_date: this.formatDate(this.calendar.getNext(this.form.controls.endTrip.value, 'd', 1)).split('T')[0],
        destinations: this.form.controls.destinations.value.map(element => {
          return {
            code: element.destination.id.toString(),
            name: element.destination.country,
            zone: element.destination.area
          };
        }),
        addons: this.getMandatoryAddonsId()
      }
    };
  }

  calculatePrice() {
    if (this.form.valid && this.form.get('numbersPeople').value > 0) {
      const request = this.createRequestQuoteTravel();
      const $quote = this.insuranceService.submitTravelHelvetiaInsuranceQuotation(request).subscribe(res => {
        localStorage.setItem('token-dhi', res.token);
        this.price = parseFloat(res.total.replace(',', '.'));
      });
      this.subscriptions.push($quote) 
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe()
    });
  }


  checkout() {
    localStorage.removeItem('CHECKOUT_OPENED_RESOLVER');
      const startDate = this.formatDate(this.form.controls.startTrip.value);
      const expirationDate = this.formatDate(this.calendar.getNext(this.form.controls.endTrip.value, 'd', 1));
      const line_items_attributes = {
        '0': {
          variant_id: this.product.master_variant,
          start_date: startDate.split('T')[0],
          expiration_date: expirationDate.split('T')[0],
          quantity: this.peopleQuantity,
          instant: false,
          addon_ids: [],
          line_item_addons_attributes: this.getMandatoryAddonsId(true),
          insurance_info_attributes: {
            destination_ids: this.form.controls.destinations.value.map(element => element.destination.id),
            travel_date: startDate,
            travel_end_date: expirationDate
          },
        }
      };
      const order = {order: {line_items_attributes}};
      this.checkoutService.addToChart(<RequestOrder>order).subscribe(res => {
        this.dataService.setResponseOrder(res);
        this.dataService.setProduct(this.product);
        return this.router.navigate(['checkout']);
      });
      if (this.dataService.tenantInfo.tenant === 'banco-desio_db' ||
      this.dataService.tenantInfo.tenant === 'civibank_db') {
        this.acceptanceService.documentAcceptance(true, this.product);
      }
  }

  onSwipe(event) {
    const direction = Math.abs(event.deltaX) > 40 ? (event.deltaX > 0 ? 'right' : 'left') : '';
    this.swipeEvent.next(direction);
  }

  hide() {
    for (let i = this.getDestinationForm().controls.length - 1; i >= 0; i--) {
      if (i > 0) {
        this.ticketList.removeAt(i);
      }
    }
  }

  show() {
    if (this.form.controls.destinations.value.length < 2) {
      this.addDestination();
    }
  }

  subtractQuantity() {
    this.peopleQuantity = this.peopleQuantity - 1;
    this.form.get('numbersPeople').patchValue((this.peopleQuantity));
  }

  addQuantity() {
    this.peopleQuantity = this.peopleQuantity + 1;
    this.form.get('numbersPeople').patchValue((this.peopleQuantity));
  }

  private emitQuotatorValues(form: FormGroup): void {
    this.saveQuotatorForm.emit(form)
  }

  compareFn(d1: Areas, d2: Areas): boolean {
    return d1 && d2 ? d1.id === d2.id : d1 === d2
  }
}
