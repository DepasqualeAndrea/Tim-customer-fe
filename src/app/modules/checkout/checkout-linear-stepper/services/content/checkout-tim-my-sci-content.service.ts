import {Injectable} from '@angular/core';
import {KenticoTranslateService} from 'app/modules/kentico/data-layer/kentico-translate.service';
import {ContentInterface} from 'app/modules/preventivatore/preventivatore-dynamic/services/content/content-interface';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CheckoutContentProvider} from './checkout-content-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class CheckoutTimMySciContentService implements CheckoutContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
  ) {}

  getContent(): Observable<ContentInterface> {
    return this.getContentFromKentico();
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_tim_mysci').pipe
    (map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const structure = {
      checkout_header: {
        title: kenticoItem.step_bar.value.find(item => item.system.codename === 'now_purchasing').text.value,
        secondary_title: kenticoItem.step_bar.value.find(item => item.system.codename === 'purchased').text.value,
        partner_text: kenticoItem.step_bar.value.find(item => item.system.codename === 'partner_collaboration').text.value,
        partner_icon: kenticoItem.step_bar.value.find(item => item.system.codename === 'chubb_logo').thumbnail.value[0].url,
      },
      
      card_contractor: {
        title: kenticoItem.card_list.card_contractor.title.value,
        image: kenticoItem.card_list.card_contractor.image.value[0].url,
        image_alt: kenticoItem.card_list.card_contractor.image.value[0].description,

        insured_number: kenticoItem.card_list.card_number_insured.title.value,
        insured_number_alt: kenticoItem.card_list.card_number_insured.image.value[0].description,
        insured_number_image: kenticoItem.card_list.card_number_insured.image.value[0].url,

        policy_duration: kenticoItem.card_list.card_policy_duration.title.value,
        policy_duration_alt: kenticoItem.card_list.card_policy_duration.image.value[0].description,
        policy_duration_image: kenticoItem.card_list.card_policy_duration.image.value[0].url,

        image_recap_proposals: kenticoItem.card_list.card_choose_policy.image.value[0].url,
        image_alt_recap_proposals: kenticoItem.card_list.card_choose_policy.image.value[0].description,
        title_recap_proposals: kenticoItem.card_list.card_choose_policy.title.value,

        insured_data: kenticoItem.card_list.card_data_insured.title.value,
        insured_data_alt: kenticoItem.card_list.card_data_insured.image.value[0].description,
        insured_data_image: kenticoItem.card_list.card_data_insured.image.value[0].url,
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
        validation_title: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'validity_policy').text.value,
        cost_detail_title: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'cost_detail_title').text.value,
        informative_set: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'informative_set_mysci').text.value,        
        product_title_price: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'total_price').text.value, 
        icon_1: kenticoItem.icon_policy_validity.value[0].url,
        icon_2: kenticoItem.icon_coverages.value[0].url,
        icon_3: kenticoItem.icon_information_set.value[0].url
      },
      
    };
    
    return structure;
  }

}
