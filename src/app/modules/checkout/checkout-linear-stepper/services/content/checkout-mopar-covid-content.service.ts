import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';
import { ContentInterface } from '../../../../preventivatore/preventivatore-dynamic/services/content/content-interface';
import { CheckoutModule } from 'app/modules/checkout/checkout.module';
import { CheckoutContentProvider } from './checkout-content-provider.interface';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { DiscountCodeService } from '@services';

@Injectable(
    {
      providedIn: 'root'
    }
  )

  export class CheckoutMoparCovidContentService implements CheckoutContentProvider {

    constructor(
        private kenticoTranslateService: KenticoTranslateService,
        private couponCode: DiscountCodeService
      ) { }

      getContent(): Observable<ContentInterface> {
        return this.getContentFromKentico();
      }

      private getContentFromKentico(): Observable<any> {
        return this.kenticoTranslateService.getItem('checkout_covid').pipe
            (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
      }

      createContentStructureFromKenticoItem(kenticoItem: any) {
        const coupon = this.couponCode.getSavedCoupon();
        const structure = {
          card_covid : {
              title:                    kenticoItem.card_list.card_info_covid.title.value,
              coverage_start_date:      kenticoItem.card_list.card_info_covid.coverage_start_date.value,
              coverage_expiration_date: kenticoItem.card_list.card_info_covid.coverage_expiration_date.value,
          },
          card_contractor: {
              image:      kenticoItem.card_list.card_info_contraente_covid.image.value[0].url,
              image_alt:  kenticoItem.card_list.card_info_contraente_covid.image.value[0].description,
              title:      kenticoItem.card_list.card_info_contraente_covid.title.value,
          },
          card_survey: {
              image:        kenticoItem.card_list.card_survey_covid.image.value[0].url,
              image_alt:    kenticoItem.card_list.card_survey_covid.image.value[0].description,
              title:        kenticoItem.card_list.card_survey_covid.title.value,
              status:       kenticoItem.card_list.card_survey_covid.status.value,
              description:  kenticoItem.card_list.card_survey_covid.description.value,
          },
          cost_item: {
            validation_title:      kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'validity_policy').text.value,
            cost_detail_title:     kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'cost_detail_title').text.value,
            product_title_price:   kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'total_prize').text.value,
            informative_set:       kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'set_informativo_covid').text.value,
            next_price:            kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'next_prize_covid').text.value,
            zero_price:            kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'zero_price').text.value,
            shopping_free_month:   kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'shopping_one_month_free').text.value,
            next_price_text:       kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'next_prize_text').text.value,
            activate_from:         kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'activate_from').text.value,
            cost_detail_by_product: {
              nobiscovidhomage:   kenticoItem.coverage_options.value.map(item => item.text.value)
          }
          },
          checkout_header: {
            title:            kenticoItem.step_bar.value.find(item => item.system.codename === 'now_purchasing').text.value,
            secondary_title:  kenticoItem.step_bar.value.find(item => item.system.codename === 'purchased').text.value,
            partner_text:     kenticoItem.step_bar.value.find(item => item.system.codename === 'partner_collaboration').text.value,
            partner_icon:     kenticoItem.step_bar.value.find(item => item.system.codename === 'nobis_logo').thumbnail.value[0].url
          },
        };
        return structure;
      }
  }
