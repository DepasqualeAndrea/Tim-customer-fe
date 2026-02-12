import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContentInterface } from '../../../../preventivatore/preventivatore-dynamic/services/content/content-interface';
import { CheckoutModule } from 'app/modules/checkout/checkout.module';
import { CheckoutContentProvider } from './checkout-content-provider.interface';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutYoloCareContentService implements CheckoutContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  getContent(): Observable<ContentInterface> {
    return this.getContentFromKentico();
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_yolo_care').pipe
        (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      checkout_header: {
        title:            kenticoItem.step_bar.now_purchasing.text.value,
        secondary_title:  kenticoItem.step_bar.purchased.text.value,
        partner_text:     kenticoItem.step_bar.partner_collaboration.text.value,
        partner_icon:     kenticoItem.step_bar.rbm_logo.thumbnail.value[0].url
      },
      card_insured: {
        title:                    kenticoItem.card_list.card_yolo_care.title.value,
        coverage_type:            kenticoItem.card_list.card_yolo_care.coverage_type.value,
        insured_subjects:         kenticoItem.card_list.card_yolo_care.insured_subjects.value,
      },
      card_contractor: {
        title:      kenticoItem.card_list.card_contractor.title.value,
        image:      kenticoItem.card_list.card_contractor.image.value[0].url,
        image_alt:  kenticoItem.card_list.card_contractor.image.value[0].description,
      },
      card_survey: {
        title:        kenticoItem.card_list.card_survey.title.value,
        image:        kenticoItem.card_list.card_survey.image.value[0].url,
        image_alt:    kenticoItem.card_list.card_survey.image.value[0].description,
        description:  kenticoItem.card_list.card_survey.description.value,
        status:       kenticoItem.card_list.card_survey.status.value,
      },
      card_payment: {
        title:    kenticoItem.card_list.card_payment &&
                  ((kenticoItem.card_list.card_payment.title && kenticoItem.card_list.card_payment.title.value) ||
                  (kenticoItem.card_list.card_payment.text && kenticoItem.card_list.card_payment.text.value)),
      },
      cost_item: {
        validation_title:             kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'validity_policy').text.value,
        cost_detail_title:            kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'cost_detail_title').text.value,
        product_title_price:          kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'yearly_price').text.value,
        informative_set:              kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'set_informativo_yolo_care').text.value,
        promo_prefix:                 kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'promo_prefix').text.value,
        icon_1:                       kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_1') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_1').thumbnail.value[0].url : null,
        icon_2:                       kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_2') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_2').thumbnail.value[0].url : null,
        icon_3:                       kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_3') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_3').thumbnail.value[0].url : null,
        cost_detail_by_variant: {
          pndmc_base:     kenticoItem.coverage_options_base.value.map(item => item.text.value),
          pndmc_alta:     kenticoItem.coverage_options_alta.value.map(item => item.text.value),
          pndmc_totale:   kenticoItem.coverage_options_totale.value.map(item => item.text.value),
        }
      },
    };
    return structure;
  }
}
