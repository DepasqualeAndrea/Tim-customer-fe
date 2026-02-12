import { DataService } from './../../../../../core/services/data.service';
import { AuthService } from './../../../../../core/services/auth.service';
import { Component, Input, OnInit } from '@angular/core';
import { CheckoutStepInsuranceInfoProduct } from 'app/modules/checkout/checkout-step/checkout-step-insurance-info/checkout-step-insurance-info.model';

@Component({
  selector: 'app-checkout-insurance-info-recap-motor-proposals',
  templateUrl: './checkout-insurance-info-recap-motor-proposals.component.html',
  styleUrls: ['./checkout-insurance-info-recap-motor-proposals.component.scss']
})
export class CheckoutInsuranceInfoRecapMotorProposalsComponent implements OnInit {
  @Input() data: any;
  customized: string;
  product: CheckoutStepInsuranceInfoProduct;
  responseOrder: any;
  proposal: string;
  constructor(
    public auth: AuthService,
    public dataService: DataService
  ) { }

  ngOnInit() {
    this.customized = localStorage.getItem('Customized');
    this.proposal = localStorage.getItem('Proposal');
    this.responseOrder = this.dataService.getResponseOrder();
  }

}
