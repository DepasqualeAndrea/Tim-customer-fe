import { DataService } from './../../../../../core/services/data.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { TimeHelper } from '../../../../../shared/helpers/time.helper';
import * as moment from 'moment';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Country } from '@model';
import { InsurancesService, UserService } from '@services';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { ComponentFeaturesService } from '../../../../../core/services/componentFeatures.service';
import { NypUserService } from '@NYP/ngx-multitenant-core';
@Component({
    selector: 'app-quotator-home-genertel',
    templateUrl: './quotator-home-genertel.component.html',
    styleUrls: ['../preventivatore-basic.component.scss', './quotator-home-genertel.component.scss'],
    standalone: false
})

export class QuotatorHomeGenertelComponent extends PreventivatoreAbstractComponent implements OnInit, OnChanges {

  @Input() product;
  @Output() actionEvent = new EventEmitter<any>();
  @Output() swipeEvent = new EventEmitter<string>();

  maxDate: NgbDate = TimeHelper.fromDateToNgbDate(moment().add(364, 'days').toDate());
  todayDate: NgbDate = TimeHelper.fromDateToNgbDate(moment().toDate());
  formQuotator: UntypedFormGroup;
  price: any = 0;
  priceTotal = 0;
  formResIsValid = true;

  residentialStates: any;
  residentialCities: any;
  residentialItalianCountry: Country;
  cities: any;

  states: any;
  isTooltipEnabled: boolean;

  constructor(
    private formBuilder: UntypedFormBuilder,
    ref: ChangeDetectorRef,
    private userService: UserService,
    protected nypUserService: NypUserService,
    public insuranceService: InsurancesService,
    private componentFeaturesService: ComponentFeaturesService,
    public dataService: DataService
  ) {
    super(ref);
  }

  ngOnInit() {
    localStorage.removeItem("Proposal");
    this.getItalianResidentialStates();
    this.initFormQuotator();
    this.annualPrize();
    this.isTooltipEnabled = this.getTooltipPrice();
  }

  initFormQuotator() {
    this.formQuotator = new UntypedFormGroup({
      choiseTypeHome: new UntypedFormControl(this.product.choise_type_home.choise.value[0].response.value, Validators.required),
      provinceSelect: new UntypedFormControl(null, Validators.required),
      area: new UntypedFormControl('', Validators.required),
      startDate: new UntypedFormControl('', Validators.required),
      choiseMassimali: new UntypedFormControl(this.product.choise_massimali.choise.value[0].response.value, Validators.required),
      choisePaymentType: new UntypedFormControl(this.product.choise_payment_type.choise.value[0].response.value, Validators.required),
    });
    this.changeValidatorsAreaField();
  }

  getFormResidential() {
    return this.formQuotator.controls.residential as UntypedFormGroup;
  }

  displayFieldCss(form: any, field: string) {
    return {
      'error-field': this.isFieldValid(form, field),
    };
  }
  changeValidatorsAreaField() {
    if (this.dataService.tenantInfo.tenant === 'chebanca_db') {
      this.formQuotator.controls['area'].addValidators([Validators.min(30), Validators.max(700)]);
    }
    if (this.dataService.tenantInfo.tenant !== 'chebanca_db') {
      this.formQuotator.controls['area'].addValidators([Validators.min(35), Validators.max(700)]);
    }
  }

  isFieldValid(form: any, field: string) {
    return !form.get(field).valid && form.get(field).touched;
  }

  // Quote - request create
  createRequest() {
    return {
      product_code: this.product.product_code,
      sqm: this.formQuotator.get('area').value,
      usage: this.formQuotator.get('choiseTypeHome').value,
      state_id: this.formQuotator.get('provinceSelect').value.id,
      start_date: moment(TimeHelper.fromNgbDateToDate(this.formQuotator.get('startDate').value)).format('YYYY-MM-DD'),
      payment_type: this.formQuotator.get('choisePaymentType').value,
      ceiling: Number(this.formQuotator.get('choiseMassimali').value),
      addons: []
    };
  }

  calculatePrice() {
    if (this.formQuotator.valid) {
      const request = this.createRequest();
      this.insuranceService.submitHomeGenertelQuotation(request).pipe(take(1)).subscribe(res => {
        this.formatDecimalPrice(res.total);
        this.priceTotal = parseFloat(res.total) * 12;
      });
    }
  }

  formatDecimalPrice(totalPrice) {
    this.componentFeaturesService.useComponent('quotator');
    this.componentFeaturesService.useRule('decimal-price');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      if (constraints.includes(this.product.product_code)) {
        this.price = parseFloat(totalPrice);
        this.price = this.price.toString().replace('.', ',');
        return true;
      } else {
        this.price = parseFloat(totalPrice);
        return false;
      }
    } else {
      this.price = parseFloat(totalPrice);
    }
  }

  getSeniority(date: string) {
    const today = moment();
    const birthday = moment(date);
    return today.diff(birthday, 'year');
  }

  // End Quote - request create

  // Checkout - request create
  checkout() {
    if (this.formQuotator.valid) {
      const order = this.createOrderObj();
      this.sendCheckoutAction(order);
    } else {
      this.validateAllFormFields(this.formQuotator);
    }
  }

  sendCheckoutAction(order: any) {
    const action = {
      action: 'checkout_product',
      payload: {
        product: this.product,
        order: order,
        router: 'checkout'
      }
    };
    this.emitActionEvent(action);
  }

  emitActionEvent(action: any) {
    this.actionEvent.next(action);
  }


  createOrderObj() {
    this.dataService.setValueInputChoise(this.formQuotator.get('choiseTypeHome').value);
    return {
      order: {
        line_items_attributes: {
          0: {
            variant_id: this.product.variants.find(elem => this.formQuotator.get('choisePaymentType').value === 'M' ? elem.sku.includes('1m') : elem.sku.includes('12m')).id,
            start_date: moment(TimeHelper.fromNgbDateToDate(this.formQuotator.get('startDate').value)).format('YYYY-MM-DD'),
            payment_frequency: this.formQuotator.get('choisePaymentType').value,
            house_attributes: {
              sqm: this.formQuotator.get('area').value,
              usage: this.formQuotator.get('choiseTypeHome').value,
              state_id: this.formQuotator.get('provinceSelect').value.id,
            },
            insurance_info_attributes: {
              quotation_maximal: Number(this.formQuotator.get('choiseMassimali').value)
            }
          }
        }
      }
    };
  }

  // End Checkout - request create

  getItalianResidentialStates() {
    this.nypUserService.getCountries(this.dataService.countriesEndpoint)
      .pipe(
        map<Country[], Country>(values =>
          values.find(country => country.iso3 === 'ITA')
        ),
        tap(italy => this.residentialItalianCountry = italy),
        switchMap(italy =>
          this.nypUserService.getProvince(italy.id)
        )
      )
      .subscribe(states => {
        this.residentialStates = states;
      });
  }

  customCompare(o1: { id: any, name: string }, o2: { id: any, name: string }): boolean {
    return o1 && o2 && o1.id === o2.id;
  }

  getStateObject(stateAbbrName: string) {
    this.states = this.residentialStates.find(state => state);
    return this.residentialStates.find(state => state.abbr === stateAbbrName);
  }

  validateAllFormFields(formGroup: UntypedFormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof UntypedFormControl) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  private getTooltipPrice(): boolean {
    this.componentFeaturesService.useComponent('quotator');
    this.componentFeaturesService.useRule('tooltip-price');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      return !!constraints.includes(this.product.product_code);
    }
  }
  private annualPrize(): void {
    this.componentFeaturesService.useComponent('quotator');
    this.componentFeaturesService.useRule('annual-prize');
    if (this.componentFeaturesService.isRuleEnabled()) {
      this.product.total_price = this.product.annual_price;
    }
  }

  openTooltip(tooltip, text: string) {
    tooltip.close();
    tooltip.open({ text });
  }
}
