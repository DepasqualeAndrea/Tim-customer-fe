import { DataService } from '@services';
import { Component, Input, OnInit } from '@angular/core';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-checkout-linear-stepper-complete-screen-protection',
    templateUrl: './checkout-linear-stepper-complete-screen-protection.component.html',
    styleUrls: ['./checkout-linear-stepper-complete-screen-protection.component.scss'],
    standalone: false
})
export class CheckoutLinearStepperCompleteScreenProtectionComponent implements OnInit {

  content: any;

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    public dataService: DataService) {}

  ngOnInit() {
    this.getKenticoContent();
  }

  getKenticoContent() {
    this.kenticoTranslateService.getItem<any>('thank_you_page_screen_protection').pipe(take(1)).subscribe(item => {
      this.createContentItem(item);
    });
  }

  createContentItem(kenticoItem) {
    this.content = {
      image:        kenticoItem.image.value[0].url,
      image_alt:    kenticoItem.image.value[0].description,
      title:        kenticoItem.title.value,
      subtitle:     kenticoItem.subtitle.value,
      button:       kenticoItem.button.value
    };
  }

}
