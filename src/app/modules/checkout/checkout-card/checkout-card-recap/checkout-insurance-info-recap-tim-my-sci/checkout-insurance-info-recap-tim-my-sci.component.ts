import { Component, Input, OnInit } from '@angular/core';
import { ResponseOrder } from '@model';
import { AuthService, DataService } from '@services';

@Component({
    selector: 'app-checkout-insurance-info-recap-tim-my-sci',
    templateUrl: './checkout-insurance-info-recap-tim-my-sci.component.html',
    styleUrls: ['./checkout-insurance-info-recap-tim-my-sci.component.scss'],
    standalone: false
})
export class CheckoutInsuranceInfoRecapTimMySciComponent implements OnInit {

  private readonly LOCALSTORAGE_PROPOSAL_KEY = 'Proposal' 

  @Input() data: any
  responseOrder: ResponseOrder
  proposal: string

  constructor(
    public auth: AuthService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.proposal = localStorage.getItem(this.LOCALSTORAGE_PROPOSAL_KEY)
    this.responseOrder = this.dataService.getResponseOrder()
  }

}
