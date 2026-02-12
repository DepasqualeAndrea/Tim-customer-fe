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
export class CheckoutGeBikeContentService implements CheckoutContentProvider {

  private productCodes = ['ge-bike-plus', 'ge-bike-premium'];

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
        start_date: kenticoItem.card_list.card_bike.start_date.value,
        end_date: kenticoItem.card_list.card_bike.end_date.value,
        duration_insurance: kenticoItem.card_list.card_bike.duration_insurance.value,
        package: kenticoItem.card_list.card_bike.package.value,
        insured: kenticoItem.card_list.card_bike.insured.value
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
        cost_detail_title: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'cost_detail_title').text.value,
        product_title_price:    kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'total_price').text.value,
        product_price: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'prezzo')
                        ? kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'prezzo').text.value
                        : null,
        discount_title: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'discount_title')
                          ? kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'discount_title').text.value
                          : null,
        informative_set_plus: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'set_informativo_bike_ge_plus').text.value,
        informative_set_premium: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'set_informativo_bike_ge_premium').text.value,
        promo_prefix: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'promo').text.value,
        cost_detail_by_product: {
          gebikeplus: kenticoItem.coverage_easy.value.map(item => item.text.value),
          gebikepremium: kenticoItem.coverage_top.value.map(item => item.text.value),
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

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_bike_genertel').pipe
    (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }
}
