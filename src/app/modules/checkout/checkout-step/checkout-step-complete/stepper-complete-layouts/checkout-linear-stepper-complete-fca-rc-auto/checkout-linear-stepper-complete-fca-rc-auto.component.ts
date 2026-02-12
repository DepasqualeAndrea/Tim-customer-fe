import { Component, Input, OnInit } from '@angular/core';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-checkout-linear-stepper-complete-fca-rc-auto',
  templateUrl: './checkout-linear-stepper-complete-fca-rc-auto.component.html',
  styleUrls: ['./checkout-linear-stepper-complete-fca-rc-auto.component.scss']
})
export class CheckoutLinearStepperCompleteFcaRcAutoComponent implements OnInit {

  @Input()showFamilyRcDisclaimer = false

  constructor(
    private kenticoTranslateService: KenticoTranslateService
  ) { }
  
  content: any;

  ngOnInit() {
    this.getKenticoContent()
  }

  getKenticoContent() { 
    this.kenticoTranslateService.getItem<any>('thank_you_page_rc_auto').pipe(take(1)).subscribe(item => {
      this.createContentItem(item)
    })
    if (this.showFamilyRcDisclaimer) {
      this.kenticoTranslateService.getItem<any>('family_rc_disclaimer').pipe(take(1)).subscribe(item => {
        this.createDisclaimerContent(item)
      })
    }
  }

  createContentItem(kenticoItem) {
    this.content = {
      image:        kenticoItem.image.value[0].url,
      image_alt:    kenticoItem.image.value[0].description,
      title:        kenticoItem.activation_title.value,
    }
  }

  createDisclaimerContent(kenticoItem) {
    this.content.disclaimer = kenticoItem.text.value
  }

}
