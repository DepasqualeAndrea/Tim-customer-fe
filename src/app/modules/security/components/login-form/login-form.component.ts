import { CheckoutProduct } from './../../../checkout/checkout.model';
import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UserService, AuthService, DataService } from '@services';
import { Router } from '@angular/router';
import { SocialAuth } from '@model';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { RegisterModalCompleteComponent } from '../register/register-modal-complete/register-modal-complete.component';
import { RegisterModalCompleteData } from '../register/register-modal-complete/register-modal-complete.model';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { environment } from 'environments/environment';
import { ForgotPasswordModalComponent } from '../login/forgot-password-modal/forgot-password-modal.component';
import { ToastrService } from 'ngx-toastr';
import { BackButtonComponent } from '../common/back-button.component';
import { GtmService } from 'app/core/services/gtm/gtm.service';
import { FormHumanError } from '../../../../shared/errors/form-human-error.model';
import { gtm_settings } from 'app/core/models/gtm/gtm-settings.model';
import { KenticoTranslateService } from './../../../kentico/data-layer/kentico-translate.service';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['../common/login-register-forms.scss', './login-form.component.scss'],
    standalone: false
})
export class LoginFormComponent extends BackButtonComponent implements OnInit {

  @Output() loginSuccess = new EventEmitter<void>();
  @Input() isFacebookDisabled;
  @Input() fieldsInColumn = false;
  @Input() canShowPassword = false;
  @Input() product: CheckoutProduct;
  wrongCredentials = false;
  loginForm: UntypedFormGroup;
  brandIcon: string;

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private gtmEventGeneratorService: YoloDataLayerEventObjGeneratorService,
    private gtmHandlerService: GtmHandlerService,
    public dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService
  ) {
    super();
  }

  ngOnInit() {
    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required, Validators.minLength(9)]),
      password: new UntypedFormControl('', Validators.required),
    });
    if (this.dataService.isTenant('santa-lucia_db')) {
      this.getBrandIcon();
    }
  }

  login() {
    if (this.loginForm.valid) {
      this.wrongCredentials = false;
      this.auth.login({ username: this.loginForm.value["email"], password: this.loginForm.value["password"] }).subscribe(
        () => {
          this.loginSuccess.emit();
          this.handleGtm();
        },
        (error) => {
          this.wrongCredentials = true;
          throw new FormHumanError("wrong login credentials")

        }
      );
    } else {
      throw new FormHumanError("login parameters mismatch excepted pattern")
    }
  }

  forgotPassword() {
    this.modalService.open(ForgotPasswordModalComponent, { centered: true });
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

  private handleGtm() {
    const originalProduct = this.product && this.product.originalProduct;
    const dl = gtm_settings.type === 'GA4'
      ? this.gtmEventGeneratorService.fillLoginEvent(originalProduct)
      : { event: 'clickLogin' };
    this.gtmHandlerService.requireTenant('yolo-it-it');
    this.gtmHandlerService.getModelHandler().overwrite(dl);
    this.gtmHandlerService.push();
  }

  getBrandIcon() {
    this.kenticoTranslateService.getItem<any>('navbar').subscribe((item) => {
      this.brandIcon = item?.logo?.value[0].url;
    });
  }

}
