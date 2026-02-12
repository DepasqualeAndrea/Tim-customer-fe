import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { City, Country, State } from '@model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DataService, UserService } from '@services';
import { ConsentFormComponent } from 'app/shared/consent-form/consent-form.component';
import { PasswordHelper } from 'app/shared/helpers/password.helper';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-register-form-tim-retirees',
  templateUrl: './register-form-tim-retirees.component.html',
  styleUrls: ['./register-form-tim-retirees.component.scss']
})
export class RegisterFormTimRetireesComponent implements OnInit {

  @ViewChild('consent', { static: true }) consent: ConsentFormComponent;

  @Input() content: any

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private dataService: DataService,
    protected nypUserService: NypUserService,
    private toastrService: ToastrService
  ) { }

  birthCountries: Country[]
  birthStates: State[]
  birthCities: City[]

  form: FormGroup
  formSavedValues: { [key: string]: any }
  isConsentFormValid: boolean = false
  model: { minBirthDate: NgbDateStruct; maxBirthDate: NgbDateStruct } = {
    minBirthDate: { year: 1930, month: 1, day: 1 },
    maxBirthDate: {
      year: +moment().subtract(18, 'years').subtract(1, 'day').format('YYYY'),
      month: +moment().subtract(18, 'years').subtract(1, 'day').format('MM'),
      day: +moment().subtract(18, 'years').subtract(1, 'day').format('DD')
    }
  };

  taxcodePattern = '^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$'

  ngOnInit() {
    this.form = this.createForm()
    this.form.valueChanges.subscribe(changes => this.evaluateFormChanges(changes))
    this.setBirthCountries()
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      taxcode: [null, { validators: [Validators.required, Validators.pattern(this.taxcodePattern)], updateOn: 'blur' }],
      password: [null, { validators: [Validators.required, PasswordHelper.passwordValidator(8)] }],
      alatelCode: [null, Validators.required],
      birthDate: [null, Validators.required],
      birthCountry: [null, Validators.required],
      birthState: [{ value: null, disabled: true }, Validators.required],
      birthCity: [{ value: null, disabled: true }, Validators.required],
      email: [null, Validators.required],
      phoneNumber: [null, Validators.required]
    })
  }

  evaluateFormChanges(changes: { [key: string]: any }): void {
    this.handleBirthData(changes)
    this.formSavedValues = changes
  }

  handleBirthData(changes: { [key: string]: any }): void {
    const birthCountry = changes['birthCountry']
    const birthState = changes['birthState']
    if (birthCountry && this.hasFormValueChanged('birthCountry', birthCountry)) {
      this.cancelControlsValue(['birthState', 'birthCity'])
      this.cancelComponentData(['birthStates', 'birthCities'])
      this.activateStatesControl(birthCountry)
    }
    if (birthState && this.hasFormValueChanged('birthState', birthState)) {
      this.cancelControlsValue(['birthCity'])
      this.cancelComponentData(['birthCities'])
      this.activateCitiesControl(birthState)
    }
  }

  activateStatesControl(birthCountry): void {
    if (birthCountry.states_required) {
      this.setBirthStates(birthCountry.id)
      this.form.controls['birthState'].enable({ emitEvent: false })
    }
  }

  activateCitiesControl(birthState) {
    if (birthState.cities_required) {
      this.setBirthCities(birthState.id)
      this.form.controls['birthCity'].enable({ emitEvent: false })
    }
  }

  hasFormValueChanged(formControlName: string, formControlValue: any): boolean {
    return formControlValue !== this.formSavedValues[formControlName]
  }

  cancelControlsValue(formControlNames: string[]): void {
    const controls = this.form.controls
    const doNotPropagate = { emitEvent: false }
    formControlNames.forEach(formControlName => {
      controls[formControlName].setValue(null, doNotPropagate)
      controls[formControlName].markAsUntouched()
      controls[formControlName].disable(doNotPropagate)
    })
  }

  cancelComponentData(attributes: string[]): void {
    attributes.forEach(attribute => {
      this[attribute] = null
    })
  }

  setBirthCountries(): void {
    this.nypUserService.getCountries(this.dataService.countriesEndpoint).subscribe(countries => {
      this.birthCountries = countries
    })
  }

  setBirthStates(countryId: number): void {
    this.nypUserService.getProvince(countryId).subscribe(states => {
      this.birthStates = states
    })
  }

  setBirthCities(stateId: number): void {
    this.nypUserService.getCities(stateId).subscribe(cities => {
      this.birthCities = cities
    })
  }

  getConsentFormValidity(): void {
    this.isConsentFormValid = this.consent.consentForm.valid
  }

  getFormFieldErrorClass(formControlName: string): string {
    const control = this.form.controls[formControlName]
    if (control.invalid && control.touched) {
      return 'error-field'
    }
    return null
  }

  getFieldError(formControlName: string, errorType: string): boolean {
    if (this.form.get(formControlName).dirty || this.form.get(formControlName).touched) {
      return this.form.get(formControlName).errors && this.form.get(formControlName).errors[errorType]
    }
    return false
  }

  showFormFieldError(formControlName: string): boolean {
    const control = this.form.controls[formControlName]
    if (control.invalid && control.touched) {
      return false
    }
    return true
  }

  register() {
    const user = this.buildUserFromForm(this.form.controls)
    this.userService.retireeRegister(user)
      .pipe(catchError((err) => {
        this.handleRegistrationError(err)
        return err
      }))
      .subscribe(newUser => newUser && this.handleRegistrationSuccess());
  }

  isValid(): boolean {
    return this.form.valid && this.isConsentFormValid
  }

  buildUserFromForm(formControls: { [key: string]: AbstractControl }): { [key: string]: any } {
    const user_acceptances_attributes = this.getUserAcceptances()
    return {
      user: {
        email: formControls['email'].value,
        password: formControls['password'].value,
        firstname: formControls['firstName'].value,
        lastname: formControls['lastName'].value,
        taxcode: formControls['taxcode'].value,
        alatel_code: formControls['alatelCode'].value,
        birth_date: this.formatDate(formControls['birthDate'].value),
        birth_country_id: formControls['birthCountry'].value.id,
        birth_state_id: formControls['birthState'].value ? formControls['birthState'].value.id : null,
        birth_city_id: formControls['birthCity'].value ? formControls['birthCity'].value.id : null,
        phone: formControls['phoneNumber'].value,
        user_acceptances_attributes
      }
    }
  }

  private formatDate(date: NgbDateStruct): string {
    return date.year + '/' + date.month + '/' + date.day
  }

  private getUserAcceptances() {
    const user_acceptances_attributes = {}
    this.consent.privacyFlags.forEach((flag, index) => {
      user_acceptances_attributes[`${index}`] = {
        flag_id: flag.id,
        value: this.consent.consentForm.controls[flag.tag].value || false,
      }
    })
    return user_acceptances_attributes
  }

  private handleRegistrationSuccess(): void {
    this.toastrService.success(this.content.registration_successful)
  }

  private handleRegistrationError(err): void {
    if (err.status === 422) {
      this.toastrService.error(this.content.registration_unsuccessful)
    } else {
      this.toastrService.error(err)
    }
  }

}
