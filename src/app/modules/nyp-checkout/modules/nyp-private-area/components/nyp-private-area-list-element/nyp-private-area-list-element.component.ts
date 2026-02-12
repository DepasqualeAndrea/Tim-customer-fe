import { Component, Input, OnInit } from '@angular/core';
import { NypPolicy } from 'app/modules/nyp-checkout/models/api.model';
import { Policy } from 'app/modules/private-area/private-area.model';
import { NypStripeService } from '../../../nyp-stripe/services/nyp-stripe.service';

@Component({
  selector: 'app-nyp-private-area-list-element',
  templateUrl: './nyp-private-area-list-element.component.html',
  styleUrls: ['./nyp-private-area-list-element.component.scss']
})
export class NypPrivateAreaListElementComponent {
  public policy: NypPolicy;
  @Input('policy') public set __policy(value: NypPolicy) {
    this.policy = value;

    this.getSmallImage(value);
    this.getProductName(value);
    this.getPolicyNumber(value);
    this.getPolicyStatus(value);
  };

  public image: string;
  public productName: string;
  public policyNumber: string;
  public policyStatus: string;
  public policyStatusLabel: string;

  private static readonly PolicyStatus: { [key: string]: { code: string, description: string } } = {
    'active': { code: 'nyp_data_service.policy_status_active', description: 'Attiva' },
    'verified': { code: 'nyp_data_service.policy_status_verified', description: 'In attesa di attivazione' },
    'draft': { code: 'nyp_data_service.policy_status_draft', description: 'In attesa di verifica' },
    'expired': { code: 'nyp_data_service.policy_status_expired', description: 'Scaduta' },
    'canceled': { code: 'nyp_data_service.policy_status_canceled', description: 'Annullata' },
    'suspended': { code: 'nyp_data_service.policy_status_suspended', description: 'Sospesa' },
  };
  constructor(public stripeService: NypStripeService,
  ) { }
  getPolicyStatus(policy: NypPolicy): string {
    const policyStatusObject = NypPrivateAreaListElementComponent.PolicyStatus[policy.status];
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
  private getProductName(policy: NypPolicy): string {
    this.productName = policy.name;
    return this.productName;
  }
  private getPolicyNumber(policy: NypPolicy): string {
    this.policyNumber = policy.policy_number;
    return this.policyNumber;
  }
  private getSmallImage(policy: NypPolicy): string {
    this.image = policy.product.images?.[0]?.small_url;
    return this.image;
  }
  updateSubscription(): void {
    this.stripeService
      .updateSubscription(this.policy.orderCode)
      .subscribe();
  }
}