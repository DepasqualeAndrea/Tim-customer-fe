import { Injectable } from '@angular/core';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ContentInterface } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/content-interface';
import { ContentItemIndexer } from 'kentico-cloud-delivery';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckoutContentProvider } from './checkout-content-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class CheckoutSportContentService implements CheckoutContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  getContent(): Observable<ContentInterface> {
    return this.getContentFromKentico();
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_sport').pipe
        (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const insuredCard = kenticoItem.card_list.card_insured_sport_yolo;
    const structure = {
      checkout_header: {
        title: kenticoItem.step_bar.value.find(item => item.system.codename === 'now_purchasing').text.value,
        secondary_title: kenticoItem.step_bar.value.find(item => item.system.codename === 'purchased').text.value,
        partner_text: kenticoItem.step_bar.value.find(item => item.system.codename === 'partner_collaboration').text.value,
        partner_icon:   kenticoItem.step_bar.value.find(item => item.system.codename === 'provider_chubb_logo').thumbnail.value[0].url
      },
      card_insured: {
        title: kenticoItem.card_list.card_insured_sport_yolo.title.value,
        package: kenticoItem.step_insurance_info.value.find(item => item.system.codename === 'variants_type_label').text.value,
        insured_subjects: kenticoItem.card_list.card_insured_sport_yolo.sport.value,
        insured: kenticoItem.card_list.card_insured_sport_yolo.insured.value,

        sport: this.getValueFrom(insuredCard, 'sport_label'),
        number_of_insureds: this.getValueFrom(insuredCard, 'number_of_insureds'),
        duration: this.getValueFrom(insuredCard, 'duration'),
        people: this.getValueFrom(insuredCard, 'people'),
      },
      card_contractor: {
        title: kenticoItem.card_list.card_contractor.title.value,
        image: kenticoItem.card_list.card_contractor.image.value[0].url,
        image_alt: kenticoItem.card_list.card_contractor.image.value[0].description,
      },
      card_survey: {
        title: kenticoItem.card_list.card_survey.title.value,
        image: kenticoItem.card_list.card_survey.image.value[0].url,
        image_alt: kenticoItem.card_list.card_survey.image.value[0].description,
        description: kenticoItem.card_list.card_survey.description.value,
        status: kenticoItem.card_list.card_survey.status.value,
      },
      card_payment: {
        title: kenticoItem.card_list.card_payment.text.value
      },
      cost_item: {
        validation_title:       kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'validity_policy').text.value,
        validity_of_policy_title: kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'validity_of_policy') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'validity_of_policy').text.value : null,
        cost_detail_title:      kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'cost_detail_title').text.value,
        informative_set:   kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'set_informativo_sport').text.value,
        product_title_price:    kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'total_price').text.value,
        total_price:    kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'totale') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'totale').text.value : null,
        promo_prefix:           kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'promo_prefix').text.value,
        icon_1:                 kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_1') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_1').thumbnail.value[0].url : null,
        icon_2:                 kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_2') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_2').thumbnail.value[0].url : null,
        icon_3:                 kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_3') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_3').thumbnail.value[0].url : null,
        cost_detail_by_product: {
          chubbsport: kenticoItem.coverage_options_gold.value.map(item => item.text.value),
          chubbsportrec: kenticoItem.coverage_options_silver.value.map(item => item.text.value)
        }
      },
      collaboration_section: {
        title: kenticoItem.collaboration_title && kenticoItem.collaboration_title.value,
        image: kenticoItem.collaboration_image && kenticoItem.collaboration_image.value[0].url
      }
    };
    return structure;
  }

  private getValueFrom(item: ContentItemIndexer, key: string): ContentItemIndexer | null {
    return item[key] && item[key].value ? item[key].value : null;
  }

}
