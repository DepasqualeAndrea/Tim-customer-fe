import { Component, Input, OnInit } from '@angular/core';
import { ResponseOrder } from '@model';
import { AuthService, DataService } from '@services';

@Component({
  selector: 'app-checkout-insurance-info-recap-tim-my-home-proposals',
  templateUrl: './checkout-insurance-info-recap-tim-my-home-proposals.component.html',
  styleUrls: ['./checkout-insurance-info-recap-tim-my-home-proposals.component.scss']
})
export class CheckoutInsuranceInfoRecapTimMyHomeProposalsComponent implements OnInit {

  private readonly LOCALSTORAGE_CUSTOMIZED_KEY = 'Customized' 
  private readonly LOCALSTORAGE_PROPOSAL_KEY = 'Proposal' 

  @Input() data: any
  responseOrder: ResponseOrder
  customized: string
  proposal: string

  constructor(
    public auth: AuthService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.customized = localStorage.getItem(this.LOCALSTORAGE_CUSTOMIZED_KEY)
    this.proposal = localStorage.getItem(this.LOCALSTORAGE_PROPOSAL_KEY)
    this.responseOrder = this.dataService.getResponseOrder()
  }

  public capitalize(content: string): string {
    const firstLetter = content.slice(0,1)
    return firstLetter.toUpperCase() + content.substring(1).toLowerCase()
  }

}
