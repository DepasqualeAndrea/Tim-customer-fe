import { Injectable } from '@angular/core';
import { CheckoutModule } from 'app/modules/checkout/checkout.module';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ContentInterface } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/content-interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CheckoutContentProvider } from './checkout-content-provider.interface';
import { CheckoutScreenProtectionContent } from './checkout-screen-protection-content-model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutScreenProtectionContentService implements CheckoutContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  getContent(): Observable<ContentInterface> {
    return this.getContentFromKentico();
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_screen_protection')
    .pipe(map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }
  
  createContentStructureFromKenticoItem(kenticoItem: any): CheckoutScreenProtectionContent {
    const structure = {
      checkout_header: {
        title: kenticoItem.step_bar.value.find(item => item.system.codename === 'now_purchasing').text.value,
        secondary_title: kenticoItem.step_bar.value.find(item => item.system.codename === 'purchased').text.value,
        partner_text: kenticoItem.step_bar.value.find(item => item.system.codename === 'partner_collaboration').text.value,
        partner_icon: kenticoItem.step_bar.value.find(item => item.system.codename === 'covercare_logo').thumbnail.value[0].url
      },
      card_screen_protection: {
        title: kenticoItem.card_list.card_screen_protection.title.value,
        package: kenticoItem.card_list.card_screen_protection.package.value,
        insured_number: kenticoItem.card_list.card_screen_protection.insured_number.value,
      },
      cost_item: {
        validation_title: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'validita_polizza').text.value,
        cost_detail_title: kenticoItem.shopping_cart_mobile.value.find(item => item.system.codename === 'cost_detail_title').text.value,
        product_title_price: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'total_price').text.value,
        cost_detail_by_product: {
          screenprotection: kenticoItem.coverage_options.value.map(i => i.text.value)
        },
        renovation_type: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'renovation_year_type').text.value,
        informative_set: kenticoItem.shopping_cart_desktop.value.find(item => item.system.codename === 'service_conditions').text.value,
      },
      card_contractor: {
        title: kenticoItem.card_list.card_customer.title.value,
        image: kenticoItem.card_list.card_customer.image.value[0].url,
        image_alt: kenticoItem.card_list.card_customer.image.value[0].description,
      },
      card_survey: {
        title: kenticoItem.card_list.card_survey.title.value,
        image: kenticoItem.card_list.card_survey.image.value[0].url,
        image_alt: kenticoItem.card_list.card_survey.image.value[0].description,
        description: kenticoItem.card_list.card_survey.description.value,
        status: kenticoItem.card_list.card_survey.status.value,
      },
      card_payment: {
        title: kenticoItem.card_list.card_payment.text.value,
      }
    };
    return structure;
  }
}
