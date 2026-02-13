import { Component, OnInit, Input } from '@angular/core';
import { Policy } from 'app/modules/private-area/private-area.model';

@Component({
    selector: 'app-policy-detail-recaps-card-legal-protection',
    templateUrl: './policy-detail-recaps-card-legal-protection.component.html',
    styleUrls: ['./policy-detail-recaps-card-legal-protection.component.scss'],
    standalone: false
})
export class PolicyDetailRecapsCardLegalProtectionComponent implements OnInit {

  @Input() policy: Policy;
  insuredPresentation;
  paymentPeriod;

  constructor() { }

  getPolicyDetails() {
    this.paymentPeriod = this.policy.variant.sku.includes('TUTLEG12') ?
                               'Annuale' : this.policy.variant.sku.includes('TUTLEG1_') ?
                               'Mensile' : null;
    this.insuredPresentation = this.policy.variant.option_values['0'].presentation;
  }

  ngOnInit() {
    this.getPolicyDetails();
  }

}
