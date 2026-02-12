import { Component, OnInit } from '@angular/core';
import { TimMyBrokerCustomersService } from 'app/core/services/tim-my-broker-customers.service';


@Component({
  selector: 'app-landing-page-tim-customers',
  templateUrl: './landing-page-tim-customers.component.html',
  styleUrls: ['./landing-page-tim-customers.component.scss']
})
export class LandingPageTimCustomersComponent implements OnInit {

  constructor(
    private timMyBrokerCustomersService: TimMyBrokerCustomersService
    
  ) { }

  ngOnInit() {
    // Add to redirect site to BE to start SSO
    this.timMyBrokerCustomersService.redirectToOldSssoAuth()
  }
  

}
