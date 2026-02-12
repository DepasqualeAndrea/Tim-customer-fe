import { Component, Input, OnInit } from '@angular/core';
import { ResponseOrder } from '@model';
import { AuthService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { CheckoutStates } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';

@Component({
  selector: 'app-checkout-thank-you',
  templateUrl: './checkout-thank-you.component.html',
  styleUrls: [
    './checkout-thank-you.component.scss',
    "../../../../styles/checkout-forms.scss",
    "../../../../styles/size.scss",
    "../../../../styles/colors.scss",
    "../../../../styles/text.scss",
    "../../../../styles/common.scss"
  ]
})
export class CheckoutThankYouComponent implements OnInit {

  @Input('state') public state: CheckoutStates;
  @Input() order: ResponseOrder;
  user: any;
  content: any;

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    public nypDataService: NypDataService,
    protected authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this?.order?.bill_address?.firstname ?? this.authService.loggedUser.address.firstname;
    this.getKenticoContent();
  }

  getKenticoContent() {
    this.kenticoTranslateService.getItem<any>('checkout_customers_nat_cat.step_thank_you').subscribe(item => this.content = item);
  }

  navigate() {
    window.location.href = '/nyp-private-area';
  }

}
