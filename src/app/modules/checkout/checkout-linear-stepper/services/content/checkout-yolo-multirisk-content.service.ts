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
export class CheckoutYoloMultiriskContentService implements CheckoutContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  getContent(): Observable<ContentInterface> {
    return this.getContentFromKentico();
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_yolo_multirischi').pipe
      (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      card_contractor: {
        title: kenticoItem.card_list.card_contraente.title.value,
        image: kenticoItem.card_list.card_contraente.image.value[0].url,
        image_alt: kenticoItem.card_list.card_contraente.image.value[0].description,
      },
      card_survey: {
        title: kenticoItem.card_list.card_question.title.value,
        image: kenticoItem.card_list.card_question.image.value[0].url,
        image_alt: kenticoItem.card_list.card_question.image.value[0].description,
      },
      card_payment: {
        title: kenticoItem.card_list.card_pagamento.text.value
      },
      cost_item: {
        info_icon: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'info_icon').icon.value[0].url,
        dati_assicurazione:      kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'dati_assicurazione').text.value,
        ragione_sociale: kenticoItem.shopping_cart_mobile.value.find(item =>item.system.codename === 'ragione_sociale').text.value,
        cf_p_iva: kenticoItem.shopping_cart_mobile.value.find(item =>item.system.codename === 'cf_p_iva').text.value,
        numero_dipendenti: kenticoItem.shopping_cart_mobile.value.find(item =>item.system.codename === 'numero_dipendenti').text.value,
        numero_posti_letto: kenticoItem.shopping_cart_mobile.value.find(item =>item.system.codename === 'numero_posti_letto').text.value,
        tipologia_immobile: kenticoItem.shopping_cart_mobile.value.find(item =>item.system.codename === 'tipologia_immobile').text.value,
        provincia_immobile: kenticoItem.shopping_cart_mobile.value.find(item =>item.system.codename === 'provincia_immobile').text.value,
        dati_immobile: kenticoItem.shopping_cart_mobile.value.find(item =>item.system.codename === 'dati_immobile').text.value,
        modifica: kenticoItem.shopping_cart_mobile.value.find(item =>item.system.codename === 'modifica').text.value,
        immobile_1: kenticoItem.shopping_cart_mobile.value.find(item =>item.system.codename === 'immobile_1').text.value,
        validita_polizza: kenticoItem.shopping_cart_mobile.value.find(item =>item.system.codename === 'validita_polizza').text.value,
        calendar_icon: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'calendar_icon').icon.value[0].url,
        shield_icon: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'shield_icon').icon.value[0].url,
        coperture: kenticoItem.shopping_cart_mobile.value.find(item =>item.system.codename === 'coperture').text.value,
        set_informativo_commerce: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'set_informativo_commerce').text.value,
        set_informativo_craft: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'set_informativo_craft').text.value,
        set_informativo_icon: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'set_informativo_icon').icon.value[0].url,
        premio_annuale: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'premio_annuale').text.value,
        premio_semestrale: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'premio_semestrale').text.value,
      }
    };
    return structure;
  }
}
