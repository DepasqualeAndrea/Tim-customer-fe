import {Component, Input, OnInit} from '@angular/core';
import {DataService} from '@services';
import {KenticoTranslateService} from 'app/modules/kentico/data-layer/kentico-translate.service';
import {take} from 'rxjs/operators';

@Component({
    selector: 'app-checkout-linear-stepper-complete-precise-time',
    templateUrl: './checkout-linear-stepper-complete-precise-time.component.html',
    styleUrls: ['./checkout-linear-stepper-complete-precise-time.component.scss'],
    standalone: false
})
export class CheckoutLinearStepperCompletePreciseTimeComponent {

  @Input() startHoursMinutes: string;
  @Input() startDate: string;

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    public dataService: DataService
  ) {
  }

  content: any;

  ngOnInit() {
    this.getKenticoContent();
  }

  getKenticoContent() {
    this.kenticoTranslateService.getItem<any>('thank_you_page_precise_time').pipe(take(1)).subscribe(item => {
      this.createContentItem(item.thank_you_page);
    });
  }

  createContentItem(kenticoItem) {
    this.content = {
      image: kenticoItem.ty_page_image.thumbnail.value[0].url,
      image_alt: kenticoItem.ty_page_image.thumbnail.value[0].description,
      policyStart: kenticoItem.ty_page_startdate_dynamic.text.value,
      paperyDocs: kenticoItem.ty_page_paperydocs.text.value,
      withoutDocs: kenticoItem.ty_page_completed_without_docs ? kenticoItem.ty_page_completed_without_docs.text.value : null,
      title: kenticoItem.ty_page_title.text.value,
      button: kenticoItem.ty_page_mypolicies_button.text.value
    };
  }

}
