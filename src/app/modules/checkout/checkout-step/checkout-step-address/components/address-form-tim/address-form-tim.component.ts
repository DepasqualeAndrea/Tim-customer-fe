import { NypIadCustomerService, NypUserService } from '@NYP/ngx-multitenant-core';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country, User } from '@model';
import { AuthService, DataService, UserService } from '@services';
import { TimMyBrokerCustomersService } from 'app/core/services/tim-my-broker-customers.service';
import { CheckoutStepService } from 'app/modules/checkout/services/checkout-step.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { CheckoutAddressForm } from '../../checkout-address-forms.interface';
import { CheckoutContractor } from '../../checkout-step-address.model';
import moment from 'moment';

@Component({
  selector: 'app-address-form-tim',
  templateUrl: './address-form-tim.component.html',
  styleUrls: ['./address-form-tim.component.scss']
})
export class AddressFormTimComponent implements CheckoutAddressForm, OnInit, OnDestroy {
  @Input() contractor: CheckoutContractor;
  @Input() residentDataDisabled: boolean;
  @Output() validityChange = new EventEmitter<boolean>();
  @Output() allFilled = new EventEmitter<boolean>();

  form: FormGroup;

  birthCountry: any;
  birthStates: any;
  birthCities: any;
  residentialCountries: any;
  defaultCountry = {
    id: null,
    name: null
  } as Country;
  residentialStates: any;
  residentialCities: string[] = [];

  public user: User;

  fiscalCodePattern = '^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$';
  namePattern = '[a-zA-Z\ òàùèéì\']*';
  birthDatePattern = /^([0]?[1-9]|[1|2][0-9]|[3][0|1])[.\/-]([0]?[1-9]|[1][0-2])[.\/-]([0-9]{4})$/;
  phoneNumberPattern = '[(+).0-9\/\ ]*';
  product: string;
  get tenant(): string {
    return this.dataService.tenantInfo.tenant;
  }

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    protected nypUserService: NypUserService,
    public dataService: DataService,
    private authService: AuthService,
    private checkoutStepService: CheckoutStepService,
    private timService: TimMyBrokerCustomersService,
    private nypIadCustomerService: NypIadCustomerService,
  ) { }

  ngOnInit() {
    this.user = this.authService.loggedUser;
    this.form = this.formBuilder.group(this.fromModelToView(this.contractor));
    this.getBirthCountries();
    this.setFormValidation();

    this.computeContractorChanges(this.form, this.contractor);

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.emitFormsValidityChange()
    });
    this.disableCompletedFields();
    this.setMyHomeReducerInfoSets();

    this.product = this.dataService.product.product_code;
  }

  setMyHomeReducerInfoSets() {
    if (this.timService.isUserFtth() && this.dataService.product.product_code === 'tim-my-home') {
      this.checkoutStepService.setReducerProperty({
        property: 'cost_item.informative_set_double',
        value: ''
      });
      this.checkoutStepService.setReducerProperty({
        property: 'cost_item.informative_set',
        value: ''
      });
    }
  }

  emitFormsValidityChange() {
    return this.validityChange.emit(this.form.valid);
  }

  setFormValidation() {
    const ctls = this.form.controls;
    ctls['firstName'].setValidators([Validators.required, Validators.pattern(this.namePattern)]);
    ctls['lastName'].setValidators([Validators.required, Validators.pattern(this.namePattern)]);
    ctls['fiscalCode'].setValidators([Validators.required, Validators.pattern(this.fiscalCodePattern)]);
    ctls['phoneNumber'].setValidators([Validators.required, Validators.pattern(this.phoneNumberPattern)]);
    ctls['birthDate'].setValidators([Validators.required, Validators.pattern(this.birthDatePattern)]);
    ctls['birthCity'].setValidators(Validators.required);
    ctls['residentialAddress'].setValidators(Validators.required);
    ctls['residentialCity'].setValidators(Validators.required);
    ctls['postCode'].setValidators(Validators.required);
    ctls['residentialCountry'].setValidators(Validators.required);
    ctls['residentialStates'].setValidators(Validators.required);
    ctls['birthCountry'].setValidators(Validators.required);
    ctls['birthStates'].setValidators(Validators.required);
    ctls['email'].setValidators([Validators.required, Validators.email]);
    ctls['birthStates'].disable();
  }

  getCitiesFromState(selectedStateId: number) {
    this.nypUserService.getCities(selectedStateId).subscribe(cities => {
      const citiesNames = cities.map(city => city.name)
      this.residentialCities = citiesNames
    })
  }

  getCitiesName(cities: any[]) {
    return cities.map((city) => city.name);
  }

  computeContractorChanges(form: FormGroup, contractor: CheckoutContractor) {
    form.patchValue(this.fromModelToView(contractor));
    this.setDefaultResidentialCountry()

    if (contractor) {
      this.toggleEnable(form.controls['birthCountry'].value, 'birthStates', true);
      this.toggleEnable(form.controls['birthStates'].value, 'birthCity', true);
      this.toggleEnable(form.controls['residentialStates'].value, 'residentialCity', true);
    }
    this.disableCompletedFields();
  }

  toggleEnable(el, input, keepValues?: boolean) {
    if (el && el.id) {
      if (!keepValues) {
        this.form.get(input).patchValue(null);
      }
      this.form.get(input).disable();
      if (input === 'birthStates') {
        if (!keepValues) {
          this.form.get('birthCity').patchValue(null);
        }
        this.form.get('birthCity').disable();
        if (el.states_required === true) {
          this.form.get(input).setValidators(Validators.required);
          this.form.get(input).enable();
          this.getBirthStates(el.id);
        } else {
          this.form.get('birthCity').setValidators(null);
          this.form.get(input).setValidators(null);
        }
      } else if (input === 'birthCity') {
        if (el.cities_required === true) {
          this.form.get(input).setValidators(Validators.required);
          this.form.get(input).enable();
          this.getBirthCities(el.id);
        } else {
          this.form.get(input).setValidators(null);
        }
      } else if (input === 'residentialCity') {
        this.form.get(input).setValidators(Validators.required);
        this.form.get(input).enable();
        this.getCitiesFromState(el.id);
      }
    } else {
      this.form.get(input).disable();
    }
  }

  getBirthCountries() {
    this.nypUserService.getCountries(this.dataService.countriesEndpoint).subscribe(countries => {
      this.dataService.setCountries(countries);
      this.birthCountry = countries;
    });
  }

  setDefaultResidentialCountry() {
    this.nypUserService.getCountries(this.dataService.countriesEndpoint).subscribe(countries => {
      this.dataService.setCountries(countries)
      this.defaultCountry = countries.find(country => country.iso_name === 'ITALIA')
      this.form.get('residentialCountry').setValue(this.defaultCountry)
      this.form.controls['residentialCountry'].disable()
      this.getResidentialState(this.defaultCountry.id)
    })
  }

  getBirthStates(stateId) {
    this.nypUserService.getProvince(stateId).subscribe(states => {
      this.birthStates = states;
    });
  }

  getResidentialState(residentialStateId) {
    this.nypUserService.getProvince(residentialStateId).subscribe(states => {
      this.residentialStates = states;
    });
  }

  getBirthCities(cityId) {
    this.nypUserService.getCities(cityId).subscribe(cities => {
      this.birthCities = cities;
    });
  }

  getContractorFromForm(): CheckoutContractor {
    this.updateUser();
    return this.computeModel();
  }

  computeModel(): CheckoutContractor {
    return this.fromViewToModel(this.form, true);
  }

  disableCompletedFields() {
    const ctls = this.form.controls;
    const residentialFields = [
      'postCode',
      'residentialCity',
      'residentialAddress',
      'residentialStates'
    ];
    if (this.form) {
      const fieldNames = Object.keys(ctls);
      fieldNames.forEach(fieldName => {
        if (!residentialFields.find(residentialField =>
          residentialField === fieldName
        )) {
          const value = this.form.get(fieldName).value;
          if (value && this.form.get(fieldName).valid && typeof (value) !== 'object') {
            ctls[fieldName].disable();
          }
        }
      });
      if (this.hasUserLockedAnagraphic()) {
        ctls['birthCountry'].disable();
        ctls['birthStates'].disable();
        ctls['birthCity'].disable();
      }
      ctls['fiscalCode'].disable();
      ctls['email'].enable();
      ctls['phoneNumber'].enable();
    }
  }

  fromModelToView(contractor: CheckoutContractor): { [key: string]: any } {
    return {
      firstName: contractor && contractor.firstName || undefined,
      lastName: contractor && contractor.lastName || undefined,
      fiscalCode: this.user && this.user.data && this.user.data.ndg || contractor && contractor.fiscalCode || undefined,
      phoneNumber: contractor && contractor.phoneNumber || undefined,
      birthDate: moment(contractor.birthDate).format('DD/MM/YYYY') || undefined,
      birthCountry: contractor && contractor.birthCountry && contractor.birthCountryId && { id: contractor.birthCountryId, name: contractor.birthCountry, states_required: true } || undefined,
      birthStates: contractor && { id: contractor.birthStateId, name: contractor.birthState, cities_required: true } || undefined,
      birthCity: contractor && { id: contractor.birthCityId, name: contractor.birthCity } || undefined,
      residentialAddress: contractor && contractor.address || undefined,
      residentialCity: contractor && contractor.residenceCity || undefined,
      postCode: contractor && contractor.zipCode || undefined,
      residentialCountry: this.defaultCountry || undefined,
      residentialStates: contractor && { id: contractor.residendeStateId, name: contractor.residendeState } || undefined,
      email: contractor.email,
      contractor: contractor,
    };
  }

  fromViewToModel(form: FormGroup, locked_anagraphic?: boolean): CheckoutContractor {
    const ctls = form.controls
    return {
      firstName: ctls['firstName'].value,
      lastName: ctls['lastName'].value,
      fiscalCode: ctls['fiscalCode'].value,
      phoneNumber: ctls['phoneNumber'].value,
      birthDate: ctls['birthDate'].value,
      birthCountry: ctls['birthCountry'].value ? ctls['birthCountry'].value.name : '',
      birthState: ctls['birthStates'].value ? ctls['birthStates'].value.name : '',
      birthCity: ctls['birthCity'].value ? ctls['birthCity'].value.name : '',
      birthCountryId: ctls['birthCountry'].value ? ctls['birthCountry'].value.id : '',
      birthStateId: ctls['birthStates'].value ? ctls['birthStates'].value.id : '',
      birthCityId: ctls['birthCity'].value ? ctls['birthCity'].value.id : '',
      address: ctls['residentialAddress'].value,
      residenceCity: ctls['residentialCity'].value,
      zipCode: ctls['postCode'].value,
      residenceCountry: ctls['residentialCountry'].value ? ctls['residentialCountry'].value.name : '',
      residendeState: ctls['residentialStates'].value ? ctls['residentialStates'].value.name : '',
      residenceCountryId: ctls['residentialCountry'].value ? ctls['residentialCountry'].value.id : '',
      residendeStateId: ctls['residentialStates'].value ? ctls['residentialStates'].value.id : '',
      locked_anagraphic: locked_anagraphic,
    };
  }

  updateUser() {
    const states = NypUserService.states
    const ctls = this.form.controls;

    if (this.form.invalid) return;

    const birthDateFormatted = ctls['birthDate'].value ? moment(ctls['birthDate'].value, 'DD/MM/YYYY').format('YYYY-MM-DD') : undefined;


    const [
      birth_country, birth_state, birth_state_abbr, birth_city, birth_country_id, birth_state_id, birth_city_id, birth_country_iso, date_of_birth,
      country, country_id, state, state_id, state_abbr, city, street, zip_code,
      education, salary, profession, primary_mail, primary_phone,
    ] = [
        this.birthCountry[ctls['birthCountry'].value] ?? ctls['birthCountry'].value.name,
        this.birthStates[ctls['birthStates'].value] ?? ctls['birthStates'].value.name,
        states.find(s => s.id == ctls['birthStates'].value.id).abbr,
        this.birthCities[ctls['birthCity'].value] ?? ctls['birthCity'].value.name,
        this.birthCountry[ctls['birthCountry'].value] ?? ctls['birthCountry'].value.id,
        this.birthStates[ctls['birthStates'].value] ?? ctls['birthStates'].value.id,
        this.birthCities[ctls['birthCity'].value] ?? ctls['birthCity'].value.id,
        ctls['birthCountry']?.value?.iso,

        birthDateFormatted ?? this.user.address.birth_date,

        ctls['residentialCountry'].value.name,
        ctls['residentialCountry'].value.id,
        ctls['residentialStates'].value.name ?? this.residentialStates.find(state => state.id == ctls['residentialStates'].value.id).name,
        ctls['residentialStates'].value.id ?? this.residentialStates.find(state => state.id == ctls['residentialStates'].value.id).id,
        states.find(s => s.id == ctls['residentialStates'].value.id).abbr, // state abbr
        ctls['residentialCity'].value ?? this.residentialCities[ctls['residentialCity'].value],
        ctls['residentialAddress'].value ?? this.user.address.address1,
        ctls['postCode'].value ?? this.user.address.zipcode,

        this.user.education,
        this.user.salary,
        this.user.profession,
        ctls['email'].value ?? this.user.email,
        ctls['phoneNumber'].value ?? this.user.address?.phone,
      ];

    this.nypUserService.editUser({
      data: {
        birth_country: birth_country?.name ?? birth_country, //string
        birth_country_id: birth_country?.id ?? birth_country_id, //number
        birth_country_abbr: birth_country.abbr ?? birth_country_iso, //number
        birth_state: birth_state?.name ?? birth_state, //string
        birth_state_id: birth_state?.id ?? birth_state_id,
        birth_state_abbr: birth_state_abbr,
        birth_city: birth_city?.name ?? birth_city, //string
        birth_city_id: birth_city?.id ?? birth_city_id,
        street: street, //string
        zip_code: zip_code, //string
        //city: city.name, //string
        //city_id: city.id, //number
        country: country?.name ?? country, //string
        country_id: country?.id ?? country_id,//number
        state: state?.name ?? state,//string
        state_id: state?.id ?? state_id, //number
        state_abbr: state_abbr,//string
        //gender: null, //string
        id: this.user.id,
        date_of_birth: date_of_birth, //string
        //language: null, //string
        //legal_form: null, //string
        education: education,//string
        salary: salary,//string
        profession: profession,//string
        primary_mail: primary_mail,//string
        primary_phone: primary_phone,//string
        //secondary_mail: this.user.email, //string
        //secondary_phone: this.user.address?.phone, //string
        //street_number: null, //string
        name: this.user.firstname,//string
        surname: this.user.lastname, //string
        tax_code: this.user.address.taxcode,
        userAcceptances: this.user.user_acceptances,
        //username: null, //string
      }
    }).subscribe(() => this.authService.setCurrentUserFromLocalStorage());
  }

  disableFields(fieldNames: string[]) {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy(): void {
  }

  getErrorFieldClass(formControlName: string): string {
    if (this.getFieldInvalidError(formControlName)) {
      if (this.getFieldError(formControlName, 'required')) {
        return 'error-field'
      }
      if (this.getFieldError(formControlName, 'pattern')) {
        return 'warning-field'
      }
    }
  }

  getFieldInvalidError(formControlName: string): boolean {
    return this.form.get(formControlName).invalid &&
      (this.form.get(formControlName).touched || this.form.get(formControlName).dirty)
  }

  getFieldError(formControlName: string, errorType: string): boolean {
    return this.form.get(formControlName).errors && this.form.get(formControlName).errors[errorType]
  }

  getMailNotConfirmedError(): boolean {
    return this.form.errors && this.form.errors.mailNotConfirmed
  }

  customCompare(o1: { id: any, name: string }, o2: { id: any, name: string }): boolean {
    return o1 && o2 && o1.id === o2.id;
  }

  hasUserLockedAnagraphic(): boolean {
    return this.user.locked_anagraphic
  }

}
