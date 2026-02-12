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
export class CheckoutBikeContentService implements CheckoutContentProvider {

  private productCodes = ['ea-bike-easy', 'ea-bike-top'];

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
  ) {
  }

  getContent(): Observable<ContentInterface> {
    return this.getContentFromKentico();
  }

  public canGetContentForProducts(code: string[]) {
    const containsBikeEasy = code.some(x => x === this.productCodes[0]);
    const containsBikeTop = code.some(x => x === this.productCodes[1]);
    return containsBikeEasy && containsBikeTop;
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      card_bike: {
        brand_bike: kenticoItem.card_list.card_bike.brand_bike.value,
        model_bike: kenticoItem.card_list.card_bike.model_bike.value,
        date_purchase: kenticoItem.card_list.card_bike.date_purchase.value,
        start_date: kenticoItem.card_list.card_bike.start_date.value,
        end_date: kenticoItem.card_list.card_bike.end_date.value,
        duration_insurance: kenticoItem.card_list.card_bike.duration_insurance.value,
        duration_insurance_value: kenticoItem.card_list.card_bike.duration_insurance_value.value,
        payment: kenticoItem.card_list.card_bike.payment.value,
        payment_value: kenticoItem.card_list.card_bike.payment_value.value,
      },
      card_insurance: {
        insurance_data: kenticoItem.step_insurance_info.value.find(item => item.system.codename === 'insurance_data').text.value,
        required_fields: kenticoItem.step_insurance_info.value.find(item => item.system.codename === 'required_fields').text.value
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
        renovation_type: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'renovation_type').text.value,
        cost_detail_title: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'cost_detail_title').text.value,
        product_title_price: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'yearly_total').text.value,
        recurrent_installment_title_price: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'monthly_installment').text.value,
        recurrent_installment_unit: 12,
        informative_set: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'set_informativo_bike').text.value,
        promo_prefix: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'promo_prefix').text.value,
        cost_detail_by_product: {
          eabikeeasy: kenticoItem.coverage_easy.value.map(item => item.text.value),
          eabiketop: kenticoItem.coverage_top.value.map(item => item.text.value),
        }
      },
      checkout_header: {
        title: kenticoItem.step_bar.value.find(item => item.system.codename === 'now_purchasing').text.value,
        partner_text: kenticoItem.step_bar.value.find(item => item.system.codename === 'partner_collaboration').text.value,
        partner_icon: kenticoItem.step_bar.value.find(item => item.system.codename === 'europe_assistance_logo').thumbnail.value[0].url
      },
    };
    return structure;
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_bike').pipe
    (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }
}
