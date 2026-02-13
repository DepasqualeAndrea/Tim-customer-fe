import { Component, OnDestroy, OnInit } from '@angular/core'
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms'
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { DataService, UserService } from '@services'
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service'
import { take } from 'rxjs/operators'
import { ForgotConfirmModalComponent } from '../forgot-confirm-modal/forgot-confirm-modal.component'
import { NypUserService } from '@NYP/ngx-multitenant-core'
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service'

@Component({
    selector: 'app-forgot-password-ndg-modal',
    templateUrl: './forgot-password-ndg-modal.component.html',
    styleUrls: [
        './forgot-password-ndg-modal.component.scss',
        '../../../../nyp-checkout/styles/checkout-forms.scss'
    ],
    standalone: false
})
export class ForgotPasswordNdgModalComponent implements OnInit, OnDestroy {

  form: UntypedFormGroup
  logoImage: string
  isBusiness: any;
  public Order$ = this.nypDataService.Order$;

  taxcodePattern = '^[a-zA-Z]{6}[0-9]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9]{2}([a-zA-Z]{1}[0-9]{3})[a-zA-Z]{1}$'

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    protected nypUserService: NypUserService,
    private formBuilder: UntypedFormBuilder,
    private kenticoTranslateService: KenticoTranslateService,
    public dataService: DataService,
    private nypDataService: NypDataService
  ) {
    this.form = this.createForm()
  }

  ngOnInit() {
    this.isBusiness = this.Order$.value?.packet?.data?.product?.business || false;
    this.getLogo()
    this.applyModeValidators(this.isBusiness);
  }

  private applyModeValidators(isBusiness: boolean): void {
    const tax = this.form.get('taxcode');
    const email = this.form.get('email');
    tax.setValidators(isBusiness ? [] : [Validators.required, Validators.pattern(this.taxcodePattern)]);
    email.setValidators(isBusiness ? [Validators.required, Validators.email] : []);
    tax.updateValueAndValidity({ onlySelf: true });
    email.updateValueAndValidity({ onlySelf: true });
  }


  private getLogo(): void {
    this.kenticoTranslateService.getItem<any>('navbar.logo').pipe(take(1)).subscribe(item => {
      this.logoImage = item.images[0].url
    })
  }

  private createForm(): UntypedFormGroup {
    return this.formBuilder.group({
      taxcode: [null],
      email: [null]
    })
  }

  sendEmail() {
    const codeToSend = this.isBusiness
    ? this.form.value['email']
    : this.form.value['taxcode']?.toUpperCase(); 
     this.nypUserService.forgotPasswordNdg(codeToSend).subscribe(res => {
        if (res.status <= 204) {
          this.activeModal.close()
          const modalRef = this.modalService.open(ForgotConfirmModalComponent, { centered: true })
          modalRef.componentInstance.sent = true
          if (!this.isBusiness) {
            localStorage.setItem('taxcodeChange', this.form.value['taxcode'].toUpperCase());
          }
          if (this.isBusiness) {
            localStorage.setItem('emailChange', this.form.value['email']);
          }
          setTimeout(() => {
            modalRef.close()
          }, 5000)
        } else {
          this.activeModal.close()
          const modalRef = this.modalService.open(ForgotConfirmModalComponent, { centered: true })
          modalRef.componentInstance.sent = false
          setTimeout(() => {
            modalRef.close()
          }, 5000)
        }
      })
  }

  getError(formControlName: string, errorType: string): boolean {
    const control = this.form.controls[formControlName]
    return control.errors && control.errors[errorType]
  }

  hasError(formControlName: string): boolean {
    const control = this.form.controls[formControlName]
    return (control.touched || control.dirty) && control.invalid
  }


  ngOnDestroy() { }
}
