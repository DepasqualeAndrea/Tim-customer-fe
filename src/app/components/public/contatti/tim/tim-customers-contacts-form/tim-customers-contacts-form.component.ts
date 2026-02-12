import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TimMyBrokerCustomersService } from 'app/core/services/tim-my-broker-customers.service';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { ContactMailPayload, ContactsFormContent } from './contacts-form-content.model';

@Component({
  selector: 'app-tim-customers-contacts-form',
  templateUrl: './tim-customers-contacts-form.component.html',
  styleUrls: ['./tim-customers-contacts-form.component.scss']
})
export class TimCustomersContactsFormComponent implements OnInit {

  content: ContactsFormContent
  form: FormGroup
  requestSubmitted: boolean

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private formBuilder: FormBuilder,
    private timMyBrokerCustomersService: TimMyBrokerCustomersService,
    private toastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.createForm()
    this.loadContent()
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      name: [null, Validators.required],
      surname: [null, Validators.required],
      phone: [null, Validators.required],
      mail: [null, Validators.required],
      sellerCode: [null, Validators.required],
    })
  }

  private loadContent(): void {
    this.kenticoTranslateService.getItem<any>('customers_contact_form').pipe(take(1)).subscribe(item => {
      this.content = {
        title: item.title.value,
        backgroundTopLeft: item.background.value[0].url,
        backgroundBottomRight: item.background.value[1].url,
        formNameLabel: item.form_name_label.value,
        formSurnameLabel: item.form_surname_label.value,
        formPhoneLabel: item.form_phone_label.value,
        formMailLabel: item.form_mail_label.value,
        formSellerCodeLabel: item.form_seller_code_label.value,
        buttonLabel: item.button_label.value,
        privacyPolicy: item.privacy_policy.value,
        disclaimer: item.disclaimer.value,
        submissionSuccess: item.submission_successful.value,
        submissionFail: item.submission_failed.value,
        breadcrumbHome: item.breadcrumb_home.value,
        breadcrumbContacts: item.breadcrumb_contacts.value,
      }
    })
  }

  public getFieldInvalidError(formControlName: string): boolean {
    return this.form.get(formControlName).invalid && this.requestSubmitted
  }

  public submit(): void {
    this.requestSubmitted = true
    if (this.form.valid) {
      const payload: ContactMailPayload = {
        data: {
          name: this.form.get('name').value,
          surname: this.form.get('surname').value,
          phone: this.form.get('phone').value,
          email: this.form.get('mail').value,
          sellerCode: this.form.get('sellerCode').value
        }
      }
      this.timMyBrokerCustomersService.sendContactsMail(payload).pipe(
        catchError(err => {
          this.toastrService.error(this.content.submissionFail)
          return throwError(err)
        })
      ).subscribe(response => {
        if (response.result === 'true') {
          this.toastrService.success(this.content.submissionSuccess)
        } else {
          this.toastrService.error(this.content.submissionFail)
        }
      })
    }
  }

  public goHome(): void {
    window.location.href = 'https://www.tim.it/fisso-e-mobile/servizi/mybroker' // o https://www.timmybroker.it ?
  }
}