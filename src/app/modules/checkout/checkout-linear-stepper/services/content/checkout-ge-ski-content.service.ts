import { Injectable } from '@angular/core';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ContentInterface } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/content-interface';
import { Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckoutContentProvider } from './checkout-content-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class CheckoutGeSkiContentService implements CheckoutContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  getContent(): Observable<ContentInterface> {
    return this.getContentFromKentico();
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_sci_genertel').pipe
        (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      checkout_header: {
        title: kenticoItem.step_bar.value.find(item => item.system.codename === 'now_purchasing').text.value,
        secondary_title: kenticoItem.step_bar.value.find(item => item.system.codename === 'purchased').text.value,
        partner_text: kenticoItem.step_bar.value.find(item => item.system.codename === 'partner_collaboration').text.value,
        partner_icon:   kenticoItem.step_bar.value.find(item => item.system.codename === 'genertel_logo').thumbnail.value[0].url,
        assicurazione_sci_plus: kenticoItem.step_bar.value.find(item => item.system.codename === 'assicurazione_sci_plus').text.value,
        assicurazione_sci_premium: kenticoItem.step_bar.value.find(item => item.system.codename === 'assicurazione_sci_premium').text.value,
      },
      card_insured: {
        title: kenticoItem.card_list.card_insured_sci_genertel.title.value,
        package:  kenticoItem.card_list.card_insured_sci_genertel.package.value,
        duration: kenticoItem.step_insurance_info.value.find(item => item.system.codename === 'duration').text.value,
        insured: kenticoItem.card_list.card_insured_sci_genertel.insured_number.value,
        where_play_sport: kenticoItem.card_list.card_insured_sci_genertel.where_play_sport.value,
        protezione_sport_invernali: kenticoItem.step_insurance_info.value.find(item => item.system.codename === 'protezione_sport_invernali').text.value

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
        cost_detail_title:      kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'cost_detail_title').text.value,
        insurance_package:      kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'insurance_package').text.value,
        optional_packages:      kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'optional_packages').text.value,
        protezione_sport_invernali_plus:      kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'protezione_sport_invernali_plus').text.value,
        protezione_sport_invernali_premium:      kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'protezione_sport_invernali_premium').text.value,
        assicurazione_sci_plus_1:      kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'assicurazione_sci_plus_1').text.value,
        assicurazione_sci_premium_2:      kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'assicurazione_sci_premium_2').text.value,
        product_title_price:    kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'total_price').text.value,
        promo_prefix:           kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'promo_prefix').text.value,
        info_set_ge_sport_plus: kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'info_set_ge_ski_plus').text.value,
        info_set_ge_sport_premium: kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'info_set_ge_ski_premium').text.value,
        icon_1:                 kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_1') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_1').thumbnail.value[0].url : null,
        icon_2:                 kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_2') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_2').thumbnail.value[0].url : null,
        icon_3:                 kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_3') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_3').thumbnail.value[0].url : null,
        cost_detail_by_product: {
          geskiplus: kenticoItem.coverage_options_gold.value.map(item => item.text.value),
          geskipremium: kenticoItem.coverage_options_silver.value.map(item => item.text.value)
        }
      },
    };
    return structure;
  }

}
