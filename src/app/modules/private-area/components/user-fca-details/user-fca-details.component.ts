import { Component, OnDestroy, OnInit, Inject, LOCALE_ID, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
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
import { Router } from '@angular/router';
import { NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
    selector: 'app-user-fca-details',
    templateUrl: './user-fca-details.component.html',
    styleUrls: ['./user-fca-details.component.scss'],
    standalone: false
})
export class UserFcaDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('consent') consent: ConsentFormComponent;

  fiscalCodePattern = '';
  professionVector = CONSTANTS.PROFESSIONS;
  educationVector = CONSTANTS.EDUCATIONS;
  salaryVector = CONSTANTS.SALARIES;

  contractor: CheckoutContractor;

  userDetailsForm: UntypedFormGroup;

  user: User;
  countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];

  birthStates: State[] = [];
  birthCities: City[] = [];

  residentialState: UntypedFormControl;
  residentialCountry: UntypedFormControl;
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

  lockedData = false;
  errorMessage = '';
  success = false;
  errorDetails = '';
  datasucaservice = '';

  showPasswordChange = false;
  showAditionalInfo = true;

  private ChangePasswordValidator: ValidatorFn = (fg: UntypedFormGroup) => {
    const pwd1 = fg.get('newPwd') && fg.get('newPwd').value;
    const pwd2 = fg.get('confirmPwd') && fg.get('confirmPwd').value;
    return (!pwd1 && !pwd2) || (pwd1 === pwd2) ? null : { changePassword: true };
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    protected nypUserService: NypUserService,
    private authService: AuthService,
    public dataService: DataService,
    public locale: LocaleService,
    public componentFeaturesService: ComponentFeaturesService,
    private router: Router
  ) {
    if (this.locale.locale === 'it_IT') {
      this.fiscalCodePattern = '^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$';
    }

  }

  ngOnInit() {

    // get current user
    this.user = this.authService.loggedUser;
    this.showPasswordChange = false;
    this.showAditionalInfo = true;
    this.lockedData = this.user.locked_anagraphic;
    // build form
    const birthDate = this.user.address.birth_date ? moment(this.user.address.birth_date, 'YYYY-MM-DD').format('DD/MM/YYYY') : null;

    const userEmail = this.user.locked_anagraphic === false ? '' : this.user.email;

    this.userDetailsForm = this.formBuilder.group({
      email: [userEmail, Validators.compose([Validators.required, Validators.email])],
      firstname: [this.user.address.firstname, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z\ ]*')])],
      lastname: [this.user.address.lastname, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z\ ]*')])],
      taxcode: [this.user.address.taxcode, Validators.required],
      phoneNumber: [this.user.address.phone, Validators.compose([Validators.required, Validators.pattern('[(+).0-9\ ]*')])],
      birthDate: [birthDate, Validators.required]
    }, { validator: this.ChangePasswordValidator });


    // for all fields but residentials & profession/education/salary,
    // once they have a value (after first update), they should be disabled
    this.addFieldsEditableOnlyOnce();
    this.disableFilledFields();

    this.addFieldsForeverEditable();

    this.initResidentialData().pipe(take(1), finalize(() => this.initResidentialLoad())).subscribe();

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
    if (!this.lockedData) {
      const confirmEmail = new UntypedFormControl(null, [Validators.required, Validators.email]);
      this.userDetailsForm.addControl('confirmEmail', confirmEmail);
      this.userDetailsForm.setValidators([this.mailChecker]);
    }
    const birthCountryName = this.user.address.birth_country ? this.user.address.birth_country.name : null;
    const birthStateName = this.user.address.birth_state ? this.user.address.birth_state.name : null;
    const birthCityName = this.user.address.birth_city ? this.user.address.birth_city.name : null;
    this.birthCountry = new UntypedFormControl(birthCountryName, Validators.required);
    this.birthState = new UntypedFormControl({ value: birthStateName, disabled: true }, Validators.required);
    this.birthCity = new UntypedFormControl({ value: birthCityName, disabled: true }, Validators.required);
    this.addControls('birthCountry', 'birthState', 'birthCity');
  }

  private mailChecker: ValidatorFn = (fg: UntypedFormGroup) => {
    const mail = fg.get('email') && fg.get('email').value;
    const confirmEmail = fg.get('confirmEmail') && fg.get('confirmEmail').value;
    return (!!mail && !!confirmEmail) && (mail !== confirmEmail) ? { mailNotConfirmed: true } : null;
  }

  addFieldsForeverEditable() {
    this.userDetailsForm.addControl('profession', new UntypedFormControl(this.user.profession));
    this.userDetailsForm.addControl('education', new UntypedFormControl(this.user.education));
    this.userDetailsForm.addControl('salary', new UntypedFormControl(this.user.salary));

    this.residentialCountry = new UntypedFormControl(null, Validators.required);
    this.residentialState = new UntypedFormControl(null, Validators.required);
    this.residentialCity = new UntypedFormControl(this.user.address.city, Validators.required);
    this.residentialAddress = new UntypedFormControl(this.user.address.address1, Validators.required);
    this.zipcode = new UntypedFormControl(this.user.address.zipcode, Validators.required),
      this.newPwd = new UntypedFormControl(null, [PasswordHelper.passwordValidator(8)]);
    this.confirmPwd = new UntypedFormControl(null, [PasswordHelper.passwordValidator(8)]);
    this.addControls('residentialCountry', 'residentialState', 'residentialCity', 'residentialAddress', 'zipcode', 'newPwd', 'confirmPwd');
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
    this.userDetailsForm.controls['phoneNumber'].enable();
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

    updatedAddress.country_id = this.getDataId(this.residentialCountry, this.countries);
    updatedAddress.state_id = this.getDataId(this.residentialState, this.states);
    updatedAddress.city = this.residentialCity.value;
    updatedAddress.address1 = this.residentialAddress.value;
    delete updatedAddress.country;
    delete updatedAddress.state;

    if (!this.lockedData) {
      updatedAddress.birth_country_id = this.getDataId(this.birthCountry, this.countries);
      updatedAddress.birth_state_id = this.getDataId(this.birthState, this.birthStates);
      updatedAddress.birth_city_id = this.birthCities.length ? this.getDataId(this.birthCity, this.birthCities) : this.birthCity.value;
      delete updatedAddress.email
      updatedUser.email = this.userDetailsForm.controls["email"].value
    } else {
      updatedAddress.birth_country_id = (updatedAddress.birth_country || {}).id;
      updatedAddress.birth_state_id = (updatedAddress.birth_state || {}).id;
      updatedAddress.birth_city_id = (updatedAddress.birth_city || {}).id;
    }

    delete (updatedAddress as any).phoneNumber;
    delete (updatedAddress as any).newPwd;
    delete (updatedAddress as any).confirmPwd;
    delete (updatedAddress as any).confirmEmail;
    delete updatedAddress.birth_country;
    delete updatedAddress.birth_state;
    delete updatedAddress.birth_city;

    updatedAddress.phone = this.userDetailsForm.value.phoneNumber;



    updatedUser.bill_address_attributes = updatedAddress;
    delete updatedUser.address;

    this.nypUserService.editUser(updatedUser).pipe(take(1)).subscribe(
      () => {
        this.success = true;
        // refresh the user for the whole application
        this.authService.setCurrentUserFromLocalStorage();
        this.router.navigate(['/private-area/home']);
      },
      (err) => this.handleError(err)
    );
  }

  private getDataId(field: UntypedFormControl, datas: any[]): number {
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

  ngOnDestroy() {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}
