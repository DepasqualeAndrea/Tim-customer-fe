import { Injectable } from '@angular/core';
import { CheckoutContentProvider } from './checkout-content-provider.interface';
import { KenticoTranslateService } from '../../../../kentico/data-layer/kentico-translate.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutScooterBikeContentService implements CheckoutContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService
  ) {
  }

  getContent(): Observable<any> {
    return this.getContentFromKentico();
  }

  getContentFromKentico() {
    return this.kenticoTranslateService.getItem('checkout_scooter_bike').pipe(map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      card_scooter_bike: {
        title:      kenticoItem.card_list.card_scooter_bike.title.value,
        product_variant: kenticoItem.card_list.card_scooter_bike.product_variant.value,
      },
      card_contractor: {
        image: kenticoItem.card_list.card_contractor.image.value[0].url,
        image_alt: kenticoItem.card_list.card_contractor.image.value[0].description,
        title: kenticoItem.card_list.card_contractor.title.value,
      },
      card_payment: {
        title: kenticoItem.card_list.card_payment.text.value,
      },
      cost_item: {
        validation_title: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'validity_policy').text.value,
        cost_detail_title: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'cost_detail_title').text.value,
        product_title_price: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'total_price').text.value,
        informative_set: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'set_informativo_rc_monopattino_e_bici').text.value,
        promo_prefix: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'promo').text.value,
        cost_detail_by_product: {
          rcscooterbike: this.getCostItemsLabels(kenticoItem)
        }
      },
      checkout_header: {
        title: kenticoItem.step_bar.value.find(item => item.system.codename === 'now_purchasing').text.value,
        secondary_title: kenticoItem.step_bar.value.find(item => item.system.codename === 'purchased').text.value,
        partner_text: kenticoItem.step_bar.value.find(item => item.system.codename === 'partner_collaboration').text.value,
        partner_icon: kenticoItem.step_bar.value.find(item => item.system.codename === 'europe_assistance_logo').thumbnail.value[0].url
      }
    };
    return structure;
  }

  getCostItemsLabels(kenticoItem) {
    const policyCoverages = [];
    let policyEasyCoverages = kenticoItem.coverage_easy.value.map(item => {
      return item.text.value
    });
    let policyPlusCoverages = kenticoItem.coverage_top.value.map(item => {
      return item.text.value;
    });
    policyCoverages.push(policyEasyCoverages)
    policyCoverages.push(policyPlusCoverages)
    return policyCoverages;
  }

}
