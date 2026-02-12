import {Injectable} from '@angular/core';
import { DataService } from '@services';
import {KenticoTranslateService} from 'app/modules/kentico/data-layer/kentico-translate.service';
import {ContentInterface} from 'app/modules/preventivatore/preventivatore-dynamic/services/content/content-interface';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CheckoutContentProvider} from './checkout-content-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class CheckoutGeMotorContentService implements CheckoutContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    private dataService: DataService
  ) {
  }

  getContent(): Observable<ContentInterface> {
    return this.getContentFromKentico();
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      checkout_header: {
        title: kenticoItem.step_bar.value.find(item => item.system.codename === 'now_purchasing').text.value,
        extra_title: kenticoItem.step_bar.value.find(item => item.system.codename === 'extra_title_auto_gen').text.value,
        secondary_title: kenticoItem.step_bar.value.find(item => item.system.codename === 'purchased').text.value,
        partner_text: kenticoItem.step_bar.value.find(item => item.system.codename === 'partner_collaboration').text.value,
        partner_icon: kenticoItem.step_bar.value.find(item => item.system.codename === 'genertel_logo').thumbnail.value[0].url
      },
      card_insured: {
        title: kenticoItem.card_list.card_insured_motor_genertel.title.value,
        car_title: this.dataService.product.product_code === 'ge-motor-car' ? kenticoItem.card_list.card_insured_motor_genertel.car_title.value : kenticoItem.card_list.card_insured_motor_genertel.van_title.value,
        car_text: this.dataService.product.product_code === 'ge-motor-car' ? kenticoItem.card_list.card_insured_motor_genertel.car_text.value : kenticoItem.card_list.card_insured_motor_genertel.van_text.value,
        name: kenticoItem.card_list.card_insured_motor_genertel.name.value,
        registration_year: kenticoItem.card_list.card_insured_motor_genertel.registration_year.value,
      },
      card_contractor: {
        title: kenticoItem.card_list.card_contractor.title.value,
        image: kenticoItem.card_list.card_contractor.image.value[0].url,
        image_alt: kenticoItem.card_list.card_contractor.image.value[0].description,
        image_recap_proposals: kenticoItem.card_list.recap_proposals.image.value[0].url,
        title_recap_proposals: kenticoItem.card_list.recap_proposals.title.value,
        title_recap_customized: kenticoItem.card_list.garanzie_aggiuntive.title.value,
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
        validation_title: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'validity_policy').text.value,
        download_icon: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'download_icon').thumbnail.value[0].url,
        cost_detail_title: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'cost_detail_title').text.value,
        informative_car: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'set_informativo_premium_motor_genertel').text.value,
        informative_van: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'set_informativo_plus_motor_genertel').text.value,
        product_title_price: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'total_price').text.value,
        product_title_price_discount: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'total_price_discount').text.value,
        promo_prefix: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'promo_prefix').text.value,
        icon_1: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'icon_1') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_1').thumbnail.value[0].url : null,
        icon_2: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'icon_2') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_2').thumbnail.value[0].url : null,
        icon_3: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'icon_3') ? kenticoItem.shopping_cart___desktop.value.find(item => item.system.codename === 'icon_3').thumbnail.value[0].url : null,
        cost_detail_with_code_by_product: {
          gemotorcar: kenticoItem.step_insurance_info_optional_warranty.value,
          gemotorvan: kenticoItem.step_insurance_info_optional_warranty.value,
        }
      },
    };
    return structure;
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_motor_genertel').pipe
    (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

}
