import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '@services';
import { TimMyBrokerCustomersService } from 'app/core/services/tim-my-broker-customers.service';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { FTTH_QUERY_PARAM } from 'app/shared/shared-queryparam-keys';

@Component({
    selector: 'app-login-customers',
    templateUrl: './login-customers.component.html',
    styleUrls: ['./login-customers.component.scss'],
    standalone: false
})
export class LoginCustomersComponent implements OnInit {
  @Input() content: any;
  @Input() redirectUrl: string = '/user-access';
  @Input() hideSsoLogin: boolean = false;
  @Input() hideLegacyLogin: boolean = false;
  @Input() hideLegacyRegistration: boolean = false;
  @Input() orderNumber: string;

  @Output() viewChange = new EventEmitter<'LOGIN' | 'REGISTER' | 'MIGRATION'>();

  public isYin: boolean = false;

  constructor(
    private router: Router,
    private timMyBrokerCustomersService: TimMyBrokerCustomersService,
    private route: ActivatedRoute,
    private dataService: DataService,
    private nypDataService: NypDataService
  ) { }

  ngOnInit() {
    this.isYin = !!this.dataService.Yin;

    const queryParamMap = this.route.snapshot.queryParamMap;
    if (queryParamMap.has(FTTH_QUERY_PARAM)) {
      localStorage.setItem(FTTH_QUERY_PARAM, 'yes');
      this.customerAccess();
    }
  }

  customerAccess() {
    this.dataService.persistFieldToRecover();
    const state = this.orderNumber || '/private-area/user-details';
    this.timMyBrokerCustomersService.redirectToNewSsoAuth(state);
  }

  switchView(view: 'LOGIN' | 'REGISTER' | 'MIGRATION') {
    this.viewChange.emit(view);
  }

  redirectToMyTimAuth() {
    const orderNumber = this.nypDataService?.Order$?.value?.['number'];
    this.timMyBrokerCustomersService.redirectToMyTimAuth(orderNumber);
  }
}
