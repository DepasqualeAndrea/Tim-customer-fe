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

  export class CheckoutSmartphoneContentService implements CheckoutContentProvider {

    constructor(
        private kenticoTranslateService: KenticoTranslateService,
      ) { }

      getContent(): Observable<ContentInterface> {
        return this.getContentFromKentico();
      }

      private getContentFromKentico(): Observable<any> {
        return this.kenticoTranslateService.getItem('checkout_smartphone').pipe
            (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
      }

      createContentStructureFromKenticoItem(kenticoItem: any) {
        const structure = {
          card_insured : {
              title:          kenticoItem.card_list.card_smartphone.title.value,
              insured_name:     kenticoItem.card_list.card_smartphone.insured_name.value,
              birth_date:     kenticoItem.card_list.card_smartphone.birth_date.value,
              package:     kenticoItem.card_list.card_smartphone.package.value,
              model:     kenticoItem.card_list.card_smartphone.model.value,
              brand:     kenticoItem.card_list.card_smartphone.brand.value,
              kind:     kenticoItem.card_list.card_smartphone.kind.value,
              price_range:     kenticoItem.card_list.card_smartphone.price_range.value
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
            validation_title:   kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'validity_policy').text.value,
            renovation_type:    kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'renovation_type').text.value,
            cost_detail_title:  kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'cost_detail_title').text.value,
            product_title_price: kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'price_monthly').text.value,
            informative_set:    kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'set_informativo_chubbdevices').text.value,
            promo_prefix:       kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'promo_prefix').text.value,
            icon_1:             kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_1') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_1').thumbnail.value[0].url : null,
            icon_2:             kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_2') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_2').thumbnail.value[0].url : null,
            icon_3:             kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_3') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_3').thumbnail.value[0].url : null,
            cost_detail_by_product: {
              chubbdevices:   kenticoItem.coverage_options.value.map(item => item.text.value),
              ccdevices:   kenticoItem.coverage_options.value.map(item => item.text.value),
          }
          },
          checkout_header: {
            title: kenticoItem.step_bar.value.find(item => item.system.codename === 'now_purchasing').text.value,
            partner_text: kenticoItem.step_bar.value.find(item => item.system.codename === 'partner_collaboration').text.value,
            partner_icon: kenticoItem.step_bar.value.find(item => item.system.codename === 'chubb_logo').thumbnail.value[0].url
          },
        };
        return structure;
      }
  }
