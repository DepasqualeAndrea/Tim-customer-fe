import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AcceptanceAttributes, Address, City, Country, State, User } from '@model';
import { AuthService, DataService, UserService } from '@services';
import { UserTypes } from 'app/components/public/products-container/products-tim-employees/user-types.enum';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { CheckoutContractor } from 'app/modules/checkout/checkout-step/checkout-step-address/checkout-step-address.model';
import { ConsentFormComponent } from 'app/shared/consent-form/consent-form.component';
import { FormHumanError } from 'app/shared/errors/form-human-error.model';
import { SystemError } from 'app/shared/errors/system-error.model';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { filter, finalize, switchMap, take, takeWhile, tap } from 'rxjs/operators';
import { NypIadCustomerService, NypUserService } from '@NYP/ngx-multitenant-core';
@Component({
    selector: 'app-user-tim-details',
    templateUrl: './user-tim-details.component.html',
    styleUrls: ['./user-tim-details.component.scss'],
    standalone: false
})
export class UserTimDetailsComponent implements OnInit {
  @ViewChild('consent', { static: true }) consent: ConsentFormComponent;

  fiscalCodePattern = '^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$';

  contractor: CheckoutContractor;
  userDetailsForm: UntypedFormGroup;
  user: User;

  countries: Country[] = [];
  states: State[] = [];
  cities: any[] = [];
  birthStates: State[] = [];
  birthCities: City[] = [];

  residentialState: UntypedFormControl;
  residentialCountry: UntypedFormControl;
  defaultCountry = {
    id: null,
    name: null
  } as Country
  residentialCity: UntypedFormControl;
  residentialAddress: UntypedFormControl;
  zipcode: UntypedFormControl;
  subscriptions: Subscription[] = [];
  birthCountry: UntypedFormControl;
  birthState: UntypedFormControl;
  birthCity: UntypedFormControl;
  newPwd: UntypedFormControl;
  confirmPwd: UntypedFormControl;
  phone_validator: boolean;
  email_validator: boolean;

  lockedData = false;
  errorMessage = '';
  success = false;
  errorDetails = '';

  showPasswordChange = true;
  showAditionalInfo = false;

  userAcceptances: { tag: string, value: boolean }[] = [];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private nypIadCustomerService: NypIadCustomerService,
    protected nypUserService: NypUserService,
    private authService: AuthService,
    public dataService: DataService,
    public componentFeaturesService: ComponentFeaturesService,
  ) { }

  ngOnInit() {
    this.user = this.authService.loggedUser;

    const isUserRetiree = !!this.user.data.user_type && this.user.data.user_type === UserTypes.RETIREE
    this.lockedData = this.user.locked_anagraphic || isUserRetiree
    const birthDate = moment(this.user.address.birth_date).format('DD/MM/YYYY').split('-').join('/')
    this.userDetailsForm = this.formBuilder.group({
      email: [this.user.email && this.user.email, Validators.compose([Validators.required, Validators.email])],
      firstname: [this.user.address.firstname, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z\ ]*')])],
      lastname: [this.user.address.lastname, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z\ ]*')])],
      taxcode: [this.user.data.ndg || this.user.address.taxcode, Validators.required],
      phoneNumber: [this.user.address.phone === this.getPhoneProv() ? undefined : this.user.address.phone, Validators.compose([Validators.required, Validators.pattern('[(+).0-9\ ]*')])],
      birthDate: [birthDate, Validators.required]
    });
    this.addFieldsEditableOnlyOnce();
    this.disableFilledFields();
    this.addFieldsForeverEditable();
    this.initResidentialData().pipe(take(1), finalize(() => this.initResidentialLoad())).subscribe();

    if (!this.lockedData || isUserRetiree) {
      this.subscriptions.push(
        this.setupDynamicLoadDefault(
          this.residentialCountry,
          this.residentialState,
          true,
          'defaultCountry',
          ['states', 'cities'],
          'states_required',
          (id) => this.nypUserService.getProvince(id)
        ).subscribe(),
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

    this.setDefaultCountry()
  }

  setDefaultCountry() {
    this.nypUserService.getCountries(this.dataService.countriesEndpoint).subscribe(countries => {
      this.dataService.setCountries(countries)
      this.defaultCountry = countries.find(country => country.iso_name === 'ITALIA')
      this.userDetailsForm.get('residentialCountry').setValue(this.defaultCountry)
    })
  }

  addFieldsEditableOnlyOnce() {
    this.residentialCountry = new UntypedFormControl({ value: null, /* disabled: true */ }, Validators.required);
    this.residentialCountry.registerOnChange((country) => this.nypUserService.getProvince(country.id));

    this.addControls('residentialCountry');
  }

  addFieldsForeverEditable() {
    this.residentialState = new UntypedFormControl(null, Validators.required);
    this.residentialCity = new UntypedFormControl(this.user.address.city, Validators.required);
    this.residentialAddress = new UntypedFormControl(this.user.address.address1, Validators.required);
    this.zipcode = new UntypedFormControl(this.user.address.zipcode, Validators.required);

    this.birthCountry = new UntypedFormControl({ value: this.user.address.birth_country?.name, disabled: true }, Validators.required);
    this.birthState = new UntypedFormControl({ value: this.user.address.birth_state?.name, disabled: true }, Validators.required);
    this.birthCity = new UntypedFormControl({ value: this.user.address.birth_city?.name, disabled: true }, Validators.required);

    this.addControls('residentialState', 'residentialCity', 'residentialAddress', 'zipcode', 'birthCountry', 'birthState', 'birthCity');
  }

  submit() {
    this.errorMessage = '';
    this.errorDetails = '';
    this.success = false;
    Object.values(this.userDetailsForm.controls).forEach(ctrl => ctrl.markAsTouched());

    if (!this.userDetailsForm.valid) {
      return;
    }

    const [
      birth_country, birth_state, birth_city, date_of_birth,
      country, state, city, street, zip_code,
      education, salary, profession, primary_mail, primary_phone,
    ] = [
        this.countries[this.userDetailsForm.value['birthCountry']],
        this.states[this.userDetailsForm.value['birthState']],
        this.cities[this.userDetailsForm.value['birthCity']],
        this.userDetailsForm.value['birthDate'] ?? this.user.address.birth_date,

        this.userDetailsForm.value['residentialCountry'],
        this.states[this.userDetailsForm.value['residentialState']],
        this.cities[this.userDetailsForm.value['residentialCity']],
        this.userDetailsForm.value['residentialAddress'] ?? this.user.address.address1,
        this.userDetailsForm.value['zipcode'] ?? this.user.address.zipcode,

        this.userDetailsForm.value['education'] ?? this.user.education,
        this.userDetailsForm.value['salary'] ?? this.user.salary,
        this.userDetailsForm.value['profession'] ?? this.user.profession,
        this.userDetailsForm.value['email'] ?? this.user.email,
        this.userDetailsForm.value['phoneNumber'] ?? this.user.address?.phone,
      ];

    this.nypIadCustomerService.editCustomerUserDetails({
      data: {
        birth_country: birth_country?.name, //string
        birth_country_id: birth_country?.id, //number
        birth_country_abbr: birth_country?.iso, //number
        birth_state: birth_state?.name, //string
        birth_state_id: birth_state?.id,
        birth_city: birth_city?.name, //string
        street: street, //string
        zip_code: zip_code, //string
        city: city.name, //string
        city_id: city.id, //number
        country: country?.name, //string
        country_id: country?.id, //number
        state: state?.name, //string
        state_id: state?.id, //number
        state_abbr: state?.abbr,//string
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
        userAcceptances: this.userAcceptances,
        //username: null, //string
      }
    }).pipe(take(1)).subscribe(
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

  private getPhoneProv() {
    this.componentFeaturesService.useComponent('address-form-cse');
    this.componentFeaturesService.useRule('phone-prov');
    return this.componentFeaturesService.getConstraints().get('phone');
  }

  private addControls(...controlNames: string[]) {
    for (const controlName of controlNames) {
      this.userDetailsForm.addControl(controlName, this[controlName]);
    }
  }

  private disableFilledFields() {
    for (const control of Object.values(this.userDetailsForm.controls)) {
      if (control.value) {
        control.disable();
      }
    }
    this.enableConstraintValidatorFields()
  }

  enableConstraintValidatorFields(): void {
    this.phone_validator = this.getValidatorConstraint('phonenumber')
    this.email_validator = this.getValidatorConstraint('email')
    if (this.email_validator) {
      this.userDetailsForm.controls['email'].enable();
    }
    if (this.phone_validator) {
      this.userDetailsForm.controls['phoneNumber'].enable();
    }
  }

  getValidatorConstraint(formControlName: string): boolean {
    this.componentFeaturesService.useComponent('user-details');
    this.componentFeaturesService.useRule(formControlName);
    const constraints: Map<string, any> = this.componentFeaturesService.getConstraints();
    return constraints.has('validator') && constraints.get('validator');
  }

  private initResidentialData(): Observable<any> {
    const address = this.user.address;
    // load countries whatever the case
    return this.nypUserService.getCountries(this.dataService.countriesEndpoint).pipe(
      tap((countries) => this.countries = countries),
      takeWhile(() => !!address.country?.id),
      tap(() => this.initResidentialField(address.country.id, 'id', this.countries, this.residentialCountry)),
      tap(() => this.user.locked_anagraphic ? null : this.initResidentialField(address.country.id, 'id', this.countries, this.birthCountry)),
      // states required ? then load states
      //takeWhile(() => address.country.states_required),
      takeWhile(() => !!address.country?.id),
      switchMap(() => this.nypUserService.getProvince(address.country.id)),
      tap((states) => this.states = states),
      tap(() => this.initResidentialField(address.state.id, 'id', this.states, this.residentialState)),
      tap(() => this.user.locked_anagraphic ? null : this.initResidentialField(address.state.id, 'id', this.states, this.birthState)),
      // cities required ? then load cities
      //takeWhile(() => address.state.cities_required),
      takeWhile(() => !!address.state?.id),
      switchMap(() => this.nypUserService.getCities(address.state.id)),
      tap((cities) => this.cities = cities),
      tap(() => this.initResidentialField(address.city, 'name', this.cities, this.residentialCity)),
      tap(() => this.user.locked_anagraphic ? null : this.initResidentialField(address.city, 'name', this.cities, this.birthCity)),
    );
  }

  private initResidentialLoad(): void {
    this.subscriptions.push(
      this.setupDynamicLoad(
        this.residentialState,
        this.residentialCity,
        true,
        'states',
        ['cities'],
        'cities_required',
        (id) => this.nypUserService.getCities(id)
      ).subscribe(),
    );
  }

  private initResidentialField(userDataField: any, dataListField: 'id' | 'name', dataList: any[], formField: UntypedFormControl) {
    const index = dataList.findIndex(item => item[dataListField] === userDataField);
    formField.setValue(index >= 0 ? index : null);
    formField.enable();
  }

  private setupDynamicLoad(
    sourceField: UntypedFormControl,
    subField: UntypedFormControl,
    subFieldDisabled: boolean,
    sourceDataField: string,
    subDataFields: string[],
    subLoadNeededFieldName: string,
    subLoadFunction: (id: number) => Observable<any>,
  ): Observable<any> {

    return sourceField.valueChanges.pipe(
      tap(() => {
        if (subField) {
          subField.reset();
          if (subFieldDisabled) {
            subField.disable();
          }
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

  private setupDynamicLoadDefault(
    sourceField: UntypedFormControl,
    subField: UntypedFormControl,
    subFieldDisabled: boolean,
    sourceDataField: string,
    subDataFields: string[],
    subLoadNeededFieldName: string,
    subLoadFunction: (id: number) => Observable<any>,
  ): Observable<any> {

    return sourceField.valueChanges.pipe(
      tap(() => {
        if (subField) {
          subField.reset();
          if (subFieldDisabled) {
            subField.disable();
          }
        }
        for (const data of subDataFields) {
          this[data] = [];
        }
      }),
      filter(() => this[sourceDataField][subLoadNeededFieldName]),
      switchMap(() => subLoadFunction(this[sourceDataField].id)),
      tap((newData: any[]) => {
        this[subDataFields[0]] = newData;
        if (subField && subFieldDisabled) {
          subField.enable();
        }
      }));
  }

  private getDataId(field: UntypedFormControl, datas: any[]): number {
    return field.value ? datas[field.value].id : null;
  }

  private getDataName(field: UntypedFormControl, datas: any[]): string {
    return field.value ? datas[field.value].name : null;
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

  getFormFieldErrorClass(formControlName: string) {
    const control = this.userDetailsForm.controls[formControlName]
    if (control.invalid && control.touched) {
      return 'error-field'
    }
    return null
  }

  showFormFieldError(formControlName: string) {
    const control = this.userDetailsForm.controls[formControlName]
    if (control.invalid && control.touched) {
      return false
    }
    return true
  }

  showFormFieldPatternError(formControlName: string) {
    const control = this.userDetailsForm.controls[formControlName]
    if (control.getError('pattern') && control.touched) {
      return false
    }
    return true
  }

}
