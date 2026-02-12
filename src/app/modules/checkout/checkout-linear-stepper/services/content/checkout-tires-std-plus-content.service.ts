import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContentInterface } from '../../../../preventivatore/preventivatore-dynamic/services/content/content-interface';
import { CheckoutModule } from 'app/modules/checkout/checkout.module';
import { CheckoutContentProvider } from './checkout-content-provider.interface';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';

@Injectable(
    {
      providedIn: 'root'
    }
  )

  export class CheckoutTiresStandardPlusContentService implements CheckoutContentProvider {

    constructor(
        private kenticoTranslateService: KenticoTranslateService,
      ) { }

      getContent(): Observable<ContentInterface> {
        return this.getContentFromKentico();
      }

      private getContentFromKentico(): Observable<any> {
        return this.kenticoTranslateService.getItem('checkout_covered_tires').pipe
            (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
      }

      createContentStructureFromKenticoItem(kenticoItem: any) {
        const structure = {
          card_vehicle : {
              title:                    kenticoItem.card_list.card_info_tires.title.value,
              coverage_start_date:      kenticoItem.card_list.card_info_tires.coverage_start_date.value,
              coverage_expiration_date: kenticoItem.card_list.card_info_tires.coverage_expiration_date.value,
              license_plate:            kenticoItem.card_list.card_info_tires.license_plate.value,
          },
          card_contractor: {
              image:      kenticoItem.card_list.card_info_contraente.image.value[0].url,
              image_alt:  kenticoItem.card_list.card_info_contraente.image.value[0].description,
              title:      kenticoItem.card_list.card_info_contraente.title.value,
          },
          card_survey: {
              image:        kenticoItem.card_list.card_survey.image.value[0].url,
              image_alt:    kenticoItem.card_list.card_survey.image.value[0].description,
              title:        kenticoItem.card_list.card_survey.title.value,
              status:       kenticoItem.card_list.card_survey.status.value,
              description:  kenticoItem.card_list.card_survey.description.value,
          },
          card_payment: {
              title: kenticoItem.card_list.card_payment.text.value,
          },
          cost_item: {
            validation_title:    kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'validity_policy').text.value,
            cost_detail_title:   kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'cost_detail_title').text.value,
            product_title_price: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'total_prize').text.value,
            informative_set:     kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'informative_set_tires_std_plus').text.value,
            next_price_text:     kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'next_prize_text').text.value,
            activate_from:       kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'activate_from').text.value,
            cost_detail_by_product: {
              coveatirescoveredstandard:   kenticoItem.covarage_options_std.value.map(item => item.text.value),
              coveatirescoveredplus:       kenticoItem.coverage_options_plus.value.map(item => item.text.value),
          }
          },
          checkout_header: {
            title:            kenticoItem.step_bar.value.find(item => item.system.codename === 'now_purchasing').text.value,
            secondary_title:  kenticoItem.step_bar.value.find(item => item.system.codename === 'purchased').text.value,
            partner_text:     kenticoItem.step_bar.value.find(item => item.system.codename === 'partner_collaboration').text.value,
            partner_icon:     kenticoItem.step_bar.value.find(item => item.system.codename === 'partner_covea_icon').thumbnail.value[0].url
          },
        };
        return structure;
      }
  }
