import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NypComunicationManagerService } from '@NYP/ngx-multitenant-core';
import { DataService } from '@services';

@Component({
    selector: 'app-insurance-info-custom-request-modal',
    templateUrl: './insurance-info-custom-request-modal.component.html',
    styleUrls: ['./insurance-info-custom-request-modal.component.scss'],
    standalone: false
})
export class InsuranceInfoCustomRequestModalComponent implements OnInit {

  @Input() kenticoContent: any;
  formSubmitted = false;
  customRequestModal: any = {};
  form: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private nypCommunicationManagerService: NypComunicationManagerService,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.loadModalData();
  }

  loadModalData(): void {
    this.customRequestModal = {
      modalTitle: this.kenticoContent.title_modal?.value || "",
      subtitle: this.kenticoContent.subtitle_modal?.value || "",
      required_text: this.kenticoContent.required_text_modal?.value || "",
      name_label: this.kenticoContent.name_label_modal?.value || "",
      surname_label: this.kenticoContent.surname_label_modal?.value || "",
      email_label: this.kenticoContent.email_label_modal?.value || "",
      phone_label: this.kenticoContent.phone_label_modal?.value || "",
      consent_text: this.kenticoContent.consent_text_modal?.value || "",
      link_consent: this.kenticoContent.link_consent?.value || "",
      close_modal_icon: this.kenticoContent.close_modal_icon?.value[0]?.url || "",
      close_btn_text: this.kenticoContent.close_btn_text_modal?.value || "",
      send_btn_text: this.kenticoContent.send_btn_text_modal?.value || "",
      thank_you_text: this.kenticoContent.thank_you_text_modal?.value || "",
    };
    this.buildFormCustomRequest();
  }

  buildFormCustomRequest(): void {
    const group = {
      name: [null, Validators.required],
      surname: [null, Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required]],
      consent: [false, Validators.requiredTrue],
    };

    this.form = this.fb.group(group);
  }

  sendRequest(): void {
    if (this.form.invalid) {
      return;
    }
    this.formSubmitted = true;
    const payload = this.form.getRawValue();
    const emailRequestBody = {
      attachments: [],
      message: {
        key: "TIM_CYBER_BUSINESS_PREVENTIVO",
      },
      options: {
        toMail: this.dataService.getResponseProduct().configuration.properties.properties.find(data => data.name === "companyMail")?.value,
        messaggetype: "html",
        "template-placeholder": [
          {
            key: "nome",
            value: payload.name,
          },
          {
            key: "cognome",
            value: payload.surname,
          },
          {
            key: "email",
            value: payload.email,
          },
          {
            key: "telefono",
            value: payload.phone,
          }
        ],
      },
    };
    this.nypCommunicationManagerService.sendEmailCommunication(emailRequestBody, "token")
      .subscribe({
        next: (response) => {
          console.log("Email sent successfully", response);
        },
        error: (error) => {
          console.error("Error sending email", error);
        },
        complete: () => {
          console.log("Email communication completed");
        },
      });
  }

  closeModal() {
    this.modalService.dismissAll();
  }
}
