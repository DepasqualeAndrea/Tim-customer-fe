import { Component, Input, OnInit } from "@angular/core";
import { NypIadPolicyService } from "@NYP/ngx-multitenant-core";
import { DataService } from "@services";
import { KenticoTranslateService } from "app/modules/kentico/data-layer/kentico-translate.service";
import { NypPolicy } from "app/modules/nyp-checkout/models/api.model";
import { NypStripeService } from "../../../nyp-stripe/services/nyp-stripe.service";

@Component({
  selector: "app-nyp-private-area-policy-detail-payment",
  templateUrl: "./nyp-private-area-policy-detail-payment.component.html",
  styleUrls: ["./nyp-private-area-policy-detail-payment.component.scss"],
})
export class NypPrivateAreaPolicyDetailPaymentComponent implements OnInit {

  @Input() public policy: NypPolicy;

  duration: string;
  public policyStatus: string;
  isPrice: boolean = false;
  isAmount: boolean = false;
  isRecurring: boolean = false;
  constructor(
    public kenticoTranslateService: KenticoTranslateService,
    public dataService: DataService,
    private nypIadPolicyService: NypIadPolicyService,
    public stripeService: NypStripeService,
  ) { }

  ngOnInit() {
    this.setDuration(this.policy);
    this.checkPrice();
    this.checkIsRecurring();
  }

  updateSubscription(): void {
    this.stripeService
      .updateSubscription(this.policy.orderCode)
      .subscribe();
  }
  private static readonly PolicyStatus: { [key: string]: { code: string, description: string } } = {
    'active': { code: 'nyp_data_service.policy_status_active', description: 'Attiva' },
    'verified': { code: 'nyp_data_service.policy_status_verified', description: 'In attesa di attivazione' },
    'draft': { code: 'nyp_data_service.policy_status_draft', description: 'In attesa di verifica' },
    'expired': { code: 'nyp_data_service.policy_status_expired', description: 'Scaduta' },
    'canceled': { code: 'nyp_data_service.policy_status_canceled', description: 'Annullata' },
    'suspended': { code: 'nyp_data_service.policy_status_suspended', description: 'Sospesa' },
  };

  getPolicyStatus(policy: NypPolicy): string {
    const policyStatusObject = NypPrivateAreaPolicyDetailPaymentComponent.PolicyStatus[policy.status];
    return policyStatusObject ? policyStatusObject.description : '';
  }
  getStatusColorClass(policy: NypPolicy): string[] {
    switch (policy.status) {
      case 'active':
        return ['active'];
      case 'verified':
      case 'draft':
        return ['verified'];
      case 'expired':
      case 'canceled':
      case 'suspended':
        return ['expired'];
      default:
        return [];
    }
  }

  private setDuration(policy): void {
    if (policy.product.payment_methods[0].type === 'Spree::Gateway::BraintreeRecurrent' || policy.product.payment_methods[0].type === 'Spree::PaymentMethod::NoPaymentCreditCard') {
      this.kenticoTranslateService.getItem<any>('private_area.yearly_duration_type').pipe().subscribe(item => {
          this.duration = item.value;
        });
    }
  }

  checkPrice() {
    switch (this.policy.name) {
      case 'TIM myPet': this.isPrice = true; break;
      case 'TIM Sci&Snowboard BLU': this.isPrice = true; break;
      case 'TIM Sci&Snowboard ROSSA': this.isPrice = true; break;
      case 'TIM Sci&Snowboard NERA': this.isPrice = true; break;
      case 'TIM myHealth': this.isPrice = true; break;
      case 'Bill Protection': this.isAmount = true; break;
      case 'TIM Protezione Casa': this.isAmount = true; break;
    }
  }

  checkIsRecurring() {
      if (this.policy.product.recurring) {
        this.isRecurring = this.policy.product.recurring;
      }
  }
}
