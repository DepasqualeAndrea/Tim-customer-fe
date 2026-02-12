import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {DataService, UserService} from '@services';
import { ToastrService } from 'ngx-toastr';
import {ComponentFeaturesService} from '../../../../core/services/componentFeatures.service'
import {KenticoTranslateService} from '../../../kentico/data-layer/kentico-translate.service';


class Message {
  name: string;
  email: string;
  message: string;
  subject: string;
  urgent: boolean;
  captcha_token: string;
}

enum MessageSendingStatus {
  NeverSent = 0,
  submitAttempt = 1,
  NotSent = 2,
  Sending = 3,
  Sent = 4
}

@Component({
  selector: 'app-contact-form-net',
  templateUrl: './contact-form-net.component.html',
  styleUrls: ['./contact-form-net.component.scss']
})
export class ContactFormNetComponent implements OnInit {

  contacts: FormGroup;
  recaptchaKey: string;
  captchaEnabled: boolean;
  captchaToken: string;
  private captchaSuccess = false;
  private messageStatus: MessageSendingStatus = MessageSendingStatus.NeverSent;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private kenticoTranslateService: KenticoTranslateService,
    private componentFeatures: ComponentFeaturesService,
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.componentFeatures.useComponent('contacts-form');
    this.componentFeatures.useRule('captcha');
    const constraints: Map<string, any> = this.componentFeatures.getConstraints();

    this.recaptchaKey = this.dataService.tenantInfo.captcha.siteKey;
    this.captchaEnabled = constraints.get('enabled') || false;
    this.captchaSuccess = !this.captchaEnabled;     // if captcha is disabled then set captchaSuccess true to validate form
                                                    // otherwise captchaSuccess is false to prevent form validation


    this.contacts = this.formBuilder.group({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      message: new FormControl(null, [Validators.required]),
    });
  }

  private isValid(): boolean {
    return this.contacts.valid && this.captchaSuccess;
  }
  private canSend(): boolean {
    return this.messageStatus < MessageSendingStatus.Sending;
  }
  neverSent(): boolean {
    return this.messageStatus === MessageSendingStatus.NeverSent;
  }

  formSubmit() {
    this.messageStatus = MessageSendingStatus.submitAttempt;
    if(this.isValid()) {
      if(!this.canSend()) {
        return;
      }
      this.messageStatus = MessageSendingStatus.NotSent;
      const mex: Message = new Message();
      mex.name = this.contacts.get('name').value;
      mex.email = this.contacts.get('email').value;
      mex.message = this.contacts.get('message').value;
      mex.captcha_token = this.captchaToken;
      mex.subject = 'Piattaforma Net - richiesta di contatto';
      mex.urgent = false;

      this.sendMessage(mex);
    }
  }

  private sendMessage(m: Message) {
    if(this.canSend()) {
      this.messageStatus = MessageSendingStatus.Sending;

      this.userService.sendContactRequest(m).subscribe(() => {
        this.messageStatus = MessageSendingStatus.Sent;
        this.kenticoTranslateService.getItem<any>('toasts.contact_send_success').subscribe(message => {
          this.toastr.success(message.value);
        })
      },
      () => {
        this.messageStatus = MessageSendingStatus.NotSent;
      })
    }
  }

  captchaResolved(token: string) {
    this.captchaToken = token;
    this.captchaSuccess = true;
  }



}
