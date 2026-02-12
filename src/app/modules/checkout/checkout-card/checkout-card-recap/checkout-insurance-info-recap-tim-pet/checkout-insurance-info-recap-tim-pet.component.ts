import { Component, Input, OnInit } from '@angular/core';
import { RequestOrder, ResponseOrder } from '@model';
import { AuthService, DataService } from '@services';

@Component({
  selector: 'app-checkout-insurance-info-recap-tim-pet',
  templateUrl: './checkout-insurance-info-recap-tim-pet.component.html',
  styleUrls: ['./checkout-insurance-info-recap-tim-pet.component.scss']
})
export class CheckoutInsuranceInfoRecapTimPetComponent implements OnInit {

  private readonly LOCALSTORAGE_PROPOSAL_KEY = 'Proposal'

  @Input() data: any
  responseOrder: ResponseOrder
  kind: any
  proposal: string

  constructor(
    public auth: AuthService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.proposal = localStorage.getItem(this.LOCALSTORAGE_PROPOSAL_KEY)
    this.responseOrder = this.dataService.getResponseOrder()
    this.kind = this.dataService.kind
  }

}
