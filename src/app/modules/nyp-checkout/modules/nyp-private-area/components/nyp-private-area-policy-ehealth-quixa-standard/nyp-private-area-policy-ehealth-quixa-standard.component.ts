import { NypIadPolicyService } from "@NYP/ngx-multitenant-core";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AuthService, DataService } from "@services";
import { CONSTANTS } from "app/app.constants";
import { ExternalClaimUser } from "app/core/models/claims/external-claim-user.model";
import { ExternalClaim } from "app/core/models/claims/external-claim.model";
import { ExternalClaimService } from "app/core/services/claims/external-claim.service";
import { ComponentFeaturesService } from "app/core/services/componentFeatures.service";
import { KenticoTranslateService } from "app/modules/kentico/data-layer/kentico-translate.service";
import { NypPolicy } from "app/modules/nyp-checkout/models/api.model";
import moment from "moment";

@Component({
    selector: "app-nyp-private-area-policy-ehealth-quixa-standard",
    templateUrl: "./nyp-private-area-policy-ehealth-quixa-standard.component.html",
    styleUrls: [
        "./nyp-private-area-policy-ehealth-quixa-standard.component.scss",
    ],
    standalone: false
})
export class NypPrivateAreaPolicyEhealthQuixaStandardComponent
  implements OnInit
{
  @Input() public policy: NypPolicy;

  @Output() openModalWithdrawalEvent = new EventEmitter<void>();
  @Output() openModalCancelationEvent = new EventEmitter<void>();
  @Output() loadingRequested: EventEmitter<boolean> =
  new EventEmitter<boolean>();

  duration: string;
  formattedExpirationDate: string;
  formattedStartDate: string;
  loading: boolean = false;
  public policyStatus: string;

  constructor(
    public kenticoTranslateService: KenticoTranslateService,
    public dataService: DataService,
    private componentFeaturesService: ComponentFeaturesService,
    private nypIadPolicyService: NypIadPolicyService,
    private externalClaimService: ExternalClaimService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.formatDates(this.policy);
    this.setDuration(this.policy);
    console.log(this.policy);
  }
  private static readonly PolicyStatus: {
    [key: string]: { code: string; description: string };
  } = {
    active: {
      code: "nyp_data_service.policy_status_active",
      description: "Attiva",
    },
    verified: {
      code: "nyp_data_service.policy_status_verified",
      description: "In attesa di attivazione",
    },
    draft: {
      code: "nyp_data_service.policy_status_draft",
      description: "In attesa di verifica",
    },
    expired: {
      code: "nyp_data_service.policy_status_expired",
      description: "Scaduta",
    },
    canceled: {
      code: "nyp_data_service.policy_status_canceled",
      description: "Annullata",
    },
    suspended: {
      code: "nyp_data_service.policy_status_suspended",
      description: "Sospesa",
    },
  };

  getPolicyStatus(policy: NypPolicy): string {
    const policyStatusObject =
      NypPrivateAreaPolicyEhealthQuixaStandardComponent.PolicyStatus[
        policy.status
      ];
    return policyStatusObject ? policyStatusObject.description : "";
  }
  getStatusColorClass(policy: NypPolicy): string[] {
    switch (policy.status) {
      case "active":
        return ["active"];
      case "verified":
      case "draft":
        return ["verified"];
      case "expired":
      case "canceled":
      case "suspended":
        return ["expired"];
      default:
        return [];
    }
  }

  public isCertificateMissing(policy): boolean {
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING;
  }

  public infoPackageDownload() {
    this.componentFeaturesService.getComponent("policy-detail");
    this.componentFeaturesService.useRule("info-package-download");
    return this.componentFeaturesService.isRuleEnabled();
  }

  private setDuration(policy): void {
    if (
      policy.product.payment_methods[0].type ===
        "Spree::Gateway::BraintreeRecurrent" ||
      policy.product.payment_methods[0].type ===
        "Spree::PaymentMethod::NoPaymentCreditCard"
    ) {
      this.kenticoTranslateService
        .getItem<any>("private_area.yearly_duration_type")
        .pipe()
        .subscribe((item) => {
          this.duration = item.value;
        });
    }
  }

  private formatDates(policy): void {
    this.formattedExpirationDate = moment(policy.expiration_date).format(
      "DD/MM/YYYY"
    );
    this.formattedStartDate = moment(policy.start_date).format("DD/MM/YYYY");
  }

  downloadFile(policy) {
    this.nypIadPolicyService
      .getDocument(policy.policy_number)
      .subscribe((res) => {
        const source = `data:application/pdf;base64,${res.file}`;
        const link = document.createElement("a");

        link.href = source;
        link.download = res.fileName;

        link.click();
      });
  }

  openModalWithdrawal() {
    if (this.policy.actions_availability.withdrawable) {
      this.openModalWithdrawalEvent.emit();
    }
  }

  openModalCancelation() {
    if (this.policy.actions_availability.deactivable) {
      this.openModalCancelationEvent.emit();
    }
  }

  private convertUserToExternalClaimUser(user): ExternalClaimUser {
    const external = new ExternalClaimUser();
    external.name = user.address.firstname + " " + user.address.lastname;
    external.fiscal_code = user.address.taxcode;
    external.email = user.email;
    external.phone = user.address.phone;
    external.birth_place = user.address.birth_city?.name || "";
    external.birth_day = moment(user.address.birth_date).format("DD/MM/YYYY");
    external.resident.city = user.address.city;
    external.resident.street = this.getNumeroCivicoFromAddress(
      user.address.address1
    );
    external.resident.square = this.getStreetFromAddress(user.address.address1);
    external.resident.province = user.address.state?.name || "";
    external.resident.postcode = user.address.zipcode;

    if (external.phone?.startsWith("0039")) {
      external.phone = "+39" + external.phone.substring("0039".length);
    }
    if (external.phone && !external.phone.startsWith("+39")) {
      external.phone = "+39" + external.phone;
    }

    return external;
  }
  private getNumeroCivicoFromAddress(address: string): string {
    const execResult: RegExpExecArray =
      /^([a-zA-Z\s]*)[\W\s]*(.*?[\d\s]+[\W+]*)$/.exec(address);
    return execResult ? execResult[2] : address;
  }

  private getStreetFromAddress(address: string): string {
    const execResult: RegExpExecArray =
      /^([a-zA-Z\s]*)[\W\s]*(.*?[\d\s]+[\W+]*)$/.exec(address);
    return execResult ? execResult[1] : address;
  }

  openExternalClaim() {
    const userClaim: ExternalClaimUser = this.convertUserToExternalClaimUser(
      this.authService.loggedUser
    );
    const claim: ExternalClaim = new ExternalClaim();
    claim.claim.insured = userClaim;
    claim.claim.insured.policy_number = this.policy.policy_number;
    this.loadingRequested.emit(true);
    this.loading = true;

    this.externalClaimService
      .createExternalClaim(this.policy.id, claim)
      .subscribe((response) => {
        if (!!response && !!response.url) {
          window.location.href = response.url;
        }
        this.loadingRequested.emit(false);
      });
  }
}
