import { Injectable } from '@angular/core';
import { CheckoutContentProvider } from './checkout-content-provider.interface';
import { KenticoTranslateService } from '../../../../kentico/data-layer/kentico-translate.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ContentInterface } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/content-interface';

@Injectable({
  providedIn: 'root'
})
export class CheckoutAxaViaggioContentService implements CheckoutContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  getContent(): Observable<ContentInterface> {
    return this.getContentFromKentico();
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_viaggio').pipe
        (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    console.log(kenticoItem, 'kenticoItem');
    const structure = {
      checkout_header: {
        title: kenticoItem.step_bar.value.find(item => item.system.codename === 'now_purchasing').text.value,
        secondary_title: kenticoItem.step_bar.value.find(item => item.system.codename === 'purchased').text.value,
      },
      card_insured: {
        title: kenticoItem.card_list.card_insured_viaggio_yolo.title.value,
        package: kenticoItem.card_list.card_insured_viaggio_yolo.package.value,
        insured_number:  kenticoItem.card_list.card_insured_viaggio_yolo.insured_number.value,
        duration: kenticoItem.card_list.card_insured_viaggio_yolo.duration.value,
        period: kenticoItem.card_list.card_insured_viaggio_yolo.period.value,
        start_date: kenticoItem.card_list.card_insured_viaggio_yolo.start_date.value,
        expiration_date: kenticoItem.card_list.card_insured_viaggio_yolo.expiration_date.value
      },
      card_contractor: {
        title: kenticoItem.card_list.card_contractor.title.value,
        image: kenticoItem.card_list.card_contractor.image.value[0].url,
        image_alt: kenticoItem.card_list.card_contractor.image.value[0].description,
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
        validation_title:       kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'validity_policy').text.value,
        cost_detail_title:      kenticoItem.shopping_cart___mobile.value.find(item => item.system.codename === 'cost_detail_title').text.value,
        product_title_price:    kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'total_price').text.value,
        promo_prefix:           kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'promo_prefix').text.value,
        informative_set_gold:   kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'set_informativo_viaggio_gold').set_informativo.value,
        informative_set_silver: kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'set_informativo_viaggio_silver').set_informativo.value,
        yolo_viaggio_silver: kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'yolo_viaggio_silver').text.value,
        yolo_viaggio_gold: kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'yolo_viaggio_gold').text.value,
        icon_1:                 kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_1') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_1').thumbnail.value[0].url : null,
        icon_2:                 kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_2') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_2').thumbnail.value[0].url : null,
        icon_3:                 kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_3') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_3').thumbnail.value[0].url : null,
        cost_detail_by_product: {
          coveragegoldsilver: this.getCostItemsLabels(kenticoItem)
        }
      },
      collaboration_section: {
        title: kenticoItem.collaboration_title && kenticoItem.collaboration_title.value,
        image: kenticoItem.collaboration_image && kenticoItem.collaboration_image.value[0].url
      }
    };
    return structure;
  }
  getCostItemsLabels(kenticoItem) {
    const policyCoverages = [];
    const coverageOptionsGold = kenticoItem.coverage_options_gold.value.map(item => {
      return item.text.value;
    });
    const coverageOptionsSilver = kenticoItem.coverage_options_silver.value.map(item => {
      return item.text.value;
    });
    policyCoverages.push(coverageOptionsGold);
    policyCoverages.push(coverageOptionsSilver);
    return policyCoverages;
  }

}
