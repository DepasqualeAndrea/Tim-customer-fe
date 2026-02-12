import { Component, OnInit } from "@angular/core";
import { DataService, InsurancesService } from "@services";
import * as _ from "lodash";
import { take } from "rxjs/operators";
import { CONSTANTS } from "app/app.constants";
import { ComponentFeaturesService } from "app/core/services/componentFeatures.service";
import { KenticoTranslateService } from "../../../kentico/data-layer/kentico-translate.service";
import { PolicyStatus } from "./my-policies.model";
import { RouterService } from "app/core/services/router.service";
import { ContainerComponent } from 'app/modules/tenants/component-loader/containers/container.component';
import { Policy } from '../../private-area.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from "moment";
import { NypInsurancesService } from "@NYP/ngx-multitenant-core";
@Component({
  selector: "app-my-policies",
  templateUrl: "./my-policies.component.html",
  styleUrls: ["./my-policies.component.scss"],
})
export class MyPoliciesComponent implements OnInit {
  policies: any;
  nopolicies = false;

  redirectClaimProductCodes: string[] = [];
  doublePolicyNumberProducts: string[];

  active: string;
  verified: string;
  unverified: string;
  expired: string;
  canceled: string;
  suspended: string;
  addNewInsurancebuttonContent: Object = {};
  petPreTitle: string;

  policy: Policy;

  isEnabledHideInsurances: boolean = false;


  constructor(
    private nypInsuranceService: NypInsurancesService,
    private kenticoTranslateService: KenticoTranslateService,
    private componentFeaturesService: ComponentFeaturesService,
    private routerService: RouterService,
    public dataService: DataService,
    private modalService: NgbModal
  ) { }

  public isCertificateMissing(policy): boolean {
    return policy.certificate !== CONSTANTS.CERTIFICATE_URL_MISSING;
  }

  public isSurveyMissing(policy): boolean {
    return policy.adequacy_survey_url !== CONSTANTS.SURVEY_URL_MISSING;
  }

  ngOnInit() {
    this.getComponentFeatures();

    this.nypInsuranceService.getInsurances(this.isEnabledHideInsurances).subscribe((res) => {
      if (res.insurances[0] && (this.dataService.tenantInfo.tenant === 'banco-desio_db' || this.dataService.tenantInfo.tenant === 'civibank_db')) {
        this.petPreTitle = res.insurances.find(quote => (quote.name === 'Basic' || quote.name === 'Prestige' || quote.name === 'VIP')) ? res.insurances.find(quote => (quote.name === 'Basic' || quote.name === 'Prestige' || quote.name === 'VIP')).product.properties.find(item => item.name === 'pre_title').value : '';
      }
      this.policies = res.insurances.sort((a, b) =>
        b.completed_at.localeCompare(a.completed_at)
      );
      this.policies.forEach((policy) => {
        const nameProduct = policy.product.properties.find(
          (prop) => prop.name === "name_product"
        );
        policy.nameProduct = nameProduct ? nameProduct.value : "";
      });
      if (!this.policies || this.policies.length === 0) {
        this.nopolicies = true;
      }
    });
    this.getPolicyStatusTextKentico();
  }

  getPolicyStatusTextKentico() {
    this.kenticoTranslateService
      .getItem<any>("private_area")
      .pipe(take(1))
      .subscribe((item) => {
        this.active = item.status_active.value;
        this.verified = item.status_verified.value;
        this.unverified = item.status_unverified.value;
        this.expired = item.status_expired.value;
        this.canceled = item.status_canceled.value;
        this.suspended = item.status_suspended.value;
      });
  }

  public getSmallImage(images): string {
    if (images && images.length) {
      let imgs = _.find(images, ["image_type", "fp_image"]);
      if (!imgs) {
        imgs = _.find(images, ["image_type", "default"])
          ? _.find(images, ["image_type", "default"])
          : _.find(images, ["image_type", "common_image"]);
      }
      return imgs.small_url;
    } else {
      return "";
    }
  }

  public getLabel(status): string {
    switch (status) {
      case PolicyStatus.ACTIVE:
        return this.active;
      case PolicyStatus.VERIFIED:
        return this.verified;
      case PolicyStatus.UNVERIFIED:
        return this.unverified;
      case PolicyStatus.EXPIRED:
        return this.expired;
      case PolicyStatus.CANCELED:
        return this.canceled;
      case PolicyStatus.SUSPENDED:
        return this.suspended;
      default:
        break;
    }
  }

  public getPaymentPeriod(policy): string {
    return policy.variant.sku.includes("TUTLEG12_") ? "Annuale" : "Mensile";
  }

  public getPaymentFrequencyPeriod(policy): string {
    return policy.payment_frequency.includes("M") ? "Mensile" : "Annuale";
  }

  public enableRedirectClaimButton(policy): boolean {
    const isClaimEligible = policy.actions_availability.claim_eligible;
    const canClaimBeOpened =
      policy.status === PolicyStatus.ACTIVE ||
      policy.status === PolicyStatus.EXPIRED;
    const isProductCodeValid = this.hasProductCodeRedirectClaim(policy);
    return isClaimEligible && canClaimBeOpened && isProductCodeValid;
  }

  public hasProductCodeRedirectClaim(policy): boolean {
    if (this.dataService.tenantInfo.tenant === 'imagin-es-es_db') {
      this.redirectClaimProductCodes = [
        "chubb-deporte",
        "chubb-deporte-rec",
        "esqui-gold",
        "esqui-silver",
      ];
    }
    else {
      this.redirectClaimProductCodes = [
        "chubb-deporte",
        "chubb-deporte-rec",
      ];
    }
    return this.redirectClaimProductCodes.some(
      (code) => code === policy.product.product_code
    );
  }

  private getComponentFeatures(): void {
    this.componentFeaturesService.useComponent("policy-detail");
    this.componentFeaturesService.useRule("double-policy-number");
    const isEnabled = this.componentFeaturesService.isRuleEnabled();
    if (isEnabled) {
      this.doublePolicyNumberProducts = this.componentFeaturesService
        .getConstraints()
        .get("product-codes");
    }

    this.componentFeaturesService.useRule("hide-insurances");
    this.isEnabledHideInsurances = this.componentFeaturesService.isRuleEnabled();
  }

  public openRedirectClaim(policy): void {
    this.componentFeaturesService.useComponent("policy-detail");
    this.componentFeaturesService.useRule("claim");
    const value: string = this.componentFeaturesService
      .getConstraints()
      .get(policy.product.product_code);

    if (policy.product.product_code === 'esqui-gold' || policy.product.product_code === 'esqui-silver') {
      let kenticoContent = {};
      this.kenticoTranslateService.getItem<any>('modal_open_claim_es').pipe().subscribe(item => {
        kenticoContent = item;
        const modalRef = this.modalService.open(ContainerComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
        (<ContainerComponent>modalRef.componentInstance).type = 'PolicyDetailModalClaimEsComponent';
        (<ContainerComponent>modalRef.componentInstance).componentInputData = { 'kenticoContent': kenticoContent, 'policyData': this.policy };
      });
    }
    if (!!value) {
      window.open(value, "_blank");
    }
    if (this.dataService.isTenant('santa-lucia_db')) {
      const updatePolicy = {
        ...policy, startDate: moment(policy.start_date).toDate(),
        policyNumber: policy.policy_number,
        expirationDate: moment(policy.expiration_date).toDate()
      };
      const modalRef = this.modalService.open(ContainerComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
      (<ContainerComponent>modalRef.componentInstance).type = 'policyModalClaim';
      (<ContainerComponent>modalRef.componentInstance).componentInputData = { 'policyData': updatePolicy };
    }
  }


  public getPolicyNumbers(policy: any): string {
    if (policy.policy_number) {
      return this.getPolicyNumber(policy);
    }
    return policy.master_policy_number;
  }

  private getPolicyNumber(policy: any): string {
    return !!policy.master_policy_number &&
      this.hasProductDoublePolicyNumber(policy)
      ? policy.policy_number + " / " + policy.master_policy_number
      : policy.policy_number;
  }

  private hasProductDoublePolicyNumber(policy: any): boolean {
    if (
      !!this.doublePolicyNumberProducts &&
      this.doublePolicyNumberProducts.length > 0
    ) {
      return this.doublePolicyNumberProducts.some(
        (code) => code === policy.product.product_code
      );
    }
    return false;
  }

  public addInsuranceButtonContent(): void {
    // My Policies redirec button (AddNewInsurance)  content item name On Kentico
    this.kenticoTranslateService
      .getItem<any>("imagin_mypolicies_redirect")
      .pipe(take(1))
      .subscribe((item) => {
        this.addNewInsurancebuttonContent = {
          text: item.label,
          link: item.value,
        };
      });
  }

  public addInsuranceButton(): boolean {
    this.componentFeaturesService.useComponent(
      "my-policies-add-new-insurance-button"
    );
    this.componentFeaturesService.useRule("add-new-insurance-button");
    const isEnabled = this.componentFeaturesService.isRuleEnabled();
    if (isEnabled && this.policies && this.policies.length !== 0) {
      this.addInsuranceButtonContent();
      return true;
    }
  }

  public addNewInsuranceButtonRedirect(link): void {
    this.routerService.navigate(link);
  }
}
