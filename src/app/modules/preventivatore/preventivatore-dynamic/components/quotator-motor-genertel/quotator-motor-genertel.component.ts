import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { PreventivatoreAbstractComponent } from '../preventivatore-abstract/preventivatore-abstract.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { TimeHelper } from '../../../../../shared/helpers/time.helper';
import * as moment from 'moment';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Country } from '@model';
import { DataService, InsurancesService, UserService } from '@services';
import { PreventivatoreConstants } from '../../../PreventivatoreConstants';
import { LoaderService } from '../../../../../core/services/loader.service';
import { NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-quotator-motor-genertel',
  templateUrl: './quotator-motor-genertel.component.html',
  styleUrls: ['../preventivatore-basic.component.scss', './quotator-motor-genertel.component.scss']
})
export class QuotatorMotorGenertelComponent extends PreventivatoreAbstractComponent implements OnInit, OnChanges {

  @Input() product;
  @Output() actionEvent = new EventEmitter<any>();
  @Output() swipeEvent = new EventEmitter<string>();

  maxDateBirthdayContractor: NgbDate = TimeHelper.fromDateToNgbDate(moment().subtract(18, 'y').toDate());
  minDateBirthdayContractor: NgbDate = TimeHelper.fromDateToNgbDate(moment().subtract(120, 'y').toDate());
  todayDate: NgbDate = TimeHelper.fromDateToNgbDate(moment().toDate());
  formQuotator: FormGroup;
  price = 0;
  formResIsValid = true;
  linkRedirectGenertel: string;

  autocompleteCar: google.maps.places.Autocomplete;
  autocompleteVan: google.maps.places.Autocomplete;

  residentialStates: any;
  residentialCities: any;
  residentialItalianCountry: Country;
  cities: any;
  flagAddress = false;

  listTopon = [
    { codDatoAssoluto: 1, descrizione: 'Via', descBrev: 'V.' },
    { codDatoAssoluto: 2, descrizione: 'Viale', descBrev: 'V.LE' },
    { codDatoAssoluto: 3, descrizione: 'Piazza', descBrev: 'P.ZA' },
    { codDatoAssoluto: 4, descrizione: 'Corso', descBrev: 'C.SO' },
    { codDatoAssoluto: 5, descrizione: 'Strada', descBrev: 'STR.' },
    { codDatoAssoluto: 6, descrizione: 'Vicolo', descBrev: 'VICOLO' },
    { codDatoAssoluto: 7, descrizione: 'Contrada', descBrev: 'CONTRADA' },
    { codDatoAssoluto: 8, descrizione: 'Largo', descBrev: 'L.GO' },
    { codDatoAssoluto: 9, descrizione: 'Piazzale', descBrev: 'P.LE' },
    { codDatoAssoluto: 10, descrizione: 'Localita', descBrev: 'LOC.' },
    { codDatoAssoluto: 11, descrizione: 'Salita', descBrev: 'SAL.' },
    { codDatoAssoluto: 12, descrizione: 'Circonvallazione', descBrev: 'CIRC.NE' },
    { codDatoAssoluto: 13, descrizione: 'Traversa', descBrev: 'TRAV.' },
    { codDatoAssoluto: 14, descrizione: 'Borgo', descBrev: 'B.GO' },
    { codDatoAssoluto: 15, descrizione: 'Frazione', descBrev: 'FRAZ.' },
    { codDatoAssoluto: 16, descrizione: 'Lungotevere', descBrev: 'L.TEVERE' },
    { codDatoAssoluto: 17, descrizione: 'Sestriere', descBrev: 'SESTIERE' },
    { codDatoAssoluto: 18, descrizione: 'Villaggio', descBrev: 'VILLAGIO' },
    { codDatoAssoluto: 19, descrizione: 'Piazzetta', descBrev: 'P.TTA' },
    { codDatoAssoluto: 20, descrizione: 'Galleria', descBrev: 'GALL.' },
    { codDatoAssoluto: 21, descrizione: 'Viottolo', descBrev: 'VIOTT' },
    { codDatoAssoluto: 99, descrizione: 'Altro', descBrev: '' },
  ];
  states: any;

  constructor(
    private formBuilder: FormBuilder,
    ref: ChangeDetectorRef,
    private dataService: DataService,
    protected nypUserService: NypUserService,
    public insuranceService: InsurancesService,
    public loaderService: LoaderService
  ) {
    super(ref);
  }

  ngOnInit() {
    this.getItalianResidentialStates();
    this.initFormQuotator();
    this.linkRedirectGenertel = (this.product.product_code === 'ge-motor-car' ? this.product.link_redirect_genertel_car : this.product.link_redirect_genertel_van);
  }

  initFormQuotator() {
    this.formQuotator = new FormGroup({
      licensePlate: new FormControl('', [Validators.required, Validators.pattern('[^\' \']+')]),
      birthdayContractor: new FormControl('', Validators.required),
      residentialAutocomplete: new FormControl('', Validators.required),
      choiseIsOwner: new FormControl(this.product.choise_contractor_is_owner.choise.value[0].response.value, Validators.required),
      birthdayInsured: new FormControl(''),
      residential: new FormGroup({
        residentialState: new FormControl('', Validators.required),
        residentialCity: new FormControl({ value: '', disabled: true }, Validators.required),
        addressType: new FormControl('', Validators.required),
        residentialAddress: new FormControl('', Validators.required),
        addressNumber: new FormControl('', Validators.required),
        postalCode: new FormControl('', [Validators.required, Validators.pattern('[(+).0-9\ ]*')]),
      })
    });
  }

  getFormResidential() {
    return this.formQuotator.controls.residential as FormGroup;
  }

  displayFieldCss(form: any, field: string) {
    return {
      'error-field': this.isFieldValid(form, field),
    };
  }

  isFieldValid(form: any, field: string) {
    return !form.get(field).valid && form.get(field).touched;
  }

  // Quote - request create
  createRequest() {
    /*    const birth_date = this.formQuotator.get('choiseIsOwner').value
          ? this.formQuotator.get('birthdayContractor').value
          : this.formQuotator.get('birthdayInsured').value;*/
    return {
      product_code: this.product.product_code,
      license_plate: this.formQuotator.get('licensePlate').value,
      birth_date: moment(TimeHelper.fromNgbDateToDate(this.formQuotator.get('birthdayContractor').value)).format('YYYY-MM-DD'),
      zipcode: this.getFormResidential().get('postalCode').value,
      province_code: this.getFormResidential().get('residentialState').value.abbr,
      toponym: this.getFormResidential().get('addressType').value.descrizione,
      city: this.getFormResidential().get('residentialCity').value.name,
      address: this.getFormResidential().get('residentialAddress').value,
      civic_number: this.getFormResidential().get('addressNumber').value
    };
  }

  calculatePrice() {
    if (this.formQuotator.valid) {
      const request = this.createRequest();
      this.loaderService.reset(PreventivatoreConstants.blockUiMainName);
      this.loaderService.start(PreventivatoreConstants.blockUiMainName);
      this.insuranceService.submitMotorGenertelQuotation(request).pipe(take(1)).subscribe((res) => {
        this.price = parseFloat(res.total);
        this.loaderService.stop(PreventivatoreConstants.blockUiMainName);
      }, (err) => {
        this.loaderService.stop(PreventivatoreConstants.blockUiMainName);
      });
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
    return {
      order: {
        line_items_attributes: {
          0: {
            variant_id: this.product.master_variant,
            start_date: moment().add(1, 'days').format('YYYY-MM-DD'),
            quantity: 1,
            instant: false,
            addon_ids: [],
            insurance_info_attributes: {
              quotation_address_attributes: {
                domicile_country: this.getFormResidential().get('residentialCity').value.name,
                domicile_country_id: this.states.country_id,
                domicile_state_id: this.cities.state_id,
                domicile_city: this.getFormResidential().get('residentialCity').value.name,
                domicile_toponym_code: this.getFormResidential().get('addressType').value.descrizione,
                domicile_street_name: this.getFormResidential().get('residentialAddress').value,
                domicile_house_number: this.getFormResidential().get('addressNumber').value,
                domicile_zipcode: this.getFormResidential().get('postalCode').value,
              },
              birth_date: this.formQuotator.controls.birthdayInsured.value
                ? moment(TimeHelper.fromNgbDateToDate(this.formQuotator.controls.birthdayInsured.value)).format('YYYY-MM-DD')
                : moment(TimeHelper.fromNgbDateToDate(this.formQuotator.controls.birthdayContractor.value)).format('YYYY-MM-DD')
            },
            car_attributes: {
              license_plate: this.formQuotator.get('licensePlate').value
            },
            contractor_is_owner: this.formQuotator.get('choiseIsOwner').value
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

  toggleEnable(el, input, formGroup: any, googleCity?: string) {
    if (el && el.id) {
      if (input === 'residentialCity') {
        if (el.cities_required === true) {
          formGroup.get(input).setValidators(Validators.required);
          formGroup.get(input).enable();
        } else {
          formGroup.get(input).setValidators(null);
        }
      }
    } else {
      formGroup.get(input).disable();
    }
  }

  customCompare(o1: { id: any, name: string }, o2: { id: any, name: string }): boolean {
    return o1 && o2 && o1.id === o2.id;
  }

  initAutocomplete() {
    this.clearInputResidential();
    this.flagAddress = false;
    const input = document.getElementById('residentialAutocomplete-' + this.product.product_code) as HTMLInputElement;
    if (this.product.product_code === 'ge-motor-car' && !this.autocompleteCar) {
      this.autocompleteCar = new google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: ['it'] },
        fields: ['address_components', 'geometry'],
        types: ['address'],
      });
      this.autocompleteCar.addListener('place_changed', () => {
        const place = this.autocompleteCar.getPlace();
        this.fillInAddress(place);
      });
    } else if (this.product.product_code === 'ge-motor-van' && !this.autocompleteVan) {
      this.autocompleteVan = new google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: ['it'] },
        fields: ['address_components', 'geometry'],
        types: ['address'],
      });
      this.autocompleteVan.addListener('place_changed', () => {
        const place = this.autocompleteVan.getPlace();
        this.fillInAddress(place);
      });
    }
  }

  fillInAddress(place: google.maps.places.PlaceResult) {
    this.states = this.residentialStates.find(state => state);
    this.flagAddress = false;
    let cityName;
    if (place.address_components) {
      document.getElementById('residentialAutocomplete-' + this.product.product_code).blur();
      const stateObj = this.getStateObject(place.address_components.find(elem => elem.types[0] === 'administrative_area_level_2').short_name);
      if (stateObj) {
        cityName = place.address_components.find(elem => elem.types[0] === 'locality') ?
          place.address_components.find(elem => elem.types[0] === 'locality').short_name :
          place.address_components.find(elem => elem.types[0] === 'administrative_area_level_3').short_name;
        this.toggleEnable(stateObj, 'residentialCity', this.getFormResidential(), cityName);
        this.getFormResidential().get('residentialState').patchValue(stateObj);
        if (!cityName) {
          this.formResIsValid = false;
          this.validateAllFormFields(this.getFormResidential());
        }
      }

      this.nypUserService.getCitiesByProvincia(stateObj.id).then((cities) => {
        this.residentialCities = cities;
        if (cityName) {
          this.getFormResidential().get('residentialCity').patchValue(this.getCityObject(cityName));
        } else {
          this.cities = this.residentialCities.find(city => city);
        }

        for (const component of place.address_components as google.maps.GeocoderAddressComponent[]) {
          const componentType = component.types[0];
          switch (componentType) {
            case 'street_number': {
              this.getFormResidential().get('addressNumber').patchValue(component.short_name);
              break;
            }
            case 'route': {
              const typeAddressAutocomplete = component.short_name.split(' ')[0];
              const typeFind = this.listTopon.find(topon =>
                topon.descrizione === typeAddressAutocomplete
                || topon.descBrev === typeAddressAutocomplete);
              this.getFormResidential().get('addressType').patchValue(typeFind || this.listTopon[this.listTopon.length - 1]);
              this.getFormResidential().get('residentialAddress').patchValue(typeFind
                ? component.long_name.replace(typeAddressAutocomplete, '')
                : component.long_name);
              break;
            }
            case 'postal_code': {
              this.getFormResidential().get('postalCode').patchValue(component.short_name);
              break;
            }
            default:
              break;
          }
        }
        if (this.getFormResidential().invalid) {
          this.formResIsValid = false;
          this.validateAllFormFields(this.getFormResidential());
        }
        this.calculatePrice();
      });
    } else {
      this.formResIsValid = false;
      this.validateAllFormFields(this.getFormResidential());
    }
  }

  getStateObject(stateAbbrName: string) {
    this.states = this.residentialStates.find(state => state);
    return this.residentialStates.find(state => state.abbr === stateAbbrName);
  }

  getCityObject(cityName: string) {
    this.cities = this.residentialCities.find(city => city);
    return this.residentialCities.find(city => city.name === cityName);
  }

  clearInputResidential() {
    this.getFormResidential().reset();
    this.formQuotator.get('residentialAutocomplete').reset();
  }

  changeValidationBirthInsured() {
    if (this.formQuotator.get('choiseIsOwner').value === 'true') {
      this.formQuotator.get('birthdayInsured').clearValidators();
      this.formQuotator.get('birthdayInsured').updateValueAndValidity();
      this.formQuotator.get('birthdayInsured').reset();
    } else {
      this.formQuotator.get('birthdayInsured').setValidators([Validators.required]);
      this.formQuotator.get('birthdayInsured').updateValueAndValidity();
    }
  }

  checkFocusForm() {
    let isUnTouched = true;
    for (const inputKey of Object.keys(this.getFormResidential().controls)) {
      if (this.getFormResidential().controls[inputKey].touched) {
        isUnTouched = false;
      }
    }
    return isUnTouched;
  }

  stringToBoolean(string: string) {
    switch (string.toLowerCase().trim()) {
      case 'true':
        return true;
      case 'false':
      case null:
        return false;
      default:
        return Boolean(string);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  addressIsValid() {
    this.flagAddress = true;
    this.formResIsValid = true;
  }

}
