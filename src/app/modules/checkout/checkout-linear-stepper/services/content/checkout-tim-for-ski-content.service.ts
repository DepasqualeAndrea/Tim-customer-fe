import { Injectable } from '@angular/core';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ContentInterface } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/content-interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckoutContentProvider } from './checkout-content-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class CheckoutTimForSkiContentService implements CheckoutContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  getContent(): Observable<ContentInterface> {
    return this.getContentFromKentico();
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_tim_for_ski').pipe
        (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      checkout_header: {
        title: kenticoItem.step_bar.value.find(item => item.system.codename === 'stai_acquistando').text.value,
        secondary_title: kenticoItem.step_bar.value.find(item => item.system.codename === 'hai_acquistato').text.value,
        partner_text: kenticoItem.step_bar.value.find(item => item.system.codename === 'collaboration').text.value,
        partner_icon:   kenticoItem.step_bar.value.find(item => item.system.codename === 'logo').thumbnail.value[0].url
      },
      card_insured: {
        title: kenticoItem.card_list.card_insured_1.title.value,
        package: kenticoItem.card_list.card_insured_1.package.value,
        insured_subjects: kenticoItem.card_list.card_insured_1.insured_number.value,
        image: kenticoItem.card_list.card_insured_1.image.value[0].url,
        image_alt: kenticoItem.card_list.card_insured_1.image.value[0].description,
      },
      card_contractor: {
        title: kenticoItem.card_list.card_contraente.title.value,
        image: kenticoItem.card_list.card_contraente.image.value[0].url,
        image_alt: kenticoItem.card_list.card_contraente.image.value[0].description,
      },
      card_survey: {
        title: kenticoItem.card_list.card_questionario.title.value,
        image: kenticoItem.card_list.card_questionario.image.value[0].url,
        image_alt: kenticoItem.card_list.card_questionario.image.value[0].description,
      },
      card_payment: {
        title: kenticoItem.card_list.card_pagamento.text.value
      },
      card_date_time:{
        title: kenticoItem.card_list.card_date_time_yolo_for_ski.value,
        instant_option: kenticoItem.card_list.card_date_time_yolo_for_ski.instant_option.value,
        other_date_option: kenticoItem.card_list.card_date_time_yolo_for_ski.other_date_option.value
      },
      banner: {
        before_seasonal: kenticoItem.card_list.banner_yolo_for_ski.before_seasonal.value,
        inside_seasonal:  kenticoItem.card_list.banner_yolo_for_ski.inside_seasonal.value,
        after_seasonal:  kenticoItem.card_list.banner_yolo_for_ski.after_seasonal.value,
        instant_default:  kenticoItem.card_list.banner_yolo_for_ski.instant_default.value,
      },
      cost_item: {
        validation_title:       kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'validita_polizza').text.value,
        cost_detail_title:      kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'cost_detail_title_1').text.value,
        informative_set:   kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'set_informativo___ski_gold').text.value,
        product_title_price:    kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'prezzo_totale').text.value,
        promo_prefix:           kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'oggetto_sconto').text.value,
        package_title:          kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'pacchetto_text').text.value,
        icon_1:               kenticoItem.icon_policy_validity.value[0].url,
        icon_2:               kenticoItem.icon_coverages.value[0].url,
        icon_3:               kenticoItem.icon_information_set.value[0].url,
        cost_detail_by_product: {
          timforskisilver: kenticoItem.coverage_options_blue.value.map(item => item.text.value),
          timforskigold: kenticoItem.coverage_options_red.value.map(item => item.text.value),
          timforskiplatinum: kenticoItem.coverage_options_black.value.map(item => item.text.value)
        },
        name: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'name').text.value,
        surname: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'surname').text.value,
        birthDate: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'birth_date').text.value,
        total: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'total').text.value,
        package: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'package_title').text.value,
        italy: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'italy_label').text.value,
        startDate: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'start_date').text.value,
        place: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'place').text.value,
        insureds: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'insureds').text.value,
        duration: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'duration').text.value,
        insuranceData: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'insurance_data_label_1').text.value,
        day: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'day').text.value,
        days: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'days').text.value
      },
    };
    return structure;
  }

}
