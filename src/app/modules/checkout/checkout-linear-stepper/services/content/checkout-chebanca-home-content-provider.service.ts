import { Injectable } from '@angular/core';
import { CheckoutModule } from 'app/modules/checkout/checkout.module';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ContentInterface } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/content-interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckoutContentProvider } from './checkout-content-provider.interface';

@Injectable({
  providedIn: CheckoutModule
})
export class CheckoutChebancaHomeContentService implements CheckoutContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  getContent(): Observable<ContentInterface> {
    return this.getContentFromKentico();
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_home_genertel')
    .pipe(map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      checkout_header: {
        title: kenticoItem.step_bar.value.find(item => item.system.codename === 'now_purchasing').text.value,
        secondary_title: kenticoItem.step_bar.value.find(item => item.system.codename === 'purchased').text.value,
        partner_text: kenticoItem.step_bar.value.find(item => item.system.codename === 'partner_collaboration').text.value,
        partner_icon: kenticoItem.step_bar.value.find(item => item.system.codename === 'genertel_logo').thumbnail.value[0].url,
        monthly_payment: kenticoItem.step_bar.value.find(item => item.system.codename === 'monthly_payment').text.value,
        annual_payment: kenticoItem.step_bar.value.find(item => item.system.codename === 'annual_payment').text.value,
      },
      card_insured: {
        title: kenticoItem.card_list.card_insured.title.value,
        metri_q: kenticoItem.card_list.card_insured.metri_q.value,
        province: kenticoItem.card_list.card_insured.province.value,
        maximal: kenticoItem.card_list.card_insured.maximal.value,
        maximal_conduction: kenticoItem.card_list.card_insured.maximal_conduction.value,
        payment: kenticoItem.card_list.card_insured.payment.value,

      },
      card_contractor: {
        title: kenticoItem.card_list.card_contractor.title.value,
        image: kenticoItem.card_list.card_contractor.image.value[0].url,
        image_alt: kenticoItem.card_list.card_contractor.image.value[0].description,
        image_recap_proposals: kenticoItem.card_list.recap_proposals_che_banca.image.value[0].url,
        title_recap_proposals: kenticoItem.card_list.recap_proposals_che_banca.title.value
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
        validation_title: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'validity_policy').text.value,
        download_icon: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'download_icon').thumbnail.value[0].url,
        cost_detail_title: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'cost_detail_title').text.value,
        informative_home: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'set_informativo_ge_home_genertel').text.value,
        product_title_price: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'total_price').text.value,
        promo_prefix: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'promo_prefix') ? kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'promo_prefix').text.value : kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'discount_code').text.value,
        product_title_price_month: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'monthly_rent').text.value,
        product_title_price_annual: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'annual_price').text.value,
        icon_1: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'icon_1') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_1').thumbnail.value[0].url : null,
        icon_2: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'icon_2') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_2').thumbnail.value[0].url : null,
        icon_3: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'icon_3') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_3').thumbnail.value[0].url : null,
        cost_detail_with_code_by_product: {
          gehome: kenticoItem.step_insurance_info_optional_warranty.value,

        },
        tooltip_text: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'tooltip_text').text.value
      },
    };
    return structure;
  }
}
