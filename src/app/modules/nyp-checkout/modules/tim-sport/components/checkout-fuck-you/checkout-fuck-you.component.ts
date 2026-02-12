import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ResponseOrder } from '@model';
import { AuthService } from '@services';
import { CheckoutProduct } from 'app/modules/checkout/checkout.model';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { CheckoutStates } from 'app/modules/nyp-checkout/models/api.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-checkout-fuck-you',
  templateUrl: './checkout-fuck-you.component.html',
  styleUrls: ['./checkout-fuck-you.component.scss']
})
export class CheckoutFuckYouComponent implements OnInit {
  /* @Input('state') private set __state__(value: CheckoutStates) {
    if (value == 'thank-you') {
      this.orderService.completeOrder(
        this.nypDataService.Order$.value.orderCode,
        {
          step: { product: { variantId: this.nypDataService.Order$.value.packetId } },
          data: { state: "confirm" }
        },
        "v2",
        null,
        "SINGLE",
        null
      )
        .subscribe({
          next: () => this.state = value,
          error: () => this.nypDataService.CurrentState$.next('consensuses'),
        });
    } else this.state = value;
  } */
  @Input('state') public state: CheckoutStates;
  @ViewChild('innerhide') public HIDE;

  @Input() order: ResponseOrder;
  @Input() product: CheckoutProduct;
  user: any;
  showConfirmPageDefault = true;
  public readonly pageStates: CheckoutStates[] = ['user-control'];
  summaryStates: CheckoutStates[] = ['address', 'insurance-info', 'survey', 'consensuses'];

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    protected authService: AuthService,
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
