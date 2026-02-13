import { Component, Input, OnInit } from '@angular/core';
import { ResponseOrder } from '@model';
import { AuthService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-checkout-linear-stepper-complete-simple',
    templateUrl: './checkout-linear-stepper-complete-simple.component.html',
    styleUrls: ['./checkout-linear-stepper-complete-simple.component.scss'],
    standalone: false
})
export class CheckoutLinearStepperCompleteSimpleComponent implements OnInit {

  @Input() order: ResponseOrder;
  user: any;

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private authService: AuthService
  ) { }

  content: any;

  ngOnInit() {
    this.user = this?.order?.bill_address?.firstname ?? this.authService.loggedUser.address.firstname;
    this.getKenticoContent();
  }

  getKenticoContent() {
    this.kenticoTranslateService.getItem<any>('thank_you_page_simple').pipe(take(1)).subscribe(item => {
      this.createContentItem(item);
    });
  }

  createContentItem(kenticoItem) {
    this.content = {
      image: kenticoItem.image.value[0].url,
      text: kenticoItem.text.value,
    };
  }

}
