import { Injectable } from '@angular/core';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ContentInterface } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/content-interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckoutContentProvider } from './checkout-content-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class CheckoutYoloForSkiContentService implements CheckoutContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  getContent(): Observable<ContentInterface> {
    return this.getContentFromKentico();
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_yolo_for_ski').pipe
        (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      checkout_header: {
        title: kenticoItem.step_bar.value.find(item => item.system.codename === 'now_purchasing').text.value,
        secondary_title: kenticoItem.step_bar.value.find(item => item.system.codename === 'purchased').text.value,
        partner_text: kenticoItem.step_bar.value.find(item => item.system.codename === 'partner_collaboration').text.value,
        partner_icon:   kenticoItem.step_bar.value.find(item => item.system.codename === 'logo_net').thumbnail.value[0].url
      },
      card_insured: {
        title: kenticoItem.card_list.card_insured.title.value,
        package: kenticoItem.card_list.card_insured.package.value,
        insured_subjects: kenticoItem.card_list.card_insured.insured_number.value,
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
        validation_title:       kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'validity_policy').text.value,
        cost_detail_title:      kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'cost_detail_title').text.value,
        informative_set:   kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'set_informativo___ski_gold').text.value,
        product_title_price:    kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'total_price').text.value,
        promo_prefix:           kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'promo_prefix').text.value,
        package_title:          kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'pacchetto_text').text.value,
        icon_1:                 kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_1') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_1').thumbnail.value[0].url : null,
        icon_2:                 kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_2') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_2').thumbnail.value[0].url : null,
        icon_3:                 kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_3') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_3').thumbnail.value[0].url : null,
        cost_detail_by_product: {
          yoloforskigold: kenticoItem.coverage_options_gold.value.map(item => item.text.value),
          yoloforskiplatinum: kenticoItem.coverage_options_platinum.value.map(item => item.text.value)
        },
        name: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'name').text.value,
        surname: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'surname').text.value,
        birthDate: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'birth_date').text.value,
        person: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'person').text.value,
        total: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'totale').text.value,
        package: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'package_title').text.value,
        italy: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'italy_label').text.value,
        startDate: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'start_date').text.value,
        place: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'place').text.value,
        insureds: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'insureds').text.value,
        duration: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'duration').text.value,
        insuranceData: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'insurance_data_label').text.value,
        day: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'day').text.value,
        days: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'days').text.value
      },
    };
    return structure;
  }

}
