import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContentInterface } from '../../../../preventivatore/preventivatore-dynamic/services/content/content-interface';
import { CheckoutModule } from 'app/modules/checkout/checkout.module';
import { CheckoutContentProvider } from './checkout-content-provider.interface';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutPaiContentService implements CheckoutContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  getContent(): Observable<ContentInterface> {
    return this.getContentFromKentico();
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_pai').pipe
        (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      checkout_header: {
        title:            kenticoItem.step_bar.now_purchasing.text.value,
        secondary_title:  kenticoItem.step_bar.purchased.text.value,
        partner_text:     kenticoItem.step_bar.partner_collaboration.text.value,
        partner_icon:     kenticoItem.step_bar.europassistance_logo.thumbnail.value[0].url
      },
      card_insured: {
          title:                    kenticoItem.card_list.card_personal_accident.title.value,
          coverage_start_date:      kenticoItem.card_list.card_personal_accident.coverage_start_date.value,
          coverage_expiration_date: kenticoItem.card_list.card_personal_accident.coverage_expiration_date.value,
          number_of_drivers:        kenticoItem.card_list.card_personal_accident.number_of_drivers.value
      },
      card_contractor: {
          title:      kenticoItem.card_list.card_contractor.title.value,
          image:      kenticoItem.card_list.card_contractor.image.value[0].url,
          image_alt:  kenticoItem.card_list.card_contractor.image.value[0].description,
      },
      card_survey: {
          title:        kenticoItem.card_list.card_survey.title.value,
          image:        kenticoItem.card_list.card_survey.image.value[0].url,
          image_alt:    kenticoItem.card_list.card_survey.image.value[0].description,
          description:  kenticoItem.card_list.card_survey.description.value,
          status:       kenticoItem.card_list.card_survey.status.value,
      },
      card_payment: {
          title: kenticoItem.card_list.card_payment.title.value,
      },
      cost_item: {
        validation_title:             kenticoItem.shopping_cart___mobile.validity_policy.text.value,
        cost_detail_title:            kenticoItem.shopping_cart___mobile.cost_detail_title.text.value,
        product_title_price:          kenticoItem.shopping_cart___desktop.total_price.text.value,
        informative_set:              kenticoItem.shopping_cart___desktop.set_informativo_pai_personal_accident.text.value,
        promo_prefix:                 kenticoItem.shopping_cart___desktop.promo_prefix.text.value,
        cost_detail_by_product: {
          paipersonalaccidentextra:   kenticoItem.coverage_options_extra.value.map(item => item.text.value),
          paipersonalaccident:        kenticoItem.coverage_options_standard.value.map(item => item.text.value)
        }
      },
    };
    return structure;
  }
}
