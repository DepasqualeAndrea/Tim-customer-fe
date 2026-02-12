import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService, DataService } from "@services";
import { AnnoDiCostruzione, MaterialeDiCostruzione, NumeroPianiEdificio, PianoPiuBassoOccupato } from "app/modules/nyp-checkout/modules/tim-nat-cat/building-enum";
import { TimNatCatService } from "../../services/api.service";
import { NypComunicationManagerService } from "@NYP/ngx-multitenant-core";

@Component({
  selector: "app-insurance-info-custom-request-modal",
  templateUrl: "./insurance-info-custom-request-modal.component.html",
  styleUrls: [
    "./insurance-info-custom-request-modal.component.scss",
    "../../../../styles/checkout-forms.scss",
    "../../../../styles/size.scss",
    "../../../../styles/colors.scss",
    "../../../../styles/text.scss",
    "../../../../styles/common.scss",
  ],
})
export class InsuranceInfoCustomRequestModalComponent implements OnInit {
  @Input() kenticoContent: any;
  formSubmitted = false;
  customRequestModal: any = {};
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
   private nypCommunicationManagerService: NypComunicationManagerService,
    private dataService: DataService,
  ) {}

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
    const MaterialeDiCostruzioneLabels = {
      [MaterialeDiCostruzione.Muratura]: "Muratura",
      [MaterialeDiCostruzione.CementoArmato]: "Cemento Armato",
      [MaterialeDiCostruzione.Acciaio]: "Acciaio",
      [MaterialeDiCostruzione.NonConosciutoAltro]: "Non Conosciuto / Altro",
    };

    const AnnoDiCostruzioneLabels = {
      [AnnoDiCostruzione.FinoAl1950]: "Fino Al 1950",
      [AnnoDiCostruzione.Dal1950Al1990]: "Dal 1950 Al 1990",
      [AnnoDiCostruzione.DopoIl1990]: "Dopo Il 1990",
      [AnnoDiCostruzione.NonConosciuto]: "Non Conosciuto",
    };

    const NumeroPianiEdificioLabels = {
      [NumeroPianiEdificio.TreOpiu]: "Tre O più",
      [NumeroPianiEdificio.ZeroDue]: "Zero - Due",
    };

    const PianoPiuBassoOccupatoLabels = {
      [PianoPiuBassoOccupato.PrimoPiano]: "Primo Piano",
      [PianoPiuBassoOccupato.SuperioriAlPrimo]: "Superiori Al Primo",
      [PianoPiuBassoOccupato.PianoTerra]: "Piano Terra",
      [PianoPiuBassoOccupato.Scantinato]: "Scantinato",
    };

    if (this.form.invalid) {
      return;
    }
    this.formSubmitted = true;
    const payload = this.form.getRawValue();
    const orderString = localStorage.getItem("order");
    const orderObject = orderString ? JSON.parse(orderString) : null;
    const emailRequestBody = {
      attachments: [],
      message: {
        key: "TIM_NAT_CAT_PREVENTIVO",
      },
      options: {
        toMail: this.dataService.getResponseProduct().configuration.properties.properties.find(data => data.name === "companyMail")?.value ,
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
          },
          {
            key: "provincia",
            value: orderObject.orderItem[0].insured_item.provincia,
          },
          {
            key: "comune",
            value: orderObject.orderItem[0].insured_item.comune,
          },
          {
            key: "indirizzo",
            value: orderObject.orderItem[0].insured_item.indirizzo,
          },
          {
            key: "cap",
            value: orderObject.orderItem[0].insured_item.cap,
          },
          {
            key: "materiale",
            value: MaterialeDiCostruzioneLabels[orderObject.orderItem[0].insured_item.materialeDiCostruzione] || "",
          },
          {
            key: "anno_costruzione",
            value: AnnoDiCostruzioneLabels[orderObject.orderItem[0].insured_item.annoDiCostruzione] || "",
          },
          {
            key: "numero_piani",
            value: NumeroPianiEdificioLabels[orderObject.orderItem[0].insured_item.numeroPianiEdificio] || "",
          },
          {
            key: "piano_occupato",
            value: PianoPiuBassoOccupatoLabels[orderObject.orderItem[0].insured_item.pianoPiuBassoOccupato] || "",
          },
          {
            key: "tipo_uso",
            value: orderObject.orderItem[0].insured_item.contraenteProprietarioEConduttore ? "Proprietario E Conduttore" : "Conduttore",
          },
          // {
          //   key: "proprietario_e_conduttore",
          //   value: orderObject.orderItem[0].insured_item.contraenteProprietarioEConduttore,
          // },
        ],
      },
    };
    this.nypCommunicationManagerService
      .sendEmailCommunication(emailRequestBody, "token")
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
