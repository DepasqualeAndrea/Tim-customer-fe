import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService, DataService } from '@services';
import { ForgotConfirmModalComponent } from '../forgot-confirm-modal/forgot-confirm-modal.component';
import { take } from 'rxjs/operators';
import {KenticoTranslateService} from '../../../../kentico/data-layer/kentico-translate.service';
import { NypUserService } from '@NYP/ngx-multitenant-core';

@Component({
    selector: 'app-forgot-password-modal',
    templateUrl: './forgot-password-modal.component.html',
    styleUrls: ['./forgot-password-modal.component.scss'],
    standalone: false
})
export class ForgotPasswordModalComponent implements OnInit, OnDestroy {

  forgotForm: UntypedFormGroup;

  logoImage: string;

  constructor(
    public  activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private nypUserService: NypUserService,
    private fb: UntypedFormBuilder,
    private kenticoTranslateService: KenticoTranslateService,
    public  dataService: DataService
  ) {
  }

  ngOnInit() {
    this.forgotForm = this.fb.group({
      email: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ])
    });
    this.kenticoTranslateService.getItem<any>('navbar.logo').pipe(take(1)).subscribe(item => {
      this.logoImage = item.images[0].url;
    });
  }

  sendEmail() {
    this.nypUserService.forgotPassword(this.forgotForm.value.email)
      .subscribe(res => {
        if (res.status <= 204) {
          this.activeModal.close();
          const modalRef = this.modalService.open(ForgotConfirmModalComponent, {centered: true});
          modalRef.componentInstance.sent = true;
          localStorage.setItem('emailChange', this.forgotForm.value.email);
          setTimeout(() => {
            modalRef.close();
          }, 5000);
        } else {
          this.activeModal.close();
          const modalRef = this.modalService.open(ForgotConfirmModalComponent, {centered: true});
          modalRef.componentInstance.sent = false;
          setTimeout(() => {
            modalRef.close();
          }, 5000);
        }
      });
  }

  setClassEmail() {
    return {'has-danger': !this.forgotForm.controls.email.pristine && !this.forgotForm.controls.valid};
  }

  ngOnDestroy() {
  }
}
