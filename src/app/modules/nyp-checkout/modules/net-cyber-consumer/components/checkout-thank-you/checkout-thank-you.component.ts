import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ResponseOrder } from '@model';
import { AuthService } from '@services';
import { CheckoutProduct } from 'app/modules/checkout/checkout.model';
import { CheckoutStates } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';

@Component({
  selector: 'app-checkout-thank-you',
  templateUrl: './checkout-thank-you.component.html',
  styleUrls: ['./checkout-thank-you.component.scss', '../../../../styles/checkout-thank-you-page.scss', '../../../../styles/size.scss', '../../../../styles/colors.scss', '../../../../styles/common.scss']
})
export class CheckoutThankYouComponent implements OnInit {
  @Input('state') public state: CheckoutStates;
  @ViewChild('innerhide') public HIDE;

  @Input() order: ResponseOrder;
  @Input() product: CheckoutProduct;
  user: any;
  showConfirmPageDefault = true;

  public Order$ = this.nypDataService.Order$;

  constructor(
    protected authService: AuthService,
    public nypDataService: NypDataService,
  ) { }


  ngOnInit() {
    this.user = this?.order?.bill_address?.firstname ?? this.authService.loggedUser.address.firstname;
  }

}
