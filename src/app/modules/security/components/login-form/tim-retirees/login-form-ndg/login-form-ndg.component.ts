import { Component, Input, OnInit } from '@angular/core'
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { AuthService, DataService } from '@services'
import { FormHumanError } from 'app/shared/errors/form-human-error.model'
import { ForgotPasswordNdgModalComponent } from '../../../login/forgot-password-ndg-modal/forgot-password-ndg-modal.component'
import { environment } from 'environments/environment'
import { NypInsurancesService } from '@NYP/ngx-multitenant-core'
import { map, mergeMap, tap } from 'rxjs/operators'

@Component({
    selector: 'app-login-form-ndg',
    templateUrl: './login-form-ndg.component.html',
    styleUrls: ['./login-form-ndg.component.scss', '../../../../../nyp-checkout/styles/checkout-forms.scss'],
    standalone: false
})
export class LoginFormNdgComponent implements OnInit {

  @Input() content: any

  constructor(
    private formBuilder: UntypedFormBuilder,
    private modalService: NgbModal,
    private auth: AuthService,
    private insuranceService: NypInsurancesService,
    private dataService: DataService,
  ) { }

  form: UntypedFormGroup
  taxcodePattern = '^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$'
  wrongCredentials = false
  passwordVisibility: boolean = false;

  ngOnInit() {
    this.form = this.createForm()
  }

  createForm(): UntypedFormGroup {
    return this.formBuilder.group({
      taxcode: ['', { validators: [Validators.required, Validators.pattern(this.taxcodePattern)] }],
      password: ['', Validators.required],
    })
  }

  getFieldInvalidError(formControlName: string): boolean {
    return this.form.get(formControlName).invalid &&
      (this.form.get(formControlName).touched || this.form.get(formControlName).dirty)
  }

  getFieldError(formControlName: string, errorType: string): boolean {
    return this.getFieldInvalidError(formControlName) && this.form.get(formControlName).errors && this.form.get(formControlName).errors[errorType]
  }

  login() {
    const credentials = this.getCredentialsFromForm();
    (<any>credentials).cipher = false;
    this.auth.ndgLogin(credentials)
      .pipe(
        mergeMap(() => this.insuranceService.getProducts()),
        map(res => res.products),
        tap(products => this.dataService.products = products),
        tap(products => {
          const y = this.dataService.Yin;
          if (!!y) {
            this.dataService.setProduct(products.find(p => p.product_code == y.product));
          }
        }),
      )
      .subscribe(
        () => {
          console.log('ok');
        },
        (error) => {
          if (error.status === 403) {
            this.forgotPassword();
          } else {
            this.wrongCredentials = true;
            throw new FormHumanError("wrong login credentials");
          }
        }
      );
  }

  getCredentialsFromForm(): { [key: string]: any } {
    const controls = this.form.controls
    return {
      user: {
        ndg_code: controls['taxcode'].value,
        password: controls['password'].value
      }
    }
  }

  forgotPassword() {
    this.modalService.open(ForgotPasswordNdgModalComponent, { centered: true, windowClass: 'tim-modal-window' })
  }

  isValid() {
    return this.form.valid
  }

  toggleShowPassword(){
    this.passwordVisibility = !this.passwordVisibility;
  }
}
