import {Injectable} from '@angular/core';
import {KenticoTranslateService} from 'app/modules/kentico/data-layer/kentico-translate.service';
import {ContentInterface} from 'app/modules/preventivatore/preventivatore-dynamic/services/content/content-interface';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CheckoutContentProvider} from './checkout-content-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class CheckoutTimMyHomeContentService implements CheckoutContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
  ) {}

  getContent(): Observable<ContentInterface> {
    return this.getContentFromKentico();
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_tim_myhome').pipe
    (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      checkout_header: {
        title: kenticoItem.step_bar.value.find(item => item.system.codename === 'now_purchasing').text.value,
        secondary_title: kenticoItem.step_bar.value.find(item => item.system.codename === 'purchased').text.value,
        partner_text: kenticoItem.step_bar.value.find(item => item.system.codename === 'partner_collaboration').text.value,
        partner_icon: kenticoItem.step_bar.value.find(item => item.system.codename === 'unipol_logo').thumbnail.value[0].url,
      },
      card_contractor: {
        title: kenticoItem.card_list.card_contractor.title.value,
        image: kenticoItem.card_list.card_contractor.image.value[0].url,
        image_alt: kenticoItem.card_list.card_contractor.image.value[0].description,
        image_recap_proposals: kenticoItem.card_list.recap_proposals_home.image.value[0].url,
        title_recap_proposals: kenticoItem.card_list.recap_proposals_home.title.value,
        title_recap_customized: kenticoItem.card_list.additional_warranties_home.title.value,
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
        default_addon: kenticoItem.step_insurance_info.value.find(item => item.system.codename === 'default_addon_myhome').text.value,
        validation_title: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'validity_policy').text.value,
        download_icon: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'download_icon').thumbnail.value[0].url,
        cost_detail_title: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'cost_detail_title').text.value,
        informative_set: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'informative_set_assistenza').text.value,
        informative_set_double: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'informative_set_multirischio').text.value,
        informative_set_wording: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'informative_set_wording').text.value,
        product_title_price: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'total_price').text.value,
        promo_prefix: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'promo_prefix').text.value,
        product_title_price_annual: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'price_annual').text.value,
        icon_1:               kenticoItem.icon_policy_validity.value[0].url,
        icon_2:               kenticoItem.icon_coverages.value[0].url,
        icon_3:               kenticoItem.icon_information_set.value[0].url,
        cost_detail_with_code_by_product: {
          timmyhome: kenticoItem.step_insurance_info_optional_warranty.value,

        }
      },
    };
    return structure;
  }

}
