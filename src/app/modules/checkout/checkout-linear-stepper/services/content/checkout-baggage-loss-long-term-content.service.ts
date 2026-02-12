import { Injectable } from '@angular/core';
import { CheckoutModule } from 'app/modules/checkout/checkout.module';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ContentInterface } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/content-interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckoutContentProvider } from './checkout-content-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class CheckoutBaggageLossLongTermContentService implements CheckoutContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService
  ) { }

  getContent(): Observable<ContentInterface> {
    return this.getContentFromKentico();
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_baggage_loss_long_term').pipe
      (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      checkout_header: {
        title: kenticoItem.step_bar.now_purchasing.text.value,
        secondary_title: kenticoItem.step_bar.purchased.text.value,
        partner_text: kenticoItem.step_bar.partner_collaboration.text.value,
        partner_icon: kenticoItem.step_bar.logo_covea.thumbnail.value[0].url
      },
      card_insured: {
        title: kenticoItem.card_list.card_baggage_loss_long_term.title.value,
        coverage_start_date: kenticoItem.card_list.card_baggage_loss_long_term.coverage_start_date.value,
        coverage_expiration_date: kenticoItem.card_list.card_baggage_loss_long_term.coverage_expiration_date.value,
        plate: kenticoItem.card_list.card_baggage_loss_long_term.plate.value
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
        title: kenticoItem.card_list.card_payment.title.value,
      },
      cost_item: {
        validation_title: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'validity_policy').text.value,
        cost_detail_title: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'cost_detail_title').text.value,
        product_title_price: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'total_price').text.value,
        informative_set: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'informative_set').text.value,
        promo_prefix: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'promo_prefix').text.value,
        cost_detail_by_product: {
          coveabaggagelosslongterm: kenticoItem.coverage_options.value.map(item => item.text.value)
        }
      },
    };
    return structure;
  }
}
