import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@model';
import { AuthService, UserService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { LoginService } from 'app/modules/security/services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription, throwError} from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import { ErrorMessages } from './ldap-error-message-keys.enum';

@Component({
  selector: 'app-checkout-step-ldap-login',
  templateUrl: './checkout-step-ldap-login.component.html',
  styleUrls: ['./checkout-step-ldap-login.component.scss']
})
export class CheckoutStepLdapLoginComponent implements OnInit {

  @Output() goBack = new EventEmitter<void>();

  @Output() loginSuccess = new EventEmitter<void>()

  errors: {[k: string]: any} = {}

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private auth: AuthService,
    private toastrService: ToastrService,
    private kenticoTranslateService: KenticoTranslateService,
    private loginService: LoginService
  ) {}

  form: FormGroup
  subscription: Subscription

  ngOnInit() {
    this.form = this.createForm()
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    })
  }

  private hasValue(formControlName: string): boolean {
    return !!this.form.controls[formControlName].value
  }

  public getErrorFieldClass(formControlName: string): string {
    if (this.getFieldInvalidError(formControlName)) {
      if (this.getFieldError(formControlName, 'required')) {
        return 'error-field'
      }
    }
  }

  public getFieldInvalidError(formControlName: string): boolean {
    return this.form.get(formControlName).invalid && 
      (this.form.get(formControlName).touched || this.form.get(formControlName).dirty)
  }

  private getFieldError(formControlName: string, errorType: string): boolean {
    return this.form.get(formControlName).errors && this.form.get(formControlName).errors[errorType]
  }

  ngOnDestroy() {}

  public loginLdap(): void {
    const userId = this.auth.currentUser.id
    const userRequest = {
      user: {
        username: this.form.controls['username'].value,
        password: this.form.controls['password'].value
      }
    }

    const ldapUser$ = this.userService.ldapAuth(userId, userRequest)
    const kenticoItem$ = this.kenticoTranslateService.getItem<any>('checkout_mypet')

    kenticoItem$.pipe(
      take(1),
      tap(content => this.setErrors(content)),
      switchMap(() => ldapUser$),
      tap(user => this.ldapAuth(user)),
      catchError(err => {
        const errorMessage = this.getErrorMessage(err)
        if (errorMessage) {
          this.toastrService.error(errorMessage)
        } else {
          this.toastrService.error(err.error)
        }
        return throwError(new Error(err))
      })
    ).subscribe()
  }

  private ldapAuth(user: User): void {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
      this.auth.setCurrentUserFromLocalStorage()

      if (!!JSON.parse(localStorage.getItem('redirectFromController'))) {
        this.loginService.redirectFromLocalStorage();
        this.loginService.cancelRedirectAfterLogin();
        this.loginService.cancelRedirectFromController();
      } else {
        // testare se da togliere
        this.loginSuccess.emit()
      }
    }
  }

  private setErrors(kenticoItem) {
    const errorKeys = Object.keys(kenticoItem).filter(key => key.includes('error'))
    errorKeys.forEach(key => {
      this.errors[key] = kenticoItem[key].value
    })
  }

  private getErrorMessage(error): string {
    if (error.error && error.error.exception) {
      switch(error.error.exception) {
        case ErrorMessages.MAIL_ERROR:
        case ErrorMessages.PASSWORD_ERROR:
          return this.errors['error_wrong_credentials']
        case ErrorMessages.INCOMPLETE_ANAGRAPHIC_ERROR:
          return this.errors['error_incomplete_anagraphic']
        case ErrorMessages.PLATFORM_CREDENTIALS_ERROR:
          return this.errors['error_wrong_platform_credentials']
        default: return
      }
    }
    return 
  }

}
