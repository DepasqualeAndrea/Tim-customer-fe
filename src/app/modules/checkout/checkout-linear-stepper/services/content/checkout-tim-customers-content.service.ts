import { Injectable } from '@angular/core';
import { CheckoutModule } from 'app/modules/checkout/checkout.module';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ContentInterface } from 'app/modules/preventivatore/preventivatore-dynamic/services/content/content-interface';
import { Observable } from 'rxjs';
import { map} from 'rxjs/operators';
import { CheckoutContentProvider } from './checkout-content-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class CheckoutTimCustomersContentService implements CheckoutContentProvider {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  getContent(): Observable<ContentInterface> {
    return this.getContentFromKentico();
  }

  private getContentFromKentico(): Observable<any> {
    return this.kenticoTranslateService.getItem('checkout_ehealth_quixa')
      .pipe(map(contentItem => this.createContentStructureFromKenticoItem(contentItem)));
  }

  createContentStructureFromKenticoItem(kenticoItem: any) {
    const coveragesList = []
    kenticoItem.coverages_list.value.forEach(element => {
      coveragesList.push(element.text.value)
    })
    const structure = {
      checkout_header: {
        title:            kenticoItem.activating.value,
        secondary_title:  kenticoItem.activated.value,
        partner_text:     kenticoItem.partner_collaboration_text.value,
        partner_icon:     kenticoItem.partner_collaboration_logo.images[0].url
      },
      cost_item: {
        validation_title:     kenticoItem.policy_validity.value,
        cost_detail_title:    kenticoItem.coverages_title.value,
        informative_set:      kenticoItem.precontractual_information_set.value,
        icon_1:               kenticoItem.icon_policy_validity.value[0].url,
        icon_2:               kenticoItem.icon_coverages.value[0].url,
        icon_3:               kenticoItem.icon_information_set.value[0].url,
        product_title_price:  kenticoItem.monthly_price.value,
        hide_payment_price :       true,
        cost_detail_by_product: {
          ehealthquixahomage:   coveragesList
        }
      },
      card_contractor: {
        image:      kenticoItem.holder_image.value[0].url,
        image_alt:  kenticoItem.holder_image.value[0].description,
        title:      kenticoItem.holder_title.value,
      },
    }
    return structure;
  }
}
