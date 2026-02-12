import { Component, OnInit, Inject, Input, OnChanges, Output, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { BusinessFormState } from './business-form-state.model';
import { BusinessFormCountry } from './business-form-country.model';
import { BusinessForm } from './business-form.model';
import { BusinessFormCountryService } from './business-form-country-service';
import { PasswordHelper } from '../helpers/password.helper';
import { Observable } from 'rxjs';
import { map, take, tap, switchMapTo, flatMap, switchMap, takeWhile } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BusinessFormCity } from './business-form-city.model';
import { DataService } from '@services';

@Component({
  selector: 'app-business-form',
  templateUrl: './business-form.component.html',
  styleUrls: ['./business-form.component.scss']
})
export class BusinessFormComponent implements OnInit, OnChanges, OnDestroy {
  showRegistrationElements = true;
  showResetPassword = true;
  form: FormGroup;
  defaultCountry: BusinessFormCountry;
  states: BusinessFormState[] = [];
  cities: string[] = [];
  newPwd: FormControl;
  confirmPwd: FormControl;
  numbersRegex = /^[0-9]+$/;
  fiscalCodePattern = '^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$';
  areVatcodeAndTaxcodeSame = false
  vatCodeRequiredLength: number;

  private componentLoaded = false;
  @Input() disableLockedFields = false;
  @Input() isFormSubmitted: boolean;
  @Input() business: BusinessForm;
  @Output() formValueChanged: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    @Inject('BusinessFormCountryService') private businessFormCountryService: BusinessFormCountryService,
    private cdref: ChangeDetectorRef,
    public dataService: DataService
  ) { }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  private ChangePasswordValidator: ValidatorFn = (fg: FormGroup) => {
    const pwd1 = fg.get('newPwd') && fg.get('newPwd').value;
    const pwd2 = fg.get('confirmPwd') && fg.get('confirmPwd').value;
    return (!pwd1 && !pwd2) || (pwd1 === pwd2) ? null : { changePassword: true };
  }

  getCompanyMaxLength(value) {
    if (!!value) {
      if (value.match(this.numbersRegex)) {
        this.vatCodeRequiredLength = 11;
        return 11;
      }
      this.vatCodeRequiredLength = 16;
      return 16;
    }
    return
  }

  ngOnChanges() {
    if (this.componentLoaded) {
      this.setFormFromBusinessProperty();
    }
  }

  ngOnDestroy(): void {
  }

  ngOnInit() {
    console.log('DATA SERVICE: ',this.dataService)
    this.form = this.buildForm()
    this.form.valueChanges.subscribe(() => {
      const isFormValid = this.form.valid;
      this.formValueChanged.next(isFormValid);
    })
    this.form.controls.vatCode.valueChanges.pipe(untilDestroyed(this)).subscribe(
      () => this.raiseFormValuesChanged()
    )
    this.addFieldsForeverEditable()
    this.loadCountries()
  }

  buildForm(): FormGroup {
    return this.formBuilder.group({
      company:        [null, Validators.required],
      vatCode:        [null, Validators.required],
      officeAddress:  [null, Validators.required],
      officeCap:      [null, {validators: [Validators.required, Validators.pattern('[(+).0-9\ ]*')]}],
      officeCity:     [null, {disabled: true, validators: Validators.required}],
      officeState:    [null, Validators.required],
      email:          [null, {validators: [Validators.required, Validators.email]}],
      phoneNumber:    [null, {validators: [Validators.required, Validators.pattern('[(+).0-9\ ]*')]}],
      password: this.setPasswordValidator(),
      individualBusiness: [false, Validators.nullValidator],
      firstName:          [null,  Validators.nullValidator],
      lastName:           [null,  Validators.nullValidator],
      taxcode:            [null,  {validators: [Validators.nullValidator, Validators.pattern(this.fiscalCodePattern)]}],
      differingTaxcode:   [false, Validators.nullValidator],
      individualTaxcode:  [null,  {validators: [Validators.nullValidator, Validators.pattern('[(+).0-9\ ]*')]}],
    }, { validator: this.ChangePasswordValidator })
  }

  loadCountries(): void {
    this.businessFormCountryService.getDefaultCountry()
    .pipe(
      take(1),
      tap((country) => this.setCountry(country)),
      switchMap((country) => this.businessFormCountryService.getProvince(country.id)),
      take(1),
      tap((states) => this.setStates(states)),
    ).subscribe(() => {
      this.componentLoaded = true;
      this.setFormFromBusinessProperty();
    });
  }

  private raiseFormValuesChanged(): void {
    const requiredVatCodeCharacters = this.getCompanyMaxLength(this.form.controls['vatCode'].value);
    if (!!requiredVatCodeCharacters) {
      if (requiredVatCodeCharacters === 16) {
        this.form.controls['vatCode'].setValidators([
          Validators.required,
          Validators.minLength(requiredVatCodeCharacters),
          Validators.maxLength(requiredVatCodeCharacters),
          Validators.pattern(this.fiscalCodePattern)
        ]);
      }
      if (requiredVatCodeCharacters === 11) {
        this.form.controls['vatCode'].setValidators([
          Validators.required,
          Validators.minLength(requiredVatCodeCharacters),
          Validators.maxLength(requiredVatCodeCharacters),
          Validators.pattern(this.numbersRegex)
        ]);
      }
    }
  }

  selectOfficeCity(cityName: string): void {
    const stateId = this.form.controls['officeState'].value;
    this.getCitiesFromState(stateId).subscribe(() => {
      this.form.controls['officeCity'].setValue(cityName);
    });
  }

  getCitiesName(cities: BusinessFormCity[]) {
    return cities.map((city) => city.name);
  }

  setPasswordValidator() {
    if (this.showRegistrationElements) {
      return new FormControl(null, [Validators.required, PasswordHelper.passwordValidator(8)]);
    }
    return new FormControl(null, [Validators.nullValidator]);
  }

  setCountry(businesFormCountry: BusinessFormCountry): void {
    this.defaultCountry = businesFormCountry;
  }

  setStates(states: BusinessFormState[]): void {
    this.states = Object.values(states);
  }

  setFormFromBusinessProperty() {
    if (!!this.business) {
      this.updateFormFromModel(this.business);
    }
    if (this.disableLockedFields) {
      this.disableLockedFormFields();
    }
  }

  addFieldsForeverEditable() {
    this.newPwd = new FormControl(null, [PasswordHelper.passwordValidator(8)]);
    this.confirmPwd = new FormControl(null, [PasswordHelper.passwordValidator(8)]);
    this.addControls('newPwd', 'confirmPwd');
  }

  private addControls(...controlNames: string[]) {
    for (const controlName of controlNames) {
      this.form.addControl(controlName, this[controlName]);
    }
  }

  isValid(): boolean {
    this.getFormValidationErrors();
    return (
      this.form.valid
    );
  }
  getFormValidationErrors() {
    Object.keys(this.form.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.form.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          throw new Error(keyError)
        });
      }
    });
  }

  disableLockedFormFields() {
    this.disableFormControls(['company', 'email'])
  }

  private disableFormControls(formControlNames: string[]): void {
    formControlNames.forEach(formControlName => {
      this.form.controls[formControlName].disable()
    })
  }

  setBusiness(business: BusinessForm) {
    this.business = business;
  }

  private updateFormFromModel(business: BusinessForm): void {
    const controls = this.form.controls
    controls['company'].setValue(business.company);
    controls['officeAddress'].setValue(business.officeaddress);
    controls['officeCap'].setValue(business.officezipcode);
    this.setOfficeState(business.officestate.id, 'id', this.states, this.form.controls['officeState']);
    controls['email'].setValue(business.email);
    controls['phoneNumber'].setValue(business.phone);
    this.selectOfficeCity(business.officecity);

    this.setBusinessCodes(business)

    if (this.hasIndividualBusinessAddressFields(business)) {
      controls['individualBusiness'].setValue(true)
      controls['firstName'].setValue(business.firstname)
      controls['lastName'].setValue(business.lastname)
      controls['taxcode'].setValue(business.taxcode)
      this.disableFormControls(['firstName', 'lastName', 'taxcode', 'individualBusiness'])
    }
  }

  private hasIndividualBusinessAddressFields(business: BusinessForm): boolean {
    return !!business.taxcode && !!business.lastname && !!business.firstname
  }

  private setBusinessCodes(business: BusinessForm): void {
    const controls = this.form.controls
    if (business.vatcode.length === 11) {
      controls['vatCode'].setValue(business.vatcode)
      this.disableFormControls(['vatCode'])
      if (!!business.taxcode && business.taxcode !== business.vatcode
        && !this.hasIndividualBusinessAddressFields(business)) {
        controls['individualTaxcode'].setValue(business.taxcode)
        controls['differingTaxcode'].setValue(true)
        this.disableFormControls(['individualTaxcode', 'differingTaxcode'])
      }
    }
    if (business.vatcode.length === 16) {
      controls['vatCode'].setValue(null)
      controls['taxcode'].setValue(business.vatcode)
      controls['individualBusiness'].setValue(true)
      this.disableFormControls(['taxcode', 'individualBusiness'])
      this.enableIndividualBusinessControls()
    }
    this.form.updateValueAndValidity()
  }

  getBusiness(): BusinessForm {
    if (this.isValid()) {
      this.form.controls['password'].setValue(this.getNewPassword());
      return this.fromFormToModel(this.form);
    }
  }

  private getNewPassword() {
    const controls = this.form.controls
    if (controls['newPwd'].value &&
        controls['confirmPwd'].value &&
        controls['newPwd'].value === controls['confirmPwd'].value) {
      return controls['newPwd'].value;
    }
    if (this.showRegistrationElements) {
      return controls['password'].value;
    }
    return null;
  }

  private setOfficeState(userDataField: any, dataListField: 'id' | 'name', dataList: any[], formField: AbstractControl) {
    const businessState = dataList.find(item => item[dataListField] === userDataField);
    formField.setValue(businessState.id);
  }

  officeStateChanged(selectedStateId: number) {
    this.getCitiesFromState(selectedStateId).subscribe();
  }

  getCitiesFromState(selectedStateId: number): Observable<string[]> {
    return this.businessFormCountryService.getCities(selectedStateId)
      .pipe(
        map((cities) => this.getCitiesName(cities))
        , tap((cities) => {
          this.cities = cities;
          if (cities.length > 0) {
            this.form.controls['officeCity'].enable();
          } else {
            this.form.controls['officeCity'].disable();
          }
        })
      );
  }

  fromFormToModel(form: FormGroup): BusinessForm {
    const controls = form.controls
    let passwordFieldToSend = null;
    if (this.showRegistrationElements) {
      passwordFieldToSend = controls['password'].value;
    }
    if (form.controls['newPwd'].value) {
      passwordFieldToSend = controls['newPwd'].value;
    }
    const business = {
      company:        controls['company'].value,
      vatcode:        controls['vatCode'].value,
      officeaddress:  controls['officeAddress'].value,
      officezipcode:  controls['officeCap'].value,
      officecity:     controls['officeCity'].value,
      officestate_id: controls['officeState'].value,
      email:          controls['email'].value,
      phone:          controls['phoneNumber'].value,
      country_id:     this.defaultCountry.id,
    };
    if (!!passwordFieldToSend) {
      business['password'] = passwordFieldToSend;
    }
    return this.getAdditionalBusinessData(business);
  }

  isIndividualBusinessFormEnabled(): boolean {
    return this.form.controls['individualBusiness'].value
  }

  isDifferingTaxcodeFormEnabled(): boolean {
    return this.form.controls['differingTaxcode'].value
  }

  enableIndividualBusinessControls(): void {
    const controls = this.form.controls
    controls['differingTaxcode'].setValue(false)

    if (controls['individualBusiness'].value) {
      this.clearIndividualBusinessControls()
    } else {
      controls['firstName'].setValidators(Validators.required)
      controls['lastName'].setValidators(Validators.required)
      controls['taxcode'].setValidators([Validators.required, Validators.pattern(this.fiscalCodePattern)])
      this.clearValidatorsAndErrors(['individualTaxcode'])
    }
    this.form.updateValueAndValidity()
  }

  enableDifferingTaxcodeControls(): void {
    const controls = this.form.controls
    controls['individualBusiness'].setValue(false)

    if (controls['differingTaxcode'].value) {
      this.clearValidatorsAndErrors(['individualTaxcode'])
    } else {
      this.clearIndividualBusinessControls()
      controls['individualTaxcode'].setValidators([Validators.required, Validators.pattern('[(+).0-9\ ]*')])
    }
    this.form.updateValueAndValidity()
  }

  clearIndividualBusinessControls() {
    this.clearValidatorsAndErrors(['firstName', 'lastName', 'taxcode'])
  }

  clearValidatorsAndErrors(formControlNames: string[]) {
    const controls = this.form.controls
    formControlNames.forEach(formControlName => {
      controls[formControlName].setErrors(null)
      controls[formControlName].clearValidators()
    })
  }

  getAdditionalBusinessData(business: BusinessForm): BusinessForm {
    const controls = this.form.controls
    if (controls['individualBusiness'].value) {
      business.firstname = controls['firstName'].value
      business.lastname = controls['lastName'].value
      business.taxcode = controls['taxcode'].value
    }
    if (controls['differingTaxcode'].value) {
      business.taxcode = controls['individualTaxcode'].value
    }
    if ((!controls['differingTaxcode'].value && !controls['individualBusiness'].value)) {
      business.taxcode = controls['vatCode'].value
    }
    return business
  }

  getErrorFieldClass(formControlName: string): string {
    if (this.getFieldInvalidError(formControlName) && this.isFormSubmitted) {
      if (this.getFieldError(formControlName, 'required') ||
          this.getFieldError(formControlName, 'pattern') ||
          this.getFieldError(formControlName, 'minlength') ||
          this.getFieldError(formControlName, 'maxlength')) {
        return 'error-field'
      }
    }
  }

  getFieldInvalidError(formControlName: string): boolean {
    return this.isFormSubmitted && this.form.get(formControlName).invalid
  }

  getFieldError(formControlName: string, errorType: string): boolean {
    return this.isFormSubmitted && this.form.get(formControlName).errors && this.form.get(formControlName).errors[errorType]
  }
}
