import {Injectable} from '@angular/core';
import {KenticoTranslateService} from 'app/modules/kentico/data-layer/kentico-translate.service';
import {ContentInterface} from 'app/modules/preventivatore/preventivatore-dynamic/services/content/content-interface';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CheckoutContentProvider} from './checkout-content-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class CheckoutTravelContentService implements CheckoutContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
  ) {
  }

  getContent(): Observable<ContentInterface> {
    return this.getContentFromKentico();
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      checkout_header: {
        title: kenticoItem.step_bar.value.find(item => item.system.codename === 'now_purchasing').text.value,
        extra_title: kenticoItem.step_bar.value.find(item => item.system.codename === 'extra_title').text.value,
        secondary_title: kenticoItem.step_bar.value.find(item => item.system.codename === 'purchased').text.value,
        partner_icon: kenticoItem.step_bar.value.find(item => item.system.codename === 'logo_helvetia').thumbnail.value[0].url
      },
      card_insured: {
        title: kenticoItem.card_list.card_info_travel.title.value,
        destination: kenticoItem.card_list.card_info_travel.destination.value,
        travel_start_date: kenticoItem.card_list.card_info_travel.travel_start_date.value,
        travel_end_date: kenticoItem.card_list.card_info_travel.travel_end_date.value,
        insured_number: kenticoItem.card_list.card_info_travel.insured_number.value,
        traveler_number: kenticoItem.card_list.card_info_travel.traveler_number.value,
      },
      card_contractor: {
        title: kenticoItem.card_list.card_contractor.title.value,
        image: kenticoItem.card_list.card_contractor.image.value[0].url,
        image_alt: kenticoItem.card_list.card_contractor.image.value[0].description,
      },
      card_survey: {
        title: kenticoItem.card_list.card_survey.title.value,
        image: kenticoItem.card_list.card_survey.image.value[0].url,
        // image_alt: kenticoItem.card_list.card_survey.image.value[0].description,
        description: kenticoItem.card_list.card_survey.description.value,
        status: kenticoItem.card_list.card_survey.status.value,
      },
      card_payment: {
        // title: kenticoItem.card_list.card_payment.text.value
      },
      cost_item: {
        validation_title: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'validity_policy').text.value,
        cost_detail_title: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'cost_detail_title').text.value,
        informative_set: kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'set_informativo_travel_helvetia').text.value,
        product_title_price: kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'total_price').text.value,
        icon_1: kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_1') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_1').thumbnail.value[0].url : null,
        icon_2: kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_2') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_2').thumbnail.value[0].url : null,
        icon_3: kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_3') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_3').thumbnail.value[0].url : null,
        cost_detail_with_code_by_product: {
          htrvpremium: kenticoItem.package_options_premium.value.map(item => item),
          htrvbasic: kenticoItem.package_options_basic.value.map(item => item)
        }
      },
    };
    return structure;
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_travel').pipe
    (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

}
