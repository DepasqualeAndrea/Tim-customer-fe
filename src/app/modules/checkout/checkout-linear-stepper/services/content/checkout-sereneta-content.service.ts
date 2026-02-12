import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ContentInterface} from '../../../../preventivatore/preventivatore-dynamic/services/content/content-interface';
import {CheckoutModule} from 'app/modules/checkout/checkout.module';
import {CheckoutContentProvider} from './checkout-content-provider.interface';
import {KenticoTranslateService} from 'app/modules/kentico/data-layer/kentico-translate.service';

@Injectable(
  {
    providedIn: 'root'
  }
)

export class CheckoutSerenetaContentService implements CheckoutContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
  ) {
  }

  getContent(): Observable<ContentInterface> {
    return this.getContentFromKentico();
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      card_sereneta: {
        title: kenticoItem.card_list.card_sereneta.title.value,
        name_insurance_holder: kenticoItem.card_list.card_sereneta.name_insurance_holder.value,
        surname_insurance_holder: kenticoItem.card_list.card_sereneta.surname_insurance_holder.value,
        age_insurance_holder_label: kenticoItem.card_list.card_sereneta.age_insurance_holder.age_insurance_holder_sereneta.label.value,
        age_insurance_holder_value: kenticoItem.card_list.card_sereneta.age_insurance_holder.age_insurance_holder_sereneta.value.value,
        duration_insurance_label: kenticoItem.card_list.card_sereneta.duration_insurance.annual_duration_insurance.label.value,
        duration_insurance_value: kenticoItem.card_list.card_sereneta.duration_insurance.annual_duration_insurance.value.value
      },
      card_contractor: {
        image: kenticoItem.card_list.card_contractor.image.value[0].url,
        image_alt: kenticoItem.card_list.card_contractor.image.value[0].description,
        title: kenticoItem.card_list.card_contractor.title.value,
      },
      card_survey: {
        image: kenticoItem.card_list.card_survey.image.value[0].url,
        image_alt: kenticoItem.card_list.card_survey.image.value[0].description,
        title: kenticoItem.card_list.card_survey.title.value,
        status: kenticoItem.card_list.card_survey.status.value,
        description: kenticoItem.card_list.card_survey.description.value,
      },
      card_payment: {
        title: kenticoItem.card_list.card_payment.text.value,
      },
      cost_item: {
        validation_title: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'validity_policy').text.value,
        cost_detail_title: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'cost_detail_title').text.value,
        product_title_price: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'yearly_price').text.value,
        informative_set: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'informative_set_sereneta').text.value,
        promo_prefix: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'promo_prefix').text.value,
        cost_detail_by_product: {
          sarasereneta: kenticoItem.coverage_options.value.map(item => item.text.value)
        }
      },
      checkout_header: {
        title: kenticoItem.step_bar.value.find(item => item.system.codename === 'now_purchasing').text.value,
        partner_text: kenticoItem.step_bar.value.find(item => item.system.codename === 'partner_collaboration').text.value,
        partner_icon: kenticoItem.step_bar.value.find(item => item.system.codename === 'partner_sereneta_icon').thumbnail.value[0].url
      },
    };
    return structure;
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_sereneta').pipe
    (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }
}
