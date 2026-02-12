import { Injectable } from '@angular/core';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ContentInterface } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/content-interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckoutContentProvider } from './checkout-content-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class CheckoutGeTravelContentService implements CheckoutContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  getContent(): Observable<ContentInterface> {
    return this.getContentFromKentico();
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_travel_genertel').pipe
        (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      checkout_header: {
        title: kenticoItem.step_bar.value.find(item => item.system.codename === 'now_purchasing').text.value,
        secondary_title: kenticoItem.step_bar.value.find(item => item.system.codename === 'purchased').text.value,
        partner_text: kenticoItem.step_bar.value.find(item => item.system.codename === 'partner_collaboration').text.value,
        partner_icon:   kenticoItem.step_bar.value.find(item => item.system.codename === 'genertel_logo').thumbnail.value[0].url
      },
      card_insured: {
        title: kenticoItem.card_list.card_insured_travel_genertel.title.value,
        main_destination: kenticoItem.card_list.card_insured_travel_genertel.main_destination.value,
        package: kenticoItem.card_list.card_insured_travel_genertel.package.value,
        insured_number:  kenticoItem.card_list.card_insured_travel_genertel.insured_number.value,
        start_date: kenticoItem.card_list.card_insured_travel_genertel.start_date.value,
        end_date: kenticoItem.card_list.card_insured_travel_genertel.end_date.value,
        more_info: kenticoItem.card_list.card_insured_travel_genertel.more_info.value

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
        product_title_price:    kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'total_price').text.value,
        product_price: kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'prezzo')
        ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'prezzo').text.value
        : null,
        discount_title: kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'discount_title')
                        ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'discount_title').text.value
                        : null,
        promo_prefix:           kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'promo_prefix').text.value,
        info_set_ge_travel_plus: kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'set_info_plus_travel_genertel').text.value,
        info_set_ge_travel_premium: kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'set_info_premium_travel_genertel').text.value,
        icon_1:                 kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_1') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_1').thumbnail.value[0].url : null,
        icon_2:                 kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_2') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_2').thumbnail.value[0].url : null,
        icon_3:                 kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_3') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_3').thumbnail.value[0].url : null,
        cost_detail_by_product: {
          getravelpremium: kenticoItem.coverage_options_gold.value.map(item => item.text.value),
          getravelplus: kenticoItem.coverage_options_silver.value.map(item => item.text.value)
        }
      },
    };
    return structure;
  }

}
