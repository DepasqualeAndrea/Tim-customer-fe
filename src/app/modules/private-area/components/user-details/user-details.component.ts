import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AuthService, DataService, UserService } from '@services';
import { CheckoutContractor } from 'app/modules/checkout/checkout-step/checkout-step-address/checkout-step-address.model';
import { Address, City, Country, State, User } from '@model';
import * as moment from 'moment';
import { filter, finalize, switchMap, take, takeWhile, tap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { CONSTANTS } from 'app/app.constants';
import { PasswordHelper } from '../../../../shared/helpers/password.helper';
import { ConsentFormComponent } from 'app/shared/consent-form/consent-form.component';
import { FormHumanError } from '../../../../shared/errors/form-human-error.model';
import { SystemError } from '../../../../shared/errors/system-error.model';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { LocaleService } from '../../../../core/services/locale.service';
import { NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('consent') consent: ConsentFormComponent;

  fiscalCodePattern = '';
  professionVector = CONSTANTS.PROFESSIONS;
  educationVector = CONSTANTS.EDUCATIONS;
  salaryVector = CONSTANTS.SALARIES;

  contractor: CheckoutContractor;

  userDetailsForm: FormGroup;

  user: User;
  countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];

  birthStates: State[] = [];
  birthCities: City[] = [];

  residentialState: FormControl;
  residentialCountry: FormControl;
  residentialCity: FormControl;
  residentialAddress: FormControl;
  zipcode: FormControl;
  subscriptions: Subscription[] = [];
  birthCountry: FormControl;
  birthState: FormControl;
  birthCity: FormControl;
  newPwd: FormControl;
  confirmPwd: FormControl;
  phone_validator: boolean;

  lockedData = false;
  errorMessage = '';
  success = false;
  errorDetails = '';
  datasucaservice = '';

  showPasswordChange = false;
  showAditionalInfo = true;
  imaginCountries: Country[] = [];
  imaginStates: State[] = [];
  tempCountryId: any;
  tempCountry: any;
  tempStateId: any;
  tempState: any;
  // countrySelected: any;
  // stateSelected: any;
  isTenantImagin: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    protected nypUserService: NypUserService,
    private authService: AuthService,
    public dataService: DataService,
    public locale: LocaleService,
    public componentFeaturesService: ComponentFeaturesService,
  ) {
    if (this.locale.locale === 'it_IT') {
      this.fiscalCodePattern = '^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$';
    }

  }

  ngOnInit() {
    // get current user
    if (this.dataService.isTenant('imagin-es-es_db')) {
      this.isTenantImagin = true;
    }

    this.user = this.authService.loggedUser;
    this.lockedData = this.user.locked_anagraphic || (this.dataService.tenantInfo.sso.required || false);
    // build form
    const birthDate = this.user.address.birth_date ? moment(this.user.address.birth_date, 'YYYY-MM-DD').format('DD/MM/YYYY') : null;
    if (this.isTenantImagin) {
      this.showAditionalInfo = false;
      this.userDetailsForm = this.formBuilder.group({
        email: [null, Validators.required],
        firstname: [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z\ ]*')])],
        lastname: [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z\ ]*')])],
        taxcode: [null, Validators.required],
        phoneNumber: [null, Validators.compose([Validators.required, Validators.pattern('[(+).0-9\ ]*')])],
        birthDate: [null, Validators.required],
        // residentialCountry: [null],
        // residentiaState: [null],
        residentialCity: [null, Validators.required],
        zipcode: [null, Validators.required],
        residentialAddress: [null, Validators.required]
      });
      this.fillUserInfo();
    } else {
      this.userDetailsForm = this.formBuilder.group({
        email: [this.user.email === this.getEmailProv() ? undefined : this.user.email, Validators.compose([Validators.required, Validators.email])],
        firstname: [this.user.address.firstname, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z\ ]*')])],
        lastname: [this.user.address.lastname, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z\ ]*')])],
        taxcode: [this.user.address.taxcode, Validators.required],
        phoneNumber: [this.user.address.phone === this.getPhoneProv() ? undefined : this.user.address.phone, Validators.compose([Validators.required, Validators.pattern('[(+).0-9\ ]*')])],
        birthDate: [birthDate, Validators.required]
      }, { validator: this.ChangePasswordValidator });
    }
    // Use some parameter from BE to set the data after use imagin data box is clicked
    if (this.dataService.tenantInfo.tenant && this.locale.locale === 'en_GB') {
      this.userDetailsForm = this.formBuilder.group({
        email: [this.user.email, Validators.compose([Validators.required, Validators.email])],
        firstname: [this.user.address.firstname, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z\ ]*')])],
        lastname: [this.user.address.lastname, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z\ ]*')])],
        taxcode: this.user.address.taxcode = !!this.user.address.taxcode ? this.user.address.taxcode : this.generateRandomTaxCode(9),
        phoneNumber: [this.user.address.phone, Validators.compose([Validators.required, Validators.pattern('[(+).0-9\ ]*')])],
        birthDate: [birthDate, Validators.required]
      }, { validator: this.ChangePasswordValidator });
    }
    this.addFieldsForeverEditable();

    // for all fields but residentials & profession/education/salary,
    // once they have a value (after first update), they should be disabled
    if (!this.isTenantImagin) {
      this.addFieldsEditableOnlyOnce();
      this.initResidentialData().pipe(take(1), finalize(() => this.initResidentialLoad())).subscribe();
    }

    this.disableFilledFields();
    this.disableFilledFieldsIfHaveDefaultParams();


    // birth location data are uncomplete : we need to enable the dynamic loads for these fields
    if (!this.lockedData) {
      this.subscriptions.push(
        this.setupDynamicLoad(
          this.birthCountry,
          this.birthState,
          true,
          'countries',
          ['birthStates', 'birthCities'],
          'states_required',
          (id) => this.nypUserService.getProvince(id)
        ).subscribe(),
        this.setupDynamicLoad(
          this.birthState,
          this.birthCity,
          true,
          'birthStates',
          ['birthCities'],
          'cities_required',
          (id) => this.nypUserService.getCities(id)
        ).subscribe(),
        this.birthCountry.valueChanges.subscribe(() => this.birthCity.reset())
      );
    }
  }

  fillUserInfo() {
    return this.nypUserService.getUserDetails(this.user.id).subscribe(user => {
      if (!user.is_same_address) {
        const birthDate = this.user.address.birth_date ? moment(this.user.address.birth_date, 'YYYY-MM-DD').format('DD/MM/YYYY') : null;
        this.userDetailsForm.patchValue({
          email: this.user.email === this.getEmailProv() ? undefined : this.user.email,
          firstname: this.user.address.firstname,
          lastname: this.user.address.lastname,
          taxcode: this.user.address.taxcode,
          phoneNumber: this.user.address.phone === this.getPhoneProv() ? undefined : this.user.address.phone,
          birthDate: birthDate,
          // residentialCountry: this.user.address.residence_country,
          // residentialState: stateSelected ? stateSelected : null,
          residentialCity: this.user.address.city,
          zipcode: this.user.address.zipcode,
          residentialAddress: this.user.address.address1
        }, { emitEvent: false });
        this.userDetailsForm.controls.firstname.disable();
        this.userDetailsForm.controls.lastname.disable();
        this.userDetailsForm.controls.birthDate.disable();
        this.userDetailsForm.controls.taxcode.disable();
      }
    });
  }
  generateRandomTaxCode(iLen: number) {
    let taxCodeRnd = '';
    const sChrs = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    for (let i = 0; i < iLen; i++) {
      const randomPoz = Math.floor(Math.random() * sChrs.length);
      taxCodeRnd += sChrs.substring(randomPoz, randomPoz + 1);
    }
    return taxCodeRnd;
  }

  addFieldsEditableOnlyOnce() {
    if (this.isTenantImagin) {
      const birthCityName = this.user.address.birth_city ? this.user.address.birth_city.name : null;
      this.birthCity = new FormControl({ value: birthCityName, disabled: true })
      this.addControls('birthCity');
    } else {
      const birthCountryName = this.user.address.birth_country ? this.user.address.birth_country.name : null;
      const birthStateName = this.user.address.birth_state ? this.user.address.birth_state.name : null;
      const birthCityName = this.user.address.birth_city ? this.user.address.birth_city.name : null;
      this.birthCountry = new FormControl(birthCountryName, Validators.required);
      this.birthState = new FormControl({ value: birthStateName, disabled: true }, Validators.required);
      this.birthCity = new FormControl({ value: birthCityName, disabled: true }, Validators.required);
      this.addControls('birthCountry', 'birthState', 'birthCity');
    }
  }

  addFieldsForeverEditable() {

    if (this.isTenantImagin) {
      this.residentialCity = new FormControl(this.user.address.city)
      this.residentialAddress = new FormControl(this.user.address.address1)
      this.zipcode = new FormControl(this.user.address.zipcode)
      this.newPwd = new FormControl(null, [PasswordHelper.passwordValidator(8)]);
      this.confirmPwd = new FormControl(null, [PasswordHelper.passwordValidator(8)]);
      this.addControls('residentialCity', 'residentialAddress', 'zipcode', 'newPwd', 'confirmPwd');
    } else {
      this.userDetailsForm.addControl('profession', new FormControl(this.user.profession));
      this.userDetailsForm.addControl('education', new FormControl(this.user.education));
      this.userDetailsForm.addControl('salary', new FormControl(this.user.salary));
      this.residentialCountry = new FormControl(null, Validators.required);
      this.residentialState = new FormControl(null, Validators.required);
      this.residentialCity = new FormControl(this.user.address.city, Validators.required);
      this.residentialAddress = new FormControl(this.user.address.address1, Validators.required);
      this.zipcode = new FormControl(this.user.address.zipcode, Validators.required);
      this.newPwd = new FormControl(null, [PasswordHelper.passwordValidator(8)]);
      this.confirmPwd = new FormControl(null, [PasswordHelper.passwordValidator(8)]);
      this.addControls('residentialCountry', 'residentialState', 'residentialCity', 'residentialAddress', 'zipcode', 'newPwd', 'confirmPwd');
    }
  }
  submit() {
    this.errorMessage = '';
    this.errorDetails = '';
    this.success = false;
    for (const ctrl of Object.values(this.userDetailsForm.controls)) {
      ctrl.markAsTouched();
    }
    if (!this.userDetailsForm.valid) {
      return;
    }
    const updatedUser = Object.assign({}, this.user) as User;
    updatedUser.profession = this.userDetailsForm.value.profession;
    updatedUser.education = this.userDetailsForm.value.education;
    updatedUser.salary = this.userDetailsForm.value.salary;
    if (this.isTenantImagin) {
      updatedUser.phone = this.userDetailsForm.value.phoneNumber;
      updatedUser.email = this.userDetailsForm.value.email;
    }
    const userAcceptancesAttributes = {};
    this.user.user_acceptances.forEach((ua: any, index) => {
      if (ua.kind === 'privacy') {
        userAcceptancesAttributes[`${index}`] = {
          id: ua.id,
          value: this.consent.consentForm.controls[ua.tag].value
        };
      }
    });
    updatedUser.user_acceptances_attributes = userAcceptancesAttributes;
    const updatedAddress = Object.assign(this.user.address, this.userDetailsForm.value) as Address;
    if (!!this.newPwd.value) {
      updatedUser.password = this.newPwd.value;
    }
    if (this.isTenantImagin) {
      ;
      updatedAddress.country = null;
      updatedAddress.state = null;
      updatedAddress.city = this.userDetailsForm.value.residentialCity;
      updatedAddress.address1 = this.userDetailsForm.value.residentialAddress;
      updatedAddress.phone = this.userDetailsForm.value.phoneNumber;
      updatedAddress.zipcode = this.userDetailsForm.value.zipcode;
      delete updatedAddress.email;
    } else {
      updatedAddress.country_id = this.getDataId(this.residentialCountry, this.countries);
      updatedAddress.state_id = this.getDataId(this.residentialState, this.states);
      updatedAddress.city = this.residentialCity.value;
      updatedAddress.address1 = this.residentialAddress.value;
      delete updatedAddress.country;
      delete updatedAddress.state;

    }

    if (!this.lockedData) {
      updatedAddress.birth_country_id = this.getDataId(this.birthCountry, this.countries);
      updatedAddress.birth_state_id = this.getDataId(this.birthState, this.birthStates);
      updatedAddress.birth_city_id = this.birthCities.length ? this.getDataId(this.birthCity, this.birthCities) : this.birthCity.value;
    } else {
      updatedAddress.birth_country_id = (updatedAddress.birth_country || {}).id;
      updatedAddress.birth_state_id = (updatedAddress.birth_state || {}).id;
      updatedAddress.birth_city_id = (updatedAddress.birth_city || {}).id;
      delete updatedAddress.birth_country;
      delete updatedAddress.birth_state;
      delete updatedAddress.birth_city;
    }

    if (this.phone_validator) {
      updatedAddress.phone = this.userDetailsForm.value.phoneNumber;
    }

    updatedUser.bill_address_attributes = updatedAddress;
    delete updatedUser.address;

    this.nypUserService.editUser(updatedUser).pipe(take(1)).subscribe(
      () => {
        this.success = true;
        // refresh the user for the whole application
        this.authService.setCurrentUserFromLocalStorage();
      },
      (err) => this.handleError(err)
    );
  }


  ngOnDestroy() {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  private getEmailProv() {
    this.componentFeaturesService.useComponent('address-form-cse');
    this.componentFeaturesService.useRule('email-prov');
    return this.componentFeaturesService.getConstraints().get('email');
  }

  private getPhoneProv() {
    this.componentFeaturesService.useComponent('address-form-cse');
    this.componentFeaturesService.useRule('phone-prov');
    return this.componentFeaturesService.getConstraints().get('phone');
  }

  private ChangePasswordValidator: ValidatorFn = (fg: FormGroup) => {
    const pwd1 = fg.get('newPwd') && fg.get('newPwd').value;
    const pwd2 = fg.get('confirmPwd') && fg.get('confirmPwd').value;
    return (!pwd1 && !pwd2) || (pwd1 === pwd2) ? null : { changePassword: true };
  }

  private addControls(...controlNames: string[]) {
    for (const controlName of controlNames) {
      this.userDetailsForm.addControl(controlName, this[controlName]);
    }
  }

  private disableFilledFields() {
    this.componentFeaturesService.useComponent('user-details');
    this.componentFeaturesService.useRule('phonenumber');
    const constraints: Map<string, any> = this.componentFeaturesService.getConstraints();
    this.phone_validator = constraints.has('validator') && constraints.get('validator');
    for (const control of Object.values(this.userDetailsForm.controls)) {
      if (control.value) {
        control.disable();
      }
    }
    if (this.phone_validator) {
      this.userDetailsForm.controls['phoneNumber'].enable();
    }
  }

  private disableFilledFieldsIfHaveDefaultParams() {
    if (this.user.email === this.getEmailProv()) {
      this.userDetailsForm.controls['email'].disable();
    }
  }

  private initResidentialData(): Observable<any> {

    const address = this.user.address;
    // load countries whatever the case
    return this.nypUserService.getCountries(this.dataService.countriesEndpoint).pipe(
      tap((countries) => this.countries = countries),
      takeWhile(() => !!(address.country && address.country.id)),
      tap(() => this.initResidentialField(address.country.id, 'id', this.countries, this.residentialCountry)),
      // states required ? then load states
      takeWhile(() => address.country.states_required),
      takeWhile(() => !!(address.country && address.country.id)),
      switchMap(() => this.nypUserService.getProvince(address.country.id)),
      tap((states) => this.states = states),
      tap(() => this.initResidentialField(address.state.id, 'id', this.states, this.residentialState)),
    );
  }

  private initResidentialLoad(): void {
    this.subscriptions.push(
      this.setupDynamicLoad(
        this.residentialCountry,
        this.residentialState,
        true,
        'countries',
        ['states', 'cities'],
        'states_required',
        (id) => this.nypUserService.getProvince(id)
      ).subscribe(),
    );
  }

  private initResidentialField(userDataField: any, dataListField: 'id' | 'name', dataList: any[], formField: FormControl) {
    const index = dataList.findIndex(item => item[dataListField] === userDataField);
    if (formField !== undefined) {
      formField.setValue(index >= 0 ? index : null);
      formField.enable();
    }
  }

  private setupDynamicLoad(
    sourceField: FormControl,
    subField: FormControl,
    subFieldDisabled: boolean,
    sourceDataField: string,
    subDataFields: string[],
    subLoadNeededFieldName: string,
    subLoadFunction: (id: number) => Observable<any>,
  ): Observable<any> {

    return sourceField.valueChanges.pipe(
      tap(() => {
        if (subField && this.dataService.tenantInfo.tenant === 'chebanca_db') {
          subField.disable();
          if (subFieldDisabled) {
            subField.disable();
          }
        } else {
          subField.reset();
        }
        for (const data of subDataFields) {
          this[data] = [];
        }
      }),
      filter((selectedIndex: number) => !!selectedIndex),
      filter((selectedIndex: number) => this[sourceDataField][selectedIndex][subLoadNeededFieldName]),
      switchMap((selectedIndex: number) => subLoadFunction(this[sourceDataField][selectedIndex].id)),
      tap((newData: any[]) => {
        this[subDataFields[0]] = newData;
        if (subField && subFieldDisabled) {
          subField.enable();
        }
      }));
  }

  private getDataId(field: FormControl, datas: any[]): number {
    return field.value ? datas[field.value].id : null;
  }
  private handleError(error: any): void {
    console.error(error);
    if (error instanceof HttpErrorResponse) {

      if (error.error && error.error.error) {
        this.errorMessage = error.error.error;
        if (error.error.errors) {
          this.errorDetails = this.getErrorDetails(error.error.errors);
        }
      } else {
        this.errorMessage = error.statusText;
        if (error.error) {
          this.errorDetails = JSON.stringify(error.error);
        }
      }
      throw new FormHumanError(this.errorMessage);

    } else {
      this.errorMessage = 'Errore imprevisto';
      throw new SystemError('Un unexpected error occured while updating user info');
    }
  }

  private getErrorDetails(errorDetails: { key: string, errors: string[] }): string {
    let details = '';
    const entries = Object.entries(errorDetails);
    for (const [field, errors] of entries.slice(0, 2)) {
      details += `${field} (${errors.length ? errors[0] : 'errore'}), `;
    }
    if (details) {
      details = details.substring(0, details.length - 2);
    }
    if (entries.length > 2) {
      details += '…';
    }
    return details;
  }

  customCompare(o1: { id: any, name: string }, o2: { id: any, name: string }): boolean {
    return o1 && o2 && o1.id === o2.id;
  }
}
