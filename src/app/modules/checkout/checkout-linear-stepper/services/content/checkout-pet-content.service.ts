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
export class CheckoutPetContentService implements CheckoutContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  private productCodes = ['net-pet-silver', 'net-pet-gold'];

  getContent(): Observable<ContentInterface> {
    return this.getContentFromKentico();
  }

  public canGetContentForProducts(code: string[]) {
    const containsPetSilver = code.some(x => x === this.productCodes[0]);
    const containsPetGold = code.some(x => x === this.productCodes[1]);
    return containsPetSilver && containsPetGold;
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_pet').pipe
        (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      card_pet : {
          title:          kenticoItem.card_list.card_pet.title.value,
          pet_type_cat:   kenticoItem.card_list.card_pet.pet_type_cat.value,
          pet_type_dog:   kenticoItem.card_list.card_pet.pet_type_dog.value,
          pet_type:       kenticoItem.card_list.card_pet.pet_type.value,
          pet_name:       kenticoItem.card_list.card_pet.pet_name.value,
          birth_date:     kenticoItem.card_list.card_pet.birth_date.value,
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
        validation_title:   kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'validity_policy').text.value,
        renovation_type:    kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'renovation_type').text.value,
        cost_detail_title:  kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'cost_detail_title').text.value,
        product_title_price: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'monthly_price').text.value,
        informative_set: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'informative_set').text.value,
        promo_prefix: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'promo_prefix').text.value,
        frequenza_pagamento_mefio: !!kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'frequenza_pagamento_mefio') ?
        kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'frequenza_pagamento_mefio').text.value
        : null,
        cost_detail_by_product: {
            netpetgold:   !!kenticoItem.coverage_options_gold.value ?
                          kenticoItem.coverage_options_gold.value.map(item => item.text.value)
                          : null,
            netpetsilver: !!kenticoItem.coverage_options_silver.value ?
                          kenticoItem.coverage_options_gold.value.map(item => item.text.value)
                          : null,
            yolomefio: !!kenticoItem.coverage_options ?
                       kenticoItem.coverage_options.value[0].linked_items.value.map(item => item.text.value)
                       : null,
        }
      },
      checkout_header: {
        title: kenticoItem.step_bar.value.find(item => item.system.codename === 'now_purchasing').text.value,
        partner_text: kenticoItem.step_bar.value.find(item => item.system.codename === 'partner_collaboration').text.value,
        partner_icon: kenticoItem.step_bar.value.find(item => item.system.codename === 'partner_icon').thumbnail.value[0].url
      },
    };
    return structure;
  }
}
