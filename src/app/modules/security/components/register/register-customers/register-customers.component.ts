import { NypUserService } from '@NYP/ngx-multitenant-core';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '@services';
import { TaxCodeService } from 'app/modules/nyp-checkout/services/tax-code/tax-code.service';
import { taxCodePattern } from 'app/modules/nyp-checkout/services/tax-code/utils/tax-code.constants';
import { ConsentFormComponent } from 'app/shared/consent-form/consent-form.component';
import { PasswordHelper } from 'app/shared/helpers/password.helper';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { catchError, take } from 'rxjs/operators';

@Component({
    selector: 'app-register-customers',
    templateUrl: './register-customers.component.html',
    styleUrls: ['./register-customers.component.scss', '../../../../nyp-checkout/styles/checkout-forms.scss'],
    standalone: false
})
export class RegisterCustomersComponent implements OnInit {

  @ViewChild('consent') consent: ConsentFormComponent
  @Input() content;

  @Output() viewChange = new EventEmitter<'LOGIN' | 'REGISTER' | 'MIGRATION'>();

  registrationSuccess: boolean = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private nypUserService: NypUserService,
    private toastrService: ToastrService,
    private readonly taxCodeService : TaxCodeService
  ) { }
  userAcceptances: { tag: string, value: boolean }[] = [];

  form: UntypedFormGroup
  taxcodePattern = '^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$';
  model: { minBirthDate: string; maxBirthDate: string } = {
    minBirthDate: moment('1930-01-01').format('YYYY-MM-DD'),
    maxBirthDate: moment().subtract(18, 'years').subtract(1, 'day').format('YYYY-MM-DD')
  }
  isConsentFormValid = false
  passwordVisibility: boolean = false;

  ngOnInit() {
    this.form = this.createForm();
    if(this.form){
      this.form.setValidators( this.taxCodeService.taxCodeConsistencyValidator('firstName', 'lastName', 'taxcode', 'birthDate') );
    }
  }

  private createForm(): UntypedFormGroup {
    return this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      taxcode: [null, { validators: [Validators.required, Validators.pattern(taxCodePattern)], updateOn: 'blur' }],
      password: [null, { validators: [Validators.required, PasswordHelper.passwordValidator(8)] }],
      birthDate: [null, { validators: [Validators.required, TimeHelper.rangeRequiredDateValidator(moment(this.model.minBirthDate).toDate(), moment(this.model.maxBirthDate).toDate())] }],
      email: [null, Validators.required],
      phoneNumber: [null, Validators.required]
    })
  }

  getConsentFormValidity(): void {
    this.isConsentFormValid = this.consent.consentForm.valid
  }

  isValid(): boolean {
    return this.form.valid && this.isConsentFormValid
  }

  showCustomersAccess() {
    // TODO
    return true
  }

  register() {
    const user = this.buildUserFromForm(this.form.controls)?.user;
    user.username = user.taxcode;
    this.nypUserService.register({ user }, undefined)
      .pipe(catchError((err) => {
        this.handleRegistrationError(err, this.content?.registration_unsuccessful)
        return err
      }))
      .subscribe(() => this.handleRegistrationSuccess(this.content?.registration_successful));
  }

  private buildUserFromForm(formControls: { [key: string]: AbstractControl }): { [key: string]: any } {

    return {
      user: {
        email: formControls['email'].value,
        password: formControls['password'].value,
        firstname: formControls['firstName'].value,
        lastname: formControls['lastName'].value,
        taxcode: formControls['taxcode'].value,
        birth_date: formControls['birthDate'].value,
        phone: formControls['phoneNumber'].value,
        userAcceptances: this.userAcceptances,
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
        value: this.consent.consentForm.controls[flag.tag].value,
      }
    })
    return user_acceptances_attributes
  }

  ngOnDestroy() { }

  getFormFieldErrorClass(formControlName: string): string {
    const control = this.form.get(formControlName)
    if (control.touched && (control.invalid || (formControlName === 'taxcode' && this.form.hasError('taxCodeMismatch')))) {
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

  switchView(view: 'LOGIN' | 'REGISTER' | 'MIGRATION') {
    this.registrationSuccess = false;
    this.viewChange.emit(view);
  }

  toggleShowPassword(){
    this.passwordVisibility = !this.passwordVisibility;
  }

  private handleRegistrationSuccess(message: string): void {
    this.registrationSuccess = true;
    this.toastrService.success(message)
  }

  private handleRegistrationError(err, message): void {
    if ([400, 409].includes(err.status)) {
      this.toastrService.error(message)
    } else {
      this.toastrService.error(err.message)
    }
  }
}

