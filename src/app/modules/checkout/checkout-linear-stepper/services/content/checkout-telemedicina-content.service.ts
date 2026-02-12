import { Injectable } from '@angular/core';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ContentInterface } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/content-interface';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckoutContentProvider } from './checkout-content-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class CheckoutTelemedicinaContentService implements CheckoutContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  getContent(): Observable<ContentInterface> {
    return this.getContentFromKentico();
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_telemedicina').pipe
         (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
        card_insurance_info: {
            title: kenticoItem.card_list.card_insurance_info.title.value,
            image:      kenticoItem.card_list.card_insurance_info.image.value[0].url,
            pagamento_text: kenticoItem.step_insurance_info.value.find(item => item.system.codename === 'modalita_di_pagamento').text.value,
            insured_subjects: kenticoItem.step_insurance_info.value.find(item => item.system.codename === 'insured').text.value,
        },
        card_contractor: {
            image:      kenticoItem.card_list.card_contractor.image.value[0].url,
            image_alt:  kenticoItem.card_list.card_contractor.image.value[0].description,
            title:      kenticoItem.card_list.card_contractor.title.value,
        },
        card_payment: {
            title: kenticoItem.card_list.card_payment.text.value,
        },
        cost_item: {
          validation_title: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'validita_servizio').text.value,
          duration_policy: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'durata_polizza').text.value,
          product_title_price_annual: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'price_annual').text.value,
          product_title_price_month: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'price_monthly').text.value,
          informative_set: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'scarica_le_condizioni_di_servizio').text.value,
          promo_prefix: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'promo_prefix').text.value,
          cost_detail_title: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'prestazioni___titolo').text.value,
          const_detail_coverage_options: kenticoItem.coverage_options.value.map(item => {
            return {
              title: item.text.value,
            };
          }),
        },
        checkout_header: {
          title: kenticoItem.step_bar.value.find(item => item.system.codename === 'now_purchasing').text.value,
          partner_text: kenticoItem.step_bar.value.find(item => item.system.codename === 'partner_collaboration').text.value,
          partner_icon: kenticoItem.step_bar.value.find(item => item.system.codename === 'virtualhospital_logo').thumbnail.value[0].url
        },
      };
      return structure;
  }
}
