import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, ValidatorFn, FormControl, AbstractControl } from '@angular/forms';
import { UserService, DataService, AuthService } from '@services';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { User, Country } from '@model';
import { take } from 'rxjs/operators';
import { ConsentFormComponent } from 'app/shared/consent-form/consent-form.component';
import { CheckoutAddressForm } from '../../../checkout-address-forms.interface';
import { CheckoutContractor } from '../../../checkout-step-address.model';
import { CONSTANTS } from 'app/app.constants';
import { CheckoutStepLdapLoginComponent } from 'app/modules/checkout/checkout-step/checkout-step-insurance-info/checkout-step-ldap-login/checkout-step-ldap-login.component';
import { UserTypes } from 'app/components/public/products-container/products-tim-employees/user-types.enum';
import { NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
    selector: 'app-address-form-tim-employees',
    templateUrl: './address-form-tim-employees.component.html',
    styleUrls: ['./address-form-tim-employees.component.scss'],
    standalone: false
})
export class AddressFormTimEmployeesComponent implements CheckoutAddressForm, OnInit, OnDestroy {

  @ViewChild('consent', { static: true }) consent: ConsentFormComponent;
  @ViewChild('ldapLoginForm') ldapLoginForm: CheckoutStepLdapLoginComponent;

  @Input() contractor: CheckoutContractor;
  @Input() residentDataDisabled: boolean;
  @Output() validityChange = new EventEmitter<boolean>();
  @Output() allFilled = new EventEmitter<boolean>();

  form: UntypedFormGroup;

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

  user: User;

  fiscalCodePattern = CONSTANTS.FISCAL_CODE_PATTERN;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    protected nypUserService: NypUserService,
    public dataService: DataService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.user = this.authService.loggedUser;
    this.form = this.formBuilder.group(this.fromModelToView(this.contractor));
    this.getBirthCountries();
    this.setFormValidation();
    this.computeContractorChanges(this.form, this.contractor);

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.emitFormsValidityChange();
    });
    this.disableCompletedFields();
  }

  getConsentFormValidity() {
    this.emitFormsValidityChange();
  }

  validateLdapLoginForm(isFormValid: boolean) {
    this.validityChange.emit(isFormValid)
  }

  emitFormsValidityChange() {
    return this.validityChange.emit(this.form.valid &&
      this.consent.consentForm && this.consent.consentForm.valid);
  }

  setFormValidation() {
    const ctls = this.form.controls;
    ctls['firstName'].setValidators([Validators.required, Validators.pattern(CONSTANTS.NAME_PATTERN)]);
    ctls['lastName'].setValidators([Validators.required, Validators.pattern(CONSTANTS.NAME_PATTERN)]);
    ctls['cid'].setValidators([this.setCidValidator()]);
    ctls['fiscalCode'].setValidators([Validators.required, Validators.pattern(CONSTANTS.FISCAL_CODE_PATTERN)]);
    ctls['phoneNumber'].setValidators([Validators.required, Validators.pattern(CONSTANTS.PHONE_NUMBER_PATTERN)]);
    ctls['birthDate'].setValidators([Validators.required, Validators.pattern(CONSTANTS.BIRTH_DATE_PATTERN)]);
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

  private setCidValidator(): ValidatorFn {
    return this.authService.loggedUser.data.user_type === UserTypes.RETIREE
      ? Validators.nullValidator
      : Validators.required;
  }

  public showIfControlEnabled(formControlName: string): boolean {
    const validator = this.form.controls[formControlName].validator({} as AbstractControl);
    return validator && validator.required;
  }

  getCitiesFromState(selectedStateId: number) {
    this.nypUserService.getCities(selectedStateId).subscribe(cities => {
      this.residentialCities = cities.map(city => city.name);
    })
  }

  getCitiesName(cities: any[]) {
    return cities.map((city) => city.name);
  }

  computeContractorChanges(form: UntypedFormGroup, contractor: CheckoutContractor) {
    form.patchValue(this.fromModelToView(contractor));
    this.setDefaultResidentialCountry();

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
    this.nypUserService.getDefaultCountry().subscribe(country => {
      this.defaultCountry = country;
      this.form.get('residentialCountry').setValue(this.defaultCountry);
      this.getResidentialState(this.defaultCountry.id);
    });
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
      'residentialStates',
      'residentialCountry'
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
        ctls['birthDate'].disable();
        ctls['birthCountry'].disable();
        ctls['birthStates'].disable();
        ctls['birthCity'].disable();
      }
      ctls['email'].enable();
      ctls['phoneNumber'].enable();
    }
  }

  getBirthDateFromFiscalCode(fiscalCode: string) {
    const encodedBirthDate = fiscalCode.substr(6, 5).toUpperCase();
    const monthLiterals = ['A', 'B', 'C', 'D', 'E', 'H', 'L', 'M', 'P', 'R', 'S', 'T'];

    const encodedBirthYear = parseInt(encodedBirthDate.substr(0, 2), 10);
    const encodedBirthMonth = encodedBirthDate.substr(2, 1);
    const encodedBirthDay = parseInt(encodedBirthDate.substr(3, 2), 10);

    const decodedBirthDay = ('0' + (encodedBirthDay % 40)).slice(-2);
    const decodedBirthMonth = ('0' + (monthLiterals.findIndex(ml => ml === encodedBirthMonth) + 1)).slice(-2);
    const decodedBirthYear = encodedBirthYear <= new Date().getFullYear() - 2000 ? encodedBirthYear + 2000 : encodedBirthYear + 1900;
    return `${decodedBirthDay}/${decodedBirthMonth}/${decodedBirthYear}`;
  }

  fromModelToView(contractor: CheckoutContractor): { [key: string]: any } {
    return {
      firstName: contractor && contractor.firstName || undefined,
      lastName: contractor && contractor.lastName || undefined,
      cid: this.user && this.user.data && this.user.data.cid || undefined,
      fiscalCode: contractor && contractor.fiscalCode || undefined,
      phoneNumber: contractor && contractor.phoneNumber || undefined,
      birthDate: contractor && contractor.fiscalCode ? this.getBirthDateFromFiscalCode(contractor && contractor.fiscalCode) : undefined,
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

  fromViewToModel(form: UntypedFormGroup, locked_anagraphic?: boolean): CheckoutContractor {
    const ctls = form.controls;
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
    const ctls = this.form.controls;
    if (this.form.valid) {
      const userId = this.user.id
      const requestBody = {
        user: {
          email: ctls['email'].value,
          phone: ctls['phoneNumber'].value,
          user_acceptances_attributes: this.getUpdatedUserFlags()
        }
      }
      this.userService.ldapUpdate(requestBody, userId).pipe(take(1)).subscribe(() => {
        this.authService.setCurrentUserFromLocalStorage()
      })
    }
  }

  getUpdatedUserFlags() {
    const userAcceptancesAttributes = {};
    this.user.user_acceptances.forEach((ua: any, index) => {
      if (ua.kind === 'privacy') {
        userAcceptancesAttributes[`${index}`] = {
          id: ua.id,
          value: !!this.consent.consentForm.controls[ua.tag].value ? true : false
        };
      }
    });
    return userAcceptancesAttributes;
  }

  disableFields(fieldNames: string[]) {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy(): void {
  }

  getErrorFieldClass(formControlName: string): string {
    if (this.getFieldInvalidError(formControlName)) {
      if (this.getFieldError(formControlName, 'required')) {
        return 'error-field';
      }
      if (this.getFieldError(formControlName, 'pattern')) {
        return 'warning-field';
      }
    }
  }

  getFieldInvalidError(formControlName: string): boolean {
    return this.form.get(formControlName).invalid &&
      (this.form.get(formControlName).touched || this.form.get(formControlName).dirty);
  }

  getFieldError(formControlName: string, errorType: string): boolean {
    return this.form.get(formControlName).errors && this.form.get(formControlName).errors[errorType];
  }

  getMailNotConfirmedError(): boolean {
    return this.form.errors && this.form.errors.mailNotConfirmed;
  }

  customCompare(o1: { id: any, name: string }, o2: { id: any, name: string }): boolean {
    return o1 && o2 && o1.id === o2.id;
  }

  hasUserLockedAnagraphic(): boolean {
    return this.user.locked_anagraphic;
  }

}
