import { NypUserService } from '@NYP/ngx-multitenant-core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { RouteHash } from 'app/modules/checkout/login-register/tim-retirees/login-register-tim-retirees/route-hashes.enum';
import { PasswordHelper } from 'app/shared/helpers/password.helper';
import { take } from 'rxjs/operators';
import { KenticoTranslateService } from '../../../kentico/data-layer/kentico-translate.service';
import { ChangePasswordModalComponent } from './change-password-modal/change-password-modal.component';

function passwordConfirming(c: AbstractControl): any {
  if (!c.parent || !c) {
    return;
  }
  const pwd = c.parent.get('newPwd');
  const cpwd = c.parent.get('confPwd');
  if (!pwd || !cpwd) {
    return;
  }
  if (pwd.value !== cpwd.value) {
    return { invalid: true };
  }
}

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    standalone: false
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  resetPwdForm: UntypedFormGroup;
  showEstimatesBox = false;
  password_token: string;

  logoCodename: string = 'navbar.logo'
  logoImage: string;

  altPath: string
  altFunction: string
  altLocalStorageKey: string

  constructor(
    private nypUserService: NypUserService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private kenticoTranslateService: KenticoTranslateService,
    public dataService: DataService,
    private componentFeaturesService: ComponentFeaturesService
  ) { }

  ngOnInit() {
    this.getComponentFeaturesAltRules()

    this.resetPwdForm = this.fb.group({
      newPwd: new UntypedFormControl('', [Validators.required, PasswordHelper.passwordValidator(8)]),
      confPwd: new UntypedFormControl('', [Validators.required, passwordConfirming])
    })
    this.route.queryParams.subscribe((params: Array<any>) => {
      if (params && params['reset_password_token']) {
        this.password_token = params['reset_password_token']
      }
    })
    this.kenticoTranslateService.getItem<any>(this.logoCodename).pipe(take(1)).subscribe(item => {
      this.logoImage = item.images[0].url
    })
  }

  sendPwdRequest() {
    if (this.resetPwdForm.invalid) {
      alert('Password non valida.\nDeve contenere almeno 8 caratteri alfanumerici di cui una lettera maiuscola, una minuscola, un numero e un carattere speciale');
      return;
    }
    this.route.queryParams
      .subscribe(params => {
        if (params?.code && params?.username) {
          this.nypUserService.forgotPasswordConfirmation(params.code, this.resetPwdForm.value.newPwd, params.username)
            .subscribe(
              resp => {
                if (resp) {
                  const modalRef = this.modalService.open(ChangePasswordModalComponent, { centered: true })
                  modalRef.componentInstance.changed = true
                  setTimeout(() => {
                    modalRef.close();
                    this.loginRedirect();
                  }, 4000);
                } else {
                  const modalRef = this.modalService.open(ChangePasswordModalComponent, { centered: true })
                  modalRef.componentInstance.changed = false
                  setTimeout(() => {
                    modalRef.close();
                    this.loginRedirect();
                  }, 4000)
                }
              },
              error => {
                throw error
              }
            );
        } else {
          console.log('error parametri errati')
        }
      })
  }

  private getComponentFeaturesAltRules() {
    this.componentFeaturesService.useComponent('forgot-password')
    this.componentFeaturesService.useRule('alts-config')
    if (this.componentFeaturesService.isRuleEnabled()) {
      this.altPath = this.getAltConfig('path')
      this.altFunction = this.getAltConfig('function')
      this.altLocalStorageKey = this.getAltConfig('key')
      this.logoCodename = this.getAltConfig('logo-codename')
    }
  }

  private getAltConfig(constraintName: string): string | any {
    const alt = this.componentFeaturesService.getConstraints().get(constraintName)
    return alt || null
  }

  loginRedirect() {
    this.router.navigate(['user-access'], { fragment: RouteHash.LOGIN });
  }

  ngOnDestroy() {
  }
}
