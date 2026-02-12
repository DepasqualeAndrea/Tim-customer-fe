import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CaptchaService } from 'app/shared/captcha.service';
import { DataService, UserService } from '@services';
import { ContentItem } from 'kentico-cloud-delivery';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import {KenticoTranslateService} from '../../modules/kentico/data-layer/kentico-translate.service';

@Component({
  selector: 'app-contacts-form',
  templateUrl: './contacts-form.component.html',
  styleUrls: ['./contacts-form.component.scss']
})
export class ContactsFormComponent implements OnInit {

  form: FormGroup;
  recaptchaKey: string;
  captchaEnabled: boolean;
  captchaToken: string;
  private captchaSuccess = false;
  isFormSubmitted: boolean;
  showContactSendSuccess = false;

  constructor(
    private formBuilder: FormBuilder,
    private captchaService: CaptchaService,
    private toastrService: ToastrService,
    private dataService: DataService,
    private kenticoTranslateService: KenticoTranslateService,
    private userService: UserService,
    private componentFeatures: ComponentFeaturesService,
  ) { }

  ngOnInit() {
    this.componentFeatures.useComponent('contacts-form');
    this.componentFeatures.useRule('captcha');
    const constraints: Map<string, any> = this.componentFeatures.getConstraints();

    this.recaptchaKey = this.dataService.tenantInfo.captcha.siteKey;
    this.captchaEnabled = constraints.get('registerEnabled') || false;
    this.captchaSuccess = !this.captchaEnabled;     // if captcha is disabled then set captchaSuccess true to validate form
                                                    // otherwise captchaSuccess is false to prevent form validation

    this.createFormGroup();
  }

  createFormGroup() {
    this.form = this.formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      subject: new FormControl(null, [Validators.required]),
      message: new FormControl(null, [Validators.required]),
      urgent: new FormControl(null, [Validators.nullValidator])
    });
  }

  isFormValid() {
    return this.form.valid && this.captchaSuccess;
  }

  captchaResolved(response: string) {
    this.captchaToken = response;
    this.captchaSuccess = true;
  }

  createContactsMessage() {
    return {
      name: this.form.controls['name'].value,
      email: this.form.controls['email'].value,
      subject: this.form.controls['subject'].value,
      message: this.form.controls['message'].value,
      urgent: !!this.form.controls['urgent'].value ? true : false,
      captcha_token: this.captchaToken
    };
  }

  sendContactsMessage() {
    this.isFormSubmitted = true;
    if (this.isFormValid()) {
      const contactMessage = this.createContactsMessage();
      this.userService.sendContactRequest(contactMessage).subscribe( () =>
        this.contactSendSuccessful()
      );
    }
  }

  contactSendSuccessful() {
    this.showContactSendSuccess = true;
  }

}
