import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
    selector: 'app-checkout-linear-stepper-complete-my-pet',
    templateUrl: './checkout-linear-stepper-complete-my-pet.component.html',
    styleUrls: ['./checkout-linear-stepper-complete-my-pet.component.scss'],
    standalone: false
})
export class CheckoutLinearStepperCompleteMyPetComponent implements OnInit, OnDestroy {

  @Input()startDate: string;
  @Input()endDate: string;

  thankYouPageImage: string;

  constructor(private kenticoTranslateService: KenticoTranslateService) { }

  ngOnInit() {
    this.kenticoTranslateService.getItem<any>('checkout_mypet').pipe(untilDestroyed(this)).subscribe(item => {
      this.thankYouPageImage = item.thank_you_page_image.value[0].url;
    });
  }

  ngOnDestroy(): void {
  }

}
