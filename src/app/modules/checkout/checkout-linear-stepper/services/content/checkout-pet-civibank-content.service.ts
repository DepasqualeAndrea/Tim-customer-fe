import { Injectable } from '@angular/core';
import {CheckoutContentProvider} from './checkout-content-provider.interface';
import {KenticoTranslateService} from '../../../../kentico/data-layer/kentico-translate.service';
import {Observable} from 'rxjs';
import {ContentInterface} from '../../../../preventivatore/preventivatore-dynamic/services/content/content-interface';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CheckoutPetCivibankContentService implements CheckoutContentProvider {

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
        extra_title: kenticoItem.step_bar.value.find(item => item.system.codename === 'extra_title_pet').text.value,
        secondary_title: kenticoItem.step_bar.value.find(item => item.system.codename === 'purchased').text.value,
        partner_text: kenticoItem.step_bar.value.find(item => item.system.codename === 'partner_collaboration').text.value,
        partner_icon: kenticoItem.step_bar.value.find(item => item.system.codename === 'logo_helvetia').thumbnail.value[0].url,
        monthly_payment: kenticoItem.step_bar.value.find(item => item.system.codename === 'monthly_payment').text.value,
        annual_payment: kenticoItem.step_bar.value.find(item => item.system.codename === 'annual_payment').text.value,
      },
      card_insured: {
        title: kenticoItem.card_list.card_info_pet.title.value,
        payment_title: kenticoItem.card_list.card_info_pet.payment_title.value,
        insurances_quantity: kenticoItem.card_list.card_info_pet.insurances_quantity.value,
        microchip: kenticoItem.card_list.card_info_pet.microchip.value,
      },
      card_contractor: {
        title: kenticoItem.card_list.card_contractor.title.value,
        image: kenticoItem.card_list.card_contractor.image.value[0].url,
        image_alt: kenticoItem.card_list.card_contractor.image.value[0].description,
      },
      card_survey: {
        title: kenticoItem.card_list.card_survey.title.value,
        image: kenticoItem.card_list.card_survey.image.value[0].url,
        description: kenticoItem.card_list.card_survey.description.value,
        status: kenticoItem.card_list.card_survey.status.value,
      },
      card_payment: {
        // title: kenticoItem.card_list.card_payment.text.value
      },
      cost_item: {
        validation_title: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'validity_policy').text.value,
        cost_detail_title: kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'cost_detail_title').text.value,
        product_name_title: kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'product_name_title_pet').text.value,
        informative_set: kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'set_informativo_pet').text.value,
        product_title_price_month: kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'price_monthly').text.value,
        product_title_price_annual: kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'price_annual_title').text.value,
        icon_1: kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_1') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_1').thumbnail.value[0].url : null,
        icon_2: kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_2') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_2').thumbnail.value[0].url : null,
        icon_3: kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_3') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_3').thumbnail.value[0].url : null,
        cost_detail_by_product: {
          hpetbasic: kenticoItem.package_options_basic.value.map(item => item.text.value),
          hpetprestige: kenticoItem.package_options_prestige.value.map(item => item.text.value),
          hpetvip: kenticoItem.package_options_vip.value.map(item => item.text.value),
        }
      },
    };
    return structure;
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_pet').pipe
    (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

}
