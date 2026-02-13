import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { AuthService, DataService, UserService } from '@services';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordHelper } from 'app/shared/helpers/password.helper';
import { TimeHelper } from 'app/shared/helpers/time.helper';
import { SocialAuth, User } from '@model';
import { catchError, take } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { RegisterModalCompleteComponent } from '../register/register-modal-complete/register-modal-complete.component';
import { RegisterModalCompleteData } from '../register/register-modal-complete/register-modal-complete.model';
import { BackButtonComponent } from '../common/back-button.component';
import { ConsentFormComponent } from 'app/shared/consent-form/consent-form.component';
import { ContentItem } from 'kentico-cloud-delivery';
import { CaptchaService } from 'app/shared/captcha.service';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { GtmService } from 'app/core/services/gtm/gtm.service';
import { FormHumanError } from '../../../../shared/errors/form-human-error.model';
import { KenticoTranslateService } from '../../../kentico/data-layer/kentico-translate.service';
import { CheckoutProduct } from 'app/modules/checkout/checkout.model';
import { gtm_settings } from 'app/core/models/gtm/gtm-settings.model';

@Component({
    selector: 'app-register-form',
    templateUrl: './register-form.component.html',
    styleUrls: ['../common/login-register-forms.scss', './register-form.component.scss'],
    standalone: false
})
export class RegisterFormComponent extends BackButtonComponent implements OnInit {

  @Input() fieldsInColumn = false;
  @Input() passwordConfirm = false;
  @Input() canShowPassword = false;
  @Input() isFacebookDisabled = true;
  @Input() redirectTo: string = null;
  @Input() product: CheckoutProduct = null;
  @Output() registerSuccess = new EventEmitter<void>();

  @ViewChild('consent', { static: true }) consent: ConsentFormComponent;

  form: UntypedFormGroup;
  userAcceptances: { tag: string, value: boolean }[] = [];

  recaptchaKey: string;
  captchaEnabled: boolean;
  captchaToken: string;
  model: { minBirthDate: NgbDateStruct; maxBirthDate: NgbDateStruct } = {
    minBirthDate: { year: 1930, month: 1, day: 1 },
    maxBirthDate: {
      year: +moment().subtract(18, 'years').subtract(1, 'day').format('YYYY'),
      month: +moment().subtract(18, 'years').subtract(1, 'day').format('MM'),
      day: +moment().subtract(18, 'years').subtract(1, 'day').format('DD')
    }
  };
  private captchaSuccess = false;
  brandIcon: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private toastrService: ToastrService,
    private router: Router,
    private auth: AuthService,
    private modalService: NgbModal,
    private kenticoTranslateService1: KenticoTranslateService,
    public dataService: DataService,
    private captchaService: CaptchaService,
    private kenticoTranslateService: KenticoTranslateService,
    private componentFeaturesService: ComponentFeaturesService,
    private activatedRoute: ActivatedRoute,
    private gtmHandlerService: GtmHandlerService,
    private gtmEventGeneratorService: YoloDataLayerEventObjGeneratorService
  ) {
    super();
  }

  ngOnInit() {
    this.componentFeaturesService.useComponent('register-form');
    this.componentFeaturesService.useRule('captcha');
    const constraints: Map<string, any> = this.componentFeaturesService.getConstraints();

    this.recaptchaKey = this.dataService.tenantInfo.captcha.siteKey;
    this.captchaEnabled = constraints.get('registerEnabled');
    this.captchaSuccess = !this.captchaEnabled;     // if captcha is disabled then set captchaSuccess true to validate form
    // otherwise captchaSuccess is false to prevent form validation

    this.form = this.formBuilder.group({
      firstName: new UntypedFormControl(null, [Validators.required, Validators.pattern('[a-zA-Z\ ]*')]),
      lastName: new UntypedFormControl(null, [Validators.required, Validators.pattern('[a-zA-Z\ ]*')]),
      email: new UntypedFormControl(null, [Validators.required, Validators.email]),
      password: new UntypedFormControl(null, [Validators.required, PasswordHelper.passwordValidator(8)]),
      phoneNumber: new UntypedFormControl(null, [Validators.required, Validators.pattern('[(+).0-9\ ]*')]),
      birthDate: new UntypedFormControl(null, [Validators.required, TimeHelper.dateValidator(moment(this.model.minBirthDate).toDate(), moment(this.model.maxBirthDate).toDate())])
    });

    this.activatedRoute.queryParams
      .map(params => params.params)
      .subscribe(params => {
        if (params) {
          const personalData = atob(params).split('|');
          this.form.controls.firstName.setValue(personalData[0]);
          this.form.controls.lastName.setValue(personalData[1]);
          this.form.controls.email.setValue(personalData[2]);
          this.form.controls.phoneNumber.setValue(personalData[3]);
        }
      });

    if (this.passwordConfirm) {
      const controlName = 'confirm-password';
      const control: UntypedFormControl = new UntypedFormControl(null, [Validators.required, PasswordHelper.passwordValidator(8)]);
      this.form.addControl(controlName, control);

      this.form.setValidators(PasswordHelper.checkPasswords('password', controlName));
    }
    if (this.dataService.isTenant('santa-lucia_db')) {
      this.getBrandIcon();
    }
  }

  handleSocialLogin(socialAuth: SocialAuth) {
    this.userService.socialAuth(socialAuth)
      .pipe(catchError((err, caught) => this.handleSocialLoginError(socialAuth)))
      .subscribe(registeredUser => {
        if (registeredUser) {
          if (registeredUser.confirmed) {
            this.auth.performLoginSuccess(registeredUser);
            this.router.navigate(['prodotti']);
          } else {
            this.router.navigate(['login']);
          }
        }
      });
  }

  fromFormToModel(form: UntypedFormGroup): User {
    const birthDate = form.controls.birthDate.value;
    const utmSource: string = this.dataService.getTenantInfo().utmSource;

    return {
      firstname: form.controls.firstName.value,
      lastname: form.controls.lastName.value,
      email: form.controls.email.value,
      password: form.controls.password.value,
      birth_date: (typeof (birthDate) === 'string' ? moment(birthDate, 'DD/MM/YYYY') : moment(TimeHelper.fromNgbDateToDate(birthDate))).format('YYYY-MM-DD'),
      phone: form.controls.phoneNumber.value,
      utm_source: utmSource,
      userAcceptances: this.userAcceptances,
    };
  }

  register() {
    const user = this.fromFormToModel(this.form);
    const utmSource = this.activatedRoute.snapshot.queryParamMap.get('utm_source');
    if (utmSource) {
      user.utm_source = utmSource;
    }
    this.userService.register({ user, 'g-recaptcha-response': this.captchaToken }, this.redirectTo)
      .pipe(catchError((err) => this.handleRegistrationError(err)))
      .subscribe(newUser => newUser && this.handleRegistrationSuccess());
  }

  handleSocialLoginError(socialAuth: SocialAuth): Observable<any> {
    const modalRef = this.modalService.open(RegisterModalCompleteComponent, { size: 'lg', backdropClass: 'backdrop-class', windowClass: 'modal-window' });
    modalRef.result.then((val: RegisterModalCompleteData) => {
      modalRef.dismiss();
      const newSocialAuth = Object.assign({}, socialAuth);
      newSocialAuth.user.phone = val.phone;
      newSocialAuth.user.password = val.password;
      newSocialAuth.user.birth_date = moment(val.birthDate).format('YYYY-MM-DD');
      this.handleSocialLogin(newSocialAuth);
    });
    return of(null);
  }

  computeErrors(errors: { [key: string]: string }): string {
    if (!errors) {
      return '';
    }
    if (errors.email) {
      return `Email ${errors.email[0]}`;
    }
    if (errors.password) {
      return `Password ${errors.password[0]}`;
    }
    if (errors.birth_date) {
      return `Data di nascita ${errors.birth_date[0]}`;
    }
    return '';
  }

  isValid(): boolean {
    return (
      this.form.valid && this.consent.consentForm.valid && this.captchaSuccess
    );
  }

  handleRegistrationSuccess(): void {
    this.kenticoTranslateService1.getItem<any>('toasts.sign_up_toast').pipe(take(1)).subscribe(
      toastMessage => this.toastrService.success(toastMessage.value)
    );
    this.registerSuccess.emit();
    this.handleGtm();
  }

  captchaResolved(token: string) {
    this.captchaToken = token;
    this.captchaService.checkCaptcha(token).subscribe(element => {
      this.captchaSuccess = element.success;
      if (element.expired) {
        this.captchaToken = null;
        this.kenticoTranslateService.getItem<ContentItem>('toasts').map<ContentItem, string>(item => item['recaptcha_expired'].value).subscribe(message => {
          this.toastrService.warning(message);
        });
      }
    });
  }

  private handleGtm() {
    const originalProduct = this.product && this.product.originalProduct;
    const dl = gtm_settings.type === 'GA4'
      ? this.gtmEventGeneratorService.fillRegistrationEvent(originalProduct)
      : { event: 'clickRegistrati' };
    this.gtmHandlerService.requireTenant('yolo-it-it');
    this.gtmHandlerService.getModelHandler().overwrite(dl);
    this.gtmHandlerService.push();
  }

  private handleRegistrationError(response: HttpErrorResponse): Observable<void> {
    const error = response.error;
    if (error && error.error) {
      const err = this.computeErrors(error.errors);
      const message = error.error + (err && `: ${err}` || '');
      this.toastrService.error(message);
      throw new FormHumanError('Cannot register new user: input patterns do not match');
    }
    return of(null);
  }
  getBrandIcon() {
    this.kenticoTranslateService.getItem<any>('navbar').subscribe((item) => {
      this.brandIcon = item?.logo?.value[0].url;
    });
  }
}
