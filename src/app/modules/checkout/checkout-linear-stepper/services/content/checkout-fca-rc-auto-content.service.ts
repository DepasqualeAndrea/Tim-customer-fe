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
export class CheckoutFcaRcAutoContentService implements CheckoutContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  getContent(): Observable<ContentInterface> {
    return this.getContentFromKentico();
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_rc_auto').pipe
        (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      card_vehicle : {
          title:          kenticoItem.card_list.card_rc_auto.title.value,
          displacement:   kenticoItem.card_list.card_rc_auto.displacement.value,
          birth_date:     kenticoItem.card_list.card_rc_auto.birth_date.value,
          residential_city: kenticoItem.card_list.card_rc_auto.residential_city.value,
      },
      card_contractor: {
          image:      kenticoItem.card_list.card_contractor.image.value[0].url,
          image_alt:  kenticoItem.card_list.card_contractor.image.value[0].description,
          title:      kenticoItem.card_list.card_contractor.title.value,
      },
      card_consents: {
          image:        kenticoItem.card_list.card_consents.image.value[0].url,
          image_alt:    kenticoItem.card_list.card_consents.image.value[0].description,
          title:        kenticoItem.card_list.card_consents.title.value,
          status:       kenticoItem.card_list.card_consents.status.value,
          description:  kenticoItem.card_list.card_consents.description.value,
      },
      card_payment: {
          title: kenticoItem.card_list.card_payment.text.value,
      },
      cost_item: {
        validation_title:   kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'validity_policy').text.value,
        cost_detail_title:  kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'cost_detail_title').text.value,
        product_title_price: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'yearly_price').text.value,
        informative_set: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'informative_set_rc_auto_auto').text.value,
        informative_set_truck: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'informative_set_rc_auto_truck').text.value,
        promo_prefix: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'promo_prefix').text.value,
        cost_detail_by_product: {
          genertelrca: kenticoItem.coverage_options.value.map(item => item.text.value)
        }
      },
      checkout_header: {
        title: kenticoItem.step_bar.value.find(item => item.system.codename === 'now_purchasing').text.value,
        partner_text: kenticoItem.step_bar.value.find(item => item.system.codename === 'partner_collaboration').text.value,
        partner_icon: kenticoItem.step_bar.value.find(item => item.system.codename === 'genertel_logo').thumbnail.value[0].url
      },
    };
    return structure;
  }
}
