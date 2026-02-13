import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ResponseOrder } from '@model';
import { AuthService } from '@services';
import { CheckoutProduct } from 'app/modules/checkout/checkout.model';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { CheckoutStates } from 'app/modules/nyp-checkout/models/api.model';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-checkout-thank-you',
    templateUrl: './checkout-thank-you.component.html',
    styleUrls: ['./checkout-thank-you.component.scss',
        '../../../../styles/checkout-thank-you-page.scss',
        '../../../../styles/size.scss',
        '../../../../styles/colors.scss',
        '../../../../styles/common.scss'],
    standalone: false
})
export class CheckoutThankYouComponent implements OnInit {
  public loader = false;
  @Input('state') public state: CheckoutStates;
  @ViewChild('innerhide') public HIDE;

  @Input() order: ResponseOrder;
  @Input() product: CheckoutProduct;
  user: any;
  showConfirmPageDefault = true;

  public Order$ = this.nypDataService.Order$;

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    protected authService: AuthService,
    public nypDataService: NypDataService,
  ) { }

  content: any;

  ngOnInit() {
    this.user = this?.order?.bill_address?.firstname ?? this.authService.loggedUser.address.firstname;
    this.getKenticoContent();
  }

  getKenticoContent() {
    this.kenticoTranslateService.getItem<any>('thank_you_page_tim_ftth').pipe(take(1)).subscribe(item => {
      this.createContentItem(item);
    });
  }

  createContentItem(kenticoItem) {
    this.content = {
      image: kenticoItem.image.value[0].url,
      title: kenticoItem.title.value,
      description_1: kenticoItem.description_1.value,
      subtitle: kenticoItem.subtitle.value,
      description_2: kenticoItem.description_2.value,
      button: kenticoItem.button.value,
      image_tim_my_home: kenticoItem.image_1.value[0].url,
      my_policies_button: kenticoItem.my_policies_button.value

    };
  }

}
