import { Injectable } from '@angular/core';
import { CheckoutModule } from 'app/modules/checkout/checkout.module';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ContentInterface } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/content-interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckoutContentProvider } from './checkout-content-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class CheckoutMyPetContentService implements CheckoutContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  getContent(): Observable<ContentInterface> {
    return this.getContentFromKentico();
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_mypet')
      .pipe(map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      checkout_header: {
        title: kenticoItem.activating.value,
        secondary_title: kenticoItem.activated.value,
        partner_text: kenticoItem.partner_collaboration_text.value,
        partner_icon: kenticoItem.partner_collaboration_logo.images[0].url
      },
      card_pet: {
        title: kenticoItem.card_pet_title.value,
        pet_type: kenticoItem.card_pet_type.value,
        pet_name: kenticoItem.card_pet_name.value,
        birth_date: kenticoItem.card_pet_birth_date.value,
      },
      card_contractor: {
        title: kenticoItem.card_holder_title.value,
        image: kenticoItem.card_holder_image.value[0].url,
        image_alt: kenticoItem.card_holder_image.value[0].description,
      },
      card_survey: {
        title: kenticoItem.card_survey_title.value,
        description: kenticoItem.card_survey_description.value,
        status: kenticoItem.card_survey_status.value,
        image: kenticoItem.card_survey_image.value[0].url,
        image_alt: kenticoItem.card_survey_image.value[0].description,
      },
      card_payment: {
        title: kenticoItem.card_payment_title.value,
      },
      cost_item: {
        validation_title: kenticoItem.policy_validity.value,
        cost_detail_title: kenticoItem.coverages_title.value,
        informative_set: kenticoItem.precontractual_information_set.value,
        icon_1: kenticoItem.icon_policy_validity.value[0].url,
        icon_2: kenticoItem.icon_coverages.value[0].url,
        icon_3: kenticoItem.icon_information_set.value[0].url,
        product_title_price:  kenticoItem.price.value,
        cost_detail_by_product: {
          timmypet: kenticoItem.coverages_list.value.map(i => i.text.value)
        }
      },
    };
    return structure;
  }
}
