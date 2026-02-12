import { Component, Input, OnInit } from '@angular/core';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-checkout-linear-stepper-complete-tim-payment',
  templateUrl: './checkout-linear-stepper-complete-tim-payment.component.html',
  styleUrls: ['./checkout-linear-stepper-complete-tim-payment.component.scss']
})
export class CheckoutLinearStepperCompleteTimPaymentComponent implements OnInit {

  @Input()startDate: string;
  @Input()endDate: string;

  constructor (
    private kenticoTranslateService: KenticoTranslateService
  ) { }

  content: any;

  ngOnInit() {
    this.getKenticoContent()
  }

  getKenticoContent() { 
    this.kenticoTranslateService.getItem<any>('thank_you_page_tim').pipe(take(1)).subscribe(item => {
      this.createContentItem(item)
    })
  }

  createContentItem(kenticoItem) {
    this.content = {
      image:        kenticoItem.image.value[0].url,
      image_alt:    kenticoItem.image.value[0].description,
      title:        kenticoItem.activation_title.value,
      button:       kenticoItem.my_policies_button.value
    }
  }

}
