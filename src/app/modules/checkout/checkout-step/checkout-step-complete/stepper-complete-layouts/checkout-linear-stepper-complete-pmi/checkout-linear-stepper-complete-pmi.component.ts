import { Component, Input, OnInit } from '@angular/core';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-checkout-linear-stepper-complete-pmi',
    templateUrl: './checkout-linear-stepper-complete-pmi.component.html',
    styleUrls: ['./checkout-linear-stepper-complete-pmi.component.scss'],
    standalone: false
})
export class CheckoutLinearStepperCompletePmiComponent implements OnInit {

  @Input()startDate: string;

  constructor(private kenticoTranslateService: KenticoTranslateService) { }

  content: any;

  ngOnInit() {
    this.getKenticoContent()
  }

  getKenticoContent() { 
    this.kenticoTranslateService.getItem<any>('thank_you_page').pipe(take(1)).subscribe(item => {
      this.createContentItem(item)
    })
  }

  createContentItem(kenticoItem) {
    this.content = {
      image:                      kenticoItem.image.value[0].url,
      image_alt:                  kenticoItem.image.value[0].description,
      activation_title:           kenticoItem.activation_title.value,
      activation_info_papery_doc: kenticoItem.activation_info_papery_doc.value,
      button:                     kenticoItem.my_policies_button.value
    }
  }

}
