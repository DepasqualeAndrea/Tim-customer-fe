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

  export class CheckoutYoloTutelaLegaleContentService implements CheckoutContentProvider {

    constructor(
        private kenticoTranslateService: KenticoTranslateService,
      ) { }

      getContent(): Observable<ContentInterface> {
        return this.getContentFromKentico();
      }

      private getContentFromKentico(): Observable<any> {
        return this.kenticoTranslateService.getItem('checkout_tutela_legale').pipe
            (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
      }

      createContentStructureFromKenticoItem(kenticoItem: any) {
        const structure = {
          card_company : {
              title:          kenticoItem.card_list.card_tutela_legale.title.value,
              employees_number:     kenticoItem.card_list.card_tutela_legale.employees_number.value,
              payment_method:     kenticoItem.card_list.card_tutela_legale.payment_method.value,
          },
          card_contractor: {
              image:      kenticoItem.card_list.card_contractor.image.value[0].url,
              image_alt:  kenticoItem.card_list.card_contractor.image.value[0].description,
              title:      kenticoItem.card_list.card_contractor.title.value,
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
              validation_title:   kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'validity_policy').text.value,
              cost_detail_title:  kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'cost_detail_title').text.value,
              informative_set:    kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'set_informativo_tutela_legale').text.value,
              product_title_price_annual:    kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'annual_prize').text.value,
              product_title_price_month:     kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'payment_monthly').text.value,
              cost_detail_by_product: {
                coverage_labels: this.getCostItemsLabels(kenticoItem)
              }
          },
          checkout_header: {
              title: kenticoItem.step_bar.value.find(item => item.system.codename === 'now_purchasing').text.value,
              partner_text: kenticoItem.step_bar.value.find(item => item.system.codename === 'partner_collaboration').text.value,
              partner_icon: kenticoItem.step_bar.value.find(item => item.system.codename === 'das_logo').thumbnail.value[0].url
          },
        };
        return structure;
      }

      getCostItemsLabels(kenticoItem) {
        const policyCoverages = {
          base:   kenticoItem.coverage_options_basic.value.find(item => item.system.codename === 'copertura_tutela_legale').text.value,
          vercli: kenticoItem.additional_coverage_options.value.find(item => item.system.codename === 'addon_vercli').text.value,
          verfor: kenticoItem.additional_coverage_options.value.find(item => item.system.codename === 'addon_verfor').text.value
        }
        return policyCoverages
      }
  }
